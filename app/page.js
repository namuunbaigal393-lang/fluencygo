'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const U = process.env.NEXT_PUBLIC_SUPABASE_URL
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const sb = U && K ? createClient(U, K) : null

const LV = [['A0', 'Огт анхан шат (A0)'], ['A1', 'A1'], ['A2', 'A2'], ['B1', 'B1'], ['B2', 'B2'], ['C1', 'C1']]
const ERR = {
  daily_limit: 'Өнөөдрийн үнэгүй хязгаар дууслаа. Маргааш дахин оролдоно уу.',
  not_configured: 'Сервер бүрэн тохируулагдаагүй байна (түлхүүрүүд дутуу).',
  unauthorized: 'Дахин нэвтэрнэ үү.',
  too_long: 'Мессеж хэт урт байна.',
  error: 'Алдаа гарлаа. Дахин оролдоно уу.',
}
const NOMIC = 'Таны хөтөч (жишээ нь iPhone Safari) дуу хоолойн оруулгыг дэмждэггүй эсвэл хаасан байна. Санаа зоволтгүй, доор бичээд илгээнэ үү ✍️'
const DENY = 'Микрофонд зөвшөөрөл өгөөгүй байна. Хөтчийн тохиргооноос зөвшөөрнө үү, эсвэл бичиж үргэлжлүүлнэ үү ✍️'
const day = (o = 0) => new Date(Date.now() - o * 864e5).toISOString().slice(0, 10)
const authErr = (m) =>
  /invalid login/i.test(m) ? 'Имэйл эсвэл нууц үг буруу байна.'
  : /already registered/i.test(m) ? 'Энэ имэйл бүртгэлтэй байна. Нэвтэрнэ үү.'
  : /password/i.test(m) ? 'Нууц үг дор хаяж 8 тэмдэгттэй байх ёстой.'
  : /rate|too many/i.test(m) ? 'Хэт олон оролдлого. Түр хүлээнэ үү.'
  : /confirm/i.test(m) ? 'Имэйлээ баталгаажуулна уу.'
  : 'Алдаа гарлаа. Дахин оролдоно уу.'

function speak(t) {
  try {
    const u = new SpeechSynthesisUtterance(t)
    u.lang = /[\u0400-\u04FF]/.test(t) ? 'mn-MN' : 'en-US'
    speechSynthesis.cancel(); speechSynthesis.speak(u)
  } catch (e) {}
}

