/* Blockchain Engineering in Healthcare — 3D lesson scenes.
   A Stage owns one WebGL renderer. Each scene builder draws a small animated 3D world and reacts to
   "beats" (one beat per narrated sentence). Builders: title, chain, network, cards, stack, flow, hash,
   keys, powpos, contract, vault, merkle, chart, compare, scale. */
import * as THREE from './vendor/three.module.min.js';

export const COLORS = {
  teal: 0x2dd4bf, blue: 0x60a5fa, amber: 0xf5b041, red: 0xf87171,
  green: 0x4ade80, violet: 0xc084fc, slate: 0x94a3b8, white: 0xe8f1f2
};
const col = c => (c == null ? COLORS.teal : typeof c === 'number' ? c : (COLORS[c] ?? COLORS.teal));
const css = c => '#' + new THREE.Color(col(c)).getHexString();
const FONT = '"Public Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';

/* ---------- easing + tweens ---------- */
const ease = {
  out: t => 1 - Math.pow(1 - t, 3),
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  lin: t => t
};

/* ---------- small deterministic fingerprint for display ---------- */
export function shortHash(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(16).padStart(8, '0').slice(0, 6);
}
export async function sha256Hex(text) {
  if (!(window.crypto && crypto.subtle)) return shortHash(text).repeat(11).slice(0, 64);
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ---------- canvas text textures ---------- */
function wrap(ctx, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const w of para.split(/\s+/)) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    out.push(line);
  }
  return out;
}
/* Draws a text panel; returns {canvas, aspect}. */
function textCanvas({ title = '', body = '', color = 0x2dd4bf, bg = true, align = 'center', mono = false, width = 512, titleSize = 44, bodySize = 30, fg = '#EAF4F5', dim = '#A9C0C4' }) {
  const S = 2, cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  const pad = 26, maxW = width - pad * 2;
  ctx.font = `700 ${titleSize}px ${mono ? MONO : FONT}`;
  const tl = title ? wrap(ctx, title, maxW) : [];
  ctx.font = `400 ${bodySize}px ${mono ? MONO : FONT}`;
  const bl = body ? wrap(ctx, body, maxW) : [];
  const h = pad * 2 + tl.length * titleSize * 1.18 + (tl.length && bl.length ? 10 : 0) + bl.length * bodySize * 1.3;
  cv.width = width * S; cv.height = Math.max(40, h) * S; ctx.scale(S, S);
  if (bg) {
    const r = 22, w = width, hh = h;
    ctx.fillStyle = 'rgba(11,24,34,0.88)';
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(2, 2, w - 4, hh - 4, r) : ctx.rect(2, 2, w - 4, hh - 4); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = css(color); ctx.stroke();
  }
  ctx.textAlign = align; ctx.textBaseline = 'top';
  const x = align === 'center' ? width / 2 : pad;
  let y = pad;
  ctx.fillStyle = fg; ctx.font = `700 ${titleSize}px ${mono ? MONO : FONT}`;
  for (const l of tl) { ctx.fillText(l, x, y); y += titleSize * 1.18; }
  if (tl.length && bl.length) y += 10;
  ctx.fillStyle = dim; ctx.font = `400 ${bodySize}px ${mono ? MONO : FONT}`;
  for (const l of bl) { ctx.fillText(l, x, y); y += bodySize * 1.3; }
  return { canvas: cv, aspect: cv.width / cv.height };
}
function texFrom(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.minFilter = THREE.LinearFilter;
  return t;
}
/* A camera-facing label. `h` = world height. */
export function label(text, o = {}) {
  const { canvas, aspect } = textCanvas({ title: text, body: o.body || '', color: o.color, bg: o.bg !== false, mono: o.mono, width: o.width || 512, titleSize: o.titleSize || 44, bodySize: o.bodySize || 30, fg: o.fg, dim: o.dim });
  const mat = new THREE.SpriteMaterial({ map: texFrom(canvas), transparent: true, depthWrite: false, depthTest: o.depthTest ?? true });
  const s = new THREE.Sprite(mat);
  const h = (o.h || 0.5) * (o.exact ? 1 : 1.3); s.scale.set(h * aspect, h, 1); s.userData.baseScale = s.scale.clone();
  s.renderOrder = o.renderOrder ?? 2;
  return s;
}
/* A flat panel (not camera-facing) with text, e.g. the face of a tile. */
function panel(title, body, o = {}) {
  const { canvas, aspect } = textCanvas({ title, body, color: o.color, bg: o.bg ?? false, width: o.width || 512, titleSize: o.titleSize || 46, bodySize: o.bodySize || 32, mono: o.mono, align: o.align || 'center' });
  const w = o.w || 2, h = w / aspect;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texFrom(canvas), transparent: true, depthWrite: false }));
  m.renderOrder = 3; m.userData.h = h;
  return m;
}

/* ---------- geometry helpers ---------- */
function mat(c, o = {}) {
  return new THREE.MeshStandardMaterial({ color: col(c), emissive: col(c), emissiveIntensity: o.glow ?? 0.18, metalness: o.metal ?? 0.25, roughness: o.rough ?? 0.42, transparent: o.opacity != null, opacity: o.opacity ?? 1 });
}
function boxWithEdges(w, h, d, c, o = {}) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, o));
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: col(c), transparent: true, opacity: 0.9 }));
  e.scale.setScalar(1.002);
  g.add(m, e); g.userData.mesh = m; g.userData.edges = e; g.userData.color = col(c);
  return g;
}
function recolor(g, c, glow) {
  const C = col(c);
  g.traverse(o => {
    if (o.isMesh && o.material && o.material.emissive && !o.userData.keepColor) { o.material.color.setHex(C); o.material.emissive.setHex(C); if (glow != null) o.material.emissiveIntensity = glow; }
    if (o.isLineSegments) o.material.color.setHex(C);
  });
}
function tile(t, d, c, o = {}) {
  const w = o.w || 2.3;
  const face = panel(t, d || '', { w: w - 0.16, color: c, titleSize: o.titleSize || 48, bodySize: o.bodySize || 34 });
  const h = Math.max(o.minH || 0.95, face.userData.h + 0.2);
  const g = boxWithEdges(w, h, 0.16, c, { opacity: 0.32, glow: 0.35 });
  face.position.z = 0.09; g.add(face);
  g.userData.w = w; g.userData.h = h;
  return g;
}
function tube(a, b, c, r = 0.035, o = {}) {
  const curve = o.curve || new THREE.LineCurve3(a, b);
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, o.seg || 24, r, 8, false), mat(c, { glow: 0.5, opacity: o.opacity ?? 0.85 }));
  m.userData.curve = curve;
  return m;
}
function arrow(a, b, c, o = {}) {
  const g = new THREE.Group();
  const dir = b.clone().sub(a), len = dir.length(), u = dir.clone().normalize();
  const end = b.clone().sub(u.clone().multiplyScalar(o.head ?? 0.22));
  g.add(tube(a, end, c, o.r || 0.035, o));
  const cone = new THREE.Mesh(new THREE.ConeGeometry(o.headR || 0.11, o.head ?? 0.22, 14), mat(c, { glow: 0.6 }));
  cone.position.copy(end).add(u.clone().multiplyScalar((o.head ?? 0.22) / 2));
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), u);
  g.add(cone); g.userData.len = len;
  return g;
}
function glowBall(c, r = 0.12) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), new THREE.MeshBasicMaterial({ color: col(c) }));
  const halo = new THREE.Mesh(new THREE.SphereGeometry(r * 2.1, 16, 12), new THREE.MeshBasicMaterial({ color: col(c), transparent: true, opacity: 0.22, depthWrite: false }));
  m.add(halo); return m;
}
function keyMesh(c) {
  const g = new THREE.Group(), m = mat(c, { metal: 0.7, rough: 0.25, glow: 0.35 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.06, 10, 24), m);
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.08), m); shaft.position.x = 0.48;
  const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.08), m); t1.position.set(0.68, -0.1, 0);
  const t2 = t1.clone(); t2.position.x = 0.56;
  g.add(ring, shaft, t1, t2); return g;
}
function tick(c = 'green') {
  const g = new THREE.Group(), m = mat(c, { glow: 0.8 });
  const a = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.12), m); a.position.set(-0.16, -0.05, 0); a.rotation.z = Math.PI / 4;
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.8, 0.12), m); b.position.set(0.14, 0.1, 0); b.rotation.z = -Math.PI / 5.5;
  g.add(a, b); return g;
}
function cross(c = 'red') {
  const g = new THREE.Group(), m = mat(c, { glow: 0.8 });
  const a = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.8, 0.12), m); a.rotation.z = Math.PI / 4;
  const b = a.clone(); b.rotation.z = -Math.PI / 4; g.add(a, b); return g;
}
function coin(c = 'amber') {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24), mat(c, { metal: 0.8, rough: 0.25, glow: 0.3 }));
  m.rotation.x = Math.PI / 2; return m;
}

