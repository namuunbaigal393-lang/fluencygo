'use client';
import { useState } from 'react';

const dailyVocabularyPacks = [
  {
    day: "Day 1 (Academic & IELTS Core)",
    words: [
      { word: "Resilient", level: "B2", meaning: "Тэсвэр хатуужилтай, сэргэг", galig: "[Ризилиэнт]", example: "She is resilient in difficult times.", trans: "Тэр хүнд үед тэсвэр хатуужилтай байдаг." },
      { word: "Eloquent", level: "C1", meaning: "Уран яруу, яриа сайтай", galig: "[Элоквэнт]", example: "He gave an eloquent speech at the conference.", trans: "Тэр хурал дээр уран яруу илтгэл тавьсан." },
      { word: "Ambiguous", level: "C1", meaning: "Хоёрдмол утгатай, тодорхой бус", galig: "[Эмбигүөс]", example: "His answer was rather ambiguous.", trans: "Түүний хариулт нилээд хоёрдмол утгатай байлаа." },
      { word: "Pragmatic", level: "B2", meaning: "Бодит байдалд суурилсан, ажил хэрэгч", galig: "[Прагматик]", example: "We need a pragmatic solution to this issue.", trans: "Бидэнд энэ асуудалд бодит шийдэл хэрэгтэй байна." },
      { word: "Meticulous", level: "C1", meaning: "Няхуур, нарийн нямбай", galig: "[Метикулөс]", example: "She is meticulous in her research.", trans: "Тэр судалгаандаа маш нямбай ханддаг." },
      { word: "Ubiquitous", level: "C2", meaning: "Хаа сайгүй тааралддаг, түгээмэл", galig: "[Юбикуөтөс]", example: "Smartphones have become ubiquitous today.", trans: "Ухаалаг утас өнөөдөр хаа сайгүй түгээмэл болжээ." },
      { word: "Ephemeral", level: "C2", meaning: "Түр зуурын, богино настай", galig: "[Ифемэрэл]", example: "Fame on social media is often ephemeral.", trans: "Сошиал медиа дахь алдар нэр ихэвчлэн түр зуурынх байдаг." },
      { word: "Exacerbate", level: "C2", meaning: "Улам дордуулах, хурцатгах", galig: "[Игзэсэрбэйт]", example: "Ignoring the problem will only exacerbate it.", trans: "Асуудлыг үл тоомсорлох нь түүнийг улам л дордуулна." },
      { word: "Corroborate", level: "C2", meaning: "Батлах, нотлох", galig: "[Короборэйт]", example: "New evidence helped corroborate her theory.", trans: "Шинэ нотлох баримт түүний онолыг батлахад тусалсан." },
      { word: "Alleviate", level: "C1", meaning: "Хөнгөвчлөх, намдаах", galig: "[Аливиэйт]", example: "New policies aim to alleviate urban traffic.", trans: "Шинэ бодлого нь хотын түгжрэлийг бууруулах зорилготой." }
    ]
  },
  {
    day: "Day 2 (Environment & Society)",
    words: [
      { word: "Mitigate", level: "C1", meaning: "Зөөлрүүлэх, бурууг багасгах", galig: "[Митигэйт]", example: "Trees help mitigate the effects of climate change.", trans: "Моднууд уур амьсгалын өөрчлөлтийн сөрөг нөлөөг зөөлрүүлэхэд тусалдаг." },
      { word: "Socioeconomic", level: "C1", meaning: "Нийгэм-эдийн засгийн", galig: "[Сошиоэкономник]", example: "We analyzed the socioeconomic impact.", trans: "Бид нийгэм-эдийн засгийн нөлөөлөлд дүн шинжилгээ хийсэн." },
      { word: "Infrastructure", level: "B2", meaning: "Дэд бүтэц", galig: "[Инфраструктур]", example: "The city invested heavily in transport infrastructure.", trans: "Хот тээврийн дээд бүтцэд их хэмжээний хөрөнгө оруулалт хийсэн." },
      { word: "Sustainable", level: "B2", meaning: "Тогтвортой", galig: "[Састэйнэбл]", example: "We need sustainable energy sources.", trans: "Бидэнд тогтвортой эрчим хүчний эх үүсвэр хэрэгтэй." },
      { word: "Innovation", level: "B2", meaning: "Шинэчлэл, инноваци", galig: "[Инновэйшн]", example: "Technological innovation drives progress.", trans: "Технологийн инноваци хөгжлийг хурдасгадаг." },
      { word: "Deteriorate", level: "C1", meaning: "Муудах, дордох", galig: "[Дитириорэйт]", example: "Patient conditions began to deteriorate.", trans: "Өвчтөний биеийн байдал муудаж эхэлсэн." },
      { word: "Comprehensive", level: "B2", meaning: "Цогц, дэлгэрэнгүй", galig: "[Комприхэнсив]", example: "A comprehensive study was published.", trans: "Цогц судалгаа хэвлэгдсэн байна." },
      { word: "Advocate", level: "C1", meaning: "Дэмжих, өмгөөлөх", galig: "[Эдвокэйт]", example: "She advocates for environmental protection.", trans: "Тэрээр байгаль орчныг хамгаалахыг дэмждэг." },
      { word: "Arbitrary", level: "C2", meaning: "Дур зоргоороо, санамсаргүй", galig: "[Арбитрари]", example: "The decision seemed completely arbitrary.", trans: "Шийдвэр нь бүхэлдээ дур зоргоороо санагдсан." },
      { word: "Pivotal", level: "C1", meaning: "Шийдвэрлэх, гол чухал", galig: "[Пивотал]", example: "Education plays a pivotal role in society.", trans: "Боловсрол нийгэмд шийдвэрлэх үүрэг гүйцэтгэдэг." }
    ]
  }
];

