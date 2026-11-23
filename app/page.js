
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

const vocabulary = [
  {
    word: 'Ubiquitous',
    level: 'C1',
    meaning: 'Хаа сайгүй байдаг, түгээмэл',
    example: 'Smartphones are ubiquitous in modern society.',
    translation: 'Ухаалаг утас орчин үеийн нийгэмд хаа сайгүй байдаг.'
  },
  {
    word: 'Mitigate',
    level: 'B2',
    meaning: 'Бууруулах, сөрөг нөлөөг багасгах',
    example: 'We need to mitigate the effects of climate change.',
    translation: 'Бид уур амьсгалын өөрчлөлтийн нөлөөг бууруулах хэрэгтэй.'
  },
  {
    word: 'Pragmatic',
    level: 'C1',
    meaning: 'Бодит байдалд суурилсан, практик',
    example: 'We need a pragmatic solution.',
    translation: 'Бидэнд бодитой, хэрэгжих боломжтой шийдэл хэрэгтэй.'
  },
  {
    word: 'Innovative',
    level: 'B2',
    meaning: 'Шинэлэг, шинэ санаа агуулсан',
    example: 'The company developed an innovative product.',
    translation: 'Тус компани шинэлэг бүтээгдэхүүн бүтээсэн.'
  },
  {
    word: 'Comprehensive',
    level: 'B2',
    meaning: 'Цогц, дэлгэрэнгүй',
    example: 'This course provides comprehensive training.',
    translation: 'Энэ сургалт цогц мэдлэг олгодог.'
  }
];

const questions = [
  {
    q: "She ___ to school yesterday.",
    translation: 'Тэр өчигдөр сургууль руу явсан.',
    options: ['go', 'goes', 'went', 'gone'],
    correct: 2,
    explanation: 'Yesterday нь өнгөрсөн цагийг илэрхийлнэ. Go-ийн өнгөрсөн хэлбэр нь went.'
  },
  {
    q: 'What does "Mitigate" mean?',
    translation: 'Mitigate ямар утгатай вэ?',
    options: ['Increase', 'Reduce', 'Ignore', 'Create'],
    correct: 1,
    explanation: 'Mitigate гэдэг нь сөрөг нөлөөг бууруулах гэсэн утгатай.'
  },
  {
    q: 'I am interested ___ learning English.',
    translation: 'Би англи хэл сурах сонирхолтой.',
    options: ['in', 'on', 'at', 'with'],
    correct: 0,
    explanation: 'Interested гэдэг үгийн дараа in хэрэглэдэг.'
  },
  {
    q: 'If I ___ more time, I would travel.',
    translation: 'Хэрэв надад илүү цаг байсан бол аялна.',
    options: ['have', 'had', 'will have', 'having'],
    correct: 1,
    explanation: 'Second conditional: If + Past Simple, would + verb.'
  },
  {
    q: 'She has lived here ___ 2020.',
    translation: 'Тэр 2020 оноос хойш энд амьдарч байна.',
    options: ['for', 'during', 'since', 'from'],
    correct: 2,
    explanation: 'Since нь тодорхой эхэлсэн цаг хугацаатай хэрэглэгдэнэ.'
  }
];

const colors = {
  bg: '#080D18',
  panel: '#111B2D',
  panel2: '#17243A',
  border: '#263750',
  blue: '#38BDF8',
  purple: '#A78BFA',
  text: '#F1F5F9',
  muted: '#94A3B8',
  green: '#34D399',
  red: '#F87171'
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [activeTab, setActiveTab] = useState('home');

  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      role: 'assistant',
      content: 'Сайн байна уу! Би Саруул байна. Өнөөдөр англи хэлээр хамтдаа ярилцъя. What would you like to talk about today?'
    }
  ]);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [testLevel, setTestLevel] = useState('');

  const [revealedWords, setRevealedWords] = useState([]);
  const [xp, setXp] = useState(0);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, generating]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!supabase) {
      setMessage('Supabase тохиргоо олдсонгүй. Environment Variables-аа шалгана уу.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        setMessage(
          data.session
            ? 'Бүртгэл амжилттай!'
            : 'Бүртгэл амжилттай! Имэйлээ шалгаад бүртгэлээ баталгаажуулна уу.'
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message || 'Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
    } else {
      setActiveTab('home');
    }
  };

  const speakText = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Таны хөтөч дуу хоолой гаргах функцийг дэмжихгүй байна.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Таны хөтөч дуу хоолой таних функцийг дэмжихгүй байна. Chrome ашиглаж үзнэ үү.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((previous) =>
        previous ? previous + ' ' + transcript : transcript
      );
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || generating) return;

    const userMessage = input.trim();

    setInput('');
    setChatLog((prev) => [
      ...prev,
      { role: 'user', content: userMessage }
    ]);
    setGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Saruul, a professional and friendly English language tutor for a Mongolian learner.

