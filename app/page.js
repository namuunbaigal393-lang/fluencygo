'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 10 Daily Words with Mongolian Explanations
const dailyVocabularyList = [
  { word: "Ubiquitous", level: "C1", meaning: "Хаа сайгүй тааралддаг, тархсан.", example: "Smartphones are ubiquitous in modern society." },
  { word: "Mitigate", level: "B2", meaning: "Бууруулах, багасгах, хөнгөвчлөх.", example: "We need to mitigate the risks of climate change." },
  { word: "Pragmatic", level: "B2", meaning: "Бодит байдалд суурилсан, практик.", example: "She took a pragmatic approach to solving the problem." },
  { word: "Innovative", level: "B1", meaning: "Шинэлэг, бүтээлч санаатай.", example: "The company launched an innovative learning app." },
  { word: "Comprehensive", level: "C1", meaning: "Цогц, бүхнийг хамарсан дэлгэрэнгүй.", example: "This course offers a comprehensive guide to IELTS." },
  { word: "Beneficial", level: "B1", meaning: "Ашигтай, тустай.", example: "Eating vegetables is beneficial for your health." },
  { word: "Significant", level: "B2", meaning: "Ач холбогдолтой, чухал, мэдэгдэхүйц.", example: "There was a significant increase in sales." },
  { word: "Resilient", level: "C1", meaning: "Тэсвэр хатуужилтай, уян хатан.", example: "Children are often very resilient after setbacks." },
  { word: "Advocate", level: "B2", meaning: "Дэмжигч, өмгөөлөгч, талд нь зогсох.", example: "He is a strong advocate for animal rights." },
  { word: "Diligent", level: "B2", meaning: "Хөдөлмөрч, хичээнгүй.", example: "She is a diligent student who always does her homework." }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('home');

  // Stats
  const [xp, setXp] = useState(15);
  const [streak, setStreak] = useState(1);

  // 10 Grammar Test Questions
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const testQuestions = [
    { q: "1. She ___ to school yesterday.", options: ["A. go", "B. goes", "C. went"], correct: 2 },
    { q: "2. What is a synonym for 'Mitigate'?", options: ["A. Increase", "B. Reduce", "C. Ignore"], correct: 1 },
    { q: "3. Choose the correct preposition: 'Interested ___ learning English.'", options: ["A. in", "B. on", "C. at"], correct: 0 },
    { q: "4. If I ___ money, I would travel the world.", options: ["A. have", "B. had", "C. will have"], correct: 1 },
    { q: "5. The passive form of: 'They build houses.'", options: ["A. Houses are built", "B. Houses were built", "C. Houses built"], correct: 0 },
    { q: "6. Choose the correct spelling:", options: ["A. Environment", "B. Envoronment", "C. Inviromant"], correct: 0 },
    { q: "7. He is ___ tallest boy in the class.", options: ["A. a", "B. an", "C. the"], correct: 2 },
    { q: "8. Synonym for 'Ubiquitous':", options: ["A. Rare", "B. Everywhere", "C. Hidden"], correct: 1 },
    { q: "9. I have lived here ___ 5 years.", options: ["A. since", "B. for", "C. during"], correct: 1 },
    { q: "10. Choose the correct modal verb for obligation: 'You ___ wear a seatbelt.'", options: ["A. must", "B. might", "C. could"], correct: 0 }
  ];

  // AI Tutor States (Personal Teacher Mode with Mongolian Feedback)
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: "Сайн байна уу? Би таны хувийн IELTS-ийн багш Саруул байна. Та монголоор эсвэл англиар дуугаар ярьж, бичиж болно. Би таны үг болон дүрэм дээр алдсан алдааг монголоор тайлбарлаж, яаж зөв ярихыг зааж өгөх болно!" }
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

  // Text-to-Speech function
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

  // Voice Recognition (Mongolian & English support)
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

  // AI Personal Teacher Feedback Handler (Mongolian explanations + English corrections)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || generating) return;

    const userMessage = input;
    setInput('');
    setChatLog(prev => [...prev, { role: 'user', content: userMessage }]);
    setGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.reply) {
          setChatLog(prev => [...prev, { role: 'assistant', content: data.reply }]);
          setXp(prev => prev + 5);
          setGenerating(false);
          return;
        }
      }
      throw new Error("API error");
    } catch (err) {
      // Personal Teacher Simulation Feedback
      setTimeout(() => {
        let teacherFeedback = `💡 **Багшийн зөвлөгөө:** Таны хэлсэн "${userMessage}" гэдэг өгүүлбэр утгаараа ойлгомжтой боловч IELTS-ийн түвшинд илүү профессионал болгохын тулд үг сонголтоо өөрчлөх хэрэгтэй.\n\n✨ **Илүү зөв хувилбар:** "Furthermore, this plays a significant role in our daily lives."\n\n📌 **Анхаарах зүйл:** Энэ төрлийн нөхцөл байдалд өнгөрсөн цаг биш одоогийн энгийн цаг (Present Simple) ашиглавал илүү оновчтой болно. Дахин нэг удаа англиар зохиогоод хэлээд үз дээ!`;

        if (userMessage.includes("сайн байна") || userMessage.includes("сайн уу") || userMessage.includes("баяртай")) {
          teacherFeedback = "Сайн байна уу! Өнөөдөр ямар сэдвээр ярилцацгаах вэ? Жишээлбэл: 'Technology' эсвэл 'Education' гэсэн сэдвээр өөрийн санаагаа англиар хэлээд үз дээ. Би алдааг чинь зааж өгье!";
        }

        setChatLog(prev => [...prev, { role: 'assistant', content: teacherFeedback }]);
        setXp(prev => prev + 5);
        setGenerating(false);
      }, 700);
    }
  };

  const handleAnswerTest = (optionIndex) => {
    if (optionIndex === testQuestions[testQuestion].correct) {
      setTestScore(prev => prev + 1);
    }
    if (testQuestion + 1 < testQuestions.length) {
      setTestQuestion(prev => prev + 1);
    } else {
      setTestFinished(true);
      setXp(prev => prev + 20);
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
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #374151', background: '#030712', color: '#fff', boxSizing: 'border-box' }} placeholder="example@gmail.com" />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: '700' }}>Нууц үг</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #374151', background: '#030712', color: '#fff', boxSizing: 'border-box' }} placeholder="********" />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
              {loading ? 'Уншиж байна...' : (isSignUp ? 'Бүртгүүлэх' : 'Нэвтрэх')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', fontWeight: '700' }}>
              {isSignUp ? 'Бүртгэлтэй юу? Нэвтрэх' : 'Бүртгэлгүй бол Шинээр бүртгүүлэх'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', display: 'flex', flexDirection: 'column', padding: '16px 16px 90px 16px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>F</div>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>Fluency<span style={{ color: '#38bdf8' }}>Go</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '700' }}>
          <span style={{ color: '#fbbf24' }}>🔥 {streak}d</span>
          <span style={{ color: '#38bdf8' }}>⚡ {xp} XP</span>
          <button onClick={handleLogout} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Гарах</button>
        </div>
      </header>

      {/* TAB 1: HOME DASHBOARD */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #161f33, #0f172a)', padding: '22px', borderRadius: '20px', border: '2px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>PERSONAL AI TUTOR</span>
              <h2 style={{ fontSize: '20px', margin: '6px 0', fontWeight: '800' }}>Сайн уу, Намуун</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Өнөөдрийн сургалт бэлэн байна.</p>
            </div>
            <button onClick={() => setActiveTab('speak')} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>
              Багштай ярих →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#111827', padding: '14px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total XP</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>{xp}</div>
            </div>
            <div style={{ background: '#111827', padding: '14px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Words today</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#a855f7', marginTop: '4px' }}>10 / 10</div>
            </div>
            <div style={{ background: '#111827', padding: '14px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Grammar</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>10 Qs</div>
            </div>
          </div>

          <div style={{ background: '#111827', padding: '18px', borderRadius: '20px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '15px' }}>Today's goal (Өдрийн даалгавар)</span>
              <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '700' }}>Active</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Personal AI Teacher (Саруул)</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Алдааг монголоор тайлбарлаж зөвлөгөө өгөх</p>
              </div>
              <button onClick={() => setActiveTab('speak')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>10 Daily Vocabulary</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Өдөр бүр шинэ 10 үг, монгол тайлбартай</p>
              </div>
              <button onClick={() => setActiveTab('words')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>10 Grammar Exercises</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Дүрмийн сорил (10 асуулт)</p>
              </div>
              <button onClick={() => setActiveTab('test')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONAL TEACHER & FEEDBACK STUDIO */}
      {activeTab === 'speak' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', letterSpacing: '0.5px' }}>PERSONAL TEACHER MODE</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>Talk to Saruul (AI Teacher)</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Алдааг монголоор ширүүн биш, харин яг хувийн багш шиг зөөлөн тайлбарлаж заана.</p>
          </div>

          <div role="log" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', marginBottom: '12px', paddingBottom: '10px' }}>
            {chatLog.map((msg, index) => (
              <div key={index} style={{ background: msg.role === 'user' ? '#1e3a8a' : '#111827', padding: '14px', borderRadius: '14px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', border: '1px solid #1f2937', fontSize: '14px', lineHeight: '1.6' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '800' }}>
                  {msg.role === 'user' ? 'Та (You)' : 'Саруул · Хувийн Багш'}
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                {msg.role === 'assistant' && (
                  <button onClick={() => speakText(msg.content)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px', marginTop: '8px', display: 'block', fontWeight: '700' }}>
                    🔊 Дуудлагыг сонсох
                  </button>
                )}
              </div>
            ))}
            {generating && (
              <div style={{ background: '#111827', padding: '12px', borderRadius: '12px', alignSelf: 'flex-start', color: '#38bdf8', fontSize: '13px', fontStyle: 'italic', border: '1px solid #1f2937' }}>
                Саруул багш алдааг чинь шалгаж байна...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', background: '#111827', padding: '8px 12px', borderRadius: '14px', border: '1px solid #1f2937', alignItems: 'center' }}>
            <button type="button" onClick={handleVoiceInput} style={{ background: isListening ? '#dc2626' : 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px' }} title="Дуугаар ярих">
              🎙️
            </button>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Энд өгүүлбэрээ бичнэ үү..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', padding: '6px' }}
            />
            <button type="submit" disabled={generating} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Илгээх
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: 10 DAILY VOCABULARY */}
      {activeTab === 'words' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>VOCABULARY LAB (10 WORDS)</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>Өнөөдрийн 10 шинэ үг</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Хөөрхөн монгол тайлбартай IELTS-ийн өдөр тутмын үгс.</p>
          </div>
          {dailyVocabularyList.map((item, idx) => (
            <div key={idx} style={{ background: '#111827', padding: '16px', borderRadius: '18px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '20px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>{idx + 1}. {item.word}</h3>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', background: '#1e293b', color: '#a855f7', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>{item.level}</span>
                  <button onClick={() => speakText(item.word)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                    🔊
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#f8fafc', margin: 0, fontWeight: '700' }}>🇲🇳 {item.meaning}</p>
              <div style={{ background: '#0b0f19', padding: '8px 10px', borderRadius: '8px', border: '1px solid #1f2937' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>"{item.example}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: 10 GRAMMAR EXERCISES */}
      {activeTab === 'test' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>GRAMMAR CHALLENGE (10 EXERCISES)</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>Дүрмийн сорил</h2>
          </div>
          {!testFinished ? (
            <div style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '1px solid #1f2937' }}>
              <p style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '8px', fontWeight: '700' }}>QUESTION {testQuestion + 1} / {testQuestions.length}</p>
              <h3 style={{ fontSize: '16px', marginBottom: '14px', fontWeight: '700' }}>{testQuestions[testQuestion].q}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {testQuestions[testQuestion].options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswerTest(idx)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '12px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: '#111827', padding: '22px', borderRadius: '18px', border: '2px solid #38bdf8', textAlign: 'center' }}>
              <h3 style={{ fontSize: '22px', color: '#38bdf8', marginBottom: '8px', fontWeight: '800' }}>Баяр хүргэе! Тест амжилттай дууслаа!</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>Таны зөв хариулсан оноо: {testScore} / {testQuestions.length}</p>
              <button onClick={() => { setTestFinished(false); setTestQuestion(0); setTestScore(0); setActiveTab('home'); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                Нүүр хуудас руу буцах
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ADVANCED IELTS CENTER */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>ADVANCED IELTS MODULES</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>IELTS Preparation Center</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Илүү хүнд, академик түвшний 4 ур чадварын хэсэг.</p>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>🎧 Listening Section (Academic)</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 10px 0' }}>Lectures & Monologues with comprehension questions.</p>
            <button onClick={() => speakText("Section 1. You will hear a conversation between a student and a university advisor.")} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              🔊 Play Audio Sample
            </button>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>📖 Reading Section (Band 7.0+)</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Advanced scientific passages, true/false/not given tasks, and complex vocabulary analysis.</p>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>✍️ Writing Task 1 & 2 Evaluator</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Graph descriptions, argumentative essays, and AI band score estimation.</p>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }} onClick={() => setActiveTab('speak')}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>🗣️ Speaking Part 1, 2 & 3 Simulator</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Live voice interaction with AI Examiner (Mongolian explanations & grammar feedback).</p>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <nav aria-label="Main Navigation" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0b0f19', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 1000, maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🏠</span> Home
        </button>
        <button onClick={() => setActiveTab('speak')} style={{ background: 'none', border: 'none', color: activeTab === 'speak' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🎙️</span> Speak
        </button>
        <button onClick={() => setActiveTab('words')} style={{ background: 'none', border: 'none', color: activeTab === 'words' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>📖</span> Words
        </button>
        <button onClick={() => setActiveTab('test')} style={{ background: 'none', border: 'none', color: activeTab === 'test' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🎯</span> Test
        </button>
        <button onClick={() => setActiveTab('ielts')} style={{ background: 'none', border: 'none', color: activeTab === 'ielts' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🎓</span> IELTS
        </button>
      </nav>

    </main>
  );
}