const vocabularyQuizData = [
  { q: "1. What is the meaning of 'Resilient'?", options: ["A. Хүнд үед тэсвэр хатуужилтай", "B. Маш хурдан гүйх", "C. Залхуу хойрго"], correct: 0 },
  { q: "2. What is the meaning of 'Meticulous'?", options: ["A. Няхуур, нарийн нямбай", "B. Хэрүүлч маргаанч", "C. Түр зуурын"], correct: 0 },
  { q: "3. What is the meaning of 'Mitigate'?", options: ["A. Муутгах, хурцатгах", "B. Зөөлрүүлэх, багасгах", "C. Орхиж явах"], correct: 1 },
  { q: "4. What is the meaning of 'Ubiquitous'?", options: ["A. Ховор олдох", "B. Хаа сайгүй тааралддаг", "C. Нууцлаг"], correct: 1 },
  { q: "5. What is the meaning of 'Pragmatic'?", options: ["A. Бодит байдалд суурилсан", "B. Мөрөөдөмтгий", "C. Хийсвэр"], correct: 0 }
];

const placementQuestions = [
  { q: "1. She ___ to the university library every morning.", options: ["A. go", "B. goes", "C. going"], correct: 1 },
  { q: "2. They ___ a fascinating documentary yesterday evening.", options: ["A. watch", "B. watched", "C. watching"], correct: 1 },
  { q: "3. He is deeply interested ___ epidemiology and public health.", options: ["A. on", "B. in", "C. at"], correct: 1 },
  { q: "4. You ___ submit your research paper before the deadline.", options: ["A. must", "B. might to", "C. can to"], correct: 0 },
  { q: "5. If I had more time, I ___ another foreign language.", options: ["A. will learn", "B. would learn", "C. learned"], correct: 1 }
];

