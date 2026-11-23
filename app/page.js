'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const U = process.env.NEXT_PUBLIC_SUPABASE_URL
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const sb = U && K ? createClient(U, K) : null

const CSS = `:root,[data-theme=aurora]{color-scheme:dark;--bg:#0b0b24;--g:radial-gradient(900px 500px at 10% -10%,#4c1d95,transparent 60%),radial-gradient(700px 500px at 100% 10%,#0f766e,transparent 55%);--card:rgba(255,255,255,.09);--bd:rgba(255,255,255,.2);--tx:#f1f0ff;--mu:#b4b1e0;--v:#8b5cf6;--t:#2dd4bf;--bt:#0b0b24;--nb:rgba(11,11,36,.96);--ok:#34d399;--bad:#fb7185;--me:#7c3aed;--met:#fff}
[data-theme=emerald]{--bg:#04170f;--g:radial-gradient(900px 500px at 10% -10%,#065f46,transparent 60%);--v:#10b981;--t:#a3e635;--nb:rgba(4,23,15,.96);--me:#047857}
[data-theme=sunset]{--bg:#1f0a1a;--g:radial-gradient(900px 500px at 90% -10%,#9f1239,transparent 60%),radial-gradient(600px 400px at 0 20%,#b45309,transparent 55%);--v:#f43f5e;--t:#fbbf24;--nb:rgba(31,10,26,.96);--me:#be123c}
[data-theme=light]{color-scheme:light;--bg:#f6f5ff;--g:none;--card:#fff;--bd:rgba(30,20,80,.3);--tx:#1b1740;--mu:#4b4780;--v:#6d28d9;--t:#0f766e;--bt:#fff;--nb:#fff;--ok:#047857;--bad:#be123c;--me:#6d28d9}
[data-theme=hc]{color-scheme:dark;--bg:#000;--g:none;--card:#000;--bd:#fff;--tx:#fff;--mu:#fff;--v:#ffe600;--t:#00e5ff;--bt:#000;--nb:#000;--ok:#00ff7f;--bad:#ff6b6b;--me:#ffe600;--met:#000}
*{box-sizing:border-box}
body{margin:0;background:var(--g),var(--bg);color:var(--tx);font:calc(16px*var(--fs,1))/1.55 system-ui,sans-serif;min-height:100vh}
main{max-width:560px;margin:0 auto;padding:14px 16px 120px}
h1{font-size:1.5em;margin:.2em 0}h1 b{color:var(--t)}h2{font-size:1.2em;margin:.3em 0}
.card{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:14px;margin:12px 0}
.m{white-space:pre-wrap;max-width:94%}.me{margin-left:auto;background:var(--me);color:var(--met)}
.sm{color:var(--mu);font-size:.9em}
button,select,input,textarea{font:inherit;color:var(--tx);min-height:48px;border-radius:12px;border:1px solid var(--bd);background:var(--card);padding:10px 14px}
textarea,input{width:100%;margin:4px 0}
.go{background:linear-gradient(135deg,var(--v),var(--t));color:var(--bt);font-weight:700;border:0;cursor:pointer}
[data-theme=hc] .go{background:var(--v)}
.go:disabled{opacity:.5}.w{width:100%}.on{outline:3px solid var(--t)}
.row{display:flex;gap:8px;align-items:center;justify-content:space-between}.row>.go,.row>.g{flex:1}
.wrap{display:flex;gap:8px;flex-wrap:wrap}
.opt{display:block;width:100%;text-align:left;margin:8px 0;cursor:pointer;border-width:2px}
.ok{border-color:var(--ok)}.bad{border-color:var(--bad)}
.flip{display:block;width:100%;text-align:center;padding:26px 8px;font-size:1.3em;cursor:pointer}
.bar{height:10px;border:1px solid var(--bd);border-radius:9px;overflow:hidden}.bar i{display:block;height:100%;background:var(--t)}
.badge{display:inline-block;margin:4px 6px 4px 0;padding:6px 10px;border-radius:99px;border:1px solid var(--bd)}.off{opacity:.45}
ul{list-style:none;padding:0;margin:0}li{padding:6px 0}
nav{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:space-around;background:var(--nb);border-top:1px solid var(--bd);padding:6px 2px calc(6px + env(safe-area-inset-bottom,0px))}
nav button{border:0;background:none;color:var(--mu);font-size:.75em;display:flex;flex-direction:column;align-items:center;min-width:64px;padding:4px}
nav button[aria-current=page]{color:var(--t);font-weight:700}nav span{font-size:1.6em}
.toast{position:fixed;left:50%;transform:translateX(-50%);top:10px;background:var(--t);color:var(--bt);padding:10px 16px;border-radius:99px;font-weight:700;z-index:9;max-width:90%;text-align:center}
.cap{position:fixed;left:8px;right:8px;bottom:84px;background:#000;color:#fff;border:2px solid #fff;border-radius:12px;padding:10px 14px;z-index:8}
:focus-visible{outline:3px solid var(--t);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}`

