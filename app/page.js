'use client';
import { useState } from 'react';

// Level-based Vocabulary Modules
const vocabularyData = {
  beginner: [
    { word: "Hello", level: "A1", meaning: "Сайн байна уу?", example: "Hello, nice to meet you.", trans: "Сайн байна уу, тантай уулзахад таатай байна." },
    { word: "Water", level: "A1", meaning: "Ус", example: "I like to drink cold water.", trans: "Би хүйтэн ус уух дуртай." },
    { word: "Family", level: "A1", meaning: "Гэр бүл", example: "My family lives in Ulaanbaatar.", trans: "Миний гэр бүл Улаанбаатарт амьдардаг." },
    { word: "Friend", level: "A1", meaning: "Найз", example: "She is my best friend.", trans: "Тэр бол миний хамгийн сайн найз." },
    { word: "School", level: "A1", meaning: "Сургууль", example: "Students go to school every day.", trans: "Сурагчид өдөр бүр сургууль руугаа явдаг." }
  ],
  intermediate: [
    { word: "Improve", level: "B1", meaning: "Сайжруулах", example: "I want to improve my English speaking.", trans: "Би англиар ярих чадвараа сайжруулахыг хүсч байна." },
    { word: "Experience", level: "B2", meaning: "Туршлага", example: "Work experience is important for jobs.", trans: "Ажлын туршлага ажилд ороход чухал юм." },
    { word: "Solution", level: "B1", meaning: "Шийдэл", example: "We need to find a solution to this problem.", trans: "Бид энэ асуудлын шийдлийг олох хэрэгтэй." }
  ],
  advanced: [
    { word: "Ubiquitous", level: "C1", meaning: "Хаа сайгүй тааралддаг, тархсан.", example: "Smartphones are ubiquitous in modern society.", trans: "Ухаалаг гар утаснууд орчин үеийн нийгэмд хаа сайгүй тархсан байна." },
    { word: "Mitigate", level: "B2", meaning: "Бууруулах, багасгах, хөнгөвчлөх.", example: "We need to mitigate the risks of climate change.", trans: "Бид уур амьсгалын өөрчлөлтийн эрсдэлийг бууруулах хэрэгтэй." },
    { word: "Comprehensive", level: "C1", meaning: "Цогц, бүхнийг хамарсан дэлгэрэнгүй.", example: "This course offers a comprehensive guide to IELTS.", trans: "Энэхүү курс нь IELTS-ийн цогц гарын авлагыг санал болгож байна." }
  ]
};

const writingPrompts = [
  "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake. Discuss both views and give your opinion.",
  "In many countries, government spending on environmental protection is becoming increasingly important. To what extent do you think governments should fund green energy projects compared to other public sectors?"
];

const readingPassages = [
  {
    title: "The Evolution of Digital Education Systems",
    text: "The rapid evolution of artificial intelligence in modern higher education has fundamentally transformed how students access research materials and interact with digital learning platforms. Adaptive algorithms now allow custom learning paths tailored to individual student weaknesses.",
    question: "What is the primary role of adaptive algorithms in modern education?",
    options: ["A. Replacing university teachers completely", "B. Providing custom learning paths tailored to student weaknesses", "C. Increasing textbook printing costs"],
    correct: 1
  }
];

