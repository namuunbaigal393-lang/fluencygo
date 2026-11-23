'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // App Navigation Tabs: 'home' | 'speak' | 'learn' | 'ielts' | 'progress'
  const [activeTab, setActiveTab] = useState('home');

  // AI Chat states
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: 'Hello! Welcome to FluencyGo 🚀 Your AI IELTS Speaking Companion. Tell me about your day in English, and let\'s practice!' }
  ]);
  const [generating, setGenerating] = useState(false);

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
      else setMessage('Registration successful! Please check your email or log in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
        body: JSON.stringify({ prompt: userMessage })
      });
      const data = await response.json();
      
      if (data.reply) {
        setChatLog(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setChatLog(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'assistant', content: 'Network error. Please check your connection.' }]);
    }
    setGenerating(false);
  };

  // Login / Register view if not authenticated
  if (!user) {
    return (
      <main style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: '#111827', padding: '32px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '2px solid #1f2937' }}>
          <h1 style={{ fontSize: '30px', marginBottom: '8px', textAlign: 'center', fontWeight: '800', letterSpacing: '-0.5px' }}>Fluency <span style={{ color: '#38bdf8' }}>Go</span></h1>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '28px', fontSize: '14px', lineHeight: '1.5' }}>Accessible AI IELTS Learning Platform for Everyone</p>
          
          {message && <div role="alert" style={{ background: '#1e293b', border: '1px solid #38bdf8', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', color: '#38bdf8', textAlign: 'center', fontWeight: '500' }}>{message}</div>}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #374151', background: '#030712', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
                placeholder="example@gmail.com"
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #374151', background: '#030712', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
                placeholder="********"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Log In')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', fontWeight: '600', padding: '8px' }}
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Main App View after Login with Gamified UI & Bottom Navigation
  return (
    <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', display: 'flex', flexDirection: 'column', padding: '16px 16px 80px 16px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>F</div>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>Fluency<span style={{ color: '#38bdf8' }}>Go</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '14px', fontWeight: '700' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>🔥 1d</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>⚡ 20 XP</span>
          <button onClick={handleLogout} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Exit</button>
        </div>
      </header>

      {/* TAB 1: HOME DASHBOARD */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Welcome Card */}
          <div style={{ background: 'linear-gradient(135deg, #161f33, #0f172a)', padding: '22px', borderRadius: '20px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>IELTS Band 7.0 · A2 Elementary</span>
              <h2 style={{ fontSize: '22px', margin: '6px 0 6px 0', fontWeight: '800', color: '#fff' }}>Сайн уу, Намуун</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>Өдрийн зорилтдоо хүрэхэд ердөө 15 минут үлдлээ.</p>
            </div>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '4px solid #1e293b', borderTopColor: '#38bdf8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', flexShrink: 0 }}>
              0/15 <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'normal' }}>min</span>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>🔥 Streak</span>
              <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '6px', color: '#fbbf24' }}>1d</div>
            </div>
            <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>⚡ Total XP</span>
              <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '6px', color: '#38bdf8' }}>20</div>
            </div>
            <div style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>📚 Words</span>
              <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '6px', color: '#a855f7' }}>0</div>
            </div>
          </div>

          {/* Saruul Tutor Card */}
          <div style={{ background: '#111827', padding: '18px', borderRadius: '20px', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', background: '#3b82f6', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>👩‍🏫</div>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Saruul · Your Bilingual Tutor</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>“Өнөөдөр 5 минут ч болов...”</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('speak')} style={{ background: '#14b8a6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Chat Now
            </button>
          </div>

          {/* Quick Speak & AI Tutor Link */}
          <div onClick={() => setActiveTab('speak')} style={{ background: '#111827', padding: '16px 18px', borderRadius: '20px', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', background: '#1e293b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>💬</div>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Speak & AI Tutor</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Voice chat + Mongolian grammar tips</p>
              </div>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '18px' }}>→</span>
          </div>
        </div>
      )}

      {/* TAB 2: SPEAK / AI CHAT */}
      {activeTab === 'speak' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: '800' }}>AI Speaking Tutor</h2>
          <div role="log" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', marginBottom: '12px', paddingBottom: '10px' }}>
            {chatLog.map((msg, index) => (
              <div key={index} style={{ background: msg.role === 'user' ? '#1e3a8a' : '#111827', padding: '14px', borderRadius: '14px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', border: '1px solid #1f2937', fontSize: '14px', lineHeight: '1.5' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' }}>
                  {msg.role === 'user' ? 'You' : 'AI IELTS Examiner'}
                </div>
                {msg.content}
              </div>
            ))}
            {generating && (
              <div style={{ background: '#111827', padding: '12px', borderRadius: '12px', alignSelf: 'flex-start', color: '#38bdf8', fontSize: '13px', fontStyle: 'italic', border: '1px solid #1f2937' }}>
                AI is responding...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', background: '#111827', padding: '8px 12px', borderRadius: '14px', border: '1px solid #1f2937', alignItems: 'center' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type your answer in English..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', padding: '6px' }}
            />
            <button type="submit" disabled={generating} style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Send
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LEARN & VOCABULARY */}
      {activeTab === 'learn' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '4px', fontWeight: '800' }}>Daily Word & Vocabulary</h2>
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '24px', borderRadius: '20px', border: '1px solid #38bdf8' }}>
            <span style={{ background: '#38bdf8', color: '#0b0f19', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Word of the Day</span>
            <h3 style={{ fontSize: '26px', color: '#f8fafc', margin: '12px 0 6px 0', fontWeight: '800' }}>Ubiquitous</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 16px 0', fontStyle: 'italic' }}>Present, appearing, or found everywhere.</p>
            <div style={{ background: '#0b0f19', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>IELTS Example:</span>
              <p style={{ fontSize: '14px', margin: 0, color: '#e2e8f0' }}>"Smartphones have become ubiquitous in modern daily life."</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IELTS MODULES */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '4px', fontWeight: '800' }}>IELTS Practice Center</h2>
          <div style={{ background: '#111827', padding: '18px', borderRadius: '16px', border: '1px solid #1f2937' }}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 6px 0', fontWeight: '700' }}>✍️ Writing Task 2 Evaluator</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>Get instant Band 7+ score estimation and professional feedback on your essays.</p>
          </div>
          <div style={{ background: '#111827', padding: '18px', borderRadius: '16px', border: '1px solid #1f2937' }}>
            <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 6px 0', fontWeight: '700' }}>🎤 Speaking Part 1, 2 & 3 Simulator</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>Practice live voice-driven Q&A sessions with the AI Examiner.</p>
          </div>
        </div>
      )}

      {/* TAB 5: PROGRESS */}
      {activeTab === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '4px', fontWeight: '800' }}>Your Progress</h2>
          <div style={{ background: '#111827', padding: '20px', borderRadius: '16px', border: '1px solid #1f2937', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#38bdf8' }}>Level A2</div>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>Target: IELTS Band 7.0+</p>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR (Fixed at bottom) */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0b0f19', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 1000, maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🏠</span> Home
        </button>
        <button onClick={() => setActiveTab('speak')} style={{ background: 'none', border: 'none', color: activeTab === 'speak' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🎙️</span> Speak
        </button>
        <button onClick={() => setActiveTab('learn')} style={{ background: 'none', border: 'none', color: activeTab === 'learn' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>📖</span> Learn
        </button>
        <button onClick={() => setActiveTab('ielts')} style={{ background: 'none', border: 'none', color: activeTab === 'ielts' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>🎓</span> IELTS
        </button>
        <button onClick={() => setActiveTab('progress')} style={{ background: 'none', border: 'none', color: activeTab === 'progress' ? '#38bdf8' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ fontSize: '18px' }}>📊</span> Progress
        </button>
      </nav>

    </main>
  );
}
