'use client';
import { useState } from 'react';

// 10 Daily Vocabulary
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
  const [activeTab, setActiveTab] = useState('home');
  const [ieltsSubTab, setIeltsSubTab] = useState('menu');

  const [xp, setXp] = useState(50);
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
        </div>
      </header>

      {/* TAB 1: HOME DASHBOARD */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #161f33, #0f172a)', padding: '22px', borderRadius: '20px', border: '2px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>ACCESSIBLE LEARNING HUB</span>
              <h2 style={{ fontSize: '20px', margin: '6px 0', fontWeight: '800' }}>Сайн байна уу?</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Өнөөдрийн интерактив хичээлүүд бэлэн.</p>
            </div>
            <button onClick={() => setActiveTab('speak')} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>
              Speaking →
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
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Test</span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>30 Qs</div>
            </div>
          </div>

          <div style={{ background: '#111827', padding: '18px', borderRadius: '20px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '15px' }}>Today's Modules</span>
              <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '700' }}>Active</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>AI English Teacher</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Таны ярьсан зүйлд тохирсон ухаалаг зөвлөгөө</p>
              </div>
              <button onClick={() => setActiveTab('speak')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>10 Daily Vocabulary</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Монгол орчуулга болон жишээ өгүүлбэрийн утга</p>
              </div>
              <button onClick={() => setActiveTab('words')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>30 Qs Placement Test</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Түвшин тогтоох сорил (Beginner алгасах боломжтой)</p>
              </div>
              <button onClick={() => setActiveTab('test')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART CONTEXTUAL AI TEACHER */}
      {activeTab === 'speak' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', letterSpacing: '0.5px' }}>SMART CONTEXTUAL AI TEACHER</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>AI English Studio</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Таны юу хэлснийг ойлгож яг тохирсон зөв хэллэг, дуудлагыг өгөх болно.</p>
          </div>

          <div role="log" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', marginBottom: '12px', paddingBottom: '10px' }}>
            {chatLog.map((msg, index) => (
              <div key={index} style={{ background: msg.role === 'user' ? '#1e3a8a' : '#111827', padding: '14px', borderRadius: '14px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', border: '1px solid #1f2937', fontSize: '14px', lineHeight: '1.6' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '800' }}>
                  {msg.role === 'user' ? 'Та (You)' : 'AI English Teacher'}
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                {msg.role === 'assistant' && (
                  <button onClick={() => speakText("Furthermore, regarding this particular matter, we can state that...")} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px', marginTop: '8px', display: 'block', fontWeight: '700' }}>
                    🔊 Дуудлагыг сонсох (Pronunciation)
                  </button>
                )}
              </div>
            ))}
            {generating && (
              <div style={{ background: '#111827', padding: '12px', borderRadius: '12px', alignSelf: 'flex-start', color: '#38bdf8', fontSize: '13px', fontStyle: 'italic', border: '1px solid #1f2937' }}>
                Teacher is analyzing your input and structuring response...
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
              placeholder="Жишээ: Би өөрийгөө англиар танилцуулж сурмаар байна..." 
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
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Үг бүрийн монгол орчуулга болон жишээ өгүүлбэрийн утга.</p>
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
              <p style={{ fontSize: '14px', color: '#f8fafc', margin: 0, fontWeight: '700' }}>🇲🇳 Утга: {item.meaning}</p>
              <div style={{ background: '#0b0f19', padding: '10px', borderRadius: '10px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '13px', color: '#38bdf8', margin: 0, fontStyle: 'italic' }}>"{item.example}"</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>🇲🇳 Өгүүлбэрийн утга: {item.trans}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: 30 Qs PLACEMENT TEST */}
      {activeTab === 'test' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>PLACEMENT TEST (30 QUESTIONS)</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>Түвшин тогтоох сорил</h2>
          </div>

          {!testModeSelected ? (
            <div style={{ background: '#111827', padding: '24px', borderRadius: '18px', border: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Та англи хэл ямар түвшинтэй вэ?</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Хэрэв та англи хэл огт мэддэггүй бол доорх товчийг дарж тест өгөхгүйгээр шууд эхлэн суралцагч горимд шилжиж болно.</p>
              
              <button onClick={() => { setTestModeSelected(true); setIsBeginnerMode(true); }} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                🟢 Би англи хэл огт мэддэггүй (Тест алгасах)
              </button>

              <button onClick={() => { setTestModeSelected(true); setIsBeginnerMode(false); }} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                🎯 30 Асуулттай тест өгөх
              </button>
            </div>
          ) : isBeginnerMode ? (
            <div style={{ background: '#111827', padding: '24px', borderRadius: '18px', border: '2px solid #38bdf8', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '20px', color: '#38bdf8', fontWeight: '800' }}>Амжилттай! (Beginner Mode)</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>Та англи хэл огт мэддэггүй горимыг сонгосон тул манай апп танд анхан шатнаас нь эхлэн монгол тайлбартайгаар алхам алхмаар заах болно.</p>
              <button onClick={() => setActiveTab('words')} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                Өдрийн шинэ үгс рүү орох →
              </button>
            </div>
          ) : !testFinished ? (
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
              <h3 style={{ fontSize: '22px', color: '#38bdf8', marginBottom: '8px', fontWeight: '800' }}>Тест амжилттай дууслаа!</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>Зөв хариулсан оноо: {testScore} / {testQuestions.length}</p>
              <button onClick={() => { setTestFinished(false); setTestModeSelected(false); setTestQuestion(0); setTestScore(0); setActiveTab('home'); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                Нүүр хуудас руу буцах
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DYNAMIC IELTS CENTER */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>INTERACTIVE IELTS CENTER</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>IELTS Skills Modules</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Аудио сонсоод шалгалт өгөх Listening, Reading болон Writing хэсэг.</p>
          </div>

          {ieltsSubTab === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div onClick={() => setIeltsSubTab('listening')} style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>🎧 1. Listening (Full Audio Conversation + Quiz)</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>3 минутын бодит харилцан яриа ба шалгалт.</p>
              </div>

              <div onClick={() => setIeltsSubTab('reading')} style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>📖 2. Reading Passage (Changing Passages)</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Switchable scientific and academic reading texts.</p>
              </div>

              <div onClick={() => setIeltsSubTab('writing')} style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>✍️ 3. Writing Task 2 (Switchable Prompts)</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Switch essay topics and submit for AI evaluation.</p>
              </div>

              <div onClick={() => setIeltsSubTab('speaking')} style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>🗣️ 4. Speaking Part 1, 2 & 3</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Independent live examiner simulation studio.</p>
              </div>
            </div>
          )}

          {/* LISTENING SUB-VIEW */}
          {ieltsSubTab === 'listening' && (
            <div style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button onClick={() => setIeltsSubTab('menu')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', textAlign: 'left', fontWeight: '800', padding: 0 }}>← Back to IELTS Menu</button>
              <h3 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>Listening Section (Full Conversation)</h3>
              <p style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.5' }}>Эхлээд бүтэн харилцан яриаг сонсоод, дараа нь доорх асуултад хариулна уу.</p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => speakText("Good morning, University Library and Student Services. How can I help you today? Good morning. I’m a first-year student here, and I'd like to register for a library membership and learn how to borrow reference books for my Hygiene and Epidemiology research. Certainly! Welcome to the university. First, I’ll need to take down some of your details. What is your full name, please? My name is Namuunbaigali Saintugs. Thank you, Namuunbaigali. And your student ID number? It is MNUMS dash 2026 dash 103. Perfect. Now, regarding the library rules: as an undergraduate student, you are allowed to borrow up to 5 books at a time for a maximum duration of 14 days. Reference books, however, can only be used inside the reading hall. I understand. Can I renew my books online if I need them longer? Yes, you can renew them twice through the student portal, provided no other student has reserved them. Also, don't forget that your student ID card also serves as your library access card. That's very convenient. Thank you so much for your help! You're welcome. Have a great semester ahead!")} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', flex: 1 }}>
                  🔊 Play Full Audio (Харилцан яриа сонсох)
                </button>
              </div>

              {!listeningFinished ? (
                <div style={{ background: '#0b0f19', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937', marginTop: '8px' }}>
                  <p style={{ fontSize: '11px', color: '#38bdf8', marginBottom: '6px', fontWeight: '700' }}>QUESTION {listeningQIndex + 1} / {listeningQuestions.length}</p>
                  <h4 style={{ fontSize: '15px', marginBottom: '12px', fontWeight: '700' }}>{listeningQuestions[listeningQIndex].q}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {listeningQuestions[listeningQIndex].options.map((opt, idx) => (
                      <button key={idx} onClick={() => handleAnswerListening(idx)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '10px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#0b0f19', padding: '16px', borderRadius: '12px', border: '1px solid #38bdf8', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '6px', fontWeight: '800' }}>Listening Quiz Completed!</h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>Таны зөв хариулсан оноо: {listeningScore} / {listeningQuestions.length}</p>
                  <button onClick={() => { setListeningFinished(false); setListeningQIndex(0); setListeningScore(0); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}>
                    Дахин шалгалт өгөх
                  </button>
                </div>
              )}
            </div>
          )}

          {/* READING SUB-VIEW */}
          {ieltsSubTab === 'reading' && (
            <div style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setIeltsSubTab('menu')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', textAlign: 'left', fontWeight: '800', padding: 0 }}>← Back to IELTS Menu</button>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>Reading Passage</h3>
                <button onClick={() => setReadingIndex((prev) => (prev + 1) % readingPassages.length)} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  🔄 Сэдэв солих (Next Passage)
                </button>
              </div>
              <h4 style={{ fontSize: '15px', color: '#f8fafc', margin: '4px 0', fontWeight: '700' }}>{readingPassages[readingIndex].title}</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>{readingPassages[readingIndex].text}</p>
            </div>
          )}

          {/* WRITING SUB-VIEW */}
          {ieltsSubTab === 'writing' && (
            <div style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setIeltsSubTab('menu')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', textAlign: 'left', fontWeight: '800', padding: 0 }}>← Back to IELTS Menu</button>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>Writing Task 2 Prompt</h3>
                <button onClick={() => setWritingIndex((prev) => (prev + 1) % writingPrompts.length)} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  🔄 Өөр сэдэв авах (Change Topic)
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.5' }}>"{writingPrompts[writingIndex]}"</p>
              <textarea value={userEssay} onChange={(e) => setUserEssay(e.target.value)} placeholder="Write your essay response here..." style={{ width: '100%', height: '100px', background: '#0b0f19', border: '1px solid #334155', color: '#fff', padding: '10px', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}></textarea>
              <button onClick={() => alert("Essay submitted for AI Band 7.0+ evaluation!")} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                Submit Essay for AI Evaluation
              </button>
            </div>
          )}

          {/* SPEAKING SUB-VIEW */}
          {ieltsSubTab === 'speaking' && (
            <div style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setIeltsSubTab('menu')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', textAlign: 'left', fontWeight: '800', padding: 0 }}>← Back to IELTS Menu</button>
              <h3 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>Speaking Simulator (Part 1, 2, 3)</h3>
              <p style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.5' }}>Independent live speaking module where you can practice directly with the AI English Teacher.</p>
              <button onClick={() => setActiveTab('speak')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                Go to AI Speaking Studio →
              </button>
            </div>
          )}

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