Help the learner improve English speaking and IELTS skills.
When the learner makes a grammar mistake:
1. Give a corrected natural English sentence.
2. Explain the mistake simply.
3. Provide a Mongolian translation.
4. Ask one useful follow-up question.
Be accurate, supportive and concise.

Learner message: ${userMessage}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI үйлчилгээ түр ажиллахгүй байна.');
      }

      if (!data.reply) {
        throw new Error('AI хариу ирсэнгүй.');
      }

      setChatLog((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply }
      ]);
    } catch (error) {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Уучлаарай, алдаа гарлаа: ${error.message}`
        }
      ]);
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerTest = (optionIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(optionIndex);

    const isCorrect = optionIndex === questions[testQuestion].correct;
    const newScore = testScore + (isCorrect ? 1 : 0);

    setTestScore(newScore);

    setTimeout(() => {
      if (testQuestion + 1 < questions.length) {
        setTestQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setTestFinished(true);

        if (newScore === 5) {
          setTestLevel('B2 — Strong result');
        } else if (newScore >= 3) {
          setTestLevel('A2–B1 — Developing');
        } else {
          setTestLevel('A1–A2 — Beginner');
        }
      }
    }, 900);
  };

  const restartTest = () => {
    setTestQuestion(0);
    setTestScore(0);
    setSelectedAnswer(null);
    setTestFinished(false);
    setTestLevel('');
  };

  const toggleWord = (index) => {
    setRevealedWords((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const finishLesson = (lesson) => {
    if (completed.includes(lesson)) return;

    setCompleted((prev) => [...prev, lesson]);
    setXp((prev) => prev + 10);
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Learner';

  const cardStyle = {
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: '20px',
    padding: '20px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg,#2563EB,#38BDF8)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 18px',
    fontWeight: '800',
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    background: '#0A1220',
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '14px',
    color: '#FFFFFF',
    fontSize: '15px',
    outline: 'none'
  };

  if (!user) {
    return (
      <main style={{
        minHeight: '100vh',
        background: colors.bg,
        color: colors.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          ...cardStyle,
          width: '100%',
          maxWidth: '420px',
          padding: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '18px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg,#2563EB,#8B5CF6)',
              fontSize: '28px',
              fontWeight: '900'
            }}>
              F
            </div>

            <h1 style={{
              fontSize: '32px',
              margin: 0,
              fontWeight: '900',
              letterSpacing: '-1px'
            }}>
              Fluency<span style={{ color: colors.blue }}>Go</span>
            </h1>

            <p style={{
              color: colors.muted,
              fontSize: '14px',
              lineHeight: 1.6
            }}>
              Your English journey starts here.
              <br />
              Англи хэлээ өөрийн хурдаар хөгжүүл.
            </p>
          </div>

          {message && (
            <div role="alert" style={{
              background: '#17243A',
              color: colors.blue,
              padding: '13px',
              borderRadius: '10px',
              marginBottom: '18px',
              fontSize: '13px'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <label style={{ fontSize: '13px', fontWeight: '700' }}>
              Имэйл хаяг
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                autoComplete="email"
                style={{ ...inputStyle, marginTop: '8px' }}
              />
            </label>

            <label style={{ fontSize: '13px', fontWeight: '700' }}>
              Нууц үг
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Нууц үгээ оруулна уу"
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                style={{ ...inputStyle, marginTop: '8px' }}
              />
            </label>

            <button type="submit" disabled={loading} style={{
              ...buttonStyle,
              width: '100%',
              opacity: loading ? 0.7 : 1,
              marginTop: '5px'
            }}>
              {loading
                ? 'Түр хүлээнэ үү...'
                : isSignUp
                  ? 'Бүртгэл үүсгэх'
                  : 'Нэвтрэх'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '22px'
          }}>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: colors.blue,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700'
              }}
            >
              {isSignUp
                ? 'Бүртгэлтэй юу? Нэвтрэх'
                : 'Бүртгэлгүй юу? Шинээр бүртгүүлэх'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: colors.bg,
      color: colors.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      paddingBottom: '105px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box'
      }}>

        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '13px',
              background: 'linear-gradient(135deg,#2563EB,#8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '20px'
            }}>
              F
            </div>

            <div>
              <div style={{ fontWeight: '900', fontSize: '19px' }}>
                Fluency<span style={{ color: colors.blue }}>Go</span>
              </div>
              <div style={{ color: colors.muted, fontSize: '10px' }}>
                ENGLISH LEARNING PLATFORM
              </div>
            </div>
          </div>

          <button onClick={handleLogout} style={{
            background: colors.panel2,
            color: colors.muted,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            padding: '9px 12px',
            cursor: 'pointer',
            fontWeight: '700'
          }}>
            Гарах
          </button>
        </header>

        {activeTab === 'home' && (
          <section style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg,#172E55,#24234D)',
              border: '1px solid #31528A',
              borderRadius: '24px',
              padding: '25px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                color: '#93C5FD',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '1px'
              }}>
                YOUR PERSONAL LEARNING SPACE
              </div>

              <h1 style={{
                fontSize: '27px',
                margin: '13px 0 8px',
                fontWeight: '900'
              }}>
                Сайн уу, {displayName}!
              </h1>

              <p style={{
                color: '#C5D5EE',
                fontSize: '14px',
                lineHeight: 1.7,
                maxWidth: '440px'
              }}>
                Өнөөдөр өөрийнхөө англи хэлийг нэг алхмаар ахиулаарай.
                Бага багаар, өдөр бүр.
              </p>

              <button
                onClick={() => setActiveTab('speak')}
                style={{ ...buttonStyle, marginTop: '10px' }}
              >
                Ярианы дасгал эхлүүлэх →
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
              gap: '10px'
            }}>
              {[
                { label: 'Нийт XP', value: xp, icon: '⚡', color: colors.blue },
                { label: 'Сурсан үг', value: revealedWords.length, icon: '📚', color: colors.purple },
                { label: 'Дууссан дасгал', value: completed.length, icon: '✓', color: colors.green }
              ].map((item) => (
                <div key={item.label} style={{
                  ...cardStyle,
                  padding: '15px 12px'
                }}>
                  <div style={{ fontSize: '20px' }}>{item.icon}</div>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '900',
                    color: item.color,
                    margin: '8px 0 3px'
                  }}>
                    {item.value}
                  </div>
                  <div style={{
                    color: colors.muted,
                    fontSize: '11px'
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '17px'
              }}>
                <h2 style={{ fontSize: '17px', margin: 0 }}>
                  Өнөөдрийн зорилго
                </h2>
                <span style={{ color: colors.blue, fontSize: '12px' }}>
                  {completed.length}/3
                </span>
              </div>

              <div style={{
                height: '8px',
                borderRadius: '20px',
                background: '#263750',
                overflow: 'hidden',
                marginBottom: '18px'
              }}>
                <div style={{
                  width: `${completed.length / 3 * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg,#2563EB,#38BDF8)',
                  transition: 'width 0.3s'
                }} />
              </div>

              {[
                { id: 'speaking', icon: '🎙️', title: 'Speaking practice', desc: 'AI багштай ярилцах', tab: 'speak' },
                { id: 'vocabulary', icon: '📖', title: 'Daily vocabulary', desc: 'Шинэ үг сурах', tab: 'learn' },
                { id: 'test', icon: '🎯', title: 'Grammar practice', desc: 'Мэдлэгээ шалгах', tab: 'placement' }
              ].map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '13px',
                  padding: '13px 0',
                  borderTop: `1px solid ${colors.border}`
                }}>
                  <div style={{
                    width: '43px',
                    height: '43px',
                    background: colors.panel2,
                    borderRadius: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '21px'
                  }}>
                    {item.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '800'
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      color: colors.muted,
                      fontSize: '12px',
                      marginTop: '4px'
                    }}>
                      {item.desc}
                    </div>
                  </div>

                  {completed.includes(item.id) ? (
                    <span style={{ color: colors.green }}>✓</span>
                  ) : (
                    <button
                      onClick={() => setActiveTab(item.tab)}
                      style={{
                        background: colors.panel2,
                        color: colors.blue,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '9px',
                        padding: '8px 12px',
                        cursor: 'pointer'
                      }}
                    >
                      Эхлэх
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              ...cardStyle,
              background: 'linear-gradient(135deg,#17243A,#201D40)'
            }}>
              <div style={{ color: colors.purple, fontWeight: '800', fontSize: '12px' }}>
                MEET YOUR AI TUTOR
              </div>
              <h2 style={{ fontSize: '21px', margin: '10px 0' }}>
                Саруул · AI English Tutor
              </h2>
              <p style={{
                color: colors.muted,
                fontSize: '13px',
                lineHeight: 1.7
              }}>
                Англиар ярилц. Алдаагаа засуул. Монгол тайлбартайгаар
                илүү байгалийн ярианы хэллэг сур.
              </p>
              <button
                onClick={() => setActiveTab('speak')}
                style={buttonStyle}
              >
                Саруултай ярилцах →
              </button>
            </div>
          </section>
        )}

        {activeTab === 'speak' && (
          <section style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            height: 'calc(100dvh - 175px)',
            minHeight: '400px'
          }}>
            <div>
              <div style={{
                color: colors.blue,
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '1px'
              }}>
                SPEAKING STUDIO
              </div>
              <h1 style={{ fontSize: '24px', margin: '8px 0' }}>
                Саруултай ярилцах
              </h1>
              <p style={{
                color: colors.muted,
                fontSize: '13px',
                margin: 0
              }}>
                Англиар бич эсвэл микрофоноор ярь.
              </p>
            </div>

            <div style={{
              ...cardStyle,
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '13px'
            }}>
              {chatLog.map((msg, index) => (
                <div key={index} style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? '#193B75' : colors.panel2,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '15px',
                  padding: '13px 15px',
                  maxWidth: '90%',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap'
                }}>
                  <div style={{
                    color: msg.role === 'user' ? '#BFDBFE' : colors.blue,
                    fontSize: '10px',
                    fontWeight: '900',
                    marginBottom: '6px'
                  }}>
                    {msg.role === 'user' ? 'YOU' : 'SARUUL · AI TUTOR'}
                  </div>
                  {msg.content}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.content)}
                      aria-label="Хариултыг сонсох"
                      style={{
                        display: 'block',
                        marginTop: '9px',
                        background: 'none',
                        border: 'none',
                        color: colors.blue,
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🔊 Сонсох
                    </button>
                  )}
                </div>
              ))}

              {generating && (
                <div role="status" style={{
                  color: colors.blue,
                  fontSize: '13px'
                }}>
                  Саруул хариулж байна...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} style={{
              display: 'flex',
              gap: '8px',
              padding: '10px',
              background: colors.panel,
              border: `1px solid ${colors.border}`,
              borderRadius: '15px'
            }}>
              <button
                type="button"
                onClick={handleVoiceInput}
                aria-label="Микрофон"
                style={{
                  background: isListening ? '#7F1D1D' : colors.panel2,
                  color: isListening ? '#FCA5A5' : colors.blue,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  padding: '0 13px',
                  cursor: 'pointer',
                  fontSize: '19px'
                }}
              >
                {isListening ? '⏹' : '🎙️'}
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type in English..."
                aria-label="Англиар зурвас бичих"
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
              />

              <button
                type="submit"
                disabled={generating || !input.trim()}
                style={{
                  ...buttonStyle,
                  padding: '11px 14px',
                  opacity: generating || !input.trim() ? 0.5 : 1
                }}
              >
                →
              </button>
            </form>

            {isListening && (
              <div style={{
                color: colors.red,
                fontSize: '12px',
                textAlign: 'center'
              }}>
                🎙️ Англиар ярьж байна... Дуусахад автоматаар зогсоно.
              </div>
            )}
          </section>
        )}

        {activeTab === 'learn' && (
          <section style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div>
              <div style={{
                color: colors.blue,
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '1px'
              }}>
                VOCABULARY LAB
              </div>
              <h1 style={{ fontSize: '24px', margin: '8px 0' }}>
                Өдрийн шинэ үгс
              </h1>
              <p style={{ color: colors.muted, fontSize: '13px' }}>
                Үг дээр дарж тайлбар болон жишээг үзээрэй.
              </p>
            </div>

            {vocabulary.map((item, index) => {
              const isRevealed = revealedWords.includes(index);

              return (
                <div key={item.word} style={cardStyle}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div>
                      <div style={{
                        color: colors.blue,
                        fontSize: '23px',
                        fontWeight: '900'
                      }}>
                        {item.word}
                      </div>
                      <span style={{
                        color: colors.purple,
                        fontSize: '11px',
                        fontWeight: '800'
                      }}>
                        {item.level} LEVEL
                      </span>
                    </div>

                    <button
                      onClick={() => speakText(item.word)}
                      style={{
                        background: colors.panel2,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '11px',
                        color: colors.blue,
                        padding: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      🔊
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWord(index)}
                    style={{
                      marginTop: '17px',
                      width: '100%',
                      background: colors.panel2,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    {isRevealed ? 'Тайлбарыг нуух ↑' : 'Утга болон жишээ харах ↓'}
                  </button>

                  {isRevealed && (
                    <div style={{ marginTop: '15px' }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '700'
                      }}>
                        {item.meaning}
                      </p>

                      <p style={{
                        fontSize: '13px',
                        color: colors.muted,
                        lineHeight: 1.6
                      }}>
                        {item.example}
                      </p>

                      <p style={{
                        fontSize: '12px',
                        color: colors.green,
                        lineHeight: 1.6
                      }}>
                        {item.translation}
                      </p>

                      <button
                        onClick={() => speakText(item.example)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: colors.blue,
                          cursor: 'pointer',
                          padding: '5px 0',
                          fontSize: '12px'
                        }}
                      >
                        ▶ Жишээ өгүүлбэр сонсох
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => finishLesson('vocabulary')}
              disabled={completed.includes('vocabulary')}
              style={{
                ...buttonStyle,
                opacity: completed.includes('vocabulary') ? 0.5 : 1
              }}
            >
              {completed.includes('vocabulary')
                ? '✓ Дасгал дууссан'
                : 'Үгийн дасгалыг дуусгах +10 XP'}
            </button>
          </section>
        )}

        {activeTab === 'placement' && (
          <section style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div>
              <div style={{
                color: colors.blue,
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '1px'
              }}>
                LEVEL ASSESSMENT
              </div>
              <h1 style={{ fontSize: '24px', margin: '8px 0' }}>
                Англи хэлний сорил
              </h1>
              <p style={{ color: colors.muted, fontSize: '13px' }}>
                Богино дүрмийн дасгал. Энэ нь албан ёсны CEFR үнэлгээ биш.
              </p>
            </div>

            {!testFinished ? (
              <div style={cardStyle}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: colors.blue,
                  fontSize: '12px',
                  fontWeight: '800'
                }}>
                  <span>QUESTION {testQuestion + 1}/{questions.length}</span>
                  <span>{testScore} зөв</span>
                </div>

                <div style={{
                  height: '6px',
                  background: '#263750',
                  borderRadius: '20px',
                  margin: '13px 0 23px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(testQuestion + 1) / questions.length * 100}%`,
                    background: colors.blue,
                    transition: 'width .3s'
                  }} />
                </div>

                <h2 style={{
                  fontSize: '19px',
                  lineHeight: 1.5
                }}>
                  {questions[testQuestion].q}
                </h2>

                <p style={{
                  color: colors.muted,
                  fontSize: '13px'
                }}>
                  {questions[testQuestion].translation}
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '20px'
                }}>
                  {questions[testQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = questions[testQuestion].correct === index;

                    let background = colors.panel2;
                    let border = colors.border;

                    if (selectedAnswer !== null && isCorrect) {
                      background = '#123B32';
                      border = colors.green;
                    } else if (isSelected) {
                      background = '#4C2028';
                      border = colors.red;
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswerTest(index)}
                        disabled={selectedAnswer !== null}
                        style={{
                          background,
                          border: `1px solid ${border}`,
                          color: colors.text,
                          padding: '15px',
                          borderRadius: '12px',
                          textAlign: 'left',
                          cursor: selectedAnswer === null ? 'pointer' : 'default',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div style={{
                    marginTop: '18px',
                    padding: '13px',
                    borderRadius: '11px',
                    background: '#17243A',
                    fontSize: '13px',
                    lineHeight: 1.6
                  }}>
                    <strong style={{
                      color: selectedAnswer === questions[testQuestion].correct
                        ? colors.green
                        : colors.red
                    }}>
                      {selectedAnswer === questions[testQuestion].correct
                        ? 'Зөв хариулт!'
                        : 'Зөв биш байна.'}
                    </strong>
                    <p style={{ color: colors.muted }}>
                      {questions[testQuestion].explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                ...cardStyle,
                textAlign: 'center',
                padding: '30px 20px'
              }}>
                <div style={{ fontSize: '42px' }}>🎓</div>
                <h2 style={{ fontSize: '24px' }}>
                  Сорил дууслаа!
                </h2>

                <div style={{
                  fontSize: '40px',
                  fontWeight: '900',
                  color: colors.blue,
                  margin: '20px 0'
                }}>
                  {testScore}/{questions.length}
                </div>

                <p style={{ color: colors.muted }}>
                  Таны сорилын үр дүн:
                </p>

                <h2 style={{ color: colors.green }}>
                  {testLevel}
                </h2>

                <p style={{
                  color: colors.muted,
                  fontSize: '12px',
                  lineHeight: 1.6
                }}>
                  Энэ богино сорил зөвхөн дүрмийн цөөн асуултад үндэслэсэн
                  тул таны бодит англи хэлний түвшинг бүрэн тогтоохгүй.
                </p>

                <button
                  onClick={restartTest}
                  style={{ ...buttonStyle, marginTop: '15px' }}
                >
                  Дахин сорих
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === 'ielts' && (
          <section style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div>
              <div style={{
                color: colors.blue,
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '1px'
              }}>
                IELTS LEARNING CENTER
              </div>
              <h1 style={{ fontSize: '24px', margin: '8px 0' }}>
                IELTS Preparation
              </h1>
              <p style={{ color: colors.muted, fontSize: '13px' }}>
                IELTS-ийн дөрвөн чадвараа хөгжүүлэх хэсэг.
              </p>
            </div>

            {[
              {
                icon: '🎧',
                title: 'Listening',
                desc: 'Сонсож ойлгох чадвараа хөгжүүлэх'
              },
              {
                icon: '📖',
                title: 'Reading',
                desc: 'Уншиж ойлгох, шинэ үг сурах'
              },
              {
                icon: '✍️',
                title: 'Writing',
                desc: 'Эссэ болон бичгийн чадвар'
              },
              {
                icon: '🎙️',
                title: 'Speaking',
                desc: 'Ярианы дадлага болон өөрийгөө илэрхийлэх'
              }
            ].map((item) => (
              <div key={item.title} style={{
                ...cardStyle,
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: colors.panel2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '23px'
                }}>
                  {item.icon}
                </div>

                <div>
                  <h3 style={{
                    margin: '0 0 5px',
                    fontSize: '15px'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: colors.muted,
                    fontSize: '12px'
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

            <div style={{
              ...cardStyle,
              borderColor: '#51418B'
            }}>
              <div style={{
                color: colors.purple,
                fontSize: '12px',
                fontWeight: '900'
              }}>
                COMING NEXT
              </div>
              <h3 style={{ fontSize: '17px' }}>
                AI Writing Evaluator
              </h3>
              <p style={{
                color: colors.muted,
                fontSize: '13px',
                lineHeight: 1.7
              }}>
                IELTS Writing Task 1 болон Task 2 бичвэрийг шалгах,
                дүрмийн алдаа болон сайжруулах боломжийг тайлбарлах
                системийг дараагийн хувилбарт хөгжүүлнэ.
              </p>
            </div>
          </section>
        )}
      </div>

      <nav aria-label="Main navigation" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(8,13,24,0.97)',
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 5px calc(10px + env(safe-area-inset-bottom))',
        backdropFilter: 'blur(15px)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          {[
            { id: 'home', icon: '⌂', label: 'Нүүр' },
            { id: 'speak', icon: '🎙️', label: 'Ярих' },
            { id: 'learn', icon: '📖', label: 'Үгс' },
            { id: 'placement', icon: '🎯', label: 'Тест' },
            { id: 'ielts', icon: '🎓', label: 'IELTS' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === item.id ? colors.blue : colors.muted,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                minWidth: '48px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '800'
              }}
            >
              <span style={{ fontSize: '20px' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