export default function Home() {
  const [session, setSession] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [level, setLevel] = useState('A1')
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authNote, setAuthNote] = useState('')
  const end = useRef(null)
  const uid = session && session.user.id

  useEffect(() => {
    if (!sb) { setSession(null); setAuthNote(ERR.not_configured); return }
    sb.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!uid) { setProfile(null); setMsgs([]); return }
    sb.from('profiles').select('*').eq('id', uid).single().then(({ data }) => { if (data) { setProfile(data); setLevel(data.level) } })
    sb.from('messages').select('role,content').eq('user_id', uid).order('created_at', { ascending: false }).limit(30)
      .then(({ data }) => setMsgs((data || []).reverse()))
  }, [uid])

  useEffect(() => { if (end.current) end.current.scrollIntoView({ block: 'end' }) }, [msgs])

  async function submitAuth(e) {
    e.preventDefault(); setAuthNote(''); setBusy(true)
    if (mode === 'signup') {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name: name.trim() } } })
      if (error) setAuthNote(authErr(error.message))
      else if (!data.session) setAuthNote('Имэйлээ шалгаад баталгаажуулах холбоос дээр дарна уу.')
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) setAuthNote(authErr(error.message))
    }
    setBusy(false)
  }

  function changeLevel(v) {
    setLevel(v)
    if (uid) sb.from('profiles').update({ level: v }).eq('id', uid).then(() => {})
  }

  async function send() {
    const v = text.trim()
    if (!v || busy || !profile) return
    const next = [...msgs, { role: 'user', content: v }]
    setMsgs(next); setText(''); setNote(''); setBusy(true)
    try {
      const r = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token },
        body: JSON.stringify({ messages: next.slice(-8), level }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'error')
      setMsgs([...next, { role: 'assistant', content: d.reply }])
      await sb.from('messages').insert([{ user_id: uid, role: 'user', content: v }, { user_id: uid, role: 'assistant', content: d.reply }])
      const streak = profile.last_active === day() ? profile.streak : profile.last_active === day(1) ? profile.streak + 1 : 1
      const upd = { xp: profile.xp + 5, streak, best_streak: Math.max(profile.best_streak, streak), last_active: day() }
      setProfile({ ...profile, ...upd })
      await sb.from('profiles').update(upd).eq('id', uid)
    } catch (e) {
      setMsgs(msgs); setText(v); setNote(ERR[e.message] || ERR.error)
    }
    setBusy(false)
  }

  function mic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return setNote(NOMIC)
    try {
      const r = new SR()
      r.lang = 'en-US'; r.interimResults = false
      r.onstart = () => setNote('🎤 Сонсож байна… Англиар ярина уу.')
      r.onresult = (e) => { setText((t) => (t + ' ' + e.results[0][0].transcript).trim()); setNote('✓ Таны үгийг бичлээ. Шалгаад “Илгээх” дарна уу.') }
      r.onerror = (e) => setNote(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? DENY : e.error === 'no-speech' ? 'Дуу сонсогдсонгүй. Дахин оролдоно уу.' : NOMIC)
      r.start()
    } catch (e) { setNote(NOMIC) }
  }

  if (session === undefined) return <main id="main"><p role="status">Ачаалж байна…</p></main>

  if (!session) return (
    <main id="main">
      <h1>Fluency<b>Go</b></h1>
      <h2>{mode === 'login' ? 'Нэвтрэх (Log in)' : 'Бүртгүүлэх (Sign up)'}</h2>
      <form className="card" onSubmit={submitAuth}>
        {mode === 'signup' && (<><label htmlFor="nm">Нэр (Name)</label><input id="nm" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></>)}
        <label htmlFor="em">Имэйл (Email)</label>
        <input id="em" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pw">Нууц үг (Password, 8+)</label>
        <input id="pw" type="password" required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="go" style={{ width: '100%', marginTop: 10 }} disabled={busy}>{mode === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</button>
        <p role="alert" className="sm">{authNote}</p>
      </form>
      <button type="button" style={{ width: '100%' }} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setAuthNote('') }}>
        {mode === 'login' ? 'Шинээр бүртгүүлэх (Create account)' : 'Бүртгэлтэй юу? Нэвтрэх (Log in)'}
      </button>
    </main>
  )

  const log = msgs.length ? msgs : [{ role: 'assistant', content: level === 'A0'
    ? 'Сайн байна уу! 👋 Би FluencyGo багш. Эхлээд хамгийн энгийн үгээс эхэлье: “Hello” гэдэг нь “Сайн байна уу”. Доор “Hello” гэж бичээд илгээгээрэй!'
    : 'Hello! Tell me about your day in English. (Өнөөдрийн тухай англиар хэлээрэй.)' }]

  return (
    <main id="main">
      <header className="row">
        <h1>Fluency<b>Go</b></h1>
        <button type="button" onClick={() => sb.auth.signOut()}>Гарах (Log out)</button>
      </header>
      <p className="sm">
        Сайн уу, {(profile && profile.display_name) || session.user.email}! ·{' '}
        <span aria-label={'Цуврал ' + (profile ? profile.streak : 0) + ' өдөр'}>🔥 {profile ? profile.streak : 0}</span> ·{' '}
        <span aria-label={(profile ? profile.xp : 0) + ' XP'}>⚡ {profile ? profile.xp : 0}</span>
      </p>
      <label htmlFor="level" className="sm">Түвшин (Level) </label>
      <select id="level" value={level} onChange={(e) => changeLevel(e.target.value)}>
        {LV.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>

      <section aria-labelledby="chat-h">
        <h2 id="chat-h" className="sr">AI багштай харилцах яриа</h2>
        <div role="log" aria-live="polite" aria-relevant="additions">
          {log.map((m, i) => (
            <article key={i} aria-label={m.role === 'user' ? 'Таны мессеж' : 'Багшийн хариу'} className={'card m' + (m.role === 'user' ? ' me' : '')}>
              {m.content}
              {m.role === 'assistant' && <div><button type="button" onClick={() => speak(m.content)} aria-label="Хариултыг чангаар унших (Read aloud)">🔊 Унших</button></div>}
            </article>
          ))}
          {busy && <p role="status" className="sm">Багш бичиж байна…</p>}
          <div ref={end} />
        </div>
      </section>

      <form className="card" onSubmit={(e) => { e.preventDefault(); send() }}>
        <label htmlFor="msg" className="sm">Англиар бичих эсвэл ярих (Type or speak English)</label>
        <textarea id="msg" rows={2} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="row">
          <button type="button" onClick={mic} aria-label="Микрофоноор ярих (Speak)">🎤</button>
          <button type="submit" className="go" disabled={busy || !profile}>Илгээх (Send)</button>
        </div>
        <p role="status" aria-live="polite" className="sm">{note}</p>
      </form>
    </main>
  )
}