const fullListeningModules = [
  {
    id: 1,
    title: "C1 Academic Lecture & Dialogue: Neuroplasticity and Cognitive Aging",
    band: "C1 / Band 8.0+",
    duration: "~3 mins",
    fullAudioText: "Dr. Vance: Good morning, everyone. Today we are examining the paradigm shift in neuroscience regarding adult neuroplasticity. For decades, the prevailing consensus was that the human brain becomes structurally immutable after adolescence. However, longitudinal neuroimaging studies now demonstrate that synaptic pruning and neurogenesis persist well into late adulthood, provided the brain is subjected to novel, complex cognitive demands. Student Sarah: Professor Vance, does that imply that routine mental exercises, such as crossword puzzles, are sufficient to stave off cognitive decline? Dr. Vance: That is a critical distinction, Sarah. Routine tasks primarily reinforce existing neural pathways rather than forging new ones. True neuroplastic adaptation requires activities that combine motor coordination, spatial navigation, and declarative memory simultaneously—such as learning a tonal language or mastering a musical instrument. Student Liam: And what role does physiological homeostasis play in this process? I read a recent meta-analysis suggesting chronic cortisol elevation impairs hippocampal volume. Dr. Vance: Precisely, Liam. Chronic stress triggers prolonged glucocorticoid secretion, which inhibits brain-derived neurotrophic factor, or BDNF. Without adequate BDNF, synaptic consolidation falters. Furthermore, slow-wave sleep is indispensable because during deep sleep, the glymphatic system clears metabolic waste like beta-amyloid plaques while transferring short-term hippocampal memories into long-term neocortical storage. Therefore, cognitive longevity is fundamentally a synergy between novel intellectual challenge, stress regulation, and restorative sleep architecture.",
    questions: [
      {
        q: "1. What was the traditional scientific consensus regarding the adult brain?",
        options: ["A. It continuously generates new neurons at a rapid pace", "B. It becomes structurally immutable after adolescence", "C. It relies entirely on the glymphatic system for memory"],
        correct: 1
      },
      {
        q: "2. Why does Dr. Vance argue that crossword puzzles are insufficient for neuroplasticity?",
        options: ["A. They cause excessive cortisol elevation", "B. They merely reinforce existing neural pathways rather than creating new ones", "C. They require too much spatial navigation"],
        correct: 1
      },
      {
        q: "3. According to the conversation, which activities best stimulate true neuroplastic adaptation?",
        options: ["A. Repetitive arithmetic and reading familiar novels", "B. Tasks combining motor coordination, spatial navigation, and memory", "C. High-intensity physical sprinting without mental engagement"],
        correct: 1
      },
      {
        q: "4. How does chronic stress negatively impact the brain according to Liam and Dr. Vance?",
        options: ["A. It accelerates beta-amyloid clearance", "B. Elevated cortisol inhibits BDNF and impairs hippocampal volume", "C. It overstimulates neocortical storage"],
        correct: 1
      },
      {
        q: "5. What crucial function occurs during slow-wave sleep?",
        options: ["A. The glymphatic system clears metabolic waste and consolidates memories", "B. Glucocorticoid secretion reaches its peak", "C. Synaptic pruning stops completely"],
        correct: 0
      }
    ]
  },
  {
    id: 2,
    title: "C1 Symposium: Urban Microclimates & Vertical Forestry",
    band: "C1 / Band 7.5 - 8.5",
    duration: "~3 mins",
    fullAudioText: "Moderator: Welcome to the Urban Sustainability Symposium. Our panel today explores whether vertical forestry—integrating dense vegetation into high-rise facades—is a viable solution for metropolitan heat islands or merely an architectural vanity project. Dr. Chen: From a thermodynamic standpoint, evapotranspiration from facade vegetation measurably reduces ambient surface temperatures by up to four degrees Celsius during peak summer heatwaves. Moreover, particulate matter deposition on leaf surfaces filters airborne pollutants. Architect Marcus: While the microclimatic benefits are undeniable, Dr. Chen, we must scrutinize the lifecycle carbon footprint. Supporting mature trees at heights exceeding one hundred meters requires heavily reinforced steel cantilevers and high-strength concrete, which substantially increases embodied carbon during construction. Dr. Chen: A fair critique, Marcus. Yet when amortized over a fifty-year building lifespan, the reduction in HVAC cooling loads offsets the initial structural carbon penalty within roughly fourteen years, provided greywater recycling systems are utilized for automated drip irrigation. Architect Marcus: That assumes rigorous botanical maintenance. If root systems breach waterproofing membranes or wind-shearing occurs during severe storms, remediation costs escalate exponentially. Consequently, vertical forestry should be deployed selectively in high-density commercial corridors rather than mandated universally across residential developments.",
    questions: [
      {
        q: "1. By how much can facade vegetation lower ambient surface temperatures during summer peaks?",
        options: ["A. Up to four degrees Celsius", "B. Exactly fourteen degrees Celsius", "C. Less than one degree Celsius"],
        correct: 0
      },
      {
        q: "2. What is Architect Marcus's primary concern regarding the construction phase of vertical forests?",
        options: ["A. Lack of municipal zoning permits", "B. Increased embodied carbon from reinforced steel and concrete", "C. Excessive noise from automated drip irrigation"],
        correct: 1
      },
      {
        q: "3. How long does it take for reduced HVAC cooling loads to offset the initial carbon penalty?",
        options: ["A. Fifty years", "B. Roughly fourteen years", "C. Four years"],
        correct: 1
      },
      {
        q: "4. What condition is necessary to achieve that carbon offset timeline?",
        options: ["A. Using greywater recycling systems for irrigation", "B. Planting only deciduous shrubs", "C. Eliminating all concrete foundations"],
        correct: 0
      },
      {
        q: "5. What final recommendation does Architect Marcus make?",
        options: ["A. Ban vertical forestry in commercial zones", "B. Mandate it for all residential buildings", "C. Deploy it selectively in high-density commercial corridors"],
        correct: 2
      }
    ]
  }
];

