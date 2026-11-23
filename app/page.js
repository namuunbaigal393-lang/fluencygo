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
  { q: "4. What is the meaning of 'Ubiquitous'?", options: ["A. Ховор олдох", "B. Хаа сайгүй тааралддаг