/* =================================================================== */
export class Stage {
  constructor(canvas, { onError } = {}) {
    this.canvas = canvas;
    this.ok = true;
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: false });
    } catch (e) { this.ok = false; onError && onError(e); return; }
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1520);
    this.scene.fog = new THREE.Fog(0x0a1520, 18, 42);
    this.camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 100);
    this.camera.position.set(0, 1.2, 12);
    this.scene.add(new THREE.HemisphereLight(0xcfeeee, 0x10202a, 1.15));
    const d = new THREE.DirectionalLight(0xffffff, 1.4); d.position.set(4, 8, 6); this.scene.add(d);
    const r = new THREE.PointLight(0x2dd4bf, 18, 30); r.position.set(-6, 3, 4); this.scene.add(r);
    this.floor = this.makeFloor(); this.scene.add(this.floor);
    this.stars = this.makeDust(); this.scene.add(this.stars);
    this.world = new THREE.Group(); this.scene.add(this.world);
    this.tweens = []; this.updaters = []; this.timers = [];
    this.instant = false; this.beatNo = -1; this.builder = null;
    this.look = { y: 0, x: 0, ty: 0, tx: 0, drag: false };
    this.camTarget = new THREE.Vector3(0, 0, 0); this.camPos = new THREE.Vector3(0, 1.2, 12);
    this.camGoal = this.camPos.clone(); this.lookGoal = this.camTarget.clone();
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.clock = new THREE.Clock(); this.running = true; this.visible = true;
    this.bindPointer(); this.resize();
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(canvas.parentElement || canvas);
    this.time = 0;
    this.io = new IntersectionObserver(es => { this.visible = es[es.length - 1].isIntersecting; }, { threshold: 0.01 });
    const watch = () => { if (canvas.isConnected) this.io.observe(canvas); else requestAnimationFrame(watch); }; watch();
    this.loop = this.loop.bind(this); requestAnimationFrame(this.loop);
  }
  makeFloor() {
    const g = new THREE.GridHelper(60, 60, 0x1d3a44, 0x13262f);
    g.position.y = -3.2; g.material.transparent = true; g.material.opacity = 0.55; return g;
  }
  makeDust() {
    const n = 260, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 40; pos[i * 3 + 1] = Math.random() * 14 - 3; pos[i * 3 + 2] = -Math.random() * 26 - 2; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x5eead4, size: 0.05, transparent: true, opacity: 0.55 }));
  }
  bindPointer() {
    const c = this.canvas; let px = 0, py = 0;
    c.addEventListener('pointerdown', e => { this.look.drag = true; px = e.clientX; py = e.clientY; c.setPointerCapture(e.pointerId); });
    c.addEventListener('pointermove', e => {
      if (!this.look.drag) return;
      this.look.ty = Math.max(-0.9, Math.min(0.9, this.look.ty + (e.clientX - px) * 0.006));
      this.look.tx = Math.max(-0.35, Math.min(0.45, this.look.tx + (e.clientY - py) * 0.004));
      px = e.clientX; py = e.clientY;
    });
    const up = () => { this.look.drag = false; this.lastDrag = performance.now(); };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  }
  resize() {
    const p = this.canvas.parentElement; if (!p) return;
    const w = p.clientWidth, h = p.clientHeight || w * 9 / 16;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    if (this.fitBox) this.fit(this.fitBox.w, this.fitBox.h, this.fitBox.y, true);
  }
  /* frame a content box of width w and height h (world units) centred at y */
  fit(w, h, y = 0, now = false) {
    this.fitBox = { w, h, y };
    const vf = THREE.MathUtils.degToRad(this.camera.fov);
    const distH = (h / 2) / Math.tan(vf / 2);
    const distW = (w / 2) / (Math.tan(vf / 2) * this.camera.aspect);
    const dist = Math.max(distH, distW) * 1.12 + 1.2;
    this.camGoal.set(0, y + dist * 0.12, dist); this.lookGoal.set(0, y, 0);
    if (now || this.instant) { this.camPos.copy(this.camGoal); this.camTarget.copy(this.lookGoal); }
  }
  focusOn(v, zoom = 0.82) {
    const base = this.fitBox ? this.fitBox : { w: 10, h: 6, y: 0 };
    this.fit(base.w * zoom, base.h * zoom, base.y);
    this.lookGoal.set(v.x * 0.6, v.y * 0.6 + base.y * 0.4, 0); this.camGoal.x = v.x * 0.5;
    this.fitBox = base;
  }
  tween(obj, to, dur = 0.6, e = 'out', delay = 0, onDone) {
    const t = { obj, to, dur, e: ease[e] || ease.out, delay, t: 0, from: null, onDone };
    if (this.instant || this.reduceTiny) { for (const k in to) obj[k] = to[k]; onDone && onDone(); return; }
    this.tweens.push(t);
  }
  pop(o, delay = 0, s = 1) { o.visible = true; const target = o.userData.baseScale ? o.userData.baseScale.clone().multiplyScalar(s) : new THREE.Vector3(s, s, s); o.scale.setScalar(0.001); this.tween(o.scale, { x: target.x, y: target.y, z: target.z }, 0.55, 'back', delay); }
  hide(o, delay = 0) { this.tween(o.scale, { x: 0.001, y: 0.001, z: 0.001 }, 0.35, 'out', delay, () => { o.visible = false; }); }
  later(fn, sec) { if (this.instant) { fn(); return; } this.timers.push({ fn, at: this.time + sec }); }
  every(fn) { this.updaters.push(fn); }
  clear() {
    this.tweens = []; this.updaters = []; this.timers = [];
    const dispose = o => { o.traverse(x => { x.geometry && x.geometry.dispose(); if (x.material) { (Array.isArray(x.material) ? x.material : [x.material]).forEach(m => { m.map && m.map.dispose(); m.dispose(); }); } }); };
    for (const c of [...this.world.children]) { this.world.remove(c); dispose(c); }
    this.world.rotation.set(0, 0, 0); this.look.ty = 0; this.look.tx = 0;
  }
  /* load a scene definition {scene, opts, say} */
  load(def) {
    if (!this.ok) return;
    this.clear(); this.def = def; this.beatNo = -1;
    const B = BUILDERS[def.scene] || BUILDERS.cards;
    try { this.builder = B(this, def.opts || {}, def); }
    catch (e) { console.error('scene build failed', def.scene, e); this.builder = BUILDERS.cards(this, { title: def.scene, items: [] }, def); }
  }
  /* advance to beat n (replays missing beats; instant when jumping) */
  beat(n, instant = false) {
    if (!this.ok || !this.builder) return;
    if (n < this.beatNo) { this.load(this.def); }
    const was = this.instant; this.instant = instant;
    for (let b = this.beatNo + 1; b <= n; b++) {
      const jump = instant || b < n;
      this.instant = jump; try { this.builder.beat(b); } catch (e) { console.error(e); }
    }
    this.instant = was; this.beatNo = Math.max(this.beatNo, n);
  }
  loop() {
    if (!this.ok || this.destroyed) return;
    requestAnimationFrame(this.loop);
    if (!this.visible || document.hidden || !this.canvas.isConnected) { this.clock.getDelta(); return; }
    const dt = Math.min(0.05, this.clock.getDelta()); this.time += dt;
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const t = this.tweens[i];
      if (t.delay > 0) { t.delay -= dt; continue; }
      if (!t.from) { t.from = {}; for (const k in t.to) t.from[k] = t.obj[k]; }
      t.t += dt / t.dur; const k = t.t >= 1 ? 1 : t.e(t.t);
      for (const p in t.to) t.obj[p] = t.from[p] + (t.to[p] - t.from[p]) * k;
      if (t.t >= 1) { this.tweens.splice(i, 1); t.onDone && t.onDone(); }
    }
    for (let i = this.timers.length - 1; i >= 0; i--) if (this.time >= this.timers[i].at) { const f = this.timers[i].fn; this.timers.splice(i, 1); f(); }
    for (const u of this.updaters) u(dt, this.time);
    // gentle sway + drag
    const idle = !this.look.drag && (!this.lastDrag || performance.now() - this.lastDrag > 2500);
    if (idle) { this.look.ty *= 0.985; this.look.tx *= 0.985; }
    const sway = this.reduce ? 0 : Math.sin(this.time * 0.25) * 0.06;
    this.look.y += (this.look.ty + sway - this.look.y) * 0.08; this.look.x += (this.look.tx - this.look.x) * 0.08;
    this.world.rotation.y = this.look.y; this.world.rotation.x = this.look.x;
    this.camPos.lerp(this.camGoal, 0.06); this.camTarget.lerp(this.lookGoal, 0.06);
    this.camera.position.copy(this.camPos); this.camera.lookAt(this.camTarget);
    this.stars.rotation.y += dt * 0.01;
    this.renderer.render(this.scene, this.camera);
  }
  destroy() { this.destroyed = true; this.clear(); this.ro && this.ro.disconnect(); this.io && this.io.disconnect(); this.renderer && (this.renderer.dispose(), this.renderer.forceContextLoss()); }
}

/* helper: parse `at` map into {beat: [actions]} */
function atMap(opts) { const m = {}; for (const [k, v] of Object.entries(opts.at || {})) (m[+k] = m[+k] || []).push(...String(v).split(/\s*,\s*/)); return m; }

