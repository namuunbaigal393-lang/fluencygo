'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 10 Daily Vocabulary with full Mongolian translation & sentence meaning
const dailyVocabularyList = [
  { word: "Ubiquitous", level: "C1", meaning: "Хаа сайгүй тааралддаг, тархсан.", example: "Smartphones are ubiquitous in modern society.", trans: "Ухаалаг гар утаснууд орчин үеийн нийгэмд хаа сайгүй тархсан байна." },
  { word: "Mitigate", level: "B2", meaning: "Бууруулах, багасгах, хөнгөвчлөх.", example: "We need to mitigate the risks of climate change.", trans: "Бид уур амьсгалын өөрчлөлтийн эрсдэлийг бууруулах хэрэгтэй." },
  { word: "Pragmatic", level: "B2", meaning: "Бодит байдалд суурилсан, практик.", example: "She took a pragmatic approach to solving the problem.", trans: "Тэрээр уг асуудлыг шийдвэрлэхэд бодит байдалд суурилсан хандлага гаргасан." },
  { word: "Innovative", level: "B1", meaning: "Шинэлэг, бүтээлч санаатай.", example: "The company launched an innovative learning app.", trans: "Тус компани шинэлэг сургалтын аппликейшн гаргасан." },
  { word: "Comprehensive", level: "C1", meaning: "Цогц, бүхнийг хамарсан дэлгэрэнгүй.", example: "This course offers a comprehensive guide to IELTS.", trans: "Энэхүү курс нь IELTS-ийн цогц гарын авлагыг санал болгож байна." },
  { word: "Beneficial", level: "B1", meaning: "Ашигтай, тустай.", example: "Eating vegetables is beneficial for your health.", trans: "Ногоо идэх нь таны эрүүл мэндэд тустай." },
  { word: "Significant", level: "B2", meaning: "Ач холбогдолтой, чухал, мэдэгдэхүйц.", example: "There was a significant increase in sales.", trans: "Борлуулалтад мэдэгдэхүйц өсөлт гарсан." },
  { word: "Resilient", level: "C1", meaning: "Тэсвэр хатуужилтай, уян хатан.", example: "Children are often very resilient after setbacks.", trans: "Хүүхдүүд уналтын дараа ихэвчлэн маш тэсвэр хатуужилтай байдаг." },
  { word: "Advocate", level: "B2", meaning: "Дэмжигч, өмгөөлөгч, талд нь зогсох.", example: "He is a strong advocate for animal rights.", trans: "Тэрээр амьтны эрхийг хамгаалагч тууштай дэмжигч юм." },
  { word: "Diligent", level: "B2", meaning: "Хөдөлмөрч, хичээнгүй.", example: "She is a diligent student who always does her homework.", trans: "Тэр бол гэрийн даалгавраа үргэлж хийдэг хичээнгүй сурагч юм." }
];

const writingPrompts = [
  "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake. Discuss both views and give your opinion.",
  "In many countries, government spending on environmental protection is becoming increasingly important. To what extent do you think governments should fund green energy projects compared to other public sectors?",
  "With the rapid advancement of artificial intelligence, many traditional jobs are being replaced by automated systems. What are the advantages and disadvantages of this trend for future generations?"
];