const readingPassages = [
  {
    title: "The Paradox of Algorithmic Curation and Epistemic Bubbles",
    level: "C1 Academic Reading",
    text: "In the contemporary digital ecosystem, recommendation algorithms are engineered to maximize user engagement by predicting preferences with uncanny precision. While proponents argue that algorithmic curation democratizes access to niche information and saves cognitive effort, sociologists warn of an insidious consequence: the proliferation of epistemic bubbles and echo chambers. Unlike a mere filter bubble—which passively omits dissenting viewpoints through personalized ranking—an epistemic bubble actively discredits external sources, rendering users impervious to contradictory evidence. When individuals are perpetually insulated from intellectual friction, their capacity for critical deliberation atrophies. Furthermore, outrage-inducing content tends to elicit higher engagement metrics, inadvertently incentivizing platforms to amplify polarizing rhetoric over nuanced discourse. Addressing this predicament requires not merely algorithmic transparency, but a deliberate redesign of digital architectures to reintroduce serendipitous exposure to diverse, credible perspectives.",
    questions: [
      {
        q: "1. How does an 'epistemic bubble' differ from a simple 'filter bubble' according to the text?",
        options: [
          "A. A filter bubble uses artificial intelligence while an epistemic bubble does not",
          "B. An epistemic bubble actively discredits outside sources rather than merely omitting them",
          "C. A filter bubble encourages critical deliberation"
        ],
        correct: 1
      },
      {
        q: "2. What happens to individuals when they are constantly shielded from intellectual friction?",
        options: [
          "A. Their capacity for critical deliberation weakens",
          "B. They seek out more diverse news outlets",
          "C. Their cognitive load decreases permanently"
        ],
        correct: 0
      },
      {
        q: "3. Why do digital platforms inadvertently amplify polarizing rhetoric?",
        options: [
          "A. Because nuanced discourse is illegal in some jurisdictions",
          "B. Because outrage-inducing content generates higher user engagement",
          "C. Because users explicitly block all neutral articles"
        ],
        correct: 1
      },
      {
        q: "4. The word 'insidious' in the passage is closest in meaning to:",
        options: [
          "A. Immediately obvious and harmless",
          "B. Subtle yet causing gradual harm",
          "C. Financially profitable"
        ],
        correct: 1
      },
      {
        q: "5. What solution does the author propose to resolve this issue?",
        options: [
          "A. Banning all recommendation algorithms entirely",
          "B. Redesigning digital platforms to reintroduce accidental exposure to diverse credible views",
          "C. Requiring users to pass a sociology exam"
        ],
        correct: 1
      }
    ]
  },
  {
    title: "Biomimicry and Circular Material Engineering",
    level: "C1 Academic Reading",
    text: "Traditional industrial manufacturing has long operated on a linear 'take-make-dispose' paradigm, extracting finite resources and generating intractable waste streams. In contrast, biomimicry—an interdisciplinary approach that emulates nature's time-tested patterns and strategies—advocates for circular material engineering. In natural ecosystems, the metabolic byproduct of one organism invariably serves as the feedstock for another, eliminating the very concept of waste. Material scientists are now synthesizing mycelium-based composites and self-healing concrete embedded with alkaliphilic bacteria that precipitate calcium carbonate when exposed to moisture. Despite promising laboratory prototypes, scaling biomimetic materials faces formidable economic inertia: entrenched petrochemical supply chains benefit from decades of subsidies and economies of scale, making nascent sustainable alternatives appear cost-prohibitive in the short term.",
    questions: [
      {
        q: "1. How does biomimicry fundamentally differ from traditional manufacturing?",
        options: [
          "A. It relies exclusively on petrochemical extraction",
          "B. It emulates natural systems where byproducts become inputs for other processes",
          "C. It focuses on single-use disposable plastics"
        ],
        correct: 1
      },
      {
        q: "2. How does the self-healing concrete described in the passage function?",
        options: [
          "A. Embedded bacteria produce calcium carbonate when moisture enters cracks",
          "B. Mycelium roots expand when heated by sunlight",
          "C. Synthetic polymers melt and reseal the surface"
        ],
        correct: 0
      },
      {
        q: "3. What is the primary barrier preventing the widespread adoption of biomimetic materials?",
        options: [
          "A. They are toxic to natural ecosystems",
          "B. Economic inertia and established subsidies favoring petrochemical industries",
          "C. Lack of scientific research in universities"
        ],
        correct: 1
      },
      {
        q: "4. The word 'nascent' in the final sentence most nearly means:",
        options: [
          "A. Obsolete and outdated",
          "B. Newly emerging and beginning to develop",
          "C. Universally dominant"
        ],
        correct: 1
      },
      {
        q: "5. Which statement best summarizes the main idea of the passage?",
        options: [
          "A. Biomimetic engineering offers sustainable circular solutions but faces structural economic hurdles",
          "B. Self-healing concrete has completely replaced traditional cement",
          "C. Linear manufacturing is more efficient than natural ecosystems"
        ],
        correct: 0
      }
    ]
  }
];

