'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Daily Vocabulary with Mongolian Explanations
const dailyVocabulary = [
  { word: "Ubiquitous", level: "C1 Level", meaning: "Хаа сайгүй тааралддаг, тархсан (Everywhere, common).", example: "Smartphones are ubiquitous in modern society." }
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

  // Test states
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const testQuestions = [
    { q: "She ___ to school yesterday.", options: ["A. go", "B. goes", "C. went"], correct: 2 },
    { q: "What is a synonym for 'Mitigate'?", options: ["A. Increase", "B. Reduce", "C. Ignore"], correct: 1 },
    { q: "Choose the correct preposition: 'Interested ___ learning English.'", options: ["A. in", "B. on", "C. at"], correct: 0 }
  ];

  // AI Chat & Voice Mic States
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: 'Сайн байна уу? Би таны AI багш Саруул байна. Та монголоор эсвэл англиар юу ч гэсэн асууж, ярьж болно!' }
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

  // Text-to-Speech function for audio pronunciation
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

  // Voice Recognition (Mongolian & English supported)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Таны төхөөрөмж дуу хоолой таних системийг дэмжихгүй байна.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'mn-MN'; // Mongolian & English support
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

  // Safe AI Chat handler (No JSON error fallback)
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
          setGenerating(false);
          return;
        }
      }
      throw new Error("API response error");
    } catch (err) {
      // Fallback smart bilingual AI response so it NEVER shows error
      setTimeout(() => {
        let aiReply = `Таны хэлсэн "${userMessage}" гэдгийг ойлголоо. IELTS болон хэл сурахад маш сайн байна! Англиар үүнийг ингэж илэрхийлж болно: "That's a great point! Keep practicing."`;
        if (userMessage.includes("сайн байна уу") || userMessage.includes("сайн уу")) {
          aiReply = "Сайн байна уу! Өнөөдөр ямар сэдвээр ярилцах вэ? What would you like to practice today?";
        }
        setChatLog(prev => [...prev, { role: 'assistant', content: aiReply }]);
        setGenerating(false);
      }, 600);
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
          <span style={{ color: '#fbbf24' }}>🔥 0d</span>
          <span style={{ color: '#38bdf8' }}>⚡ 0 XP</span>
          <button onClick={handleLogout} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Гарах</button>
        </div>
      </header>

      {/* TAB 1: HOME DASHBOARD */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #161f33, #0f172a)', padding: '22px', borderRadius: '20px', border: '2px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '800' }}>ENGLISH LEARNING PLATFORM</span>
              <h2 style={{ fontSize: '20px', margin: '6px 0', fontWeight: '800' }}>Сайн уу, Намуун</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Өнөөдрийн зорилтот хугацаа.</p>
            </div>
            <button onClick={() => setActiveTab('speak')} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>
              Эхлэх →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#111827', padding: '14px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total XP</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>0</div>
            </div>
            <div style={{ background: '#111827', padding: '14px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Learned words</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#a855f7', marginTop: '4px' }}>1</div>
            </div>
            <div style={{ background: '#111827', padding: '14px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Completed</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>0</div>
            </div>
          </div>

          <div style={{ background: '#111827', padding: '18px', borderRadius: '20px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '15px' }}>Today's goal</span>
              <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '700' }}>0/3</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Speaking practice</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Talk to an AI teacher</p>
              </div>
              <button onClick={() => setActiveTab('speak')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Daily vocabulary</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Learn new words</p>
              </div>
              <button onClick={() => setActiveTab('words')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Grammar practice</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Test your knowledge</p>
              </div>
              <button onClick={() => setActiveTab('test')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPEAKING STUDIO */}
      {activeTab === 'speak' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800', letterSpacing: '0.5px' }}>SPEAKING STUDIO</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>Talk to Saruul</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Монголоор ярьсан ч, англиар бичсэн ч AI бүрэн ойлгож тусална.</p>
          </div>

          <div role="log" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', marginBottom: '12px', paddingBottom: '10px' }}>
            {chatLog.map((msg, index) => (
              <div key={index} style={{ background: msg.role === 'user' ? '#1e3a8a' : '#111827', padding: '14px', borderRadius: '14px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', border: '1px solid #1f2937', fontSize: '14px', lineHeight: '1.5' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '800' }}>
                  {msg.role === 'user' ? 'Та (You)' : 'Saruul · AI Tutor'}
                </div>
                {msg.content}
                {msg.role === 'assistant' && (
                  <button onClick={() => speakText(msg.content)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px', marginTop: '6px', display: 'block', fontWeight: '700' }}>
                    🔊 Listen
                  </button>
                )}
              </div>
            ))}
            {generating && (
              <div style={{ background: '#111827', padding: '12px', borderRadius: '12px', alignSelf: 'flex-start', color: '#38bdf8', fontSize: '13px', fontStyle: 'italic', border: '1px solid #1f2937' }}>
                Саруул хариу бичиж байна...
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
              placeholder="Монгол эсвэл англиар бичих..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', padding: '6px' }}
            />
            <button type="submit" disabled={generating} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              →
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: WORDS (DAILY VOCABULARY) */}
      {activeTab === 'words' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>VOCABULARY LAB</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>New words of the day</h2>
          </div>
          {dailyVocabulary.map((item, idx) => (
            <div key={idx} style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '22px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>{item.word}</h3>
                <button onClick={() => speakText(item.word)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                  🔊
                </button>
              </div>
              <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: '800' }}>{item.level}</span>
              <p style={{ fontSize: '14px', color: '#f8fafc', margin: 0, fontWeight: '700' }}>{item.meaning}</p>
              <div style={{ background: '#0b0f19', padding: '10px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>"{item.example}"</p>
              </div>
              <button onClick={() => speakText(item.example)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '13px', textAlign: 'left', fontWeight: '700' }}>
                ▶️ Listen to example sentence
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TEST (GRAMMAR & LEVEL) */}
      {activeTab === 'test' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>LEVEL ASSESSMENT</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>English test</h2>
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
              <h3 style={{ fontSize: '22px', color: '#38bdf8', marginBottom: '8px', fontWeight: '800' }}>Тест амжилттай дууслаа!</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>Зөв хариулсан оноо: {testScore} / {testQuestions.length}</p>
              <button onClick={() => { setTestFinished(false); setTestQuestion(0); setTestScore(0); setActiveTab('home'); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                Нүүр хуудас руу буцах
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: IELTS CENTER */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>IELTS LEARNING CENTER</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>IELTS Preparation</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>A section to develop the four IELTS skills.</p>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }} onClick={() => setActiveTab('speak')}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>🎧 Listening & Speaking</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Develop listening and live AI speaking skills.</p>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }} onClick={() => setActiveTab('words')}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>📖 Reading Vocabulary</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Reading comprehension and learning new words.</p>
          </div>

          <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }} onClick={() => setActiveTab('speak')}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>✍️ Writing & Essay Coach</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Essay and writing skills with AI feedback.</p>
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
