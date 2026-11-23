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

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [xp, setXp] = useState(80);
  const [userLevel, setUserLevel] = useState('beginner');
  const [testModeSelected, setTestModeSelected] = useState(false);
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: "Сайн байна уу? Би таны AI багш байна. Англиар юу сурмаар байгаагаа бичээрэй." }
  ]);
  const [generating, setGenerating] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || generating) return;
    const userMsg = input;
    setInput('');
    setChatLog(prev => [...prev, { role: 'user', content: userMsg }]);
    setGenerating(true);

    setTimeout(() => {
      let reply = `Англиар хэлэхэд: "Hello, let me introduce myself."\nДуудлага: [həˈloʊ]\nМонгол тайлбар: Мэндчилгээ дэвшүүлэх зөв хэллэг.`;
      setChatLog(prev => [...prev, { role: 'assistant', content: reply }]);
      setXp(p => p + 5);
      setGenerating(false);
    }, 500);
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
            <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Түвшин: {userLevel.toUpperCase()}</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Өнөөдрийн хичээлүүд бэлэн байна.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={() => setActiveTab('words')} style={{ background: '#111827', color: '#fff', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>📖 Шинэ үгс</button>
            <button onClick={() => setActiveTab('test')} style={{ background: '#111827', color: '#fff', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🎯 Түвшин тест</button>
          </div>
        </div>
      )}

      {/* SPEAK */}
      {activeTab === 'speak' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>AI Speaking Studio</h2>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', marginBottom: '10px' }}>
            {chatLog.map((m, i) => (
              <div key={i} style={{ background: m.role === 'user' ? '#1e3a8a' : '#111827', padding: '12px', borderRadius: '10px', fontSize: '14px', whiteSpace: 'pre-line', border: '1px solid #1f2937' }}>
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Юу сурмаар байна..." style={{ flex: 1, background: '#111827', border: '1px solid #334155', color: '#fff', padding: '12px', borderRadius: '8px', outline: 'none' }} />
            <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 'bold' }}>Илгээх</button>
          </form>
        </div>
      )}

      {/* WORDS */}
      {activeTab === 'words' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '18px' }}>Шинэ үгс ({userLevel})</h2>
          {vocabularyData[userLevel].map((w, i) => (
            <div key={i} style={{ background: '#111827', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937' }}>
              <h3 style={{ color: '#38bdf8', margin: '0 0 4px 0' }}>{w.word} ({w.level})</h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Утга: {w.meaning}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Жишээ: {w.example} - {w.trans}</p>
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
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Анхан шатнаас эхлэх эсвэл сорил өгнө үү.</p>
              <button onClick={() => { setUserLevel('beginner'); setActiveTab('words'); }} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Огт мэддэггүй (Beginner)</button>
              <button onClick={() => setTestModeSelected(true)} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Тест эхлэх</button>
            </>
          ) : !testFinished ? (
            <>
              <p style={{ fontSize: '12px', color: '#38bdf8', margin: 0 }}>Асуулт {testQuestion + 1} / {realPlacementQuestions.length}</p>
              <h3 style={{ fontSize: '15px', margin: 0 }}>{realPlacementQuestions[testQuestion].q}</h3>
              {realPlacementQuestions[testQuestion].options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswerTest(idx)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '10px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer' }}>{opt}</button>
              ))}
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#38bdf8' }}>Тест дууслаа!</h3>
              <p>Таны түвшин: {userLevel.toUpperCase()}</p>
              <button onClick={() => { setTestFinished(false); setTestModeSelected(false); setTestQuestion(0); setTestScore(0); setActiveTab('home'); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Нүүр хуудас руу очих</button>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0b0f19', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 1000, maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold' }}>🏠 Нүүр</button>
        <button onClick={() => setActiveTab('speak')} style={{ background: 'none', border: 'none', color: activeTab === 'speak' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold' }}>🎙️ Speak</button>
        <button onClick={() => setActiveTab('words')} style={{ background: 'none', border: 'none', color: activeTab === 'words' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold' }}>📖 Үгс</button>
        <button onClick={() => setActiveTab('test')} style={{ background: 'none', border: 'none', color: activeTab === 'test' ? '#38bdf8' : '#64748b', cursor: 'pointer', fontWeight: 'bold' }}>🎯 Тест</button>
      </nav>

    </main>
  );
}
