/* Blockchain Engineering in Healthcare — chapter engine.
   Reads window.CH (from chNN/content.js) and renders: Start, narrated 3D lessons with checks,
   scenarios and labs, a final test, the learning index and a certificate.
   Progress is stored in this browser only (localStorage key "bc:<chapter id>"). */
import { Stage } from './scenes.js';
import { LABS } from './labs.js';

const CH = window.CH;
const $ = s => document.querySelector(s);
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
}
const seg = (options, value, onChange, labelText) => {
  const w = h('div', { class: 'seg', role: 'group', 'aria-label': labelText || '' });
  const bs = options.map(([v, t]) => { const b = h('button', { type: 'button', 'aria-pressed': String(v === value) }, t); b.onclick = () => { bs.forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); onChange(v); }; return b; });
  w.append(...bs); return w;
};
const initials = s => (s.match(/\b[A-Z]/g) || ['?']).slice(0, 2).join('');

/* ---------------- learner state ---------------- */
const KEY = 'bc:' + CH.id;
const blank = () => ({ v: 1, starter: null, plan: { rate: 1, voice: '', sound: true, captions: true }, lessons: {}, test: null, name: '' });
let S;
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || 'null') || {}); } catch (e) { S = blank(); }
S.plan = Object.assign(blank().plan, S.plan || {});
function L(i) { return S.lessons[i] || (S.lessons[i] = { watched: false, check: null, retry: null, caseScore: 0, caseMax: 0, caseDone: false, lab: false, done: false }); }
function save() {
  const M = metrics();
  S.meta = { title: CH.title, num: CH.num, index: M.index, level: M.level, lessons: CH.lessons.length, done: Object.values(S.lessons).filter(l => l.done).length, test: !!S.test, updated: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { }
  renderChip(); renderMenu();
}

/* ---------------- learning index ----------------
   Knowledge 35%: first-try quick checks + final-test answers
   Application 35%: points earned in scenarios (each choice 0–2)
   Self-awareness 15%: how often confidence matched the result (sure & right, or unsure & wrong)
   Completion 15%: lessons completed + final test taken */
const LEVELS = [[0, 'Novice', 'Knows the words; needs support to apply them'], [40, 'Advanced beginner', 'Recognises the main ideas in familiar cases'], [60, 'Competent', 'Applies the ideas to new healthcare cases'], [80, 'Proficient', 'Judges blockchain designs and explains why to colleagues']];
function metrics() {
  const n = CH.lessons.length; let kOk = 0, kN = 0, aPts = 0, aMax = 0, cal = 0, calN = 0, done = 0;
  for (let i = 0; i < n; i++) {
    const l = S.lessons[i]; if (!l) continue;
    if (l.check) { kN++; if (l.check.ok) kOk++; if (l.check.conf) { calN++; if ((l.check.conf === 'sure') === l.check.ok) cal++; } }
    if (l.caseDone) { aPts += l.caseScore || 0; aMax += l.caseMax || 0; }
    if (l.done) done++;
  }
  if (S.test) S.test.answers.forEach(a => { kN++; if (a.ok) kOk++; if (a.conf) { calN++; if ((a.conf === 'sure') === a.ok) cal++; } });
  const K = kN ? kOk / kN : 0, A = aMax ? aPts / aMax : 0, C = calN ? cal / calN : null, P = (done + (S.test ? 1 : 0)) / (n + 1);
  const parts = [[K, .35], [A, .35], [P, .15]]; if (C != null) parts.push([C, .15]);
  const w = parts.reduce((x, p) => x + p[1], 0); const index = Math.round(100 * parts.reduce((x, p) => x + p[0] * p[1], 0) / w);
  const lv = LEVELS.filter(l => index >= l[0]).pop();
  return { K, A, C, P, index, level: lv[1], levelText: lv[2], done, n };
}

/* ---------------- voice ---------------- */
const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
let voice = null;
function englishVoices() { return synth ? synth.getVoices().filter(v => /^en/i.test(v.lang)).sort((a, b) => (b.lang === 'en-GB') - (a.lang === 'en-GB')) : []; }
function pickVoice() {
  const vs = englishVoices();
  voice = vs.find(v => v.name === S.plan.voice) || vs.find(v => v.lang === 'en-GB' && /female|libby|sonia|serena|kate|hazel|susan|martha/i.test(v.name)) || vs.find(v => v.lang === 'en-GB') || vs[0] || null;
}
if (synth) { pickVoice(); synth.addEventListener ? synth.addEventListener('voiceschanged', pickVoice) : (synth.onvoiceschanged = pickVoice); }
const words = t => t.split(/\s+/).filter(Boolean).length;
const estSecs = t => words(t) / (2.6 * (S.plan.rate || 1)) + 0.6;

/* ---------------- tutor (Maya) ---------------- */
const TUTOR = `<svg viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" fill="#123A36"/>
<path d="M18 205 C26 152 62 136 100 134 C138 136 174 152 182 205 Z" fill="#0F766E"/><path d="M84 136 L100 160 L116 136 Z" fill="#E7F5F3"/>
<rect x="88" y="110" width="24" height="30" rx="9" fill="#8D5A3B"/>
<g class="hd"><path d="M62 96 C56 48 86 34 104 36 C130 36 148 56 140 100 C150 120 146 150 132 160 L126 110 C122 76 112 66 100 66 C86 66 76 78 74 110 L68 160 C54 150 52 120 62 96Z" fill="#1E1410"/>
<ellipse cx="100" cy="90" rx="29" ry="35" fill="#A86B47"/>
<path d="M70 82 C74 58 92 52 104 54 C120 55 130 66 130 84 C122 70 110 66 100 66 C88 66 78 72 70 82Z" fill="#1E1410"/>
<path d="M82 79 Q89 75 96 79" fill="none" stroke="#1E1410" stroke-width="2.6" stroke-linecap="round"/><path d="M104 79 Q111 75 118 79" fill="none" stroke="#1E1410" stroke-width="2.6" stroke-linecap="round"/>
<g class="ey"><ellipse cx="89" cy="88" rx="3.3" ry="3.8" fill="#140D0A"/><ellipse cx="111" cy="88" rx="3.3" ry="3.8" fill="#140D0A"/></g>
<path d="M100 92 Q96 101 101 103" fill="none" stroke="#7E4B30" stroke-width="1.8" stroke-linecap="round"/>
<ellipse class="mo" cx="100" cy="113" rx="8" ry="1.4" fill="#6B2A22"/><path class="sm" d="M92 112 Q100 117 108 112" fill="none" stroke="#6B2A22" stroke-width="1.9" stroke-linecap="round"/>
<circle cx="72" cy="104" r="3" fill="#F5B041"/><circle cx="128" cy="104" r="3" fill="#F5B041"/></g></svg>`;
const T = { el: null, speaking: false, open: 0, nextBlink: 0, blinkT: 0 };
function tutorTick(now) {
  if (T.el && T.el.isConnected) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = T.speaking && !reduce ? 0.3 + 0.6 * Math.abs(Math.sin(now / 95)) * (0.6 + 0.4 * Math.sin(now / 410)) : 0;
    T.open += (target - T.open) * 0.35;
    const mo = T.el.querySelector('.mo'), sm = T.el.querySelector('.sm'), ey = T.el.querySelector('.ey'), hd = T.el.querySelector('.hd');
    mo.setAttribute('ry', (1.4 + T.open * 5).toFixed(2)); sm.style.opacity = T.open > 0.15 ? 0 : 1;
    if (now > T.nextBlink) { T.blinkT = now; T.nextBlink = now + 2600 + Math.random() * 3000; }
    const b = now - T.blinkT, sy = b < 140 ? Math.abs(1 - 2 * b / 140) : 1;
    ey.setAttribute('transform', `translate(0 ${88 * (1 - sy)}) scale(1 ${Math.max(0.1, sy)})`);
    hd.setAttribute('transform', T.speaking && !reduce ? `translate(0 ${(Math.sin(now / 600) * 1.2).toFixed(2)}) rotate(${(Math.sin(now / 1300) * 1.5).toFixed(2)} 100 120)` : '');
  }
  requestAnimationFrame(tutorTick);
}
requestAnimationFrame(tutorTick);

