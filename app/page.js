
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Daily Vocabulary with Mongolian Explanations for Accessibility
const dailyVocabulary = [
  { word: "Ubiquitous", meaning: "Хаа сайгүй тааралддаг, тархсан.", example: "Smartphones have become ubiquitous in modern daily life." },
  { word: "Mitigate", meaning: "Бууруулах, багасгах, хөнгөвчлөх.", example: "Effective strategies are required to mitigate climate change." },
  { word: "Pragmatic", meaning: "Бодит байдалд суурилсан, практик.", example: "A pragmatic approach to solving economic challenges is essential." },
  { word: "Innovative", meaning: "Шинэлэг, бүтээлч.", example: "FluencyGo provides an innovative platform for language learners." },
  { word: "Comprehensive", meaning: "Цогц, бүхнийг хамарсан.", example: "The course offers a comprehensive review of IELTS grammar." }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Navigation Tabs: 'home' | 'speak' | 'learn' | 'ielts' | 'placement'
  const [activeTab, setActiveTab] = useState('home');

  // Placement Test States
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [userLevel, setUserLevel] = useState('A2 Elementary (Анхан шат)');

  const testQuestions = [
    { q: "Choose the correct form: 'She ___ to the store yesterday.' (Өнгөрсөн цаг дээр зөв хувилбарыг сонгоно уу)", options: ["go", "goes", "went", "gone"], correct: 2 },
    { q: "What is a synonym for 'Mitigate'? ('Mitigate' гэдэг үетэй ижил утгатай үг)", options: ["Increase (Ихсүүлэх)", "Reduce (Багасгах)", "Ignore (Үл тоох)", "Create (Бүтээх)"], correct: 1 },
    { q: "Choose the correct preposition: 'Interested ___ learning English.' (Зөв угтварыг сонгоно уу)", options: ["in", "on", "at", "with"], correct: 0 }
  ];

  // AI Chat & Voice Mic States
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: 'Сайн байна уу? Би таны IELTS болон хэл сурах туслах багш Саруул байна. Энд англиар бичиж эсвэл микрофон ашиглан дуугаар ярьж дасгал хийж болно!' }
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
    // Text-to-Speech function to pronounce words & sentences
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
  };

  // Voice Recognition for Accessibility (Харааны бэрхшээлтэй болон бичихэд бэрх хүмүүст зориулсан микрофон)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Таны төхөөрөмж дуу хоолой таних системийг дэмжихгүй байна.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
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

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `IELTS Speaking Practice. User: ${userMessage}. Answer encouragingly, correct grammar, and provide Mongolian translation/explanations to help accessibility.` })
      });
      const data = await response.json();
      
      if (data.reply) {
        setChatLog(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setChatLog(prev => [...prev, { role: 'assistant', content: 'Уучлаарай, алдаа гарлаа.' }]);
      }
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'assistant', content: 'Сүлжээний алдаа гарлаа.' }]);
    }
    setGenerating(false);
  };

  const handleAnswerTest = (optionIndex) => {
    if (optionIndex === testQuestions[testQuestion].correct) {
      setTestScore(prev => prev + 1);
    }
    if (testQuestion + 1 < testQuestions.length) {
      setTestQuestion(prev => prev + 1);
    } else {
      setTestFinished(true);
      if (testScore >= 2) setUserLevel('B2 Upper-Intermediate (Band 6.5-7.0)');
      else setUserLevel('A2 Elementary (Анхан шат)');
    }
  };

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: '#111827', padding: '32px', borderRadius: '20px', border: '2px solid #38bdf8' }}>
          <h1 style={{ fontSize: '30px', marginBottom: '8px', textAlign: 'center', fontWeight: '800' }}>Fluency <span style={{ color: '#38bdf8' }}>Go</span></h1>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '28px', fontSize: '14px' }}>Хөгжлийн бэрхшээлтэй болон хүн бүрт хүртээмжтэй IELTS систем</p>
          
          {message && <div role="alert" style={{ background: '#1e293b', color: '#38bdf8', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{message}</div>}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label htmlFor="email" style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: '700' }}>Имэйл хаяг</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-required="true" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #374151', background: '#030712', color: '#fff', boxSizing: 'border-box' }} placeholder="example@gmail.com" />
            </div>
            <div>
              <label htmlFor="pass" style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: '700' }}>Нууц үг</label>
              <input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-required="true" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #374151', background: '#030712', color: '#fff', boxSizing: 'border-box' }} placeholder="********" />
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
          <div aria-hidden="true" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>F</div>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>Fluency<span style={{ color: '#38bdf8' }}>Go</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '700' }}>
          <span aria-label="1 day streak" style={{ color: '#fbbf24' }}>🔥 1d</span>
          <span aria-label="20 experience points" style={{ color: '#38bdf8' }}>⚡ 20 XP</span>
          <button onClick={handleLogout} aria-label="Log out of account" style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Гарах</button>
        </div>
      </header>

      {/* TAB 1: HOME DASHBOARD */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #161f33, #0f172a)', padding: '22px', borderRadius: '20px', border: '2px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '800' }}>{userLevel}</span>
              <h2 style={{ fontSize: '22px', margin: '6px 0', fontWeight: '800' }}>Сайн уу, Намуун</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Өнөөдрийн суралцах зорилтот хугацаа: 15 минут.</p>
            </div>
            <button onClick={() => setActiveTab('placement')} aria-label="Take placement test" style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '12px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>
              🎯 Түвшин тогтоох
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>🔥 Streak</span>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>1d</div>
            </div>
            <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>⚡ XP</span>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>20</div>
            </div>
            <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>📚 Words</span>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#a855f7', marginTop: '4px' }}>5</div>
            </div>
          </div>

          <div onClick={() => setActiveTab('speak')} role="button" tabIndex={0} aria-label="Open AI Voice Tutor" style={{ background: '#111827', padding: '20px', borderRadius: '20px', border: '2px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div aria-hidden="true" style={{ width: '48px', height: '48px', background: '#3b82f6', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👩‍🏫</div>
              <div>
                <h4 style={{ fontSize: '16px', margin: '0 0 2px 0', fontWeight: '800' }}>Саруул · Хос хэлний багш (AI Tutor)</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Монгол тайлбартайгаар яриа болон дүрмийн дасгал хийх</p>
              </div>
            </div>
            <span style={{ color: '#38bdf8', fontSize: '20px' }}>→</span>
          </div>
        </div>
      )}

      {/* TAB 2: PLACEMENT TEST */}
      {activeTab === 'placement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>🎯 Англи хэлний түвшин тогтоох сорил</h2>
          {!testFinished ? (
            <div style={{ background: '#111827', padding: '22px', borderRadius: '18px', border: '2px solid #38bdf8' }}>
              <p style={{ fontSize: '13px', color: '#38bdf8', marginBottom: '10px', fontWeight: '700' }}>Асуулт {testQuestion + 1} / {testQuestions.length}</p>
              <h3 style={{ fontSize: '17px', marginBottom: '18px', lineHeight: '1.6', fontWeight: '700' }}>{testQuestions[testQuestion].q}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {testQuestions[testQuestion].options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswerTest(idx)} style={{ background: '#1e293b', color: '#fff', border: '2px solid #334155', padding: '14px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                    {idx + 1}. {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: '#111827', padding: '26px', borderRadius: '18px', border: '2px solid #38bdf8', textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px', color: '#38bdf8', marginBottom: '10px', fontWeight: '800' }}>Баяр хүргэе!</h3>
              <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '16px' }}>Таны тогтоогдсон түвшин:</p>
              <div style={{ fontSize: '20px', fontWeight: '800', background: '#1e293b', padding: '14px', borderRadius: '12px', marginBottom: '20px', color: '#fff' }}>{userLevel}</div>
              <button onClick={() => { setTestFinished(false); setTestQuestion(0); setTestScore(0); setActiveTab('home'); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '14px 24px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '15px' }}>
                Нүүр хуудас руу буцах
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SPEAK & VOICE MIC */}
      {activeTab === 'speak' && ({/* TAB 4: LEARN & VOCABULARY WITH AUDIO PRONUNCIATION */}
      {activeTab === 'learn' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Өдрийн шинэ үг (Daily Vocabulary)</h2>
          {dailyVocabulary.map((item, idx) => (
            <div key={idx} style={{ background: '#111827', padding: '18px', borderRadius: '16px', border: '2px solid #1f2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '22px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>{item.word}</h3>
                <button 
                  onClick={() => speakText(item.word)} 
                  aria-label={`Pronounce ${item.word}`}
                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
                >
                  🔊 Дуудлага сонсох
                </button>
              </div>
              <p style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 10px 0', fontWeight: '700' }}>{item.meaning}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b0f19', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>"{item.example}"</p>
                <button 
                  onClick={() => speakText(item.example)} 
                  aria-label="Pronounce example sentence"
                  style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                >
                  ▶️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>AI Speaking & Voice Tutor</h2>
            <button onClick={handleVoiceInput} aria-label="Use microphone for voice input" style={{ background: isListening ? '#dc2626' : '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
              {isListening ? '🎤 Сонсож байна...' : '🎙️ Микрофоноор ярих'}
            </button>
          </div>

          <div role="log" aria-label="Conversation history" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', marginBottom: '12px', paddingBottom: '10px' }}>
            {chatLog.map((msg, index) => (
              <div key={index} style={{ background: msg.role === 'user' ? '#1e3a8a' : '#111827', padding: '16px', borderRadius: '16px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', border: '2px solid #1f2937', fontSize: '15px', lineHeight: '1.6' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '800' }}>
                  {msg.role === 'user' ? 'Та' : 'Саруул (AI Tutor)'}
                </div>
                {msg.content}
              </div>
            ))}
            {generating && (
              <div role="status" style={{ background: '#111827', padding: '14px', borderRadius: '14px', alignSelf: 'flex-start', color: '#38bdf8', fontSize: '14px', fontStyle: 'italic', border: '2px solid #1f2937', fontWeight: '700' }}>
                Багш хариу бичиж байна...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', background: '#111827', padding: '10px 14px', borderRadius: '16px', border: '2px solid #1f2937', alignItems: 'center' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Энд англиар бичих эсвэл микрофон ашиглана уу..." 
              aria-label="Type your message in English"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none', padding: '6px' }}
            />
            <button type="submit" disabled={generating} style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
              Илгээх
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: LEARN & VOCABULARY */}
      {activeTab === 'learn' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Өдрийн шинэ үг (Daily Vocabulary)</h2>
          {dailyVocabulary.map((item, idx) => (
            <div key={idx} style={{ background: '#111827', padding: '18px', borderRadius: '16px', border: '2px solid #1f2937' }}>
              <h3 style={{ fontSize: '22px', color: '#38bdf8', margin: '0 0 6px 0', fontWeight: '800' }}>{item.word}</h3>
              <p style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 10px 0', fontWeight: '700' }}>{item.meaning}</p>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>"{item.example}"</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: IELTS & WRITING */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>IELTS Writing & Speaking Center</h2>
          <div style={{ background: '#111827', padding: '20px', borderRadius: '18px', border: '2px solid #1f2937' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', margin: '0 0 8px 0', fontWeight: '800' }}>✍️ Writing Task 2 Evaluator</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>Эссэ бичээд Band 7.0+ үнэлгээ, зөвлөгөөг монголоор нарийвчлан авах боломжтой.</p>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <nav aria-label="Main Navigation" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0b0f19', borderTop: '2px solid #1e293b', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 1000, maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#38bdf8' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}>
          <span style={{ fontSize: '20px' }}>🏠</span> Нүүр
        </button>
        <button onClick={() => setActiveTab('speak')} style={{ background: 'none', border: 'none', color: activeTab === 'speak' ? '#38bdf8' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}>
          <span style={{ fontSize: '20px' }}>🎙️</span> Ярих
        </button>
        <button onClick={() => setActiveTab('learn')} style={{ background: 'none', border: 'none', color: activeTab === 'learn' ? '#38bdf8' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}>
          <span style={{ fontSize: '20px' }}>📖</span> Үгс
        </button>
        <button onClick={() => setActiveTab('placement')} style={{ background: 'none', border: 'none', color: activeTab === 'placement' ? '#38bdf8' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}>
          <span style={{ fontSize: '20px' }}>🎯</span> Тест
        </button>
        <button onClick={() => setActiveTab('ielts')} style={{ background: 'none', border: 'none', color: activeTab === 'ielts' ? '#38bdf8' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}>
          <span style={{ fontSize: '20px' }}>🎓</span> IELTS
        </button>
      </nav>

    </main>
  );
}