const realPlacementQuestions = [
  { q: "Choose the correct form: 'She ___ to the office every morning.'", options: ["A. go", "B. goes", "C. going"], correct: 1 },
  { q: "Choose the correct past tense: 'They ___ a great movie yesterday.'", options: ["A. watch", "B. watched", "C. watching"], correct: 1 },
  { q: "Identify the correct preposition: 'He is interested ___ learning English.'", options: ["A. on", "B. in", "C. at"], correct: 1 },
  { q: "Choose the correct modal verb: 'You ___ submit your assignment before Friday.'", options: ["A. must", "B. might", "C. can to"], correct: 0 },
  { q: "Which word is a synonym for 'Mitigate'?", options: ["A. Increase", "B. Reduce/Lessening", "C. Complicate"], correct: 1 }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [ieltsSubTab, setIeltsSubTab] = useState('menu');

  const [xp, setXp] = useState(75);
  const [streak, setStreak] = useState(1);

  // User Level State
  const [userLevel, setUserLevel] = useState('beginner');
  const [testModeSelected, setTestModeSelected] = useState(false);
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  // Writing & Reading States
  const [writingIndex, setWritingIndex] = useState(0);
  const [userEssay, setUserEssay] = useState('');
  const [readingIndex, setReadingIndex] = useState(0);
  const [readingAnswered, setReadingAnswered] = useState(false);
  const [readingScore, setReadingScore] = useState(0);

  // AI Chat States
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', content: "Hello! I am your AI English Teacher. Type or say anything you want to learn in English, and I will instantly give you the correct professional phrases, pronunciation, and Mongolian explanation!" }
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
      let customMongolian = `Уг санааг англиар илэрхийлэхэд хамгийн оновчтой бөгөөд албан ёсны хэллэг юм.`;

      const lower = userMessage.toLowerCase();
      if (lower.includes("сайн байна уу") || lower.includes("hello") || lower.includes("hi")) {
        customPhrase = `To greet someone politely in English:`;
        customEnglish = `"Hello! It is a pleasure to meet you today."`;
        customPronunciation = `[həˈloʊ, ɪt ɪz ə ˈplɛʒər tu mit ju]`;
        customMongolian = `Мэндчилгээ дэвшүүлэхэд хэрэглэх тохиромжтой хэллэг.`;
      } else if (lower.includes("танилцуул") || lower.includes("нэр")) {
        customPhrase = `To introduce yourself professionally:`;
        customEnglish = `"Hello, let me introduce myself. My name is [Your Name], and I am currently studying..."`;
        customPronunciation = `[həˈloʊ, lɛt mi ˌɪntrəˈdʌs maɪˈsɛlf]`;
        customMongolian = `Өөрийгөө мэргэжлийн түвшинд танилцуулах загвар.`;
      }

      const teacherResponse = `💡 **Smart AI English Guide:**\n\n${customPhrase}\n\n👉 **${customEnglish}**\n\n📌 **Pronunciation:** ${customPronunciation}\n\n🇲🇳 **Монгол тайлбар:** ${customMongolian}`;

      setChatLog(prev => [...prev, { role: 'assistant', content: teacherResponse }]);
      setXp(prev => prev + 5);
      setGenerating(false);
    }, 600);
  };

  const handleAnswerTest = (optionIndex) => {
    let newScore = testScore;
    if (optionIndex === realPlacementQuestions[testQuestion].correct) {
      newScore = testScore + 1;
      setTestScore(newScore);
    }
    if (testQuestion + 1 < realPlacementQuestions.length) {
      setTestQuestion(prev => prev + 1);
    } else {
      setTestFinished(true);
      if (newScore <= 1) setUserLevel('beginner');
      else if (newScore <= 3) setUserLevel('intermediate');
      else setUserLevel('advanced');
      setXp(prev => prev + 30);
    }
  };

  const handleReadingAnswer = (optionIdx) => {
    if (optionIdx === readingPassages[readingIndex].correct) {
      setReadingScore(1);
    } else {
      setReadingScore(0);
    }
    setReadingAnswered(true);
  };

  const handleResetApp = () => {
    setActiveTab('home');
    setTestModeSelected(false);
    setTestFinished(false);
    setTestQuestion(0);
    setTestScore(0);
  };

  const activeVocabularyList = vocabularyData[userLevel] || vocabularyData.beginner;

  return (
    <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', display: 'flex', flexDirection: 'column', padding: '16px 16px 90px 16px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>F</div>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>Fluency<span style={{ color: '#38bdf8' }}>Go</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700' }}>
          <span style={{ color: '#fbbf24' }}>🔥 {streak}d</span>
          <span style={{ color: '#38bdf8' }}>⚡ {xp} XP</span>
          <button onClick={handleResetApp} style={{ background: '#1e293b', border: '1px solid #334155', color: '#f87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px' }}>
            Эхлэл ⮡
          </button>
        </div>
      </header>

      {/* TAB 1: HOME DASHBOARD */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #161f33, #0f172a)', padding: '22px', borderRadius: '20px', border: '2px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>ADAPTIVE LEARNING HUB ({userLevel.toUpperCase()})</span>
              <h2 style={{ fontSize: '20px', margin: '6px 0', fontWeight: '800' }}>Сайн байна уу?</h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Таны түвшинд тохирсон хичээлүүд бэлэн.</p>
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
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Level</span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#a855f7', marginTop: '4px', textTransform: 'uppercase' }}>{userLevel}</div>
            </div>
            <div style={{ background: '#111827', padding: '14px', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Test</span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>Placement</div>
            </div>
          </div>

          <div style={{ background: '#111827', padding: '18px', borderRadius: '20px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '15px' }}>Today's Modules</span>
              <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '700' }}>Active</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Smart AI English Teacher</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Ярьсан зүйлд тохирсон зөв хэллэг ба дуудлага</p>
              </div>
              <button onClick={() => setActiveTab('speak')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Custom Vocabulary ({userLevel})</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Таны түвшинд тохирсон шинэ үгс ба тайлбар</p>
              </div>
              <button onClick={() => setActiveTab('words')} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Start</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f2937', paddingTop: '10px' }}>
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 2px 0', fontWeight: '700' }}>Placement Test</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Түвшин тогтоох сорил өгч түвшингээ өөрчлөх</p>
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
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>AI Speaking Studio</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Таны ярьсан зүйлийг яг таг ойлгож оновчтой зөвлөгөө өгнө.</p>
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
              placeholder="Жишээ: Сайн байна уу, англиар мэндэлж сурмаар байна..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', padding: '6px' }}
            />
            <button type="submit" disabled={generating} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Илгээх
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: LEVEL-BASED VOCABULARY */}
      {activeTab === 'words' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>VOCABULARY LAB ({userLevel.toUpperCase()} LEVEL)</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>Таны түвшний шинэ үгс</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Түвшин тогтоох тест өгч түвшингээ өөрчилснөөр эндхийн үгс автоматаар өөрчлөгдөнө.</p>
          </div>
          {activeVocabularyList.map((item, idx) => (
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

      {/* TAB 4: PLACEMENT TEST */}
      {activeTab === 'test' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>PLACEMENT TEST</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>Түвшин тогтоох сорил</h2>
          </div>

          {!testModeSelected ? (
            <div style={{ background: '#111827', padding: '24px', borderRadius: '18px', border: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Та англи хэл ямар түвшинтэй вэ?</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>Хэрэв та англи хэл огт мэддэггүй бол шууд анхан шатнаас эхлэх эсвэл тест өгч түвшингээ тогтооно уу.</p>
              
              <button onClick={() => { setUserLevel('beginner'); setActiveTab('words'); }} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                🟢 Англи хэл огт мэддэггүй (Beginner шууд эхлэх)
              </button>

              <button onClick={() => setTestModeSelected(true)} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>
                🎯 Тест өгч түвшингээ тогтоох
              </button>
            </div>
          ) : !testFinished ? (
            <div style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '1px solid #1f2937' }}>
              <p style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '8px', fontWeight: '700' }}>QUESTION {testQuestion + 1} / {realPlacementQuestions.length}</p>
              <h3 style={{ fontSize: '16px', marginBottom: '14px', fontWeight: '700' }}>{realPlacementQuestions[testQuestion].q}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {realPlacementQuestions[testQuestion].options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswerTest(idx)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '12px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: '#111827', padding: '22px', borderRadius: '18px', border: '2px solid #38bdf8', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '22px', color: '#38bdf8', fontWeight: '800' }}>Тест амжилттай дууслаа!</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>Зөв хариулсан оноо: {testScore} / {realPlacementQuestions.length}</p>
              <p style={{ fontSize: '16px', color: '#34d399', fontWeight: '800' }}>Таны тогтоогдсон түвшин: {userLevel.toUpperCase()}</p>
              <button onClick={() => { setTestFinished(false); setTestModeSelected(false); setTestQuestion(0); setTestScore(0); setActiveTab('home'); }} style={{ background: '#38bdf8', color: '#0b0f19', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>
                Нүүр хуудас руу буцах
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: IELTS & SKILLS CENTER */}
      {activeTab === 'ielts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>SKILLS & IELTS CENTER</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0' }}>Modules</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Listening, Reading болон Writing дасгалууд.</p>
          </div>

          {ieltsSubTab === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div onClick={() => setIeltsSubTab('listening')} style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>🎧 1. Listening Practice</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Бодит харилцан яриа ба шалгалт.</p>
              </div>

              <div onClick={() => setIeltsSubTab('reading')} style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>📖 2. Reading Passage & Quiz</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Текст унших болон асуулт хариулт.</p>
              </div>

              <div onClick={() => setIeltsSubTab('writing')} style={{ background: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '15px', color: '#38bdf8', margin: '0 0 4px 0', fontWeight: '800' }}>✍️ 3. Writing Task 2</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Эссе бичих болон үнэлгээ авах.</p>
              </div>
            </div>
          )}

          {/* LISTENING */}
          {ieltsSubTab === 'listening' && (
            <div style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button onClick={() => setIeltsSubTab('menu')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', textAlign: 'left', fontWeight: '800', padding: 0 }}>← Back</button>
              <h3 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>Listening Section</h3>
              <button onClick={() => speakText("Good morning! Welcome to our English learning center. How can I help you today? Good morning, I would like to improve my speaking skills and learn new words.")} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                🔊 Сонсох (Play Audio)
              </button>
            </div>
          )}

          {/* READING */}
          {ieltsSubTab === 'reading' && (
            <div style={{ background: '#111827', padding: '18px', borderRadius: '18px', border: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => { setIeltsSubTab('menu'); setReadingAnswered(false); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', textAlign: 'left', fontWeight: '800', padding: 0 }}>← Back</button>
              <h3 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, fontWeight: '800' }}>{readingPassages[readingIndex].title}</h3>
              <p style={{ fontSize: '13px', color: '#94a3