/* ---------------- narrated 3D player ---------------- */
let stage = null;
let player = null;
class Player {
  constructor(lesson, idx, onFinish) {
    this.lesson = lesson; this.idx = idx; this.onFinish = onFinish;
    this.seq = []; lesson.scenes.forEach((sc, si) => sc.say.forEach((t, bi) => this.seq.push({ si, bi, t })));
    this.pos = 0; this.playing = false; this.token = 0; this.curScene = -1;
    this.el = this.build();
  }
  build() {
    const canvas = h('canvas', { 'aria-hidden': 'true' });
    this.cap = h('div', { class: 'cap', 'aria-live': 'polite' });
    this.tag = h('div', { class: 'sceneTag' });
    const tutor = h('div', { class: 'tutor', html: TUTOR, title: 'Maya, your tutor' }); T.el = tutor;
    this.big = h('button', { class: 'bigplay', type: 'button', 'aria-label': 'Play lesson video', onclick: () => this.play() }, '▶');
    this.screen = h('div', { class: 'screen' }, canvas, this.tag, h('div', { class: 'hint' }, 'Drag to look around'), tutor, this.cap, this.big);
    this.playBtn = h('button', { type: 'button', 'aria-label': 'Play or pause', onclick: () => this.playing ? this.pause() : this.play() }, '▶ Play');
    this.prog = h('div', { class: 'prog', role: 'group', 'aria-label': 'Jump to a sentence' });
    this.time = h('span', { class: 'time' });
    const ccBtn = h('button', { type: 'button', 'aria-pressed': String(S.plan.captions), onclick: () => { S.plan.captions = !S.plan.captions; ccBtn.setAttribute('aria-pressed', String(S.plan.captions)); this.root.classList.toggle('nocap', !S.plan.captions); save(); } }, 'CC');
    const sndBtn = h('button', { type: 'button', 'aria-pressed': String(S.plan.sound), title: 'Voice on or off', onclick: () => { S.plan.sound = !S.plan.sound; sndBtn.setAttribute('aria-pressed', String(S.plan.sound)); sndBtn.textContent = S.plan.sound ? '🔊' : '🔇'; save(); if (this.playing) this.speak(); } }, S.plan.sound ? '🔊' : '🔇');
    const rate = h('select', { 'aria-label': 'Speed', onchange: e => { S.plan.rate = +e.target.value; save(); if (this.playing) this.speak(); } }, ...[0.8, 0.9, 1, 1.1, 1.25].map(r => h('option', { value: r, selected: r === S.plan.rate }, r + '×')));
    const fs = h('button', { type: 'button', 'aria-label': 'Full screen', onclick: () => { const p = this.root; if (document.fullscreenElement) document.exitFullscreen(); else p.requestFullscreen && p.requestFullscreen(); } }, '⛶');
    const prev = h('button', { type: 'button', 'aria-label': 'Previous sentence', onclick: () => this.go(this.pos - 1) }, '⏮');
    const next = h('button', { type: 'button', 'aria-label': 'Next sentence', onclick: () => this.go(this.pos + 1) }, '⏭');
    const restart = h('button', { type: 'button', 'aria-label': 'Restart', onclick: () => this.go(0, true) }, '↺');
    this.root = h('div', { class: 'player' + (S.plan.captions ? '' : ' nocap') }, this.screen, h('div', { class: 'controls' }, this.playBtn, prev, next, restart, this.prog, this.time, ccBtn, sndBtn, rate, fs));
    // progress ticks (gap between scenes)
    this.ticks = [];
    this.seq.forEach((s, i) => { if (i && s.si !== this.seq[i - 1].si) this.prog.append(h('i', { class: 'gap' })); const t = h('i', { title: `Sentence ${i + 1}`, onclick: () => this.go(i, true) }); this.prog.append(t); this.ticks.push(t); });
    // stage
    if (!stage || !stage.ok) { if (stage) stage.destroy(); stage = null; }
    if (stage) stage.destroy();
    stage = new Stage(canvas, { onError: () => { } });
    if (!stage.ok) this.screen.append(h('div', { class: 'fallback' }, h('div', null, h('b', null, '3D view unavailable on this device.'), h('p', { class: 'muted' }, 'The narration and captions still work.'))));
    requestAnimationFrame(() => { stage.resize && stage.resize(); this.show(0, true); });
    return this.root;
  }
  show(i, instant) {
    const s = this.seq[i]; if (!s) return;
    if (s.si !== this.curScene) { stage.ok && stage.load(this.lesson.scenes[s.si]); this.curScene = s.si; }
    stage.ok && stage.beat(s.bi, instant);
    this.cap.textContent = s.t;
    this.tag.textContent = `Scene ${s.si + 1} of ${this.lesson.scenes.length}`;
    this.ticks.forEach((t, k) => { t.className = k < i ? 'on' : k === i ? 'cur' : ''; });
    const remain = this.seq.slice(i).reduce((x, q) => x + estSecs(q.t), 0);
    this.time.textContent = `-${Math.floor(remain / 60)}:${String(Math.round(remain % 60)).padStart(2, '0')}`;
  }
  go(i, jump) {
    i = Math.max(0, Math.min(this.seq.length - 1, i));
    this.big.hidden = true;
    const back = i < this.pos || jump;
    this.pos = i; this.show(i, back && i !== 0 ? true : false);
    if (this.playing) this.speak();
  }
  play() {
    this.big.hidden = true; this.playing = true; this.playBtn.textContent = '❚❚ Pause';
    if (this.pos >= this.seq.length - 1 && this.finished) { this.pos = 0; this.finished = false; this.show(0, false); }
    this.speak();
  }
  pause() { this.playing = false; this.token++; this.playBtn.textContent = '▶ Play'; synth && synth.cancel(); T.speaking = false; clearTimeout(this.timer); }
  speak() {
    const my = ++this.token; clearTimeout(this.timer); synth && synth.cancel();
    const s = this.seq[this.pos]; if (!s) return;
    const done = () => { if (my !== this.token) return; T.speaking = false; this.timer = setTimeout(() => { if (my === this.token) this.advance(); }, 350); };
    if (S.plan.sound && synth && voice !== undefined) {
      const u = new SpeechSynthesisUtterance(s.t);
      if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-GB';
      u.rate = S.plan.rate || 1; u.pitch = 1.02;
      u.onstart = () => { if (my === this.token) T.speaking = true; };
      u.onend = done; u.onerror = done;
      synth.speak(u); T.speaking = true;
      // watchdog for browsers that never fire onend
      this.timer = setTimeout(() => { if (my === this.token) { synth.cancel(); done(); } }, (estSecs(s.t) * 2.2 + 3) * 1000);
    } else {
      T.speaking = true;
      this.timer = setTimeout(done, estSecs(s.t) * 1000);
    }
  }
  advance() {
    if (this.pos < this.seq.length - 1) { this.pos++; this.show(this.pos, false); this.speak(); }
    else { this.finished = true; this.pause(); this.big.hidden = false; this.big.textContent = '↺'; this.onFinish && this.onFinish(); }
  }
  destroy() { this.pause(); }
}