/* =================================================================== */
const BUILDERS = {

  /* ---------- title card ---------- */
  title(S, o) {
    const ring = new THREE.Group(); S.world.add(ring);
    const N = 10;
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2, b = boxWithEdges(0.7, 0.7, 0.7, i % 3 === 0 ? 'amber' : 'teal', { opacity: 0.55, glow: 0.4 });
      b.position.set(Math.cos(a) * 4.6, Math.sin(a * 2) * 0.25 - 1.7, Math.sin(a) * 4.6 - 2.5); ring.add(b);
      const a2 = (i + 0.5) / N * Math.PI * 2;
      const l = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 20), mat('slate', { glow: 0.4 }));
      l.position.set(Math.cos(a2) * 4.6, -1.7, Math.sin(a2) * 4.6 - 2.5); l.rotation.y = -a2; ring.add(l);
    }
    S.every(dt => { ring.rotation.y += dt * 0.18; ring.children.forEach((c, i) => { if (c.userData.mesh) c.rotation.x += dt * 0.4; }); });
    const k = label(o.kicker || '', { h: 0.42, bg: false, fg: '#F5B041', titleSize: 34, exact: true, depthTest: false, renderOrder: 10 }); k.position.set(0, 1.55, 1);
    const t = label(o.title || '', { h: 1.25, bg: false, width: 900, titleSize: 64, exact: true, depthTest: false, renderOrder: 10 }); t.position.set(0, 0.55, 1);
    const s = label(o.subtitle || '', { h: 0.55, bg: false, width: 980, titleSize: 30, fg: '#A9C0C4', exact: true, depthTest: false, renderOrder: 10 }); s.position.set(0, -0.55, 1);
    [k, t, s].forEach(x => { if (x.userData.baseScale.x > 9) x.userData.baseScale.multiplyScalar(9 / x.userData.baseScale.x); S.world.add(x); x.visible = false; });
    S.fit(10, 6, 0.2, true);
    return { beat(n) { if (n === 0) { S.pop(k, 0); S.pop(t, 0.15); S.pop(s, 0.35); } } };
  },

  /* ---------- chain of blocks ---------- */
  chain(S, o) {
    const n = Math.max(2, Math.min(6, o.n || 4)), gap = 2.35, size = 1.35, x0 = -(n - 1) * gap / 2;
    const blocks = [], links = [], hashes = [];
    const names = i => (o.labels && o.labels[i]) || (o.genesis && i === 0 ? 'Genesis block' : `Block ${i + 1}`);
    for (let i = 0; i < n; i++) hashes.push(shortHash(names(i) + i));
    for (let i = 0; i < n; i++) {
      const g = boxWithEdges(size, size, size, o.genesis && i === 0 ? 'amber' : 'teal', { opacity: 0.5, glow: 0.3 });
      g.position.set(x0 + i * gap, 0, 0);
      const nm = label(names(i), { h: 0.36, width: 400, titleSize: 46, color: o.genesis && i === 0 ? 'amber' : 'teal' }); nm.position.set(0, size / 2 + 0.45, 0); g.add(nm);
      const face = panel('#' + hashes[i], i ? 'prev #' + hashes[i - 1] : 'prev —', { w: size * 0.92, mono: true, titleSize: 54, bodySize: 40 });
      face.position.z = size / 2 + 0.01; g.add(face); g.userData.face = face;
      g.visible = false; S.world.add(g); blocks.push(g);
      g.userData.spin = (Math.random() - .5) * 0.2;
    }
    for (let i = 0; i < n - 1; i++) {
      const L = new THREE.Group();
      for (let j = 0; j < 3; j++) {
        const t = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.05, 8, 20), mat('slate', { metal: 0.7, glow: 0.25 }));
        t.position.x = -0.33 + j * 0.33; t.rotation.y = j % 2 ? Math.PI / 2 : 0; t.scale.x = 1.5; L.add(t);
      }
      L.position.set(x0 + i * gap + gap / 2, 0, 0); L.visible = false; S.world.add(L); links.push(L);
    }
    let header = null;
    S.every((dt, t) => blocks.forEach((b, i) => { b.position.y = Math.sin(t * 1.2 + i) * 0.06; }));
    S.fit(n * gap + 0.5, 4.2, 0.2, true);
    const A = atMap(o);
    const act = a => {
      const [k, v] = a.split(':'); const i = +v;
      if (k === 'tamper' && blocks[i]) {
        recolor(blocks[i], 'red', 0.5);
        S.tween(blocks[i].rotation, { z: 0.12 }, 0.12, 'out', 0, () => S.tween(blocks[i].rotation, { z: 0 }, 0.5, 'back'));
        blocks[i].userData.face.material.opacity = 0.35;
        for (let j = i; j < links.length; j++) { recolor(links[j], 'red', 0.6); S.tween(links[j].position, { y: -0.35 }, 0.6, 'out', 0.2 + (j - i) * 0.15); }
        for (let j = i + 1; j < n; j++) S.later(() => recolor(blocks[j], 'red', 0.25), 0.3 + (j - i) * 0.25);
        const warn = label('Hash no longer matches', { h: 0.42, color: 'red' }); warn.position.set(blocks[i].position.x, -1.45, 0.5); S.world.add(warn); S.pop(warn, 0.3);
        blocks[i].userData.warn = warn;
      }
      if (k === 'heal') {
        blocks.forEach((b, j) => { recolor(b, o.genesis && j === 0 ? 'amber' : 'teal', 0.3); b.userData.face.material.opacity = 1; if (b.userData.warn) S.hide(b.userData.warn); });
        links.forEach(l => { recolor(l, 'slate', 0.25); S.tween(l.position, { y: 0 }, 0.5); });
      }
      if (k === 'focus' && blocks[i]) { blocks.forEach((b, j) => S.tween(b.scale, { x: j === i ? 1.15 : 0.92, y: j === i ? 1.15 : 0.92, z: j === i ? 1.15 : 0.92 }, 0.5)); S.focusOn(blocks[i].position, 0.8); }
      if (k === 'add') {
        const g = boxWithEdges(size, size, size, 'green', { opacity: 0.5, glow: 0.4 });
        const x = x0 + n * gap; g.position.set(x + 4, 0, 0); S.world.add(g);
        const nm = label('New block', { h: 0.42, color: 'green' }); nm.position.set(0, size / 2 + 0.45, 0); g.add(nm);
        S.tween(g.position, { x }, 1.0, 'out');
        const L = links[0] ? links[0].clone() : null; if (L) { L.position.x = x - gap / 2; S.world.add(L); S.pop(L, 0.8); }
        S.fit((n + 1) * gap + 0.5, 4.2, 0.2); S.world.position.x = -gap / 2;
      }
      if (k === 'header' && !header) {
        const target = blocks[Math.min(1, n - 1)];
        header = new THREE.Group();
        const f = [['Previous hash', '#' + hashes[Math.max(0, Math.min(1, n - 1) - 1)], 'blue'], ['Block hash', '#' + hashes[Math.min(1, n - 1)], 'teal'], ['Nonce', '48213', 'amber'], ['Merkle root', 'summary of all transactions', 'violet']];
        f.forEach(([t, d, c], j) => { const tl = tile(t, d, c, { w: 2.2, minH: 0.8, titleSize: 46, bodySize: 36 }); tl.position.set((j - 1.5) * 2.45, 0, 0); header.add(tl); tl.visible = false; S.later(() => S.pop(tl), 0.2 + j * 0.25); });
        const hl = label(`Inside ${names(Math.min(1, n - 1))}`, { h: 0.34, color: 'amber' }); hl.position.set(0, 0.85, 0); header.add(hl);
        header.position.set(0, -2.35, 0.6); S.world.add(header);
        recolor(target, 'amber', 0.4); S.fit(Math.max(n * gap + 0.5, 10.4), 6.6, -0.6);
      }
    };
    return {
      beat(b) {
        if (b === 0) { blocks.forEach((g, i) => S.pop(g, i * 0.3)); links.forEach((l, i) => S.pop(l, 0.2 + i * 0.3)); }
        (A[b] || []).forEach(act);
      }
    };
  },

  /* ---------- peer-to-peer network ---------- */
  network(S, o) {
    const n = Math.max(6, Math.min(22, o.n || 12)), R = 3.1, nodes = [], edges = [];
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i;
      const p = new THREE.Vector3(Math.cos(th) * r * R, y * R * 0.75, Math.sin(th) * r * R);
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 1), mat('teal', { glow: 0.55 }));
      m.position.copy(p); m.visible = false; S.world.add(m); nodes.push(m);
    }
    const lineMat = c => new THREE.LineBasicMaterial({ color: col(c), transparent: true, opacity: 0.55 });
    const pairs = new Set();
    nodes.forEach((a, i) => {
      nodes.map((b, j) => [j, a.position.distanceTo(b.position)]).filter(x => x[0] !== i).sort((x, y) => x[1] - y[1]).slice(0, 3)
        .forEach(([j]) => { const key = i < j ? i + '-' + j : j + '-' + i; if (!pairs.has(key)) { pairs.add(key); const g = new THREE.BufferGeometry().setFromPoints([a.position, nodes[j].position]); const l = new THREE.Line(g, lineMat('slate')); l.visible = false; l.userData.ij = [i, j]; S.world.add(l); edges.push(l); } });
    });
    const hub = boxWithEdges(1.0, 1.4, 1.0, 'amber', { opacity: 0.6, glow: 0.45 }); hub.visible = false; S.world.add(hub);
    const hubL = label('Central server', { h: 0.4, color: 'amber' }); hubL.position.y = 1.15; hub.add(hubL);
    const spokes = nodes.map(nd => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), nd.position]), lineMat('amber')); l.visible = false; S.world.add(l); return l; });
    const packets = []; const extras = [];
    let mode = 'mesh', captions = null;
    const caption = (t, c) => { if (captions) S.hide(captions); captions = label(t, { h: 0.42, color: c, width: 900 }); captions.position.set(0, 3.35, 1.5); S.world.add(captions); S.pop(captions); };
    const setMode = m => {
      mode = m;
      if (m === 'hub') { S.pop(hub); spokes.forEach((s, i) => { s.visible = true; }); edges.forEach(e => e.visible = false); }
      else { if (hub.visible) S.hide(hub); spokes.forEach(s => s.visible = false); edges.forEach(e => e.visible = true); }
    };
    const sendPacket = (i, j, c = 'blue', speed = 1.6) => {
      const b = glowBall(c, 0.08); S.world.add(b);
      const a = mode === 'hub' ? new THREE.Vector3() : nodes[i].position, z = nodes[j].position;
      const from = mode === 'hub' ? nodes[i].position : a;
      b.userData = { a: from.clone(), b: (mode === 'hub' ? new THREE.Vector3() : z).clone(), t: 0, speed };
      packets.push(b);
    };
    let packetRate = 0, acc = 0, ddosTarget = -1;
    S.every((dt, t) => {
      S.world.children.forEach(c => { if (c.geometry && c.geometry.type === 'IcosahedronGeometry') c.rotation.y += dt * 0.6; });
      acc += dt;
      if (packetRate && acc > packetRate) { acc = 0; const i = Math.floor(Math.random() * n); let j = Math.floor(Math.random() * n); if (j === i) j = (j + 1) % n; sendPacket(i, j, 'blue'); }
      if (ddosTarget >= 0 && Math.random() < 0.6) { const b = glowBall('red', 0.06); const from = new THREE.Vector3((Math.random() - .5) * 12, (Math.random() - .5) * 7, -4 + Math.random() * 3); b.userData = { a: from, b: nodes[ddosTarget].position.clone(), t: 0, speed: 1.4 }; S.world.add(b); packets.push(b); }
      for (let k = packets.length - 1; k >= 0; k--) { const p = packets[k]; p.userData.t += dt * p.userData.speed; p.position.lerpVectors(p.userData.a, p.userData.b, Math.min(1, p.userData.t)); if (p.userData.t >= 1) { S.world.remove(p); packets.splice(k, 1); } }
      if (ddosTarget >= 0) nodes[ddosTarget].scale.setScalar(1 + Math.abs(Math.sin(t * 14)) * 0.35);
      extras.forEach(e => { e.rotation.y += dt; });
    });
    S.fit(8.4, 7.9, 0.25, true);
    const A = atMap(o);
    const first = (A[0] || [])[0];
    const act = a => {
      const [k] = a.split(':');
      if (k === 'hub') { setMode('hub'); caption('One central copy', 'amber'); }
      if (k === 'mesh') { setMode('mesh'); caption('Every node is a peer', 'teal'); }
      if (k === 'packets') { packetRate = 0.18; caption('Transactions spread peer to peer', 'blue'); S.later(() => { packetRate = 0.6; }, 6); }
      if (k === 'ledger') {
        nodes.forEach((nd, i) => { const g = new THREE.Group(); for (let j = 0; j < 3; j++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.13), mat('amber', { glow: 0.6 })); c.position.x = (j - 1) * 0.17; g.add(c); } g.position.copy(nd.position).add(new THREE.Vector3(0, 0.45, 0)); g.visible = false; S.world.add(g); extras.push(g); S.later(() => S.pop(g), i * 0.06); });
        caption('Each node keeps its own copy of the ledger', 'amber');
      }
      if (k === 'vote') {
        nodes.forEach((nd, i) => S.later(() => { recolor(nd, 'green', 0.9); S.later(() => recolor(nd, 'teal', 0.55), 1.4); }, i * 0.08));
        caption('Nodes agree: consensus', 'green');
      }
      if (k === 'attack') {
        const order = nodes.map((_, i) => i).sort((a, b) => nodes[a].position.x - nodes[b].position.x); const take = Math.ceil(n * 0.58);
        order.slice(0, take).forEach((i, j) => S.later(() => recolor(nodes[i], 'red', 0.8), j * 0.18));
        caption('Attacker controls more than half', 'red');
      }
      if (k === 'sybil') {
        const src = nodes[0]; recolor(src, 'red', 0.8);
        for (let j = 0; j < 9; j++) {
          const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 0), mat('red', { glow: 0.7, opacity: 0.7 }));
          const ang = j / 9 * Math.PI * 2; f.position.copy(src.position).add(new THREE.Vector3(Math.cos(ang) * 1.3, Math.sin(ang) * 0.9, 0.8));
          f.visible = false; S.world.add(f); extras.push(f); S.later(() => S.pop(f), 0.2 + j * 0.12);
          const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([src.position, f.position]), new THREE.LineDashedMaterial({ color: col('red'), dashSize: 0.1, gapSize: 0.08 })); l.computeLineDistances(); S.world.add(l); extras.push(l);
        }
        caption('One attacker, many fake identities', 'red');
      }
      if (k === 'ddos') { ddosTarget = 3 % n; recolor(nodes[ddosTarget], 'red', 0.9); caption('A flood of traffic swamps one node', 'red'); }
      if (k === 'heal') {
        ddosTarget = -1; packetRate = 0; nodes.forEach(nd => { recolor(nd, 'teal', 0.55); nd.scale.setScalar(1); });
        extras.splice(0).forEach(e => S.world.remove(e)); caption('Back to normal', 'teal');
      }
    };
    return {
      beat(b) {
        if (b === 0) { nodes.forEach((m, i) => S.pop(m, i * 0.04)); setMode(first === 'hub' ? 'hub' : 'mesh'); }
        (A[b] || []).forEach(act);
      }
    };
  },

  /* ---------- floating cards ---------- */
  cards(S, o, def) {
    const items = (o.items || []).slice(0, 8), N = items.length;
    const layout = o.center && N > 2 ? 'ring' : (o.layout || (N <= 3 ? 'row' : N <= 6 ? 'grid' : 'ring'));
    const w = N > 6 ? 2.15 : 2.5, tiles = [];
    let pos = [];
    if (layout === 'row') pos = items.map((_, i) => [(i - (N - 1) / 2) * (w + 0.35), 0]);
    else if (layout === 'grid') { const cols = N <= 4 ? 2 : 3, rows = Math.ceil(N / cols); pos = items.map((_, i) => { const r = Math.floor(i / cols), c = i % cols, inRow = Math.min(cols, N - r * cols); return [(c - (inRow - 1) / 2) * (w + 0.35), ((rows - 1) / 2 - r) * 1.55]; }); }
    else if (layout === 'hex') { const cols = 3; pos = items.map((_, i) => { const r = Math.floor(i / cols), c = i % cols; return [(c - 1) * (w + 0.25) + (r % 2 ? (w + 0.25) / 2 : 0) - (N > 3 ? (w + 0.25) / 4 : 0), (Math.ceil(N / cols) - 1) / 2 * 1.45 - r * 1.45]; }); }
    else { const rx = N > 6 ? 4.4 : 3.9, ry = N > 6 ? 2.35 : 2.1; pos = items.map((_, i) => { const a = Math.PI / 2 - i / N * Math.PI * 2; return [Math.cos(a) * rx, Math.sin(a) * ry]; }); }
    items.forEach((it, i) => {
      const t = tile(it.t, it.d, it.c || ['teal', 'blue', 'amber', 'violet', 'green', 'slate', 'teal', 'blue'][i % 8], { w });
      t.position.set(pos[i][0], pos[i][1], 0); t.visible = false; S.world.add(t); tiles.push(t);
      t.userData.phase = Math.random() * 6;
    });
    let center = null, title = null;
    if (o.center) {
      center = new THREE.Group();
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), mat('teal', { glow: 0.45, opacity: 0.55 }));
      const wire = new THREE.LineSegments(new THREE.EdgesGeometry(core.geometry), new THREE.LineBasicMaterial({ color: col('teal') }));
      const cl = label(o.center, { h: 0.42, color: 'teal' }); cl.position.z = 1.0;
      center.add(core, wire, cl); center.visible = false; S.world.add(center);
      if (layout === 'ring') tiles.forEach(t => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), t.position.clone().multiplyScalar(0.72)]), new THREE.LineBasicMaterial({ color: col('slate'), transparent: true, opacity: 0.4 })); S.world.add(l); });
    }
    const ys = pos.map(p => p[1]), xs = pos.map(p => p[0]);
    const top = (ys.length ? Math.max(...ys) : 0) + 1.2, bottom = (ys.length ? Math.min(...ys) : 0) - 0.9;
    if (o.title) { title = label(o.title, { h: 0.5, bg: false, titleSize: 46, width: 900 }); title.position.set(0, top + 0.35, 0.3); title.visible = false; S.world.add(title); }
    const W = (xs.length ? Math.max(...xs) - Math.min(...xs) : 0) + w + 0.6, H = top - bottom + (o.title ? 1 : 0.3);
    S.fit(Math.max(W, 5), Math.max(H, 3.5), (top + bottom) / 2 + (o.title ? 0.3 : 0), true);
    S.every((dt, t) => { tiles.forEach(x => { x.position.z = Math.sin(t * 0.9 + x.userData.phase) * 0.12; }); if (center) center.rotation.y += dt * 0.5; });
    const nBeats = (def && def.say ? def.say.length : N + 1);
    const showAt = i => o.reveal === 'all' ? 0 : Math.min(i + 1, Math.max(0, nBeats - 1));
    const A = atMap(o);
    const focus = i => tiles.forEach((t, j) => S.tween(t.scale, { x: j === i ? 1.12 : 0.94, y: j === i ? 1.12 : 0.94, z: 1 }, 0.4));
    return {
      beat(b) {
        if (b === 0) { if (title) S.pop(title); if (center) S.pop(center, 0.1); }
        tiles.forEach((t, i) => { if (showAt(i) === b) { S.pop(t, (o.reveal === 'all' ? i * 0.12 : 0.05 * (i - b + 1))); if (o.reveal !== 'all' && !A[b]) focus(i); } });
        (A[b] || []).forEach(a => { const [k, v] = a.split(':'); if (k === 'focus') focus(+v); if (k === 'all') tiles.forEach((t, j) => { if (!t.visible) S.pop(t, j * 0.08); S.tween(t.scale, { x: 1, y: 1, z: 1 }, 0.4); }); });
      }
    };
  },

  /* ---------- stacked layers ---------- */
  stack(S, o, def) {
    const layers = (o.layers || []).slice(0, 5), N = layers.length, W = 6.2, D = 2.6, H = 0.55, gap = 0.42;
    const slabs = [];
    const y0 = -((N - 1) * (H + gap)) / 2 - 0.2;
    layers.forEach((L, i) => {
      const c = L.c || ['blue', 'teal', 'violet', 'amber', 'green'][i % 5];
      const g = boxWithEdges(W, H, D, c, { opacity: 0.42, glow: 0.35 });
      const face = panel(L.t, L.d || '', { w: W - 0.4, titleSize: 50, bodySize: 36 });
      const fh = face.userData.h, sc = Math.min(1, (H + gap * 0.9) / fh); face.scale.setScalar(sc);
      face.position.set(0, 0, D / 2 + 0.02); g.add(face);
      g.position.set(0, y0 + i * (H + gap), 0); g.userData.y = g.position.y; g.visible = false; S.world.add(g); slabs.push(g);
    });
    // supporting pillars
    [[-W / 2 + 0.2, -D / 2 + 0.2], [W / 2 - 0.2, -D / 2 + 0.2], [-W / 2 + 0.2, D / 2 - 0.2], [W / 2 - 0.2, D / 2 - 0.2]].forEach(([x, z]) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, N * (H + gap), 8), mat('slate', { opacity: 0.4, glow: 0.2 })); p.position.set(x, y0 + (N - 1) * (H + gap) / 2, z); S.world.add(p);
    });
    let title = null;
    const topY = y0 + (N - 1) * (H + gap) + 0.9;
    if (o.title) { title = label(o.title, { h: 0.5, bg: false, titleSize: 46, width: 900 }); title.position.set(0, topY + 0.25, 0); title.visible = false; S.world.add(title); }
    const threats = (o.threats || []).map(T => {
      const L = slabs[Math.max(0, Math.min(N - 1, T.layer | 0))]; if (!L) return null;
      const g = new THREE.Group();
      const side = (T.layer % 2 ? 1 : -1);
      const a = new THREE.Vector3(side * (W / 2 + 2.3), 0, 0.6), b = new THREE.Vector3(side * (W / 2 + 0.05), 0, 0.6);
      g.add(arrow(a, b, 'red', { r: 0.05, headR: 0.16, head: 0.32 }));
      const tl = label(T.t, { h: 0.36, color: 'red', width: 420, titleSize: 40 }); tl.position.set(side * (W / 2 + 1.9), 0.42, 0.7); g.add(tl);
      g.position.y = L.userData.y; g.visible = false; S.world.add(g); return { g, beat: T.beat | 0 };
    }).filter(Boolean);
    S.fit(W + (threats.length ? 4.6 : 0.8), N * (H + gap) + 2, y0 + (N - 1) * (H + gap) / 2 + 0.45, true);
    S.world.rotation.x = 0.12;
    const nBeats = def && def.say ? def.say.length : N + 1;
    const showAt = i => Math.min(i + 1, Math.max(0, nBeats - 1));
    const A = atMap(o);
    const focus = i => slabs.forEach((s, j) => { S.tween(s.scale, { x: j === i ? 1.06 : 0.96, y: 1, z: j === i ? 1.06 : 0.96 }, 0.4); S.tween(s.position, { z: j === i ? 0.5 : 0 }, 0.4); });
    return {
      beat(b) {
        if (b === 0 && title) S.pop(title);
        slabs.forEach((s, i) => { if (showAt(i) === b) { s.visible = true; s.position.y = s.userData.y + 3; S.tween(s.position, { y: s.userData.y }, 0.7, 'back', (i - b + 1) * 0.12); if (!A[b]) focus(i); } });
        threats.forEach(t => { if (t.beat === b) { S.pop(t.g, 0.2); S.tween(t.g.position, { x: 0 }, 0.01); } });
        (A[b] || []).forEach(a => { const [k, v] = a.split(':'); if (k === 'focus') focus(+v); if (k === 'all') slabs.forEach(s => { s.visible = true; s.position.y = s.userData.y; }); });
      }
    };
  },

  /* ---------- flow diagram with packets ---------- */
  flow(S, o, def) {
    const nodes = o.nodes || [], byId = {}, X = x => (x - 2) * 2.75, Y = y => (1.5 - y) * 1.75;
    const xs = nodes.map(n => n.x ?? 0), ys = nodes.map(n => n.y ?? 0);
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    nodes.forEach((n, i) => {
      const t = tile(n.t, n.d || '', n.c || 'teal', { w: 2.3, minH: 0.85, titleSize: 46 });
      t.position.set(X(n.x ?? 0) - X(cx) + X(2), Y(n.y ?? 0) - Y(cy) + Y(1.5), 0); t.visible = false; S.world.add(t);
      byId[n.id] = t; t.userData.i = i;
    });
    const edgeObjs = (o.edges || []).map(([a, b, lab]) => {
      const A = byId[a], B = byId[b]; if (!A || !B) return null;
      const pa = A.position.clone(), pb = B.position.clone(), d = pb.clone().sub(pa);
      const off = (n, dir) => { const half = new THREE.Vector3(n.userData.w / 2 + 0.06, n.userData.h / 2 + 0.06, 0); const k = Math.min(Math.abs(half.x / (dir.x || 1e-6)), Math.abs(half.y / (dir.y || 1e-6))); return dir.clone().multiplyScalar(k); };
      const u = d.clone().normalize();
      const s = pa.clone().add(off(A, u)), e = pb.clone().sub(off(B, u));
      const g = arrow(s, e, 'slate', { r: 0.03 });
      if (lab) { const l = label(lab, { h: 0.3, bg: true, color: 'slate', width: 420, titleSize: 36 }); l.position.copy(s.clone().lerp(e, 0.5)).add(new THREE.Vector3(0, 0.28, 0.2)); g.add(l); }
      g.visible = false; S.world.add(g);
      return { g, a, b, s, e };
    }).filter(Boolean);
    const P = Object.values(byId).map(t => t.position);
    const minX = Math.min(...P.map(p => p.x)), maxX = Math.max(...P.map(p => p.x)), minY = Math.min(...P.map(p => p.y)), maxY = Math.max(...P.map(p => p.y));
    S.fit(maxX - minX + 3, maxY - minY + 2.2, (maxY + minY) / 2, true);
    const live = [];
    S.every((dt, t) => {
      Object.values(byId).forEach((n, i) => { n.position.z = Math.sin(t * 0.8 + i) * 0.08; });
      for (let k = live.length - 1; k >= 0; k--) {
        const p = live[k], u = p.userData; u.t += dt * 0.9;
        const seg = Math.floor(u.t);
        if (seg >= u.pts.length - 1) { if (u.loops-- > 0) { u.t = 0; continue; } S.world.remove(p); live.splice(k, 1); continue; }
        p.position.lerpVectors(u.pts[seg], u.pts[seg + 1], ease.inOut(u.t - seg)); p.position.z = 0.35;
      }
    });
    const nBeats = def && def.say ? def.say.length : nodes.length;
    const showAt = i => o.reveal === 'all' ? 0 : Math.min(i, Math.max(0, nBeats - 1));
    const visible = new Set();
    return {
      beat(b) {
        nodes.forEach((n, i) => { if (showAt(i) === b) { S.pop(byId[n.id], o.reveal === 'all' ? i * 0.12 : 0); visible.add(n.id); } });
        edgeObjs.forEach(E => { if (!E.g.visible && visible.has(E.a) && visible.has(E.b)) S.pop(E.g, 0.35); });
        (o.packets || []).filter(p => p.beat === b).forEach(pk => {
          const pts = (pk.path || []).map(id => byId[id] && byId[id].position.clone()).filter(Boolean);
          if (pts.length < 2) return;
          (pk.path || []).forEach(id => { if (byId[id] && !byId[id].visible) { S.pop(byId[id]); visible.add(id); } });
          edgeObjs.forEach(E => { if (!E.g.visible && visible.has(E.a) && visible.has(E.b)) S.pop(E.g, 0.2); });
          const c = pk.c === 'bad' ? 'red' : pk.c === 'good' ? 'green' : 'amber';
          const ball = glowBall(c, 0.13);
          if (pk.t) { const l = label(pk.t, { h: 0.3, color: c, width: 400, titleSize: 36 }); l.position.y = 0.38; ball.add(l); }
          ball.userData = { pts, t: 0, loops: 1 }; ball.position.copy(pts[0]); S.world.add(ball); live.push(ball);
          if (pk.c === 'bad') { const last = byId[pk.path[pk.path.length - 1]]; if (last) S.later(() => { const x = cross(); x.scale.setScalar(0.6); x.position.copy(last.position).add(new THREE.Vector3(last.userData.w / 2, last.userData.h / 2, 0.3)); S.world.add(x); }, (pts.length - 1) / 0.9); }
        });
      }
    };
  },

  /* ---------- hash machine ---------- */
  hash(S, o) {
    const inputs = (o.inputs || ['Patient record']).slice(0, 3), start = o.start | 0;
    const machine = new THREE.Group();
    const glass = boxWithEdges(2.0, 2.0, 2.0, 'teal', { opacity: 0.16, glow: 0.2 });
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.15, 120, 16), mat('amber', { metal: 0.6, rough: 0.25, glow: 0.35 }));
    machine.add(glass, knot);
    const ml = label('Hash function', { h: 0.42, color: 'teal' }); ml.position.y = 1.45; machine.add(ml);
    S.world.add(machine);
    const inL = label('Input', { h: 0.34, bg: false, fg: '#A9C0C4', titleSize: 38 }); inL.position.set(-4.3, 1.6, 0); S.world.add(inL);
    const outL = label('Unique fingerprint (SHA-256)', { h: 0.34, bg: false, fg: '#A9C0C4', titleSize: 38, width: 700 }); outL.position.set(4.2, 1.6, 0); S.world.add(outL);
    let spin = 0.6; S.every((dt) => { knot.rotation.x += dt * spin; knot.rotation.y += dt * spin * 0.7; spin += (0.6 - spin) * dt * 0.8; });
    const outs = [];
    S.fit(12.5, 5.5, 0.2, true);
    const show = async (k) => {
      const txt = inputs[k], y = 0.55 - k * 1.35;
      const inp = label(txt, { h: 0.42, color: k ? 'amber' : 'blue', width: 640, titleSize: 40, mono: true }); inp.position.set(-4.3, y, 0); S.world.add(inp); S.pop(inp);
      const ghost = glowBall(k ? 'amber' : 'blue', 0.12); ghost.position.set(-2.6, y, 0); S.world.add(ghost);
      S.tween(ghost.position, { x: 0, y: 0 }, 0.9, 'inOut', 0.3, () => { S.world.remove(ghost); spin = 7; });
      const hex = await sha256Hex(txt);
      outs[k] = hex;
      const shown = hex.slice(0, 16) + '…';
      S.later(() => {
        const out = label(shown, { h: 0.42, color: k ? 'amber' : 'green', width: 640, titleSize: 40, mono: true }); out.position.set(4.2, y, 0); S.world.add(out); S.pop(out);
        if (k > 0 && outs[0]) {
          let diff = 0; for (let i = 0; i < 64; i++) if (outs[0][i] !== hex[i]) diff++;
          const d = label(`${diff} of 64 characters changed`, { h: 0.36, color: 'red', width: 640, titleSize: 38 }); d.position.set(4.2, y - 0.62, 0.2); S.world.add(d); S.pop(d, 0.3);
        }
      }, 1.4);
    };
    return { beat(b) { if (b === 0) S.pop(machine); const k = b - start; if (k >= 0 && k < inputs.length) show(k); } };
  },

  /* ---------- digital signatures ---------- */
  keys(S, o) {
    const sx = -4.2, vx = 4.2;
    const st = (x, t, c) => { const g = boxWithEdges(1.6, 0.25, 1.4, c, { opacity: 0.5 }); g.position.set(x, -1.2, 0); const l = label(t, { h: 0.42, color: c }); l.position.set(0, 2.55, 0); g.add(l); S.world.add(g); return g; };
    const signer = st(sx, o.signer || 'Doctor', 'amber'), verifier = st(vx, o.verifier || 'Verifier', 'blue');
    const mini = new THREE.Group(); for (let j = 0; j < 3; j++) { const b = boxWithEdges(0.55, 0.55, 0.55, 'teal', { opacity: 0.5 }); b.position.x = (j - 1) * 0.75; mini.add(b); }
    mini.position.set(0, -0.8, -0.4); S.world.add(mini);
    const ml = label('Blockchain', { h: 0.36, color: 'teal' }); ml.position.set(0, -1.75, 0); S.world.add(ml);
    const doc = new THREE.Group();
    const paper = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.65, 0.04), new THREE.MeshStandardMaterial({ color: 0xeef6f6, emissive: 0xffffff, emissiveIntensity: 0.15 }));
    const dt = panel(o.doc || 'Record update', '', { w: 1.15, titleSize: 64 }); dt.material.map && (dt.material.color = new THREE.Color(0x0b1822)); dt.position.z = 0.03;
    const dtl = label(o.doc || 'Record update', { h: 0.34, color: 'slate', width: 460, titleSize: 40 }); dtl.position.set(0, 1.1, 0.1);
    doc.add(paper, dtl); doc.position.set(sx, 0.3, 0); S.world.add(doc);
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 24), mat('amber', { metal: 0.7, glow: 0.4 })); seal.rotation.x = Math.PI / 2; seal.position.set(0.35, -0.5, 0.05); seal.visible = false; doc.add(seal);
    const priv = keyMesh('amber'); priv.position.set(sx - 1.6, 1.3, 0.4); S.world.add(priv);
    const pl = label('Private key', { h: 0.3, color: 'amber', titleSize: 36 }); pl.position.set(0.3, 0.45, 0); priv.add(pl);
    const pub = keyMesh('blue'); pub.position.set(vx + 1.6, 1.3, 0.4); pub.visible = false; S.world.add(pub);
    const pbl = label('Public key', { h: 0.3, color: 'blue', titleSize: 36 }); pbl.position.set(0.3, 0.45, 0); pub.add(pbl);
    S.every((dt2, t) => { priv.rotation.y = Math.sin(t) * 0.4; pub.rotation.y = Math.sin(t + 1) * 0.4; doc.rotation.y = Math.sin(t * 0.6) * 0.12; });
    S.fit(11.5, 5.4, 0.3, true);
    let tampered = false;
    const A = atMap(o), keysUsed = Object.keys(A).length;
    const act = k => {
      if (k === 'sign') { S.tween(priv.position, { x: sx - 0.2, y: 0.1, z: 0.6 }, 0.8, 'inOut', 0, () => { seal.visible = true; S.pop(seal); S.tween(priv.position, { x: sx - 1.6, y: 1.3, z: 0.4 }, 0.8, 'inOut', 0.3); }); }
      if (k === 'send') { S.tween(doc.position, { x: 0, y: 0.7 }, 1.0, 'inOut', 0, () => S.tween(doc.position, { x: vx, y: 0.3 }, 1.0, 'inOut', 0.4)); }
      if (k === 'tamper') { tampered = true; paper.material.color.setHex(0xfecaca); const t = label('Edited!', { h: 0.36, color: 'red' }); t.position.set(0, -0.15, 0.2); doc.add(t); S.pop(t); S.tween(doc.rotation, { z: 0.15 }, 0.15, 'out', 0, () => S.tween(doc.rotation, { z: 0 }, 0.5, 'back')); }
      if (k === 'verify' || k === 'reject') {
        S.pop(pub); S.tween(pub.position, { x: vx + 0.2, y: 0.1 }, 0.8, 'inOut', 0.3);
        S.later(() => { const ok = k === 'verify' && !tampered; const m = ok ? tick() : cross(); m.position.set(vx, 1.65, 0.6); S.world.add(m); S.pop(m); const l = label(ok ? 'Signature valid: add to chain' : 'Signature fails: rejected', { h: 0.36, color: ok ? 'green' : 'red', width: 640 }); l.position.set(vx - 0.6, 2.35, 0.6); S.world.add(l); S.pop(l, 0.2); if (ok) { const nb = boxWithEdges(0.55, 0.55, 0.55, 'green', { opacity: 0.6 }); nb.position.set(1.5, -0.8, -0.4); S.world.add(nb); S.pop(nb, 0.4); } }, 1.3);
      }
    };
    return { beat(b) { if (!keysUsed) { const seq = [null, 'sign', 'send', 'verify']; if (seq[b]) act(seq[b]); } (A[b] || []).forEach(act); } };
  },

  /* ---------- Proof of Work vs Proof of Stake ---------- */
  powpos(S, o) {
    const L = new THREE.Group(), R = new THREE.Group(); L.position.x = -3.3; R.position.x = 3.3; S.world.add(L, R);
    const lt = label('Proof of Work', { h: 0.48, color: 'amber' }); lt.position.y = 2.8; L.add(lt);
    const rt = label('Proof of Stake', { h: 0.48, color: 'teal' }); rt.position.y = 2.8; R.add(rt);
    const miners = [];
    for (let i = 0; i < 4; i++) { const m = boxWithEdges(0.6, 0.6, 0.6, 'amber', { opacity: 0.6, glow: 0.35 }); m.position.set((i % 2 - 0.5) * 1.3, (i < 2 ? 0.7 : -0.5), 0); L.add(m); miners.push(m); }
    const puzzle = label('Find the nonce…', { h: 0.34, color: 'amber', mono: true, titleSize: 36 }); puzzle.position.set(0, 1.55, 0.3); puzzle.visible = false; L.add(puzzle);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1, 0.35), mat('red', { glow: 0.6 })); bar.position.set(-1.7, -1.5, 0); bar.scale.y = 0.05; bar.geometry.translate(0, 0.5, 0); L.add(bar);
    const bl = label('Energy', { h: 0.28, bg: false, fg: '#F87171', titleSize: 34 }); bl.position.set(-1.7, -1.85, 0); L.add(bl);
    const vals = []; const heights = [3, 5, 2, 4];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group(); g.position.set((i - 1.5) * 0.95, -1.2, 0); R.add(g);
      for (let j = 0; j < heights[i]; j++) { const c = coin('teal'); c.rotation.x = 0; c.position.y = j * 0.09; g.add(c); }
      const v = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), mat('blue', { glow: 0.45 })); v.position.y = 0.9; g.add(v);
      vals.push(g);
    }
    const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1, 0.35), mat('green', { glow: 0.6 })); bar2.geometry.translate(0, 0.5, 0); bar2.position.set(1.95, -1.5, 0); bar2.scale.y = 0.05; R.add(bar2);
    const bl2 = label('Energy', { h: 0.28, bg: false, fg: '#4ADE80', titleSize: 34 }); bl2.position.set(1.95, -1.85, 0); R.add(bl2);
    let racing = false;
    S.every((dt, t) => { if (racing) miners.forEach((m, i) => { m.rotation.x += dt * (3 + i); m.rotation.y += dt * (2 + i * 0.5); }); vals.forEach((g, i) => { g.children.at(-1).position.y = 0.9 + Math.sin(t * 2 + i) * 0.06; }); });
    S.fit(12, 6.4, 0.5, true);
    const A = atMap(o);
    const act = k => {
      if (k === 'pow') { racing = true; S.pop(puzzle); S.tween(bar.scale, { y: 1.6 }, 2.0, 'out'); S.later(() => { racing = false; recolor(miners[2], 'green', 0.8); const w = label('Winner adds the block', { h: 0.32, color: 'green', titleSize: 36 }); w.position.set(0, -1.3, 0.6); L.add(w); S.pop(w); }, 2.6); }
      if (k === 'energy') { S.tween(bar.scale, { y: 3.4 }, 1.2, 'out'); S.tween(bar2.scale, { y: 0.35 }, 1.2, 'out'); const e = label('Much more energy', { h: 0.32, color: 'red', titleSize: 36 }); e.position.set(-1.7, 2.05, 0.4); L.add(e); S.pop(e); }
      if (k === 'pos') { S.tween(bar2.scale, { y: 0.35 }, 1.2); vals.forEach((g, i) => S.later(() => recolor(g.children.at(-1), i === 1 ? 'green' : 'blue', 0.6), 0.3 + i * 0.2)); S.later(() => { const w = label('Chosen by stake', { h: 0.32, color: 'green', titleSize: 36 }); w.position.set(-0.47, 1.5, 0.5); R.add(w); S.pop(w); }, 1.3); }
      if (k === 'central') { [1, 3].forEach(i => { const g = vals[i]; for (let j = 0; j < 7; j++) { const c = coin('amber'); c.rotation.x = 0; c.position.y = (heights[i] + j) * 0.09; c.visible = false; g.add(c); S.later(() => S.pop(c), j * 0.1); } S.tween(g.children.find(x => x.geometry && x.geometry.type === 'SphereGeometry').position, { y: 1.6 }, 0.8); }); const w = label('A few big stakers can dominate', { h: 0.32, color: 'amber', titleSize: 36, width: 620 }); w.position.set(0, -2.3, 0.5); R.add(w); S.pop(w, 0.6); }
    };
    return { beat(b) { (A[b] || []).forEach(act); } };
  },

  /* ---------- smart contract machine ---------- */
  contract(S, o) {
    const mach = boxWithEdges(2.6, 2.4, 1.8, 'teal', { opacity: 0.18, glow: 0.25 }); mach.position.set(0, 0, 0); S.world.add(mach);
    const t = label(o.title || 'Smart contract', { h: 0.45, color: 'teal' }); t.position.set(0, 1.75, 0); S.world.add(t);
    const rule = label(o.rule || 'IF condition THEN action', { h: 0.36, color: 'slate', mono: true, width: 900, titleSize: 36 }); rule.position.set(0, -1.75, 0.5); S.world.add(rule);
    const gears = [];
    [[-0.45, 0.2, 0.5], [0.42, -0.2, 0.42]].forEach(([x, y, r], i) => { const g = new THREE.Mesh(new THREE.TorusGeometry(r, 0.12, 6, 12), mat(i ? 'amber' : 'blue', { metal: 0.6, glow: 0.35 })); g.position.set(x, y, 0); S.world.add(g); gears.push(g); });
    const fund = boxWithEdges(1.5, 1.4, 1.2, 'amber', { opacity: 0.4 }); fund.position.set(-4.0, -0.2, 0); S.world.add(fund);
    const fl = label('Fund', { h: 0.36, color: 'amber' }); fl.position.y = 1.1; fund.add(fl);
    let balance = 5;
    const balWrap = new THREE.Group(); balWrap.position.set(-4.0, -1.35, 0.4); S.world.add(balWrap);
    const setBal = (v, c) => { balWrap.clear(); const l = label(`Balance: ${v}`, { h: 0.34, color: c || 'amber', mono: true, titleSize: 38 }); balWrap.add(l); };
    setBal(balance);
    const dest = boxWithEdges(1.3, 1.2, 1.0, 'green', { opacity: 0.35 }); dest.position.set(4.1, -0.2, 0); S.world.add(dest);
    const dl = label('Paid out', { h: 0.34, color: 'green' }); dl.position.y = 1.0; dest.add(dl);
    let speed = 0.4; S.every(dt => { gears[0].rotation.z += dt * speed; gears[1].rotation.z -= dt * speed * 1.2; speed += (0.4 - speed) * dt * 0.5; });
    S.fit(11, 5, 0, true);
    const payOne = (delay, after) => { S.later(() => { const c = coin(); c.position.set(-4, 0, 0.5); S.world.add(c); S.tween(c.position, { x: 4.1 }, 1.0, 'inOut', 0, () => { S.world.remove(c); after && after(); }); }, delay); };
    const A = atMap(o);
    let fixed = false;
    const act = k => {
      if (k === 'input') { const tk = tile('Request', '', 'blue', { w: 1.4, minH: 0.6, titleSize: 54 }); tk.position.set(0, 3.2, 0.3); S.world.add(tk); S.tween(tk.position, { y: 0.3 }, 0.9, 'back', 0, () => S.hide(tk, 0.4)); }
      if (k === 'run') { speed = 6; recolor(rule, 'amber'); const ok = label('Condition met', { h: 0.32, color: 'green' }); ok.position.set(0, 1.1, 1.1); S.world.add(ok); S.pop(ok, 0.8); }
      if (k === 'pay') { speed = 4; payOne(0.2, () => { balance -= 1; setBal(balance); }); }
      if (k === 'reentrancy') {
        speed = 9; recolor(mach, 'red', 0.35);
        const warn = label('Asks again before the balance is updated', { h: 0.34, color: 'red', width: 900 }); warn.position.set(0, 2.35, 0.4); S.world.add(warn); S.pop(warn);
        for (let i = 0; i < 4; i++) payOne(i * 0.55, () => { balance = Math.max(0, balance - 1); setBal(balance, balance ? 'amber' : 'red'); if (!balance) recolor(fund, 'red', 0.4); });
      }
      if (k === 'fix') {
        fixed = true; balance = 5; setBal(balance); recolor(mach, 'teal', 0.25); recolor(fund, 'amber', 0.2);
        const fx = label('Fix: update the balance first', { h: 0.34, color: 'green', width: 900 }); fx.position.set(0, 2.35, 0.6); S.world.add(fx); S.pop(fx);
        S.later(() => { balance -= 1; setBal(balance, 'green'); }, 0.5); payOne(0.7);
        S.later(() => { const x = cross(); x.scale.setScalar(0.7); x.position.set(0, 0.2, 1.2); S.world.add(x); S.pop(x); const r = label('Second request refused', { h: 0.32, color: 'red' }); r.position.set(0, -0.75, 1.3); S.world.add(r); S.pop(r); }, 2.0);
      }
    };
    return { beat(b) { (A[b] || []).forEach(act); } };
  },

  /* ---------- multi-signature vault ---------- */
  vault(S, o) {
    const ks = (o.keys || ['Doctor', 'Pharmacist', 'Nurse']).slice(0, 4), need = o.need || 2;
    const cab = boxWithEdges(3.0, 3.2, 1.6, 'slate', { opacity: 0.45, glow: 0.2 }); cab.position.set(0, 0, -0.4); S.world.add(cab);
    const hinge = new THREE.Group(); hinge.position.set(-1.5, 0, 0.42); S.world.add(hinge);
    const door = boxWithEdges(3.0, 3.2, 0.12, 'teal', { opacity: 0.55, glow: 0.3 }); door.position.x = 1.5; hinge.add(door);
    const inside = tile('Patient record', 'released', 'green', { w: 1.9, minH: 0.8 }); inside.position.set(0, 0, -0.3); S.world.add(inside);
    const tl = label(o.title || `Needs ${need} of ${ks.length} keys`, { h: 0.45, color: 'teal', width: 700 }); tl.position.set(0, 2.25, 0); S.world.add(tl);
    const slots = ks.map((k, i) => {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 20), mat('slate', { glow: 0.3 })); s.rotation.x = Math.PI / 2;
      s.position.set(1.5 + (i - (ks.length - 1) / 2) * 0.85 - 1.5, -0.9, 0.08); door.add(s);
      const key = keyMesh('amber'); key.position.set((i - (ks.length - 1) / 2) * 2.0 + (i - (ks.length - 1) / 2) * 0.6, -2.6, 1.6); S.world.add(key);
      const kl = label(k, { h: 0.3, color: 'amber', titleSize: 36 }); kl.position.set(0.3, 0.42, 0); key.add(kl);
      return { s, key, turned: false };
    });
    let count = 0;
    S.every((dt, t) => slots.forEach((x, i) => { if (!x.turned) x.key.rotation.y = Math.sin(t + i) * 0.3; }));
    S.fit(8, 6.6, -0.25, true);
    const open = () => { S.tween(hinge.rotation, { y: -1.9 }, 1.4, 'inOut'); recolor(inside, 'green', 0.6); };
    const A = atMap(o);
    const act = a => {
      const [k, v] = a.split(':'), i = +v;
      if (k === 'turn' && slots[i] && !slots[i].turned) {
        const x = slots[i]; x.turned = true;
        const wp = new THREE.Vector3(); x.s.getWorldPosition(wp); S.world.worldToLocal(wp);
        S.tween(x.key.position, { x: wp.x - 0.5, y: wp.y, z: wp.z + 0.3 }, 0.9, 'inOut', 0, () => { S.tween(x.key.rotation, { x: Math.PI / 2 }, 0.4); x.key.children.forEach(c => { if (c.isSprite) c.visible = false; }); recolor(x.s, 'green', 0.8); count++; if (count >= need) S.later(open, 0.5); });
      }
      if (k === 'open') open();
      if (k === 'stolen') {
        const th = keyMesh('red'); th.position.set(4.3, -2.2, 1.6); S.world.add(th);
        const thl = label('Stolen key', { h: 0.3, color: 'red', titleSize: 36 }); thl.position.set(0.3, 0.42, 0); th.add(thl);
        const s = slots[slots.length - 1]; const wp = new THREE.Vector3(); s.s.getWorldPosition(wp); S.world.worldToLocal(wp);
        S.tween(th.position, { x: wp.x - 0.5, y: wp.y, z: wp.z + 0.3 }, 1.0, 'inOut', 0, () => { recolor(s.s, 'red', 0.8); const l = label('One key is not enough', { h: 0.36, color: 'red' }); l.position.set(0, 0.2, 1.4); S.world.add(l); S.pop(l); });
      }
    };
    return { beat(b) { (A[b] || []).forEach(act); } };
  },

  /* ---------- Merkle tree ---------- */
  merkle(S, o) {
    const n = o.leaves === 8 ? 8 : 4, levels = [];
    let row = [];
    for (let i = 0; i < n; i++) row.push({ t: (o.labels && o.labels[i]) || `Record ${i + 1}`, h: shortHash('leaf' + i) });
    levels.push(row);
    while (row.length > 1) { const nx = []; for (let i = 0; i < row.length; i += 2) nx.push({ t: row.length === 2 ? 'Merkle root' : 'Hash ' + (row[i].h.slice(0, 2) + row[i + 1].h.slice(0, 2)), h: shortHash(row[i].h + row[i + 1].h) }); levels.push(nx); row = nx; }
    const W = n === 8 ? 1.55 : 2.4, objs = [];
    levels.forEach((L, li) => {
      const y = -1.9 + li * 1.55;
      objs[li] = L.map((x, i) => {
        const span = n * W / L.length, px = (i - (L.length - 1) / 2) * span;
        const tl = tile(li === 0 ? x.t : (li === levels.length - 1 ? 'Merkle root' : 'Hash'), '#' + x.h, li === levels.length - 1 ? 'amber' : li === 0 ? 'blue' : 'teal', { w: Math.min(2.2, W - 0.15), minH: 0.75, titleSize: 44, bodySize: 38 });
        tl.position.set(px, y, 0); tl.visible = false; S.world.add(tl);
        return tl;
      });
    });
    const lines = [];
    for (let li = 1; li < levels.length; li++) objs[li].forEach((p, i) => [objs[li - 1][2 * i], objs[li - 1][2 * i + 1]].forEach(c => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([c.position.clone().add(new THREE.Vector3(0, 0.42, 0)), p.position.clone().add(new THREE.Vector3(0, -0.42, 0))]), new THREE.LineBasicMaterial({ color: col('slate') })); l.visible = false; l.userData.li = li; l.userData.child = c; S.world.add(l); lines.push(l); }));
    S.fit(n * W + 0.6, levels.length * 1.55 + 0.8, -1.9 + (levels.length - 1) * 0.78, true);
    const build = () => { objs.forEach((L, li) => L.forEach((t, i) => { if (!t.visible) S.pop(t, li * 0.5 + i * 0.08); })); lines.forEach(l => S.later(() => { l.visible = true; }, l.userData.li * 0.5)); };
    const A = atMap(o), hasBuild = Object.values(A).flat().some(a => a === 'build');
    const act = a => {
      const [k, v] = a.split(':');
      if (k === 'build') build();
      if (k === 'root') { const r = objs.at(-1)[0]; if (!r.visible) build(); S.tween(r.scale, { x: 1.2, y: 1.2, z: 1.2 }, 0.5, 'back'); recolor(r, 'amber', 0.7); }
      if (k === 'tamper') { let i = +v; if (!objs[0][0].visible) build(); for (let li = 0; li < objs.length; li++) { const t = objs[li][i]; S.later(() => { recolor(t, 'red', 0.6); }, li * 0.45); i = Math.floor(i / 2); } lines.forEach(l => { }); const w = label('Root changes: tampering detected', { h: 0.36, color: 'red', width: 700 }); w.position.set(0, -2.95, 0.6); S.world.add(w); S.pop(w, objs.length * 0.45); }
    };
    return { beat(b) { if (b === 0) { objs[0].forEach((t, i) => S.pop(t, i * 0.1)); if (!hasBuild) build(); } (A[b] || []).forEach(act); } };
  },

  /* ---------- 3D chart ---------- */
  chart(S, o) {
    const years = o.years || [], series = o.series || [], nY = years.length;
    const maxV = Math.max(1, ...series.flatMap(s => s.values)), W = 8, H = 4, X = i => -W / 2 + i * W / Math.max(1, nY - 1), Y = v => -2 + v / maxV * H;
    const axes = new THREE.Group(); S.world.add(axes);
    axes.add(arrow(new THREE.Vector3(-W / 2 - 0.3, -2, 0), new THREE.Vector3(W / 2 + 0.6, -2, 0), 'slate', { r: 0.02 }));
    axes.add(arrow(new THREE.Vector3(-W / 2 - 0.3, -2, 0), new THREE.Vector3(-W / 2 - 0.3, 2.5, 0), 'slate', { r: 0.02 }));
    years.forEach((y, i) => { const l = label(String(y), { h: 0.3, bg: false, fg: '#A9C0C4', titleSize: 38 }); l.position.set(X(i), -2.4, 0); axes.add(l); });
    if (o.title) { const t = label(o.title, { h: 0.45, bg: false, width: 1000, titleSize: 44 }); t.position.set(0, 3.0, 0); axes.add(t); }
    if (o.note) { const t = label(o.note, { h: 0.3, bg: false, width: 1100, titleSize: 32, fg: '#A9C0C4' }); t.position.set(0, -3.0, 0); axes.add(t); }
    const lines = series.map((s, si) => {
      const g = new THREE.Group(), z = (si - (series.length - 1) / 2) * 0.55, c = s.c || ['blue', 'amber', 'green', 'violet'][si % 4];
      const pts = s.values.map((v, i) => new THREE.Vector3(X(i), Y(v), z));
      if (pts.length > 1) g.add(tube(null, null, c, 0.05, { curve: new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.1), seg: 60 }));
      pts.forEach((p, i) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), mat(c, { glow: 0.7 })); b.position.copy(p); g.add(b); const vl = label(String(s.values[i]), { h: 0.24, bg: false, fg: css(c), titleSize: 36 }); vl.position.copy(p).add(new THREE.Vector3(0, 0.3, 0)); g.add(vl); });
      const nl = label(s.name, { h: 0.3, color: c, titleSize: 36, width: 440 }); nl.position.copy(pts.at(-1)).add(new THREE.Vector3(1.25, 0, 0)); g.add(nl);
      g.visible = false; S.world.add(g); return g;
    });
    S.fit(W + 3.6, 6.8, 0.1, true);
    const A = atMap(o), hasSeries = Object.values(A).flat().some(a => a.startsWith('series'));
    return {
      beat(b) {
        if (!hasSeries && b === 0) lines.forEach((l, i) => S.pop(l, i * 0.3));
        (A[b] || []).forEach(a => { const [k, v] = a.split(':'); if (k === 'series' && lines[+v]) S.pop(lines[+v]); if (k === 'all') lines.forEach(l => { if (!l.visible) S.pop(l); }); });
      }
    };
  },

  /* ---------- comparison podiums ---------- */
  compare(S, o) {
    const cols = (o.cols || []).slice(0, 3), N = cols.length, gap = 3.6, groups = [];
    const maxItems = Math.max(1, ...cols.map(c => (c.items || []).length));
    cols.forEach((C, i) => {
      const g = new THREE.Group(), c = C.c || ['blue', 'amber', 'violet'][i % 3];
      g.position.x = (i - (N - 1) / 2) * gap;
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.6, 0.4, 40), mat(c, { opacity: 0.55, glow: 0.3 })); pod.position.y = -2.3; g.add(pod);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.03, 8, 60), mat(c, { glow: 0.8 })); ring.rotation.x = Math.PI / 2; ring.position.y = -2.08; g.add(ring);
      const t = label(C.t, { h: 0.48, color: c, width: 560 }); t.position.y = -2.3 + 0.65 + maxItems * 0.85 + 0.55; g.add(t);
      (C.items || []).slice(0, 5).forEach((it, j) => { const tl = tile(it, '', c, { w: 3.0, minH: 0.62, titleSize: 40 }); tl.position.y = -1.35 + j * 0.85; g.add(tl); });
      g.visible = false; S.world.add(g); groups.push(g);
    });
    S.fit(N * gap + 0.6, maxItems * 0.85 + 2.6, -2.3 + (maxItems * 0.85 + 1.4) / 2, true);
    const A = atMap(o), hasCol = Object.keys(A).length > 0;
    const showCol = i => { const g = groups[i]; if (!g || g.visible) return; g.visible = true; g.position.y = -4; S.tween(g.position, { y: 0 }, 0.8, 'back'); };
    return {
      beat(b) {
        if (!hasCol && b < N) showCol(b);
        (A[b] || []).forEach(a => { const [k, v] = a.split(':'); if (k === 'col') showCol(+v); if (k === 'all') groups.forEach((_, i) => showCol(i)); if (k === 'focus') { groups.forEach((g, i) => S.tween(g.scale, { x: i === +v ? 1.08 : 0.9, y: i === +v ? 1.08 : 0.9, z: 1 }, 0.4)); } });
      }
    };
  },

  /* ---------- balance scale ---------- */
  scale(S, o) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.25, 32), mat('slate', { glow: 0.2 })); base.position.y = -2.2; S.world.add(base);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.2, 12), mat('slate', { metal: 0.7 })); post.position.y = -0.55; S.world.add(post);
    const beam = new THREE.Group(); beam.position.y = 1.05; S.world.add(beam);
    beam.add(new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.12, 0.12), mat('slate', { metal: 0.7, glow: 0.3 })));
    const pans = [-3, 3].map((x, i) => {
      const p = new THREE.Group(); p.position.set(x, 0, 0); beam.add(p);
      const str = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 6), mat('slate')); str.position.y = -0.65; p.add(str);
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.7, 0.15, 32), mat(i ? 'amber' : 'teal', { glow: 0.35 })); dish.position.y = -1.35; p.add(dish);
      const l = label(i ? (o.right || 'Performance') : (o.left || 'Security'), { h: 0.48, color: i ? 'amber' : 'teal', width: 600 }); l.position.y = -0.55; l.position.z = 0.6; p.add(l);
      return p;
    });
    S.every(() => pans.forEach(p => { p.rotation.z = -beam.rotation.z; }));
    S.fit(8.4, 5.4, -0.3, true);
    const A = atMap(o);
    return { beat(b) { (A[b] || []).forEach(a => { if (a === 'tilt-left') S.tween(beam.rotation, { z: 0.22 }, 1.0, 'back'); if (a === 'tilt-right') S.tween(beam.rotation, { z: -0.22 }, 1.0, 'back'); if (a === 'balance') S.tween(beam.rotation, { z: 0 }, 1.2, 'back'); }); } };
  }
};
export const SCENE_TYPES = Object.keys(BUILDERS);
