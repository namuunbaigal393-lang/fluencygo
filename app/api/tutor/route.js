import { NextResponse } from 'next/server'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1']

function system(level) {
  const base =
    'You are FluencyGo, a kind bilingual tutor for Mongolian learners aiming for IELTS 7.0+. Learner level: ' + level + '. ' +
    'Explanations are in natural Mongolian Cyrillic; English examples stay in English. ' +
    'NEVER write IPA or phonetic spellings or imitate sounds with Mongolian letters; for pronunciation tell the learner to press the speaker button. ' +
    'Never invent facts. Be concise (under 120 words), no lectures. ' +
    'When the learner writes English with a mistake, reply in exactly this format:\n' +
    '✅ Зөв: <corrected English sentence>\n' +
    '💡 <1-2 short Mongolian sentences naming the specific mistake and why>\n' +
    '❓ <one natural English follow-up question> (<its Mongolian translation>)\n' +
    'If there is no mistake, praise in one short Mongolian line, then give the ❓ follow-up.'
  return level === 'A0'
    ? base + '\nThe learner knows NO English. Write mostly in friendly Mongolian. Teach ONE tiny step at a time (a greeting, a survival phrase, or a simple sentence pattern) with its Mongolian meaning, then ask them to type it. Do not use IELTS terms yet.'
    : base
}

const sb = (path, token, init = {}) =>
  fetch(SB_URL + path, { ...init, headers: { apikey: SB_KEY, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } })

async function callClaude(sys, messages) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 500, system: sys, messages }),
  })
  if (!r.ok) throw new Error('claude ' + r.status + ' ' + (await r.text()))
  const d = await r.json()
  return (d.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim()
}

async function callGemini(sys, messages) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: sys }] },
      contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 800 },
    }),
  })
  if (!r.ok) throw new Error('gemini ' + r.status + ' ' + (await r.text()))
  const d = await r.json()
  const text = ((d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || []).map((p) => p.text || '').join('').trim()
  if (!text) throw new Error('gemini empty reply')
  return text
}

export async function POST(req) {
  const provider = process.env.AI_PROVIDER || (process.env.ANTHROPIC_API_KEY ? 'claude' : process.env.GEMINI_API_KEY ? 'gemini' : '')
  if (!SB_URL || !SB_KEY || !provider) return NextResponse.json({ error: 'not_configured' }, { status: 500 })

  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const who = await sb('/auth/v1/user', token)
  if (!who.ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }) }
  const level = LEVELS.includes(body && body.level) ? body.level : 'A1'
  const msgs = Array.isArray(body && body.messages)
    ? body.messages.slice(-8).filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    : []
  while (msgs.length && msgs[0].role !== 'user') msgs.shift()
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  if (msgs.some((m) => m.content.length > 2000)) return NextResponse.json({ error: 'too_long' }, { status: 400 })

  const q = await sb('/rest/v1/rpc/use_ai_request', token, { method: 'POST', body: '{}' })
  if (!q.ok) return NextResponse.json({ error: 'upstream' }, { status: 502 })
  if ((await q.json()) !== true) return NextResponse.json({ error: 'daily_limit' }, { status: 429 })

  try {
    const reply = provider === 'gemini' ? await callGemini(system(level), msgs) : await callClaude(system(level), msgs)
    return NextResponse.json({ reply })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'upstream' }, { status: 502 })
  }
}