function generateConversationalResponse(rawInput) {
  const trimmed = rawInput.trim();
  const lower = trimmed.toLowerCase();
  const hasCyrillic = /[а-яА-ЯөүёӨҮЁ]/.test(trimmed);

  if (hasCyrillic) {
    if (lower.includes("намуун") || lower.includes("настай") || lower.includes("миний нэр")) {
      const reply = "Nice to meet you, Namuunbaigal! Being 21 is such an exciting stage of life. What are you currently studying or focusing on?";
      return {
        corrected: "My name is Namuunbaigal, and I am 21 years old.",
        galig: "[Май нэйм из Намуунбайгаль, энд ай эм туэнти уан йэрс оулд]",
        explanation: "Өөрийгөө танилцуулах зөв хэлбэр.",
        aiReply: reply,
        aiReplyMn: "Тантай танилцахад таатай байна, Намуунбайгаль! 21 нас бол амьдралын хамгийн гайхалтай үе шүү дээ. Та одоо юу судалж, юунд илүү төвлөрч байна вэ?",
        speakPhrase: reply
      };
    }
    if (lower.includes("хобби") || lower.includes("дуртай") || lower.includes("чөлөөт цаг")) {
      const reply = "That sounds like a wonderful way to unwind! How often do you get the chance to enjoy your hobbies during a busy week?";
      return {
        corrected: "In my free time, I enjoy reading books and listening to music.",
        galig: "[Ин май фрий тайм, ай инжой рийдинг бүүкс энд лиснинг ту мьюзик]",
        explanation: "'enjoy' үйл үгийн дараа '-ing' залгавар ордог.",
        aiReply: reply,
        aiReplyMn: "Амрах гайхалтай сайхан арга байна! Завгүй долоо хоногийн дундуур хоббигоороо хичээллэх зав хэр их гардаг вэ?",
        speakPhrase: reply
      };
    }
    const defaultReply = "I understand! Let's practice expressing that in English. Could you tell me a little more details about it?";
    return {
      corrected: "I would like to talk about this topic in English.",
      galig: "[Ай уод лайк ту тоок эбаут дис топик ин Инглиш]",
      explanation: "Таны санааг англи ярианы хэлбэрт орууллаа.",
      aiReply: defaultReply,
      aiReplyMn: "Ойлголоо! Үүнийг англиар илэрхийлж дадлага хийцгээе. Энэ талаар надад арай дэлгэрэнгүй ярьж өгөхгүй юу?",
      speakPhrase: defaultReply
    };
  }

  let fixed = trimmed;
  let notes = [];

  const rules = [
    { pattern: /\bdes\b/gi, replacement: "this", reason: "'des' биш 'this' гэж бичнэ." },
    { pattern: /\bdat\b/gi, replacement: "that", reason: "'dat' биш 'that' гэж бичнэ." },
    { pattern: /\bi\b/g, replacement: "I", reason: "'I' үсэг үргэлж том үсгээр бичигдэнэ." },
    { pattern: /\bhelp me for\b/gi, replacement: "help me with", reason: "'help with' гэж угтвар үг авна." }
  ];

  rules.forEach(r => {
    if (r.pattern.test(fixed)) {
      fixed = fixed.replace(r.pattern, r.replacement);
      notes.push(r.reason);
    }
  });

  fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
  if (!/[.?!]$/.test(fixed)) fixed += ".";

  const wordMap = {
    "i": "ай", "am": "эм", "my": "май", "name": "нэйм", "is": "из",
    "years": "йэрс", "old": "оулд", "want": "уонт", "to": "ту",
    "practice": "практис", "english": "инглиш", "can": "кэн", "you": "юү",
    "help": "хэлп", "me": "ми", "with": "уиз", "this": "дис", "one": "уан",
    "like": "лайк", "study": "стади", "work": "уөрк", "love": "лав",
    "travel": "трэвэл", "music": "мьюзик", "books": "бүүкс", "ielts": "ай-эл-ти-эс"
  };

  const galigWords = fixed.replace(/[.,?!]/g, "").split(/\s+/).map(w => wordMap[w.toLowerCase()] || w.toLowerCase());
  const galigString = `[${galigWords.join(" ")}]`;

  let aiReply = "";
  let aiReplyMn = "";

  if (lower.includes("hello") || lower.includes("hi ") || lower === "hi") {
    aiReply = "Hello there! It's great to talk with you today. What topic would you like to discuss to practice your speaking?";
    aiReplyMn = "Сайн байна уу! Өнөөдөр тантай ярилцахад таатай байна. Ярианы дадлага хийхийн тулд ямар сэдвээр ярилцмаар байна вэ?";
  } else if (lower.includes("ielts") || lower.includes("exam") || lower.includes("test")) {
    aiReply = "Preparing for IELTS is a great goal! Which section do you find most challenging right now—Speaking Part 2, Writing, or C1 Listening?";
    aiReplyMn = "IELTS-д бэлдэх нь маш сайхан зорилго байна! Одоогоор аль хэсэг нь танд хамгийн хэцүү санагдаж байна вэ—Ярианы 2-р хэсэг үү, Бичих үү, эсвэл C1 Сонсох уу?";
  } else if (lower.includes("study") || lower.includes("student") || lower.includes("university") || lower.includes("major")) {
    aiReply = "That sounds fascinating! What inspired you to choose that field of study, and what are your plans after graduation?";
    aiReplyMn = "Маш сонирхолтой сонсогдож байна! Энэ мэргэжлийг сонгоход танд юу нөлөөлсөн бэ, мөн төгссөнийхөө дараа ямар төлөвлөгөөтэй байгаа вэ?";
  } else if (lower.includes("hobby") || lower.includes("free time") || lower.includes("music") || lower.includes("movie") || lower.includes("read")) {
    aiReply = "I love that! Having hobbies keeps our minds sharp. Why do you enjoy that activity so much compared to others?";
    aiReplyMn = "Надад ч бас таалагдаж байна! Хоббитой байх нь оюун ухааныг сэргэг байлгадаг. Бусад зүйлстэй харьцуулахад яагаад үүнд илүү дуртай вэ?";
  } else if (lower.includes("travel") || lower.includes("country") || lower.includes("visit") || lower.includes("tour")) {
    aiReply = "Traveling opens up so many new perspectives! If you could visit any country tomorrow, where would you go and why?";
    aiReplyMn = "Аялах нь маш олон шинэ харах өнцгийг нээж өгдөг! Хэрэв та маргааш аль нэг улс руу аялах боломжтой байсан бол хаашаа явах вэ, яагаад?";
  } else if (lower.includes("practice") || lower.includes("help") || lower.includes("english")) {
    aiReply = "Of course! I am right here to help you speak fluently. Tell me about your daily routine or a memorable experience you had recently.";
    aiReplyMn = "Мэдээж хэрэг! Би таныг чөлөөтэй ярьдаг болоход туслахад бэлэн байна. Өдөр тутмын хэвшил эсвэл саяхан тохиолдсон дурсамжтай явдлаасаа хуваалцаач.";
  } else {
    aiReply = `That's a very interesting point about "${fixed.replace(/\.$/, '')}". Could you elaborate on your reasons or give a specific example?`;
    aiReplyMn = `"${fixed.replace(/\.$/, '')}" гэдэг дээр та маш сонирхолтой санаа хэллээ. Шалтгаанаа илүү дэлгэрүүлэх эсвэл тодорхой жишээ хэлж чадах уу?`;
  }

  return {
    corrected: fixed,
    galig: galigString,
    explanation: notes.length > 0 ? notes.join(" ") : "Таны өгүүлбэр дүрмийн хувьд зөв байна!",
    aiReply,
    aiReplyMn,
    speakPhrase: aiReply
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [ieltsSubTab, setIeltsSubTab] = useState('menu');
  const [xp, setXp] = useState(140);
  const [userLevel, setUserLevel] = useState('C1 Advanced');

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const [vocabQuizIdx, setVocabQuizIdx] = useState(0);
  const [vocabQuizScore, setVocabQuizScore] = useState(0);
  const [vocabQuizFinished, setVocabQuizFinished] = useState(false);

  const [testModeSelected, setTestModeSelected] = useState(false);
  const [testQuestion, setTestQuestion] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      role: 'assistant',
      text: "Сайн байна уу? Микрофон дээр дарж ярих эсвэл хүссэн сэдвээрээ бичээрэй. Би таны ярианы утгад тохируулан англиар харилцан ярьж, зэрэгцээд таны өгүүлбэрийн алдаа, монгол галигийг гаргаж өгөх болно!",
      speakPhrase: "Hello! Speak into the microphone or type anything, and I will converse with you naturally while checking your grammar."
    }
  ]);
  const [generating, setGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [selectedListeningIdx, setSelectedListeningIdx] = useState(0);
  const [listeningQIndex, setListeningQIndex] = useState(0);
  const [listeningScore, setListeningScore] = useState(0);
  const [listeningFinished, setListeningFinished] = useState(false);

  const [readingIndex, setReadingIndex] = useState(0);
  const [readingQIndex, setReadingQIndex] = useState(0);
  const [readingScore, setReadingScore] = useState(0);
  const [readingFinished, setReadingFinished] = useState(false);

  const [userEssay, setUserEssay] = useState('');

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Таны хөтөч дуу хоолой гаргах функцийг дэмжихгүй байна.");
    }
  };

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined' || (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))) {
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

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || generating) return;
    const userMsg = input;
    setInput('');
    setChatLog(prev => [...prev, { role: 'user', text: userMsg }]);
    setGenerating(true);

    setTimeout(() => {
      const res = generateConversationalResponse(userMsg);
      const formattedReply = `🗣️ AI Хариулт (Яриа үргэлжлүүлэх):
"${res.aiReply}"
(${res.aiReplyMn})

✅ Таны өгүүлбэрийн засвар:
"${res.corrected}"

📌 Монгол галиг:
${res.galig}

💡 Тайлбар: ${res.explanation}`;

      setChatLog(prev => [
        ...prev,
        { role: 'assistant', text: formattedReply, speakPhrase: res.speakPhrase }
      ]);
      speakText(res.speakPhrase);
      setXp(p => p + 10);
      setGenerating(false);
    }, 400);
  };

  const handleVocabQuizAnswer = (idx) => {
    if (idx === vocabularyQuizData[vocabQuizIdx].correct) {
      setVocabQuizScore(p => p + 1);
    }
    if (vocabQuizIdx + 1 < vocabularyQuizData.length) {
      setVocabQuizIdx(p => p + 1);
    } else {
      setVocabQuizFinished(true);
      setXp(p => p + 15);
    }
  };

  const handleAnswerTest = (idx) => {
    let score = testScore;
    if (idx === placementQuestions[testQuestion].correct) {
      score++;
      setTestScore(score);
    }
    if (testQuestion + 1 < placementQuestions.length) {
      setTestQuestion(p => p + 1);
    } else {
      setTestFinished(true);
      setUserLevel('C1 Advanced');
      setXp(p => p + 25);
    }
  };

  const currentListening = fullListeningModules[selectedListeningIdx];

  const handleAnswerListening = (idx) => {
    if (idx === currentListening.questions[listeningQIndex].correct) {
      setListeningScore(p => p + 1);
    }
    if (listeningQIndex + 1 < currentListening.questions.length) {
      setListeningQIndex(p => p + 1);
    } else {
      setListeningFinished(true);
      setXp(p => p + 25);
    }
  };

  const currentReading = readingPassages[readingIndex];

  const handleAnswerReading = (idx) => {
    if (idx === currentReading.questions[readingQIndex].correct) {
      setReadingScore(p => p + 1);
    }
    if (readingQIndex + 1 < currentReading.questions.length) {
      setReadingQIndex(p => p + 1);
    } else {
      setReadingFinished(true);
      setXp(p => p + 25);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', display: 'flex', flexDirection: 'column', padding: '16px 16px 90px 16px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>F</div>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>Fluency<span style={{ color: '#38bdf8' }}>Go</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
          <span style={{ color: '#38bdf8' }}>⚡ {xp} XP</span>
          <button onClick={() => { stopAudio(); setActiveTab('home'); setIeltsSubTab('menu'); setTest