const LV = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1']
const Q = [['She ___ to school every day.', ['go', 'goes', 'going', 'gone'], 1], ['I have lived here ___ 2019.', ['for', 'since', 'from', 'during'], 1], ['If it rains, we ___ at home.', ['stay', 'stayed', 'will stay', 'would stay'], 2], ['Choose the synonym of “big”.', ['tiny', 'huge', 'narrow', 'quiet'], 1], ['He suggested ___ earlier.', ['to leave', 'leave', 'leaving', 'left'], 2], ['The report was ___ by the committee.', ['reviewing', 'reviewed', 'review', 'reviews'], 1], ['Hardly ___ arrived when it started to rain.', ['we had', 'had we', 'we have', 'have we'], 1], ['“Mitigate” means to ___.', ['worsen', 'reduce the effect of', 'ignore', 'celebrate'], 1], ['Had I known, I ___ differently.', ['would act', 'will act', 'would have acted', 'acted'], 2], ['Her argument was ___, so everyone agreed.', ['compelling', 'compelled', 'compel', 'compellingly'], 0]]
const V = [['mitigate', 'бууруулах, зөөлрүүлэх', 'Planting trees can mitigate climate change.'], ['substantial', 'ихээхэн, мэдэгдэхүйц', 'There was a substantial increase in prices.'], ['advocate', 'дэмжигч; сурталчлах', 'She advocates for equal education.'], ['compelling', 'үнэмшилтэй, татам', 'He gave a compelling reason.'], ['deteriorate', 'муудах, доройтох', 'Air quality may deteriorate.'], ['inevitable', 'зайлшгүй', 'Change is inevitable.'], ['scrutinize', 'нарийвчлан шалгах', 'Experts scrutinize every claim.'], ['sustainable', 'тогтвортой', 'We need sustainable energy.'], ['prevalent', 'өргөн дэлгэрсэн', 'Stress is prevalent among students.'], ['controversial', 'маргаантай', 'It is a controversial policy.']]
const P = [['Hello', 'Сайн байна уу'], ['Thank you', 'Баярлалаа'], ['Yes', 'Тийм'], ['No', 'Үгүй'], ['Please', 'Гуйя'], ['Sorry', 'Уучлаарай'], ['My name is …', 'Миний нэр …'], ['How are you?', 'Сайн байна уу? (Амар сайн уу?)'], ['I don’t understand', 'Би ойлгохгүй байна'], ['Goodbye', 'Баяртай']]
const BG = [[3, '🥉 3 өдөр'], [7, '🥈 7 өдөр'], [14, '🥇 14 өдөр'], [30, '🏆 30 өдөр']]
const TH = [['aurora', 'Midnight Aurora'], ['emerald', 'Emerald Forest'], ['sunset', 'Royal Sunset'], ['light', 'Гэрэлтэй (Light)'], ['hc', 'Өндөр ялгаралт (High-Contrast)']]
const MODES = [['coach', '💬 Юу гэж хэлэх вэ?'], ['exam1', 'Part 1'], ['exam2', 'Part 2'], ['exam3', 'Part 3']]
const HELP = {
  coach: 'Хэлмээр байгаа зүйлээ монголоор, англиар эсвэл холиод бич (эсвэл 🎙️). Би англиар яаж хэлэхийг өгнө.',
  exam1: 'IELTS Speaking Part 1: энгийн асуултууд. Англиар хариул.',
  exam2: 'IELTS Speaking Part 2: карт авч 1-2 минут ярина. Урт хариул.',
  exam3: 'IELTS Speaking Part 3: гүнзгий хэлэлцүүлэг.',
}
const SC = [
  ['L', 'Good morning, University Library and Student Services. How can I help you today?'],
  ['S', 'Good morning. I’m a first-year student, and I’d like to register for a library membership. I also need to find out how borrowing works.'],
  ['L', 'Of course. Have you got your student card with you?'],
  ['S', 'Yes, here it is. Do I need to fill in a form as well?'],
  ['L', 'Yes, a short online form. It takes about five minutes. You’ll need your student number, which is on the front of the card, and your email address.'],
  ['S', 'Okay. Is there a fee for the membership?'],
  ['L', 'No, it’s free for all current students. Only visitors from outside the university pay a yearly fee.'],
  ['S', 'That’s good to know. And how many books can I borrow at once?'],
  ['L', 'Undergraduate students can borrow up to five books at a time. Postgraduate students can borrow ten.'],
  ['S', 'Five should be enough for now. How long can I keep them?'],
  ['L', 'Standard books can be kept for fourteen days. After that you can renew them online, twice, as long as nobody else has reserved them.'],
  ['S', 'And what happens if I return a book late?'],
  ['L', 'There’s a fine of fifty pence per day for each book, so it’s best to renew early.'],
  ['S', 'I see. I’ll set a reminder on my phone. Also, I need a quiet place to study. Does the library have group rooms?'],
  ['L', 'We have twelve group study rooms on the second floor. You can book one for up to two hours, but you have to reserve it at least a day in advance.'],
  ['S', 'Can I do that on the website?'],
  ['L', 'Yes, through your library account. The quiet study desks on the third floor don’t need booking, and that floor is open twenty-four hours during exam weeks.'],
  ['S', 'Wonderful. What are the normal opening hours?'],
  ['L', 'From eight in the morning until ten at night on weekdays, and from ten until six at the weekend.'],
  ['S', 'Is there Wi-Fi, and can I print there?'],
  ['L', 'Wi-Fi is free everywhere in the building. Printing costs five pence per page, and you can top up your print credit at the machine next to the main entrance, using cash or your bank card.'],
  ['S', 'Perfect. And can I bring a drink?'],
  ['L', 'Water in a closed bottle is fine, but hot drinks and food are only allowed in the café on the ground floor.'],
  ['S', 'Great. One last thing. I’m looking for an economics textbook, but I couldn’t find it in the catalogue.'],
  ['L', 'In that case you can ask for it through our request service. If we don’t own it, we’ll order it for you, and it usually arrives within a week. Just leave your name at the desk on the ground floor.'],
  ['S', 'Thank you so much. You’ve been really helpful.'],
  ['L', 'You’re welcome. Enjoy your studies, and don’t forget your card next time.'],
]
const LQ = [['1. What does the student want to do?', ['Book a study room', 'Register for library membership', 'Pay a fine'], 1], ['2. How many books can an undergraduate borrow at once?', ['Three', 'Five', 'Ten'], 1], ['3. How long can standard books be kept?', ['7 days', '14 days', '30 days'], 1], ['4. What is the fine for a late book?', ['50 pence per day for each book', '£1 per day in total', '£5 once'], 0], ['5. Which floor is open 24 hours during exam weeks?', ['Second', 'Third', 'Ground'], 1]]
const ERR = {
  daily_limit: 'Өнөөдрийн үнэгүй хязгаар дууслаа. Маргааш дахин оролдоно уу.',
  not_configured: 'Сервер бүрэн тохируулагдаагүй байна (түлхүүрүүд дутуу).',
  unauthorized: 'Дахин нэвтэрнэ үү.',
  too_long: 'Текст хэт урт байна.',
  error: 'Алдаа гарлаа. Дахин оролдоно уу.',
}
const NOMIC = 'Энэ хөтөч дуу хоолойн оруулгыг дэмждэггүй байна. Chrome дээр шууд нээж үзнэ үү, эсвэл бичнэ үү ✍️'
const DENY = 'Микрофонд зөвшөөрөл өгөөгүй байна. Хөтчийн тохиргооноос зөвшөөрнө үү, эсвэл бичнэ үү ✍️'
const day = (o = 0) => new Date(Date.now() - o * 864e5).toISOString().slice(0, 10)
const eng = (t) => { const m = t.match(/^(?:🗣️[^:\n]*:|❓)\s*(.+)$/mu); return m ? m[1] : '' }
const authErr = (m) =>
  /invalid login/i.test(m) ? 'Имэйл эсвэл нууц үг буруу байна.'
  : /already registered/i.test(m) ? 'Энэ имэйл бүртгэлтэй байна. Нэвтэрнэ үү.'
  : /password/i.test(m) ? 'Нууц үг дор хаяж 8 тэмдэгттэй байх ёстой.'
  : /rate|too many/i.test(m) ? 'Хэт олон оролдлого. Түр хүлээнэ үү.'
  : /confirm/i.test(m) ? 'Имэйлээ баталгаажуулна уу.'
  : 'Алдаа гарлаа. Дахин оролдоно уу.'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('home')
  const [pt, setPt] = useState(null)
  const [mode, setMode] = useState('coach')
  const [log, setLog] = useState([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const [lang, setLang] = useState('mn-MN')
  const [vi, setVi] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [cap, setCap] = useState('')
  const [ess, setEss] = useState('')
  const [essRes, setEssRes] = useState('')
  const [ls, setLs] = useState({ cur: -1, play: false, tr: false, a: {} })
  const [am, setAm] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authNote, setAuthNote] = useState('')
  const end = useRef(null)
  const tt = useRef(null)
  const ct = useRef(null)
  const uid = session && session.user.id
  const S = (profile && profile.settings) || {}

  useEffect(() => {
    if (!sb) { setSession(null); setAuthNote(ERR.not_configured); return }
    sb.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!uid) { setProfile(null); return }
    sb.from('profiles').select('*').eq('id', uid).single().then(({ data }) => { if (data) setProfile(data) })
  }, [uid])
  useEffect(() => {
    document.documentElement.dataset.theme = S.theme || 'aurora'
    document.documentElement.style.setProperty('--fs', S.fs || 1)
  }, [S.theme, S.fs])
  useEffect(() => { if (tab === 'speak' && end.current) end.current.scrollIntoView({ block: 'end' }) }, [log, tab])
  useEffect(() => () => { try { speechSynthesis.cancel() } catch (e) {} }, [])

  const say = (m) => { setToastMsg(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToastMsg(''), 3500) }
  function speak(t, force) {
    try {
      const u = new SpeechSynthesisUtterance(t)
      u.lang = /[\u0400-\u04FF]/.test(t) ? 'mn-MN' : 'en-US'
      u.rate = 0.9
      speechSynthesis.cancel(); speechSynthesis.speak(u)
    } catch (e) {}
    if (S.cap !== false || force) { setCap('🔊 ' + t.slice(0, 300)); clearTimeout(ct.current); ct.current = setTimeout(() => setCap(''), 7000) }
  }
  const readScreen = () => speak(document.getElementById('main').innerText.slice(0, 1500), true)
  function upd(patch) {
    setProfile((p) => ({ ...p, ...patch }))
    sb.from('profiles').update(patch).eq('id', uid).then(() => {})
  }
  const setS = (o) => upd({ settings: { ...S, ...o } })
  const Q0 = S.quest && S.quest.d === day() ? S.quest : { d: day(), msg: 0, words: 0, wod: false, bonus: false }

  function award(n, qp, learned) {
    const q = { ...Q0, ...(qp || {}) }
    let b = 0
    if (!q.bonus && q.msg >= 1 && q.words >= 3 && q.wod) { q.bonus = true; b = 30; say('✅ Өдрийн 3 даалгавар биелэв! +30 XP') }
    const t = day()
    const streak = profile.last_active === t ? profile.streak : profile.last_active === day(1) ? profile.streak + 1 : 1
    const best = Math.max(profile.best_streak, streak)
    if (best > profile.best_streak) { const g = BG.find((x) => x[0] === streak); if (g) say('🎉 Шинэ медаль: ' + g[1]) }
    const patch = { xp: profile.xp + n + b, streak, best_streak: best, last_active: t, settings: { ...S, quest: q } }
    if (learned) patch.learned = learned
    upd(patch)
  }

  async function submitAuth(e) {
    e.preventDefault(); setAuthNote(''); setBusy(true)
    if (am === 'signup') {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name: name.trim() } } })
      if (error) setAuthNote(authErr(error.message))
      else if (!data.session) setAuthNote('Имэйлээ шалгаад баталгаажуулах холбоос дээр дарна уу.')
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) setAuthNote(authErr(error.message))
    }
    setBusy(false)
  }

  async function callAI(messages, m, turn) {
    const r = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token },
      body: JSON.stringify({ messages, level: profile.level, mode: m, turn: turn || 0 }),
    })
    const d = await r.json()
    if (!r.ok) throw new Error(d.error || 'error')
    return d.reply
  }

  async function run(history, m) {
    setLog(history); setBusy(true); setNote('')
    try {
      const turn = history.filter((x) => x.role === 'user' && !x.hidden).length
      const reply = await callAI(history.map((x) => ({ role: x.role, content: x.content })), m, turn)
      setLog([...history, { role: 'assistant', content: reply }])
      if (S.auto) speak(eng(reply) || reply)
      if (!history[history.length - 1].hidden) award(5, { msg: Q0.msg + 1 })
    } catch (e) {
      const last = history[history.length - 1]
      setLog(history.slice(0, -1))
      if (last && !last.hidden) setText(last.content)
      setNote(ERR[e.message] || ERR.error)
    }
    setBusy(false)
  }
  function pickMode(m) {
    setMode(m); setNote(''); setLang(m === 'coach' ? 'mn-MN' : 'en-US')
    if (m === 'coach') setLog([])
    else run([{ role: 'user', content: 'Please start Part ' + m.slice(4) + '.', hidden: true }], m)
  }
  function send() {
    const v = text.trim()
    if (!v || busy) return
    setText('')
    run([...log, { role: 'user', content: v }], mode)
  }
  function mic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return setNote(NOMIC)
    try {
      const r = new SR()
      r.lang = lang; r.interimResults = false
      r.onstart = () => setNote('🎤 Сонсож байна…')
      r.onresult = (e) => { setText((t) => (t + ' ' + e.results[0][0].transcript).trim()); setNote('✓ Бичлээ. Шалгаад “Илгээх” дарна уу.') }
      r.onerror = (e) => setNote(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? DENY : 'Дуу сонсогдсонгүй. Дахин оролдоно уу.')
      r.start()
    } catch (e) { setNote(NOMIC) }
  }
  async function grade() {
    if (ess.trim().split(/\s+/).length < 40) { say('Дор хаяж 40 үг бичнэ үү'); return }
    if (busy) return
    setBusy(true); setEssRes('Шалгаж байна…')
    try { const r = await callAI([{ role: 'user', content: ess.trim() }], 'essay'); setEssRes(r); award(25); if (S.auto) speak(r) }
    catch (e) { setEssRes(ERR[e.message] || ERR.error) }
    setBusy(false)
  }

  function playL() {
    try {
      speechSynthesis.cancel()
      const vs = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang))
      setLs((x) => ({ ...x, play: true }))
      SC.forEach(([w, t], i) => {
        const u = new SpeechSynthesisUtterance(t)
        u.lang = 'en-GB'; u.rate = 0.92; u.pitch = w === 'L' ? 0.8 : 1.25
        const v = vs[w === 'L' ? 0 : Math.min(1, vs.length - 1)]
        if (v) u.voice = v
        u.onstart = () => setLs((x) => ({ ...x, cur: i }))
        if (i === SC.length - 1) u.onend = () => setLs((x) => ({ ...x, play: false, cur: -1 }))
        speechSynthesis.speak(u)
      })
    } catch (e) { say('Энэ хөтөч дуу тоглуулахгүй байна. Транскриптийг уншина уу.') }
  }
  const stopL = () => { try { speechSynthesis.cancel() } catch (e) {} setLs((x) => ({ ...x, play: false, cur: -1 })) }
  function ansL(i, j) {
    setLs((x) => ({ ...x, a: { ...x.a, [i]: j } }))
    say(j === LQ[i][2] ? '✓ Зөв! +5 XP' : '✗ Буруу')
    if (j === LQ[i][2]) award(5)
  }

  const pick = (i) => { setPt({ ...pt, a: i, s: pt.s + (i === Q[pt.i][2] ? 1 : 0) }); say(i === Q[pt.i][2] ? '✓ Зөв!' : i < 0 ? 'Зүгээр, хамт сурна 🙂' : '✗ Дараагийн удаад!') }
  function nextQ() {
    if (pt.i + 1 >= Q.length) { upd({ level: LV[Math.min(5, Math.floor(pt.s / 2))], settings: { ...S, onboarded: true } }); setPt(null) }
    else setPt({ ...pt, i: pt.i + 1, a: null })
  }

  const fx = (<>
    <style>{CSS}</style>
    <div className="toast" role="status" aria-live="polite" style={{ display: toastMsg ? 'block' : 'none' }}>{toastMsg}</div>
    <div className="cap" role="status" aria-live="polite" style={{ display: cap ? 'block' : 'none' }}>{cap}</div>
  </>)

  if (session === undefined || (session && !profile)) return <main id="main"><style>{CSS}</style><p role="status">Ачаалж байна…</p></main>

  if (!session) return (
    <main id="main">{fx}
      <h1>Fluency<b>Go</b></h1>
      <h2>{am === 'login' ? 'Нэвтрэх (Log in)' : 'Бүртгүүлэх (Sign up)'}</h2>
      <form className="card" onSubmit={submitAuth}>
        {am === 'signup' && (<><label htmlFor="nm">Нэр (Name)</label><input id="nm" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></>)}
        <label htmlFor="em">Имэйл (Email)</label>
        <input id="em" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pw">Нууц үг (Password, 8+)</label>
        <input id="pw" type="password" required minLength={8} autoComplete={am === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="go w" style={{ marginTop: 10 }} disabled={busy}>{am === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</button>
        <p role="alert" className="sm">{authNote}</p>
      </form>
      <button type="button" className="w" onClick={() => { setAm(am === 'login' ? 'signup' : 'login'); setAuthNote('') }}>
        {am === 'login' ? 'Шинээр бүртгүүлэх (Create account)' : 'Бүртгэлтэй юу? Нэвтрэх (Log in)'}
      </button>
    </main>
  )

  if (pt) {
    const q = Q[pt.i], d = pt.a !== null
    return (<main id="main">{fx}
      <p className="sm">Асуулт (Question) {pt.i + 1}/{Q.length}</p>
      <div className="bar" role="progressbar" aria-valuenow={pt.i * 10} aria-valuemin="0" aria-valuemax="100"><i style={{ width: pt.i * 10 + '%' }} /></div>
      <div className="card">
        <p className="sm">Зөв хариултыг сонгоно уу (Choose the correct answer)</p>
        <h2>{q[0]}</h2>
        {q[1].map((o, i) => <button key={i} className={'opt ' + (d ? (i === q[2] ? 'ok' : i === pt.a ? 'bad' : '') : '')} disabled={d} onClick={() => pick(i)}>{d && i === q[2] ? '✓ ' : d && i === pt.a ? '✗ ' : ''}{o}</button>)}
        <button className="opt" disabled={d} onClick={() => pick(-1)}>🤷 Мэдэхгүй (I don’t know)</button>
      </div>
      {d && <button className="go w" onClick={nextQ}>Үргэлжлүүлэх (Next)</button>}
    </main>)
  }

  if (!S.onboarded) return (<main id="main">{fx}
    <h1>Тавтай морил, {profile.display_name || ''}! 👋</h1>
    <p>Таны англи хэлний мэдлэг хэр байна?</p>
    <button className="go w" onClick={() => upd({ level: 'A0', settings: { ...S, onboarded: true } })}>🌱 Огт англи мэдэхгүй (A0 / Complete Beginner)</button>
    <br /><br />
    <button className="w" onClick={() => setPt({ i: 0, s: 0, a: null })}>📝 Түвшин тогтоох тест (10 асуулт)</button>
    <p className="sm">Тестэд “Мэдэхгүй” гэж хариулж болно. Тэр нь алдаа биш.</p>
  </main>)

  const lvl = profile.level
  const deck = lvl === 'A0' ? P : V
  const word = deck[vi % deck.length]
  const wod = deck[Math.floor(Date.now() / 864e5) % deck.length]
  const lock = lvl !== 'A0' && !(profile.is_pro || S.demo) && vi % deck.length >= 5
  const learned = profile.learned || []
  const pct = Math.round(learned.length / (V.length + P.length) * 100)
  const steps = [['AI багштай 1 удаа ярих (Speak once)', Q0.msg >= 1], ['3 шинэ ' + (lvl === 'A0' ? 'хэллэг' : 'үг') + ' сурах (Learn 3): ' + Math.min(3, Q0.words) + '/3', Q0.words >= 3], ['Өдрийн үгийг сурах (Word of the Day)', Q0.wod]]
  const badges = <div>{BG.map((b) => <span key={b[0]} className={'badge ' + (profile.best_streak >= b[0] ? '' : 'off')}>{b[1]}{profile.best_streak >= b[0] ? ' ✓' : ' 🔒'}</span>)}</div>
  const sw = (k, l, def) => { const on = S[k] === undefined ? !!def : !!S[k]; return <button className={'w ' + (on ? 'on' : '')} role="switch" aria-checked={on} onClick={() => setS({ [k]: !on })}>{l}: {on ? 'Асаалттай ✓' : 'Унтраалттай'}</button> }
  const T = [['home', '🏠', 'Нүүр'], ['speak', '🎙️', 'Ярих'], ['learn', '📚', lvl === 'A0' ? 'Хэллэг' : 'Үгс'], ['ielts', '🎯', 'IELTS']]
  const done = Object.keys(ls.a).length === LQ.length
  const score = LQ.filter((q, i) => ls.a[i] === q[2]).length

  return (
    <main id="main">{fx}
      <header className="row">
        <h1>{{ home: 'Нүүр', speak: 'Speaking', learn: lvl === 'A0' ? 'Амьдралын хэллэг' : 'Band 7+ үгс', ielts: 'IELTS', set: 'Тохиргоо' }[tab]}</h1>
        <button aria-label="Дэлгэцийг чангаар унших (Read screen aloud)" onClick={readScreen}>🔊</button>
        <button aria-label="Тохиргоо (Settings)" onClick={() => setTab('set')}>⚙️</button>
      </header>

      {tab === 'home' && (<>
        <p className="sm">Сайн уу, {profile.display_name || session.user.email}! Түвшин: <b>{lvl}</b> · Зорилго: IELTS 7.0</p>
        <div className="card row"><span>🔥 {profile.streak} өдөр</span><span>⚡ {profile.xp} XP</span><span>📚 {learned.length}</span></div>
        <section className="card" aria-labelledby="dq"><h2 id="dq">Өдрийн 3 даалгавар (Daily Quest)</h2>
          <ul>{steps.map((s, i) => <li key={i}><span aria-hidden="true">{s[1] ? '✅' : '⬜'}</span> {s[0]} <span className="sm">({s[1] ? 'Хийсэн' : 'Хийгээгүй'})</span></li>)}</ul></section>
        <section className="card" aria-labelledby="wd"><h2 id="wd">Өдрийн үг (Word of the Day)</h2>
          <p style={{ fontSize: '1.3em' }}><b>{wod[0]}</b> — {wod[1]}</p>
          <div className="row"><button className="g" aria-label={'Сонсох: ' + wod[0]} onClick={() => speak(wod[0])}>🔊 Сонсох</button>
            <button className="go" disabled={Q0.wod} onClick={() => award(5, { wod: true })}>{Q0.wod ? 'Сурсан ✓' : 'Сурлаа ✓'}</button></div></section>
        <section className="card"><h2>Ахиц ба медаль</h2>
          <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><i style={{ width: pct + '%' }} /></div>
          <span className="sm">{learned.length}/{V.length + P.length} үг, хэллэг</span>{badges}</section>
        <button className="go w" onClick={() => setTab('speak')}>Ярьж эхлэх →</button>
      </>)}

      {tab === 'speak' && (<>
        <div className="wrap" role="group" aria-label="Горим">
          {MODES.map(([k, l]) => <button key={k} aria-pressed={mode === k} className={mode === k ? 'on' : ''} onClick={() => pickMode(k)}>{l}</button>)}
        </div>
        <p className="sm">{HELP[mode]}</p>
        <div role="log" aria-live="polite">
          {log.filter((x) => !x.hidden).map((m, i) => (
            <article key={i} aria-label={m.role === 'user' ? 'Таны мессеж' : 'Багшийн хариу'} className={'card m' + (m.role === 'user' ? ' me' : '')}>
              {m.content}
              {m.role === 'assistant' && eng(m.content) && <div><button aria-label="Англи өгүүлбэрийг сонсох" onClick={() => speak(eng(m.content), true)}>🔊 Сонсох</button></div>}
            </article>
          ))}
          {busy && <p role="status" className="sm">Бодож байна…</p>}
          <div ref={end} />
        </div>
        <form className="card" onSubmit={(e) => { e.preventDefault(); send() }}>
          <label htmlFor="t" className="sm">{mode === 'coach' ? 'Юу гэж хэлэхийг хүсэж байна вэ?' : 'Хариултаа англиар бич эсвэл ярь'}</label>
          <textarea id="t" rows={3} maxLength={1500} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="row">
            <button type="button" aria-label="Микрофоноор ярих" onClick={mic}>🎤</button>
            <button type="button" aria-label="Яриа таних хэл солих" onClick={() => setLang(lang === 'mn-MN' ? 'en-US' : 'mn-MN')}>{lang === 'mn-MN' ? 'МН' : 'EN'}</button>
            <button type="submit" className="go" disabled={busy}>Илгээх</button>
          </div>
          <p role="status" aria-live="polite" className="sm">{note}</p>
        </form>
      </>)}

      {tab === 'learn' && (<>
        <p className="sm">{lock ? 'Үнэгүй: эхний 5 үг' : (vi % deck.length) + 1 + '/' + deck.length}</p>
        {lock
          ? <div className="card flip">🔒 Энэ үг Pro-д байна<br /><button className="go" style={{ marginTop: 12 }} onClick={() => setS({ demo: true })}>Pro демо асаах (туршилт)</button></div>
          : <>
            <button className="card flip" aria-label="Карт эргүүлэх (Flip card)" onClick={() => setFlipped(!flipped)}>
              {flipped ? <><b>{word[1]}</b>{word[2] && <p className="sm">{word[2]}</p>}</> : <><b>{word[0]}</b><p className="sm">Эргүүлэх бол товш (Tap to flip)</p></>}
            </button>
            <div className="row"><button className="g" aria-label="Англиар сонсох (Listen)" onClick={() => speak(word[0] + (word[2] ? '. ' + word[2] : ''))}>🔊 Сонсох</button>
              <button className="go" onClick={() => { if (!learned.includes(word[0])) { award(10, { words: Q0.words + 1 }, [...learned, word[0]]); say('✓ +10 XP') } setVi(vi + 1); setFlipped(false) }}>Сурлаа ✓</button></div></>}
        <div className="row" style={{ marginTop: 12 }}>
          <button aria-label="Өмнөх (Previous)" onClick={() => { setVi((vi + deck.length - 1) % deck.length); setFlipped(false) }}>←</button>
          <button aria-label="Дараах (Next)" onClick={() => { setVi((vi + 1) % deck.length); setFlipped(false) }}>→</button></div>
      </>)}

      {tab === 'ielts' && (<>
        <section className="card" aria-labelledby="li"><h2 id="li">🎧 Listening (ойролцоогоор 3 минут)</h2>
          <p className="sm">Номын сангийн ажилтан ба оюутны яриа. Нэг удаа сонсоод хариул. Компьютерийн дуу тул жинхэнэ IELTS-ийн аялгатай адил биш.</p>
          <div className="wrap">
            <button className="go" disabled={ls.play} onClick={playL}>▶ Тоглуулах</button>
            <button disabled={!ls.play} onClick={stopL}>⏹ Зогсоох</button>
            <button className={ls.tr ? 'on' : ''} aria-pressed={ls.tr} onClick={() => setLs({ ...ls, tr: !ls.tr })}>📄 Транскрипт</button>
          </div>
          {ls.play && ls.cur >= 0 && <p className="card" role="status" aria-live="polite"><b>{SC[ls.cur][0] === 'L' ? 'Librarian' : 'Student'}:</b> {SC[ls.cur][1]}</p>}
          {ls.tr && <div className="card" aria-label="Транскрипт">{SC.map(([w, t], i) => <p key={i} style={{ margin: '6px 0' }}><b>{w === 'L' ? 'Librarian' : 'Student'}:</b> {t}</p>)}</div>}
          {LQ.map((q, i) => (
            <div key={i} role="group" aria-label={'Асуулт ' + (i + 1)}>
              <p><b>{q[0]}</b></p>
              {q[1].map((o, j) => { const d = ls.a[i] !== undefined; return <button key={j} className={'opt ' + (d ? (j === q[2] ? 'ok' : j === ls.a[i] ? 'bad' : '') : '')} disabled={d} onClick={() => ansL(i, j)}>{d && j === q[2] ? '✓ ' : d && j === ls.a[i] ? '✗ ' : ''}{o}</button> })}
            </div>
          ))}
          {done && <p className="card" role="status"><b>Үр дүн: {score} / {LQ.length}</b> <button onClick={() => setLs({ ...ls, a: {} })}>Дахин</button></p>}
        </section>
        <section className="card" aria-labelledby="wr"><h2 id="wr">✍️ Writing (AI үнэлгээ)</h2>
          <p className="sm">Task 2: Some people think remote work is better than office work. Discuss both views and give your opinion. (Зайнаас ажиллах нь оффисоос илүү гэж зарим хүн үздэг. Хоёр байр суурийг тайлбарлаж, өөрийн саналаа хэл.)</p>
          <label htmlFor="ess" className="sm">Эссэ (Essay, 40+ үг)</label>
          <textarea id="ess" rows={8} maxLength={4000} value={ess} onChange={(e) => setEss(e.target.value)} />
          <button className="go w" disabled={busy} onClick={grade}>Үнэлүүлэх (Grade)</button>
          {essRes && <p className="card m" role="status" aria-live="polite">{essRes}</p>}
        </section>
      </>)}

      {tab === 'set' && (<>
        <section className="card"><h2>Түвшин (Level)</h2>
          <select aria-label="Түвшин" className="w" value={lvl} onChange={(e) => upd({ level: e.target.value })}>{LV.map((l) => <option key={l} value={l}>{l === 'A0' ? 'Огт анхан шат (A0)' : l}</option>)}</select>
          <button className="w" style={{ marginTop: 8 }} onClick={() => setPt({ i: 0, s: 0, a: null })}>Түвшин тогтоох тест дахин өгөх</button></section>
        <section className="card"><h2>Үсгийн хэмжээ (Font size)</h2>
          <div className="row">{[[1, 'A'], [1.2, 'A+'], [1.45, 'A++']].map((f) => <button key={f[0]} className={(S.fs || 1) === f[0] ? 'on' : ''} aria-pressed={(S.fs || 1) === f[0]} onClick={() => setS({ fs: f[0] })}>{f[1]}</button>)}</div></section>
        <section className="card"><h2>Өнгөний сонголт (Theme)</h2>
          {TH.map((t) => <button key={t[0]} className={'opt ' + ((S.theme || 'aurora') === t[0] ? 'ok' : '')} aria-pressed={(S.theme || 'aurora') === t[0]} onClick={() => setS({ theme: t[0] })}>{(S.theme || 'aurora') === t[0] ? '✓ ' : ''}{t[1]}</button>)}</section>
        <section className="card"><h2>Хүртээмж (Accessibility)</h2>{sw('cap', 'Дууны subtitle (Captions)', true)}<br /><br />{sw('auto', 'AI-ийн хариултыг автоматаар унших')}
          <p className="sm">Монгол дуу зарим утсанд байдаггүй. Тэр үед текст дэлгэц дээр үргэлж харагдана.</p></section>
        <section className="card"><h2>Pro</h2>{sw('demo', 'Pro демо (зөвхөн үгсийн сангийн түгжээ)')}<p className="sm">AI-ийн хязгаар: {profile.is_pro ? 'хязгааргүй (Pro)' : 'өдөрт 20 хүсэлт'}</p></section>
        <section className="card"><p>{profile.display_name} · {session.user.email}</p><button className="w" onClick={() => sb.auth.signOut()}>Гарах (Log out)</button></section>
        <button className="go w" onClick={() => setTab('home')}>← Буцах</button>
      </>)}

      <nav aria-label="Үндсэн цэс">
        {T.map((t) => <button key={t[0]} aria-current={tab === t[0] ? 'page' : undefined} onClick={() => setTab(t[0])}><span aria-hidden="true">{t[1]}</span>{t[2]}</button>)}
      </nav>
    </main>
  )
}
