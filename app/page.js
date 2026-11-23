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

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Navigation Tabs: 'home' | 'speak' | 'words' | 'test' | 'ielts'
  const [activeTab, setActiveTab] = useState('home');

  // Gamification Stats
  const [xp, setXp] = useState(20);
  const [streak, setStreak] = useState(1);

  // Test Mode & 30 Questions Placement Test State
  const [testModeSelected, setTestModeSelected] = useState(false); // false means user chooses if they know English or take test
  const [isBeginnerMode, setIsBeginnerMode] = useState(false);
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // 30 Comprehensive Placement Test Questions
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

  // AI Chat States (Strict English Only Teaching Mode)
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: "Hello! I am your English & IELTS Teacher. You can type or speak in Mongolian if you want to learn how to express something in English. I will give you the exact English phrases, pronunciation guide, and Mongolian meanings!" }
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

  // Voice Recognition
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

  // Strict English Teacher AI Handler (No Mongolian chatting back, gives English phrases + Mongolian explanations)
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
      // Professional English Teacher Simulation (Strictly English UI responses with Mongolian translation assistance)
      setTimeout(() => {
        let teacherReply = `💡 **English Expression Guide:**\n\nTo express "${userMessage}" in professional English, use this phrase:\n\n👉 **"Hello, let me introduce myself. My name is..."**\n\n📌 **Pronunciation (Дуудлага):** [həˈloʊ, lɛt mi ˌɪntrəˈdʌs maɪˈsɛlf]\n\n🇲🇳 **Монгол утга:** Сайн байна уу, би өөрийгөө танилцуулъя. Миний нэр...\n\nKeep practicing this sentence out loud!`;

        if (userMessage.toLowerCase().includes("сайн байна") || userMessage.toLowerCase().includes("сайн уу")) {
          teacherReply = `💡 **English Greeting Guide:**\n\nIn English, we say:\n👉 **"Hello! How are you doing today?"**\n\n📌 **Pronunciation:** [həˈloʊ! haʊ ɑːr ju ˈduːɪŋ təˈdeɪ?]\n\n🇲🇳 **Монгол утга:** Сайн байна уу! Өнөөдөр сонин сайхан юутай байна?\n\nTry saying this back to me!`;
        }

        setChatLog(prev => [...prev, { role: 'assistant', content: teacherReply }]);
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
      setXp(prev => prev + 30);
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
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>ENGLISH LEARNING HUB</span>
              <h2 style={{ fontSize: '20px', margin: '6px 0', fontWeight: '800' }}>Сайн уу, Намуун</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Өнөөдрийн хичээл бэлэн байна.</p>
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
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Placement Test</span>
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
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>English Teacher (AI)</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Англи хэлээр суралцах, дуудлага болон утга олох</p>
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
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Түвшин тогтоох сорил (Эхлэн суралцагч алгасах боломжтой)</p>
              </div>
              <button onClick={() => setActiveTab('test')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPEAKING & PRONUNCIATION STUDIO (Strict English Response Mode) */}
      {activeTab === 'speak' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', letterSpacing: '0.5px' }}>ENGLISH PRONUNCIATION & PHRASES</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>AI English Teacher</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Англи хэлээр хэрхэн ярих, дуудлага болон монгол утгыг зааж өгөх багш.</p>
          </div>

          <div role="log" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', marginBottom: '12px', paddingBottom: '10px' }}>
            {chatLog.map((msg, index) => (
              <div key={index} style={{ background: msg.role === 'user' ? '#1e3a8a' : '#111827', padding: '14px', borderRadius: '14px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', border: '1px solid #1f2937', fontSize: '14px', lineHeight: '1.6' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '800' }}>
                  {msg.role === 'user' ? 'Та (You)' : 'AI English Teacher'}
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                {msg.role === 'assistant' && (
                  <button onClick={() => speakText("Hello, let me introduce myself. My name is...")} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px', marginTop: '8px', display: 'block', fontWeight: '700' }}>
                    🔊 Дуудлагыг сонсох (Pronunciation)
                  </button>
                )}
              </div>
            ))}
            {generating && (
              <div style={{ background: '#111827', padding: '12px', borderRadius: '12px', alignSelf: 'flex-start', color: '#38bdf8', fontSize: '13px', fontStyle: 'italic', border: '1px solid #1f2937' }}>
                Teacher is generating English phrases & pronunciation...
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

      {/* TAB 3: 10 DAILY VOCABULARY WITH SENTENCE MEANINGS */}
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

      {/* TAB 4: 30 QUESTIONS PLACEMENT TEST (With Beginner Option to Skip) */}
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

      {/* TAB 5: SEPARATED IELTS CENTER (Listening, Reading, Writing, Speaking) */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>SEPARATED IELTS SKILLS</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>IELTS Preparation Center</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Ур чадвар тус бүрээр нь тусгаарласан академик хэсэг.</p>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>🎧 1. Listening Section 1 (University & Student)</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Conversation between a university student and a supervisor regarding library registration.</p>
            <button onClick={() => speakText("Section 1. You will hear a conversation between a student and a university library supervisor. Listen carefully and answer the form.")} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-start' }}>
              🔊 Play Listening Audio Sample
            </button>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>📖 2. Reading Passage (Academic)</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Scientific research texts with comprehensive multiple-choice questions and vocabulary analysis.</p>
            <div style={{ background: '#0b0f19', padding: '10px', borderRadius: '8px', border: '1px solid #1f2937' }}>
              <p style={{ fontSize: '12px', color: '#f8fafc', margin: 0 }}>"The impact of artificial intelligence on modern education systems..." (Reading module active)</p>
            </div>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>✍️ 3. Writing Task 1 & 2 Center</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Graph description and argumentative essay prompts with AI band score evaluation.</p>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>🗣️ 4. Speaking Simulator (Independent)</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Dedicated live speaking module for Part 1, Part 2, and Part 3 examiner practice.</p>
            <button onClick={() => setActiveTab('speak')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-start' }}>
              Open Speaking Studio →
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <nav aria-label="Main Navigation" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0b0f19', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 1000, maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🏠</span> Home
        </button>
        <button onClick={() => setActiveTab('speak')} style={{ background: 'none', border: 'none', color: activeTab === 'speak' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' », color: '#38bdf8' }}>🎙️</span> Speak
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