/* ---------------- navigation ---------------- */
let cur = 'start';
const views = () => ['start', ...CH.lessons.map((_, i) => 'l' + i), 'final', 'progress'];
function renderMenu() {
  const m = $('#menu'); if (!m) return; m.innerHTML = '';
  const add = (v, labelText, state) => m.append(h('button', { type: 'button', 'aria-current': String(cur === v), onclick: () => go(v) }, state !== undefined ? h('span', { class: 'dot' + (state === 'done' ? ' done' : state === 'part' ? ' part' : '') }) : null, labelText));
  add('start', 'Start', S.starter ? 'done' : '');
  CH.lessons.forEach((l, i) => { const st = S.lessons[i]; add('l' + i, `${i + 1}. ${l.title}`, st ? (st.done ? 'done' : (st.watched || st.check) ? 'part' : '') : ''); });
  add('final', 'Final test', S.test ? 'done' : '');
  add('progress', 'My progress');
  const c = m.querySelector('[aria-current="true"]'); if (c) c.scrollIntoView({ block: 'nearest', inline: 'center' });
}
function renderChip() { const M = metrics(); $('#idxVal').textContent = M.index; $('#idxLvl').textContent = M.level; }
function go(v, noScroll) {
  if (player) { player.destroy(); player = null; }
  synth && synth.cancel(); T.speaking = false;
  cur = v; try { history.replaceState(null, '', '#' + v); } catch (e) { }
  const main = $('#main'); main.innerHTML = '';
  if (v === 'start') viewStart(main);
  else if (v === 'final') viewFinal(main);
  else if (v === 'progress') viewProgress(main);
  else viewLesson(main, +v.slice(1));
  renderMenu(); if (!noScroll) window.scrollTo({ top: 0 });
  main.focus({ preventScroll: true });
}

