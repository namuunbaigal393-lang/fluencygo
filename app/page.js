'use client';
import { useState } from 'react';

const vocabularyData = {
  beginner: [
    { word: "Hello", level: "A1", meaning: "Сайн байна уу?", example: "Hello, nice to meet you.", trans: "Сайн байна уу, тантай уулзахад таатай байна." },
    { word: "Water", level: "A1", meaning: "Ус", example: "I like to drink cold water.", trans: "Би хүйтэн ус уух дуртай." },
    { word: "Family", level: "A1", meaning: "Гэр бүл", example: "My family lives in Ulaanbaatar.", trans: "Миний гэр бүл Улаанбаатарт амьдардаг." }
  ],
  intermediate: [
    { word: "Improve", level: "B1", meaning: "Сайжруулах", example: "I want to improve my English.", trans: "Би англи хэлээ сайжруулахыг хүсч байна." },
    { word: "Experience", level: "B2", meaning: "Туршлага", example: "Work experience is important.", trans: "Ажлын туршлага чухал." }
  ],
  advanced: [
    { word: "Ubiquitous", level: "C1", meaning: "Хаа сайгүй тааралддаг.", example: "Smartphones are ubiquitous.", trans: "Ухаалаг утас хаа сайгүй байна." }
  ]
};

const realPlacementQuestions = [
  { q: "1. Choose the correct form: 'She ___ to the office every morning.'", options: ["A. go", "B. goes", "C. going"], correct: 1 },
  { q: "2. Choose the correct past tense: 'They ___ a great movie yesterday.'", options: ["A. watch", "B. watched", "C. watching"], correct: 1 },
  { q: "3. Identify the correct preposition: 'He is interested ___ learning English.'", options: ["A. on", "B. in", "C. at"], correct: 1 }
];