const readingPassages = [
  {
    title: "The Evolution of Digital Education Systems",
    text: "The rapid evolution of artificial intelligence in modern higher education has fundamentally transformed how students access research materials and interact with digital learning platforms. Adaptive algorithms now allow custom learning paths tailored to individual student weaknesses."
  },
  {
    title: "Urbanization and Renewable Energy Solutions",
    text: "As global urban populations expand exponentially, metropolitan areas face unprecedented demands for sustainable energy grids. Integrating solar panels on commercial skyscrapers and utilizing wind turbine farms in coastal zones have become vital municipal priorities."
  }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [activeTab, setActiveTab] = useState('home');
  const [ieltsSubTab, setIeltsSubTab] = useState('menu');

  const [xp, setXp] = useState(45);
  const [streak, setStreak] = useState(1);

  // Test States
  const [testModeSelected, setTestModeSelected] = useState(false);
  const [isBeginnerMode, setIsBeginnerMode] = useState(false);
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const generate30Questions = () => {
    let qs = [];
    for (let i = 1; i <= 30; i++) {
      qs.push({
        q: `Question ${i}: Choose the correct English grammar option for daily conversation.`,
        options: ["A. Correct form option 1", "B. Correct form option 2", "C. Correct form option 3"],
        correct: 0
      });
    }
    return qs;
  };
  const [testQuestions] = useState(generate30Questions());

  // Writing & Reading Dynamic States
  const [writingIndex, setWritingIndex] = useState(0);
  const [userEssay, setUserEssay] = useState('');
  const [readingIndex, setReadingIndex] = useState(0);

  // Listening Interactive Quiz States
  const [listeningQIndex, setListeningQIndex] = useState(0);
  const [listeningScore, setListeningScore] = useState(0);
  const [listeningFinished, setListeningFinished] = useState(false);

  const listeningQuestions = [
    { q: "1. What is the student registering for?", options: ["A. Campus parking", "B. Library membership", "C. Dormitory room"], correct: 1 },
    { q: "2. How many books can an undergraduate student borrow at once?", options: ["A. Up to 2 books", "B. Up to 5 books", "C. Up to 10 books"], correct: 1 },
    { q: "3. What is the maximum borrowing duration for standard books?", options: ["A. 7 days", "B. 14 days", "C. 30 days"], correct: 1 }
  ];

  // AI Chat States
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: "Hello! I am your AI English Teacher. Type or say anything you want to learn in English, and I will instantly translate, structure, and give you the correct professional phrases with pronunciation!" }
  ]);
  const [generating, setGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Бүртгэл амжилттай! Имэйлээ шалгаад нэвтэрнэ үү.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Таны хөтөч дуу хоолой гаргах функцийг дэмжихгүй байна.");
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Таны төхөөрөмж дуу хоолой таних системийг дэмжихгүй байна.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'mn-MN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || generating) return;

    const userMessage = input;
    setInput('');
    setChatLog(prev => [...prev, { role: 'user', content: userMessage }]);
    setGenerating(true);

    setTimeout(() => {
      let customPhrase = `To express "${userMessage}" in professional English, use this precise phrase:`;
      let customEnglish = `"Furthermore, regarding this particular matter, we can state that..."`;
      let customPronunciation = `[ˈfɜːrðərmɔːr, rɪˈɡɑːrdɪŋ ðɪs pərtɪkjələr ˈmætər]`;
      let customMongolian = `Уг санааг англиар илэрхийлэхэд хамгийн оновчтой хэллэг юм.`;

      if (userMessage.toLowerCase().includes("танилцуул") || userMessage.toLowerCase().includes("нэр")) {
        customPhrase = `To introduce yourself professionally in English:`;
        customEnglish = `"Hello, let me introduce myself. My name is [Your Name], and I am currently studying..."`;
        customPronunciation = `[həˈloʊ, lɛt mi ˌɪntrəˈdʌs maɪˈsɛlf]`;
        customMongolian = `Өөрийгөө англиар танилцуулах үед хэрэглэх үндсэн загвар.`;
      }

      const teacherResponse = `💡 **Contextual English Guide:**\n\n${customPhrase}\n\n👉 **${customEnglish}**\n\n📌 **Pronunciation:** ${customPronunciation}\n\n🇲🇳 **Монгол тайлбар:** ${customMongolian}`;

      setChatLog(prev => [...prev, { role: 'assistant', content: teacherResponse }]);
      setXp(prev => prev + 5);
      setGenerating(false);
    }, 700);
  };

  const handleAnswerTest = (optionIndex) => {
    if (optionIndex === testQuestions[testQuestion].correct) {
      setTestScore(prev => prev + 1);
    }
    if (testQuestion + 1 < testQuestions.length) {
      setTestQuestion(prev => prev + 1);
    } else {
      setTestFinished(true);
      setXp(prev => prev + 30);
    }
  };

  const handleAnswerListening = (optionIndex) => {
    if (optionIndex === listeningQuestions[listeningQIndex].correct) {
      setListeningScore(prev => prev + 1);
    }
    if (listeningQIndex + 1 < listeningQuestions.length) {
      setListeningQIndex(prev => prev + 1);
    } else {
      setListeningFinished(true);
      setXp(prev => prev + 15);
    }
  };

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: '#111827', padding: '32px', borderRadius: '20px', border: '2px solid #38bdf8' }}>
          <h1 style={{ fontSize: '30px', marginBottom: '8px', textAlign: 'center', fontWeight: '800' }}>Fluency <span style={{ color: '#38bdf8' }}>Go</span></h1>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '28px', fontSize: '14px' }}>Хөгжлийн бэрхшээлтэй болон хүн бүрт хүртээмжтэй IELTS систем</p>
          
          {message && <div style={{ background: '#1e293b', color: '#38bdf8', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{message}</div>}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: '700' }}>Имэйл хаяг</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '10