/* ---------------- question widget ---------------- */
function question(q, { onAnswer, askConf = true, prefix = '' } = {}) {
  const box = h('div', { class: 'qbox' });
  let conf = null, answered = false;
  box.append(h('h3', null, prefix + q.q));
  let confRow = null;
  if (askConf) {
    confRow = h('div', { class: 'row', style: 'margin:4px 0 6px' }, h('span', { class: 'muted', style: 'font-size:.86rem' }, 'How sure are you?'), seg([['sure', 'Sure'], ['unsure', 'Not sure']], null, v => { conf = v; }, 'Confidence'));
    box.append(confRow);
  }
  const opts = h('div', { class: 'opts' });
  const bs = q.o.map((t, i) => h('button', { type: 'button', class: 'opt', onclick: () => pick(i) }, t));
  opts.append(...bs); box.append(opts);
  const fb = h('div'); box.append(fb);
  function pick(i) {
    if (answered) return; answered = true;
    const ok = i === q.a;
    bs.forEach((b, j) => { b.disabled = true; if (j === q.a) b.classList.add('right'); else if (j === i) b.classList.add('wrong'); });
    fb.replaceWith(h('div', { class: 'fb ' + (ok ? 'ok' : 'no'), role: 'status' }, h('b', null, ok ? 'Correct. ' : 'Not quite. '), q.e || ''));
    onAnswer && onAnswer({ ok, pick: i, conf });
  }
  return box;
}

