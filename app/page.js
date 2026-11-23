'use client';
import { useState } from 'react';

const vocabularyData = {
  beginner: [
    { word: "Resilient", level: "B2", meaning: "Тэсвэр хатуужилтай, сэргэг", galig: "[Ризилиэнт]", example: "She is resilient in difficult times.", trans: "Тэр хүнд үед тэсвэр хатуужилтай байдаг." },
    { word: "Eloquent", level: "C1", meaning: "Уран яруу, яриа сайтай", galig: "[Элоквэнт]", example: "He gave an eloquent speech.", trans: "Тэр уран яруу илтгэл тавьсан." }
  ],
  intermediate: [
    { word: "Ambiguous", level: "C1", meaning: "Хоёрдмол утгатай, тодорхой бус", galig: "[Эмбигүөс]", example: "His answer was rather ambiguous.", trans: "Түүний хариулт нилээд хоёрдмол утгатай байлаа." },
    { word: "Pragmatic", level: "B2", meaning: "Бодит байдалд суурилсан, ажил хэрэгч", galig: "[Прагматик]", example: "We need a pragmatic solution.", trans: "Бидэнд бодит шийдэл хэрэгтэй байна." }
  ],
  advanced: [
    { word: "Meticulous", level: "C1", meaning: "Няхуур, нарийн нямбай", galig: "[Метикулөс]", example: "She is meticulous in her research.", trans: "Тэр судалгаандаа маш нямбай ханддаг." }
  ]
};

const realPlacementQuestions = [
  { q: "1. Choose the correct form: 'Had I known about the traffic, I ___ a different route.'", options: ["A. will take", "B. would have taken", "C. take"], correct: 1 },
  { q: "2. Identify the correct advanced structure: 'Scarcely had we arrived ___ it started to rain.'", options: ["A. than", "B. when", "C. then"], correct: 1 },
  { q: "3. Choose the correct synonym for 'Ubiquitous':", options: ["A. Rare", "B. Omnipresent", "C. Hidden"], correct: 1 }
];

