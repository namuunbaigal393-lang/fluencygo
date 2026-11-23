
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sample Daily Vocabulary Database for IELTS Band 7.0+
const dailyVocabulary = [
  { word: "Ubiquitous", meaning: "Present, appearing, or found everywhere.", example: "Smartphones have become ubiquitous in modern daily life." },
  { word: "Mitigate", meaning: "Make less severe, serious, or painful.", example: "Effective strategies are required to mitigate climate change." },
  { word: "Pragmatic", meaning: "Dealing with things sensibly and realistically.", example: "A pragmatic approach to solving economic challenges is essential." },
  { word: "Innovative", meaning: "Featuring new methods; advanced and original.", example: "FluencyGo provides an innovative platform for language learners." },
  { word: "Comprehensive", meaning: "Complete; including all or nearly all elements.", example: "The course offers a comprehensive review of IELTS grammar." }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // App Navigation Tabs: 'chat' | 'vocabulary' | 'writing' | 'reading'
  const [activeTab, setActiveTab] = useState('chat');

  // Daily word state (picks a word based on day of the year)
  const [todayWord, setTodayWord] = useState(dailyVocabulary[0]);

  // AI Chat states
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: 'Hello! Welcome to FluencyGo 🚀 Your AI IELTS Companion. Choose a section below or practice Speaking with me right now!' }
  ]);
  const [generating, setGenerating] = useState(false);

  // Writing practice states
  const [writingPrompt, setWritingPrompt] = useState("Some people think that university education should be free for everyone. To what extent do you agree or disagree?");
  const [essayInput, setEssayInput] = useState('');
  const [essayFeedback, setEssayFeedback] = useState('');
  const [evaluatingEssay, setEvaluatingEssay] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Select Word of the Day based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setTodayWord(dailyVocabulary[dayOfYear % dailyVocabulary.length]);

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
        body: JSON.stringify({ prompt: `IELTS Speaking Practice: ${userMessage}` })
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

  const evaluateEssay = async (e) => {
    e.preventDefault();
    if (!essayInput.trim() || evaluatingEssay) return;

    setEvaluatingEssay(true);
    setEssayFeedback('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Evaluate this IELTS Writing Task 2 essay based on Band 7+ criteria (Task Response, Coherence, Lexical Resource, Grammatical Range) and give constructive feedback:\n\nPrompt: ${writingPrompt}\n\nEssay: ${essayInput}` })
      });
      const data = await response.json();
      if (data.reply) {
        setEssayFeedback(data.reply);
      } else {
        setEssayFeedback('Could not evaluate essay right now. Please try again.');
      }
    } catch (err) {
      setEssayFeedback('Network error during evaluation.');
    }
    setEvaluatingEssay(false);
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
              <label htmlFor="email-input" style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Email address</label>
              <input 
                id="email-input"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                aria-required="true"
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #374151', background: '#030712', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
                placeholder="example@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="password-input" style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Password</label>
              <input 
                id="password-input"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                aria-required="true"
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #374151', background: '#030712', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
                placeholder="********"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              aria-busy={loading}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 14px rgba(56,189,248,0.4)' }}
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

  // Main App View after Login with Tabs
  return (
    <main style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column', padding: '16px', maxWidth: '680px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #1f2937', paddingBottom: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>Fluency <span style={{ color: '#38bdf8' }}>Go</span></h1>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0', fontWeight: '500' }}>{user.email}</p>
        </div>
        <button 
          onClick={handleLogout} 
          aria-label="Log out of your account"
          style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
        >
          Log out
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav aria-label="Main Navigation" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1f)', gap: '8px', marginBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('chat')} 
          style={{ padding: '10px', borderRadius: '10px', border: activeTab === 'chat' ? '2px solid #38bdf8' : '2px solid #1f2937', background: activeTab === 'chat' ? '#1e293b' : '#111827', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
        >
          🎤 Speaking AI
        </button>
        <button 
          onClick={() => setActiveTab('writing')} 
          style={{ padding: '10px', borderRadius: '10px', border: activeTab === 'writing' ? '2px solid #38bdf8' : '2px solid #1f2937', background: activeTab === 'writing' ? '#1e293b' : '#111827', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
        >
          ✍️ Writing Coach
        </button>
        <button 
          onClick={() => setActiveTab('vocabulary')} 
          style={{ padding: '10px', borderRadius: '10px', border: activeTab === 'vocabulary' ? '2px solid #38bdf8' : '2px solid #1f2937', background: activeTab === 'vocabulary' ? '#1e293b' : '#111827', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
        >
          📚 Daily Word
        </button>
      </nav>

      {/* TAB 1: SPEAKING AI CHAT */}
      {activeTab === 'chat' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 210px)' }}>
          <div role="log" aria-label="Chat history" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', marginBottom: '12px', paddingBottom: '10px' }}>
            {chatLog.map((msg, index) => (
              <div key={index} style={{ background: msg.role === 'user' ? '#1e3a8a' : '#111827', padding: '14px', borderRadius: '12px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', border: '2px solid #1f2937', fontSize: '14px', lineHeight: '1.5' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' }}>
                  {msg.role === 'user' ? 'You' : 'AI IELTS Examiner'}
                </div>
                {msg.content}
              </div>
            ))}
            {generating && (
              <div role="status" style={{ background: '#111827', padding: '12px', borderRadius: '12px', alignSelf: 'flex-start', color: '#38bdf8', fontSize: '13px', fontStyle: 'italic', border: '2px solid #1f2937', fontWeight: '600' }}>
                AI is responding...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', background: '#111827', padding: '8px 12px', borderRadius: '14px', border: '2px solid #1f2937', alignItems: 'center' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Speak or type your answer in English..." 
              aria-label="Type your English answer"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', padding: '6px' }}
            />
            <button type="submit" disabled={generating} style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Send
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: WRITING COACH */}
      {activeTab === 'writing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          <div style={{ background: '#111827', padding: '16px', borderRadius: '14px', border: '2px solid #1f2937' }}>
            <h3 style={{ fontSize: '14px', color: '#38bdf8', margin: '0 0 8px 0', fontWeight: '700' }}>IELTS Writing Task 2 Prompt</h3>
            <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5', color: '#e2e8f0' }}>{writingPrompt}</p>
          </div>

          <form onSubmit={evaluateEssay} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea 
              rows="6"
              value={essayInput}
              onChange={(e) => setEssayInput(e.target.value)}
              placeholder="Type your essay or response here..."
              style={{ width: '100%', background: '#111827', color: '#fff', border: '2px solid #1f2937', borderRadius: '12px', padding: '14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', lineHeight: '1.5' }}
            ></textarea>
            <button type="submit" disabled={evaluatingEssay} style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
              {evaluatingEssay ? 'Evaluating with AI...' : 'Get AI Band Score & Feedback'}
            </button>
          </form>

          {essayFeedback && (
            <div style={{ background: '#111827', padding: '16px', borderRadius: '14px', border: '2px solid #38bdf8', marginTop: '10px' }}>
              <h4 style={{ fontSize: '14px', color: '#38bdf8', margin: '0 0 8px 0', fontWeight: '700' }}>Examiner Feedback:</h4>
              <p style={{ fontSize: '14px', margin: 0, whiteSpace: 'pre-line', lineHeight: '1.6', color: '#f8fafc' }}>{essayFeedback}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DAILY VOCABULARY */}
      {activeTab === 'vocabulary' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '24px', borderRadius: '18px', border: '2px solid #38bdf8', boxShadow: '0 10px 25px rgba(56,189,248,0.1)' }}>
            <span style={{ background: '#38bdf8', color: '#090d16', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Word of the Day</span>
            <h2 style={{ fontSize: '28px', color: '#f8fafc', margin: '12px 0 6px 0', fontWeight: '800' }}>{todayWord.word}</h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', margin: '0 0 16px 0', fontStyle: 'italic' }}>{todayWord.meaning}</p>
            <div style={{ background: '#090d16', padding: '14px', borderRadius: '10px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>IELTS Example:</span>
              <p style={{ fontSize: '14px', margin: 0, color: '#e2e8f0' }}>"{todayWord.example}"</p>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: 0 }}>Come back every day for a new advanced IELTS vocabulary word!</p>
        </div>
      )}

    </main>
  );
}