/* ---------------- START ---------------- */
function viewStart(main) {
  const M = metrics();
  main.append(h('section', { class: 'stackv' },
    h('div', null, h('div', { class: 'eyebrow' }, `Chapter ${CH.num}`), h('h2', { style: 'font-size:2rem;margin-top:4px' }, CH.title), h('p', { class: 'lede' }, CH.summary))));
  main.append(h('div', { class: 'grid2' },
    h('div', { class: 'card' }, h('h3', null, 'By the end you can'), h('ul', { class: 'plain' }, CH.outcomes.map(o => h('li', null, o)))),
    h('div', { class: 'card stackv' }, h('h3', null, 'How this chapter works'),
      h('p', { class: 'muted' }, `${CH.lessons.length} short animated lessons, each about two minutes, narrated by Maya. After each one: a quick check, a healthcare scenario to decide, and sometimes a hands-on lab. A final test closes the chapter.`),
      h('div', { class: 'row' }, h('span', { class: 'pill acc' }, `About ${CH.lessons.reduce((x, l) => x + (l.minutes || 2) + 4, 10)} minutes in total`), h('span', { class: 'pill' }, `Your index: ${M.index}`)))));
  // settings
  const vs = englishVoices();
  const voiceSel = h('select', { 'aria-label': 'Narrator voice', onchange: e => { S.plan.voice = e.target.value; pickVoice(); save(); } }, h('option', { value: '' }, 'Automatic (British English if available)'), ...vs.map(v => h('option', { value: v.name, selected: v.name === S.plan.voice }, `${v.name} (${v.lang})`)));
  main.append(h('div', { class: 'card stackv' }, h('h3', null, 'Set up the narration'),
    h('div', { class: 'row' }, h('span', { style: 'min-width:120px' }, 'Voice'), synth ? voiceSel : h('span', { class: 'muted' }, 'This browser has no speech voice; captions will play on their own.')),
    h('div', { class: 'row' }, h('span', { style: 'min-width:120px' }, 'Speed'), seg([[0.8, 'Slower'], [1, 'Normal'], [1.25, 'Faster']], S.plan.rate, v => { S.plan.rate = v; save(); }, 'Speed')),
    h('div', { class: 'row' }, h('span', { style: 'min-width:120px' }, 'Voice on'), seg([[true, 'Yes'], [false, 'Captions only']], S.plan.sound, v => { S.plan.sound = v; save(); }, 'Sound')),
    synth ? h('div', null, h('button', { type: 'button', class: 'btn', onclick: () => { synth.cancel(); const u = new SpeechSynthesisUtterance(`Hello, I'm Maya. I'll be your tutor for Chapter ${CH.num}.`); if (voice) u.voice = voice; u.rate = S.plan.rate; synth.speak(u); } }, '🔊 Test the voice')) : null));
  // starter
  const st = h('div', { class: 'card stackv' }, h('h3', null, 'Three quick questions first'), h('p', { class: 'muted' }, 'This shows what you already know. It does not count towards your index.'));
  const ans = S.starter ? S.starter.slice() : [];
  CH.starter.forEach((q, i) => st.append(question({ ...q, e: '' }, { askConf: false, prefix: `${i + 1}. `, onAnswer: r => { ans[i] = r.ok; if (ans.filter(x => x !== undefined).length === CH.starter.length) { S.starter = ans; save(); res.textContent = `You got ${ans.filter(Boolean).length} of ${CH.starter.length}. ${ans.filter(Boolean).length === CH.starter.length ? 'A strong start: the lessons will deepen it.' : 'Good to know: the lessons cover each of these.'}`; } } })));
  const res = h('p', { class: 'muted', role: 'status' }, S.starter ? `Earlier you got ${S.starter.filter(Boolean).length} of ${CH.starter.length}.` : '');
  st.append(res);
  main.append(st);
  main.append(h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn primary', onclick: () => go(firstUnfinished()) }, Object.keys(S.lessons).length ? 'Continue where I left off ▶' : 'Begin lesson 1 ▶')));
}
function firstUnfinished() { for (let i = 0; i < CH.lessons.length; i++) if (!(S.lessons[i] && S.lessons[i].done)) return 'l' + i; return 'final'; }

/* ---------------- LESSON ---------------- */
function viewLesson(main, i) {
  const les = CH.lessons[i], st = L(i);
  main.append(h('div', { class: 'lessonHead' },
    h('div', null, h('div', { class: 'eyebrow' }, `Lesson ${i + 1} of ${CH.lessons.length} · about ${les.minutes || 2} min`), h('h2', null, les.title)),
    h('div', { class: 'row' }, st.done ? h('span', { class: 'pill good' }, 'Completed') : null, les.lab ? h('span', { class: 'pill acc' }, [].concat(les.lab).length > 1 ? 'Includes 2 labs' : 'Includes a lab') : null)));
  player = new Player(les, i, () => { st.watched = true; save(); });
  main.append(player.el);
  main.append(h('div', { class: 'grid2' },
    h('div', { class: 'card stackv' }, h('div', { class: 'keypoint' }, les.keyPoint), h('div', null, h('b', null, 'In plain words'), h('ul', { class: 'plain' }, les.plain.map(p => h('li', null, p))))),
    h('div', { class: 'card' }, h('details', { class: 'tx' }, h('summary', null, 'Read the transcript'), ...les.scenes.map((sc, k) => h('div', { class: 'scn' }, h('b', null, `Scene ${k + 1}`), ...sc.say.map(t => h('p', null, t))))))));
  // quick check
  const qc = h('div', { class: 'card stackv' }, h('div', { class: 'eyebrow' }, 'Quick check'));
  const after = h('div', { class: 'stackv' });
  const renderCheck = () => {
    qc.querySelectorAll('.qbox,.fb,.redo').forEach(x => x.remove());
    if (st.check) {
      qc.append(h('div', { class: 'fb ' + (st.check.ok || (st.retry && st.retry.ok) ? 'ok' : 'mid') }, st.check.ok ? 'You answered this correctly first time.' : st.retry && st.retry.ok ? 'You got it on the second try.' : 'Review the key point above, then try the scenario.'),
        h('button', { type: 'button', class: 'btn ghost redo', onclick: () => { qc.append(question(les.check, { askConf: false })); } }, 'Try the question again (practice)'));
      return;
    }
    qc.append(question(les.check, {
      onAnswer: r => {
        st.check = { ok: r.ok, conf: r.conf }; st.watched = true; save();
        if (!r.ok && les.check.retry) qc.append(h('div', { class: 'stackv', style: 'margin-top:12px' }, h('div', { class: 'eyebrow' }, 'Second chance'), question(les.check.retry, { askConf: false, onAnswer: r2 => { st.retry = { ok: r2.ok }; save(); } })));
        completeIfReady();
      }
    }));
  };
  renderCheck();
  main.append(qc);
  // scenario
  main.append(scenarioCard(les, st, () => completeIfReady()));
  // labs (one or more)
  [].concat(les.lab || []).filter(id => LABS[id]).forEach(id => {
    const lab = LABS[id];
    const body = h('div', { class: 'labBody' });
    const card = h('div', { class: 'card lab' }, h('div', { class: 'eyebrow' }, 'Hands-on lab'), h('h3', null, lab.title), h('p', { class: 'muted', style: 'margin-top:6px' }, lab.intro), body);
    try { lab.mount(body, () => { st.lab = true; save(); }); } catch (e) { body.append(h('p', { class: 'muted' }, 'This lab could not start in this browser.')); console.error(e); }
    main.append(card);
  });
  main.append(after);
  function completeIfReady() {
    if (!st.done && st.check && st.caseDone) { st.done = true; save(); }
    after.innerHTML = '';
    if (st.done) after.append(h('div', { class: 'done-banner' }, h('div', null, h('b', null, 'Lesson complete. '), h('span', { class: 'muted' }, `Your learning index is now ${metrics().index}.`)),
      h('button', { type: 'button', class: 'btn primary', onclick: () => go(i + 1 < CH.lessons.length ? 'l' + (i + 1) : 'final') }, i + 1 < CH.lessons.length ? `Next: ${CH.lessons[i + 1].title} ▶` : 'Go to the final test ▶')));
  }
  completeIfReady();
}

function scenarioCard(les, st, onDone) {
  const sc = les.scenario;
  const card = h('div', { class: 'card stackv scenario' }, h('div', { class: 'eyebrow' }, 'Scenario'), h('h3', null, sc.title));
  const who = (sc.setting.match(/\b(?:Dr |Mrs |Mr |Ms )?[A-Z][a-z]+ [A-Z][a-z]+/) || ['You'])[0];
  card.append(h('div', { class: 'who' }, h('div', { class: 'av', 'aria-hidden': 'true' }, initials(who)), h('div', { class: 'setting' }, sc.setting)));
  const dots = h('div', { class: 'stepdots', 'aria-hidden': 'true' }, sc.steps.map(() => h('i')));
  card.append(dots);
  const area = h('div', { class: 'stackv' }); card.append(area);
  let k = 0, pts = 0;
  const max = sc.steps.length * 2;
  const step = () => {
    [...dots.children].forEach((d, j) => d.classList.toggle('on', j <= k));
    const s = sc.steps[k];
    const box = h('div', { class: 'qbox' }, h('h3', null, `Step ${k + 1}: ${s.prompt}`));
    const opts = h('div', { class: 'opts' });
    const bs = s.choices.map((c, j) => h('button', { type: 'button', class: 'opt', onclick: () => choose(j) }, c.t));
    opts.append(...bs); box.append(opts); area.append(box);
    function choose(j) {
      bs.forEach((b, x) => { b.disabled = true; const sc2 = s.choices[x].s; if (x === j) b.classList.add(sc2 === 2 ? 'right' : sc2 === 1 ? 'part' : 'wrong'); else if (sc2 === 2) b.classList.add('right'); });
      const c = s.choices[j]; pts += c.s;
      box.append(h('div', { class: 'fb ' + (c.s === 2 ? 'ok' : c.s === 1 ? 'mid' : 'no'), role: 'status' }, h('b', null, c.s === 2 ? 'Good call. ' : c.s === 1 ? 'Partly right. ' : 'Risky choice. '), c.fb));
      k++;
      if (k < sc.steps.length) box.append(h('button', { type: 'button', class: 'btn', style: 'margin-top:10px', onclick: e => { e.target.remove(); step(); } }, 'Next step ▶'));
      else { if (!st.caseDone || pts > st.caseScore) { st.caseScore = pts; st.caseMax = max; } st.caseDone = true; save(); area.append(h('div', { class: 'fb ' + (pts === max ? 'ok' : 'mid') }, `Scenario score: ${pts} of ${max}.`), h('button', { type: 'button', class: 'btn ghost', onclick: () => { area.innerHTML = ''; k = 0; pts = 0; step(); } }, 'Replay the scenario')); onDone && onDone(); }
    }
  };
  if (st.caseDone) area.append(h('div', { class: 'fb ok' }, `You scored ${st.caseScore} of ${st.caseMax}.`), h('button', { type: 'button', class: 'btn ghost', onclick: () => { area.innerHTML = ''; k = 0; pts = 0; step(); } }, 'Replay the scenario'));
  else step();
  return card;
}

/* ---------------- FINAL TEST ---------------- */
function viewFinal(main) {
  main.append(h('div', null, h('div', { class: 'eyebrow' }, 'Final test'), h('h2', { style: 'font-size:1.8rem' }, `Chapter ${CH.num}: put it all together`), h('p', { class: 'lede' }, `${CH.test.length} scenario questions. Say how sure you are before you answer: being honest about uncertainty raises your index.`)));
  if (S.test) {
    const ok = S.test.answers.filter(a => a.ok).length;
    main.append(h('div', { class: 'card row', style: 'justify-content:space-between' }, h('div', null, h('b', null, `Last attempt: ${ok} of ${CH.test.length}`), h('p', { class: 'muted' }, 'You can take it again; your latest attempt counts.')), h('button', { type: 'button', class: 'btn', onclick: () => go('progress') }, 'See my progress')));
  }
  const answers = [];
  const list = h('div', { class: 'stackv' });
  CH.test.forEach((q, i) => list.append(h('div', { class: 'card' }, question(q, { prefix: `${i + 1}. `, onAnswer: r => { answers[i] = { ok: r.ok, conf: r.conf, lesson: q.lesson }; finish(); } }))));
  main.append(list);
  const out = h('div'); main.append(out);
  function finish() {
    if (answers.filter(Boolean).length < CH.test.length) return;
    S.test = { answers, at: Date.now() }; save();
    const ok = answers.filter(a => a.ok).length, weak = [...new Set(answers.filter(a => !a.ok).map(a => a.lesson))];
    out.append(h('div', { class: 'done-banner' }, h('div', null, h('b', null, `You scored ${ok} of ${CH.test.length}. `), h('span', null, weak.length ? 'Worth revisiting: ' + weak.map(w => `Lesson ${w + 1}`).join(', ') + '.' : 'Every lesson is secure.')), h('button', { type: 'button', class: 'btn primary', onclick: () => go('progress') }, 'See my index and certificate ▶')));
    out.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* ---------------- PROGRESS + CERTIFICATE ---------------- */
function viewProgress(main) {
  const M = metrics();
  const meter = (name, v, note) => h('div', { class: 'meter' }, h('span', null, name), h('div', { class: 'bar' }, h('i', { style: `width:${Math.round(100 * (v || 0))}%` })), h('span', { class: 'mono' }, v == null ? '—' : Math.round(100 * v)), note ? h('small', { class: 'muted', style: 'grid-column:1/-1;margin-top:-4px' }, note) : null);
  main.append(h('div', { class: 'card summary' }, h('div', null, h('div', { class: 'big' }, M.index), h('small', { class: 'muted' }, 'learning index')), h('div', null, h('b', null, M.level), h('p', { class: 'muted' }, M.levelText))));
  main.append(h('div', { class: 'card stackv' }, h('h3', null, 'What makes up your index'),
    meter('Knowledge', M.K, 'First-try quick checks and final-test answers (35%)'),
    meter('Applying it', M.A, 'Points earned in the scenarios (35%)'),
    meter('Self-awareness', M.C, 'How often your confidence matched your answer (15%)'),
    meter('Completion', M.P, 'Lessons completed and the final test taken (15%)')));
  main.append(h('div', { class: 'card stackv' }, h('h3', null, 'Lessons'), ...CH.lessons.map((l, i) => { const s = S.lessons[i] || {}; return h('div', { class: 'row', style: 'justify-content:space-between;border-top:1px solid var(--line);padding-top:8px' }, h('span', null, `${i + 1}. ${l.title}`), h('span', { class: 'row' }, s.done ? h('span', { class: 'pill good' }, 'Done') : h('span', { class: 'pill' }, 'Not finished'), s.caseDone ? h('span', { class: 'pill sig' }, `Scenario ${s.caseScore}/${s.caseMax}`) : null, h('button', { type: 'button', class: 'btn ghost', onclick: () => go('l' + i) }, 'Open'))); })));
  // certificate
  const allDone = CH.lessons.every((_, i) => S.lessons[i] && S.lessons[i].done) && S.test;
  const nameIn = h('input', { type: 'text', value: S.name || '', placeholder: 'Your name as it should appear', 'aria-label': 'Your name', style: 'max-width:340px;font:inherit;border:1px solid var(--line);border-radius:10px;padding:9px 12px;background:var(--surface);color:var(--ink)', oninput: e => { S.name = e.target.value; save(); nm.textContent = S.name || 'Your name'; } });
  const nm = h('div', { class: 'nm' }, S.name || 'Your name');
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const cert = h('div', { class: 'cert' }, h('div', { class: 'eyebrow' }, 'Certificate of completion'), h('h2', null, 'Blockchain Engineering in Healthcare'), h('p', { class: 'muted' }, 'This certifies that'), nm,
    h('p', { style: 'margin-top:10px' }, `completed Chapter ${CH.num}: ${CH.title}`), h('p', { class: 'muted' }, `Learning index ${M.index} · ${M.level} · ${date}`),
    h('p', { class: 'muted', style: 'font-size:.8rem;margin-top:12px' }, 'Self-paced online course by Prof Muthu Ramachandran, based on the Springer book Blockchain Engineering in Healthcare. Progress recorded in the learner\'s own browser.'));
  main.append(h('div', { class: 'card stackv' }, h('h3', null, 'Certificate'),
    allDone ? h('div', { class: 'stackv noprint' }, nameIn, h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn primary', onclick: () => window.print() }, 'Print or save as PDF'))) : h('p', { class: 'muted' }, 'Finish every lesson and take the final test to unlock your certificate.'),
    allDone ? cert : null));
  main.append(h('div', { class: 'row noprint' }, h('button', { type: 'button', class: 'btn ghost', onclick: () => { if (confirm('Clear all your progress for this chapter on this device?')) { localStorage.removeItem(KEY); S = blank(); save(); go('start'); } } }, 'Reset this chapter')));
}

/* ---------------- boot ---------------- */
document.title = `Ch ${CH.num}: ${CH.title} · Blockchain Engineering in Healthcare`;
$('#chNum').textContent = `Ch ${CH.num}`; $('#chTitle span').textContent = CH.title;
$('#idxChip').onclick = () => go('progress');
const start = (location.hash || '').slice(1);
renderChip();
go(views().includes(start) ? start : 'start', true);
document.addEventListener('keydown', e => {
  if (!player || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if (e.key === 'k' || (e.key === ' ' && document.activeElement === document.body)) { e.preventDefault(); player.playing ? player.pause() : player.play(); }
});