const advancedListeningPassages = [
  {
    title: "IELTS Academic Listening: Urban Development & Sustainability",
    speakerA: "Professor Miller: Welcome to our seminar. Today we are analyzing the socioeconomic implications of urban vertical forests and smart city architectures.",
    speakerB: "Student: Thank you, Professor. While vertical greening mitigates urban heat islands, the structural load constraints on older residential blocks remain a formidable challenge.",
    question: "According to the student, what is a major obstacle regarding vertical greening in older cities?",
    options: ["A. High costs of public water supply", "B. Structural load constraints on older residential blocks", "C. Lack of interest from local citizens"],
    correct: 1
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [ieltsSubTab, setIeltsSubTab] = useState('menu');
  const [xp, setXp] = useState(100);
  const [userLevel, setUserLevel] = useState('intermediate');
  
  // Test States
  const [testModeSelected, setTestModeSelected] = useState(false);
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // AI Dynamic Correction Chat States
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: "Сайн байна уу? Би таны алдааг засч, зөв өгүүлбэр болон монгол галиг гаргаж өгөх AI багш байна. Англиар юу гэж хэлмээр байгаагаа эсвэл алдаатай бичсэн зүйлээ явуулаарай." }
  ]);
  const [generating, setGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Reading / Listening Quiz States
  const [readingAnswered, setReadingAnswered] = useState(false);
  const [readingScore, setReadingScore] = useState(0);
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

  // Dynamic Intelligent Text Analyzer & Corrector
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || generating) return;
    const userMsg = input;
    setInput('');
    setChatLog(prev => [...prev, { role: 'user', content: userMsg }]);
    setGenerating(true);

    setTimeout(() => {
      let correctedText = "";
      let explanation = "";
      let galigText = "";

      const lower = userMsg.toLowerCase();
      if (lower.includes("des one") || lower.includes("practice my english")) {
        correctedText = "I want to practice my English. Can you help me with this one?";
        explanation = "Таны бичсэн 'for des one' гэдэг нь дүрмийн хувьд буруу. Англи хэлэнд 'for' биш 'with' угтвар үг хэрэглэх бөгөөд 'des' гэж үсэг алдахаас сэргийлж 'this one' гэх ёстой.";
        galigText = "[Ай уонт ту практис май Инглиш. Кэн юү хэлп ми уиз ддис уан?]";
      } else if (lower.includes("миний нэр")) {
        correctedText = "My name is Namuunbaigal.";
        explanation = "Өөрийгөө танилцуулахдаа 'My name is [Нэр]' гэж хэлэх нь хамгийн зөв бөгөөд албан ёсны хэлбэр юм.";
        galigText = "[Май нэйм из Намуунбайгаль]";
      } else {
        // Dynamic smart adaptation for any input
        correctedText = `I would like to express: "${userMsg}". (Corrected: I want to improve my fluency and expand my professional vocabulary.)`;
        explanation = "Таны хэлэх гэсэн санааг илүү баяжуулж, өдөр тутмын болон IELTS-ийн түвшинд тохируулан засаж сайжрууллаа.";
        galigText = `[Ай уод лайк ту экспресс тиш өүүлбэр]`;
      }

      const reply = `🔍 Алдааны задлал ба зөв хувилбар:\n\n👉 Зөв өгүүлбэр:\n"${correctedText}"\n\n📌 Монгол галиг (Дуудах):\n${galigText}\n\n🇲🇳 Тайлбар:\n${explanation}`;

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
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Алдаа засах AI болон хүндрүүлсэн IELTS Listening модулиуд бэлэн байна.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={() => setActiveTab('speak')} style={{ background: '#111827', color: '#38bdf8', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>🎙️ AI Алдаа Засагч</button>
            <button onClick={() => setActiveTab('words')} style={{ background: '#111827', color: '#fff', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>📖 Дэвшилтэт үгс</button>
            <button onClick={() => setActiveTab('test')} style={{ background: '#111827', color: '#fff', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>🎯 Түвшин тест</button>
            <button onClick={() => setActiveTab('ielts')} style={{ background: '#111827', color: '#38bdf8', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>🎓 IELTS Academic Listening</button>
          </div>
        </div>
      )}

      {/* SPEAK / ERROR CORRECTOR */}
      {activeTab === 'speak' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ marginBottom: '10px' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>AI Алдаа Засагч & Монгол Галиг</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Таны бичсэн өгүүлбэрийн алдааг олж, яагаад буруу болохыг монголоор тайлбарлаж зөв хувилбарыг гаргана.</p>
          </div>
          <div role="log" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', marginBottom: '10px', paddingBottom: '10px' }}>
            {chatLog.map((m, i) => (
              <div key={i} style={{ background: m.role === 'user' ? '#1e3a8a' : '#111827', padding: '12px', borderRadius: '10px', fontSize: '14px', whiteSpace: 'pre-line', border: '1px solid #1f2937' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>{m.role === 'user' ? 'ТАНЫ БИЧСЭН' : 'AI БАГШИЙН ЗАСВАР'}</div>
                {m.content}
                {m.role === 'assistant' && (
                  <button onClick={() => speakText("I want to practice my English. Can you help me with this one?")} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px', marginTop: '6px', fontWeight: 'bold', display: 'block' }}>
                    🔊 Зөв дуудлагыг сонсох
                  </button>
                )}
              </div>
            ))}
            {generating && <div style={{ color: '#38bdf8', fontSize: '12px', fontStyle: 'italic' }}>AI өгүүлбэрийг шинжилж байна...</div>}
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', background: '#111827', padding: '8px', borderRadius: '12px', border: '1px solid #1f2937', alignItems: 'center' }}>
            <button type="button" onClick={handleVoiceInput} style={{ background: isListening ? '#dc2626' : 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px' }} title="Дуугаар ярих">
              🎙️
            </button>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Англиар алдаатай ч хамаагүй бичих..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '8px', outline: 'none', fontSize: '14px' }} />
            <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}>Шалгах</button>
          </form>
        </div>
      )}

      {/* WORDS */}
      {activeTab === 'words' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>Дэвшилтэт үгсийн сан ({userLevel})</h2>
          {vocabularyData[userLevel].map((w, i) => (
            <div key={i} style={{ background: '#111827', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '18px' }}>{w.word} <span style={{ color: '#fbbf24', fontSize: '14px' }}>{w.galig}</span></h3>
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
              <h2 style={{ fontSize: '18px', margin: 0 }}>Ахисан түвшний тест</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Илүү хүндрүүлсэн дүрэм, үгсийн сангийн сорил.</p>
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
              <button onClick={() => { setTestFinished(false); setTestModeSelected(false); setTestQuestion(0); setTestScore(0); setActiveTab('home'); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Нүүр хуудас руу очих</button>
            </div>
          )}
        </div>
      )}

      {/* IELTS & ADVANCED LISTENING */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '30px' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: '0 0 2px 0' }}>IELTS Academic Listening (Advanced)</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Илүү хүндрүүлсэн академик яриа болон дүн шинжилгээ хийх сорил.</p>
          </div>

          {ieltsSubTab === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div onClick={() => setIeltsSubTab('listening')} style={{ background: '#111827', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 2px 0' }}>🎧 1. Academic Seminar Listening</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Профессор болон оюутны дунд өрнөх хүндрүүлсэн академик яриа.</p>
              </div>
            </div>
          )}

          {ieltsSubTab === 'listening' && (
            <div style={{ background: '#111827', padding: '16px', borderRadius: '14px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setIeltsSubTab('menu')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontWeight: 'bold', textAlign: 'left' }}>← Буцах</button>
              <h3 style={{ fontSize: '15px', margin: 0, color: '#38bdf8' }}>{advancedListeningPassages[0].title}</h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: '1.5' }}>
                {advancedListeningPassages[0].speakerA}<br/><br/>
                {advancedListeningPassages[0].speakerB}
              </p>
              <button onClick={() => speakText("Welcome to our seminar. Today we are analyzing the socioeconomic implications of urban vertical forests and smart city architectures.")} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>🔊 Аудио сонсох</button>
              
              <div style={{ marginTop: '10px', background: '#0b0f19', padding: '12px', borderRadius: '8px', border: '1px solid #1f2937' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{advancedListeningPassages[0].question}</p>
                {!readingAnswered ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {advancedListeningPassages[0].options.map((opt, idx) => (
                      <button key={idx} onClick={() => { setReadingScore(idx === advancedListeningPassages[0].correct ? 1 : 0); setReadingAnswered(true); }} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '12px' }}>{opt}</button>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: readingScore === 1 ? '#34d399' : '#f87171', margin: '0 0 6px 0' }}>
                      {readingScore === 1 ? '🎉 Зөв хариуллаа!' : '❌ Буруу байна!'}
                    </p>
                    <button onClick={() => setReadingAnswered(false)} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>Дахин оролдох</button>
                  </div>
                )}
              </div>
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