const readingPassages = [
  {
    title: "The Evolution of Digital Education Systems",
    text: "The rapid evolution of artificial intelligence in modern higher education has fundamentally transformed how students access research materials and interact with digital learning platforms.",
    question: "What is the primary role of AI in modern education?",
    options: ["A. Replacing teachers", "B. Transforming how students access materials", "C. Printing books"],
    correct: 1
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [ieltsSubTab, setIeltsSubTab] = useState('menu');
  const [xp, setXp] = useState(85);
  const [userLevel, setUserLevel] = useState('beginner');
  
  // Test States
  const [testModeSelected, setTestModeSelected] = useState(false);
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // Speak / AI Chat States
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: "Hello! I am your AI English Teacher. Type or use the microphone to practice English and get instant professional phrases with pronunciation and Mongolian translation!" }
  ]);
  const [generating, setGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Reading States
  const [readingAnswered, setReadingAnswered] = useState(false);
  const [readingScore, setReadingScore] = useState(0);

  // Writing States
  const [userEssay, setUserEssay] = useState('');

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

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || generating) return;
    const userMsg = input;
    setInput('');
    setChatLog(prev => [...prev, { role: 'user', content: userMsg }]);
    setGenerating(true);

    setTimeout(() => {
      let reply = `💡 **English Translation & Guide:**\n\nTo express "${userMsg}" professionally, use:\n👉 **"Furthermore, regarding this matter..."**\n\n📌 **Pronunciation:** [ˈfɜːrðərmɔːr, rɪˈɡɑːrdɪŋ]\n\n🇲🇳 **Монгол тайлбар:** Уг санааг англиар илэрхийлэхэд хамгийн оновчтой хэллэг юм.`;
      setChatLog(prev => [...prev, { role: 'assistant', content: reply }]);
      setXp(p => p + 5);
      setGenerating(false);
    }, 600);
  };

  const handleAnswerTest = (idx) => {
    let score = testScore;
    if (idx === realPlacementQuestions[testQuestion].correct) {
      score++;
      setTestScore(score);
    }
    if (testQuestion + 1 < realPlacementQuestions.length) {
      setTestQuestion(p => p + 1);
    } else {
      setTestFinished(true);
      if (score === 1) setUserLevel('beginner');
      else if (score === 2) setUserLevel('intermediate');
      else setUserLevel('advanced');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', display: 'flex', flexDirection: 'column', padding: '16px 16px 90px 16px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>F</div>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>Fluency<span style={{ color: '#38bdf8' }}>Go</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
          <span style={{ color: '#38bdf8' }}>⚡ {xp} XP</span>
          <button onClick={() => { setActiveTab('home'); setTestModeSelected(false); setTestFinished(false); setTestQuestion(0); }} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
            Гарах ⮡
          </button>
        </div>
      </header>

      {/* HOME */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#161f33', padding: '20px', borderRadius: '16px', border: '1px solid #38bdf8' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 6px 0' }}>Түвшин: {userLevel.toUpperCase()}</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Өнөөдрийн хичээлүүд болон Speaking, IELTS модулиуд бэлэн байна.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={() => setActiveTab('speak')} style={{ background: '#111827', color: '#38bdf8', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>🎙️ AI Speaking & Mic</button>
            <button onClick={() => setActiveTab('words')} style={{ background: '#111827', color: '#fff', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>📖 Шинэ үгс ({userLevel})</button>
            <button onClick={() => setActiveTab('test')} style={{ background: '#111827', color: '#fff', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>🎯 Түвшин тест</button>
            <button onClick={() => setActiveTab('ielts')} style={{ background: '#111827', color: '#38bdf8', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>🎓 IELTS & Skills</button>
          </div>
        </div>
      )}

      {/* SPEAK (MIC & TRANSLATION) */}
      {activeTab === 'speak' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ marginBottom: '10px' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>AI Speaking & Translation Studio</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Микрофон дээр дарж ярих эсвэл хүссэн үгээ бичиж англи-монгол орчуулга, дуудлага аваарай.</p>
          </div>
          <div role="log" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', marginBottom: '10px', paddingBottom: '10px' }}>
            {chatLog.map((m, i) => (
              <div key={i} style={{ background: m.role === 'user' ? '#1e3a8a' : '#111827', padding: '12px', borderRadius: '10px', fontSize: '14px', whiteSpace: 'pre-line', border: '1px solid #1f2937' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>{m.role === 'user' ? 'ТАНЫ АСУУЛТ' : 'AI БАГШ'}</div>
                {m.content}
                {m.role === 'assistant' && (
                  <button onClick={() => speakText("Furthermore, regarding this matter...")} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px', marginTop: '6px', fontWeight: 'bold', display: 'block' }}>
                    🔊 Дуудлагыг сонсох
                  </button>
                )}
              </div>
            ))}
            {generating && <div style={{ color: '#38bdf8', fontSize: '12px', fontStyle: 'italic' }}>AI хариу бэлдэж байна...</div>}
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', background: '#111827', padding: '8px', borderRadius: '12px', border: '1px solid #1f2937', alignItems: 'center' }}>
            <button type="button" onClick={handleVoiceInput} style={{ background: isListening ? '#dc2626' : 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px' }} title="Дуугаар ярих">
              🎙️
            </button>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Англи эсвэл монголоор бичих..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '8px', outline: 'none', fontSize: '14px' }} />
            <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}>Илгээх</button>
          </form>
        </div>
      )}

      {/* WORDS */}
      {activeTab === 'words' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>Шинэ үгс ({userLevel})</h2>
          {vocabularyData[userLevel].map((w, i) => (
            <div key={i} style={{ background: '#111827', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '18px' }}>{w.word} ({w.level})</h3>
                <button onClick={() => speakText(w.word)} style={{ background: '#1e293b', border: 'none', color: '#38bdf8', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>🔊</button>
              </div>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Утга: {w.meaning}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Жишээ: "{w.example}" — {w.trans}</p>
            </div>
          ))}
        </div>
      )}

      {/* TEST */}
      {activeTab === 'test' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#111827', padding: '18px', borderRadius: '14px', border: '1px solid #1f2937' }}>
          {!testModeSelected ? (
            <>
              <h2 style={{ fontSize: '18px', margin: 0 }}>Түвшин тогтоох тест</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Анхан шатнаас шууд эхлэх эсвэл сорил өгнө үү.</p>
              <button onClick={() => { setUserLevel('beginner'); setActiveTab('words'); }} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Огт мэддэггүй (Beginner шууд эхлэх)</button>
              <button onClick={() => setTestModeSelected(true)} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Тест эхлэх</button>
            </>
          ) : !testFinished ? (
            <>
              <p style={{ fontSize: '12px', color: '#38bdf8', margin: 0 }}>Асуулт {testQuestion + 1} / {realPlacementQuestions.length}</p>
              <h3 style={{ fontSize: '15px', margin: '6px 0 10px 0' }}>{realPlacementQuestions[testQuestion].q}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {realPlacementQuestions[testQuestion].options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswerTest(idx)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '10px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>{opt}</button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <h3 style={{ color: '#38bdf8', margin: '0 0 6px 0' }}>Тест амжилттай дууслаа!</h3>
              <p style={{ margin: '0 0 14px 0' }}>Таны тогтоогдсон түвшин: **{userLevel.toUpperCase()}**</p>
              <button onClick={() => { setTestFinished(false); setTestModeSelected(false); setTestQuestion(0); setTestScore(0); setActiveTab('home'); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Нүүр хуудас руу очих</button>
            </div>
          )}
        </div>
      )}

      {/* IELTS & SKILLS HUB */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '30px' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: '0 0 2px 0' }}>IELTS & Skills Center</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Listening, Reading болон Writing дасгалууд.</p>
          </div>

          {ieltsSubTab === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div onClick={() => setIeltsSubTab('listening')} style={{ background: '#111827', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 2px 0' }}>🎧 1. Listening Practice</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Аудио сонсож дасгал хийх.</p>
              </div>
              <div onClick={() => setIeltsSubTab('reading')} style={{ background: '#111827', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 2px 0' }}>📖 2. Reading Passage & Quiz</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Академик текст унших болон сорил.</p>
              </div>
              <div onClick={() => setIeltsSubTab('writing')} style={{ background: '#111827', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 2px 0' }}>✍️ 3. Writing Task 2</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Эссе бичих болон үнэлгээ авах.</p>
              </div>
            </div>
          )}

          {ieltsSubTab === 'listening' && (
            <div style={{ background: '#111827', padding: '16px', borderRadius: '14px', border: '1px solid #1f2937' }}>
              <button onClick={() => setIeltsSubTab('menu')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontWeight: 'bold', marginBottom: '10px' }}>← Буцах</button>
              <h3 style={{ fontSize: '16px', margin: '0 0 8px 0' }}>Listening Practice Audio</h3>
              <button onClick={() => speakText("Welcome to the IELTS listening module. Please listen carefully to the conversation and answer the following questions.")} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>🔊 Аудио сонсох</button>
            </div>
          )}

          {ieltsSubTab === 'reading' && (
            <div style={{ background: '#111827', padding: '16px', borderRadius: '14px', border: '1px solid #1f2937' }}>
              <button onClick={() => { setIeltsSubTab('menu'); setReadingAnswered(false); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontWeight: 'bold', marginBottom: '10px' }}>← Буцах</button>
              <h3 style={{ fontSize: '16px', margin: '0 0 4px 0' }}>{readingPassages[0].title}</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>{readingPassages[0].text}</p>
              <div style={{ marginTop: '12px', background: '#0b0f19', padding: '10px', borderRadius: '8px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{readingPassages[0].question}</p>
                {!readingAnswered ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {readingPassages[0].options.map((opt, idx) => (
                      <button key={idx} onClick={() => { setReadingScore(idx === readingPassages[0].correct ? 1 : 0); setReadingAnswered(true); }} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '12px' }}>{opt}</button>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: readingScore === 1 ? '#34d399' : '#f87171', margin: 0 }}>
                    {readingScore === 1 ? '🎉 Зөв хариуллаа!' : '❌ Буруу байна!'}
                  </p>
                )}
              </div>
            </div>
          )}

          {ieltsSubTab === 'writing' && (
            <div style={{ background: '#111827', padding: '16px', borderRadius: '14px', border: '1px solid #1f2937' }}>
              <button onClick={() => setIeltsSubTab('menu')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontWeight: 'bold', marginBottom: '10px' }}>← Буцах</button>
              <h3 style={{ fontSize: '16px', margin: '0 0 6px 0' }}>Writing Task 2</h3>
              <p style={{ fontSize: '13px', color: '#f8fafc', margin: '0 0 10px 0' }}>"Some people think that universities should provide graduates with workplace skills. Discuss both views."</p>
              <textarea value={userEssay} onChange={e => setUserEssay(e.target.value)} placeholder="Энд эссегээ бичнэ үү..." style={{ width: '100%', height: '90px', background: '#0b0f19', border: '1px solid #334155', color: '#fff', padding: '8px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '13px' }}></textarea>
              <button onClick={() => alert("Эссе амжилттай илгээгдлээ! AI үнэлгээ удахгүй гарна.")} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', fontSize: '13px' }}>Эссе илгээх</button>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0b0f19', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 1000, maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🏠 Нүүр</button>
        <button onClick={() => setActiveTab('speak')} style={{ background: 'none', border: 'none', color: activeTab === 'speak' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🎙️ Speak</button>
        <button onClick={() => setActiveTab('words')} style={{ background: 'none', border: 'none', color: activeTab === 'words' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>📖 Үгс</button>
        <button onClick={() => setActiveTab('test')} style={{ background: 'none', border: 'none', color: activeTab === 'test' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🎯 Тест</button>
        <button onClick={() => setActiveTab('ielts')} style={{ background: 'none', border: 'none', color: activeTab === 'ielts' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🎓 Skills</button>
      </nav>

    </main>
  );
}
