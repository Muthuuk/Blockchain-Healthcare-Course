/* Hands-on labs. Each lab: { title, intro, mount(el, done) }.
   Hashing and signatures use the browser's real Web Crypto (SHA-256, ECDSA P-256). */
import { sha256Hex } from './scenes.js';

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
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const hexDiff = (a, b) => { const out = h('div', { class: 'hex' }); for (let i = 0; i < b.length; i++) out.append(a && a[i] !== b[i] ? h('span', { class: 'd' }, b[i]) : b[i]); return out; };
const fb = (cls, ...k) => h('div', { class: 'fb ' + cls, role: 'status' }, ...k);

/* generic sorting exercise */
function sorter(el, done, items, cats, explain) {
  const rows = shuffle(items).map(it => {
    const sel = h('select', { 'aria-label': 'Choose for: ' + it.t }, h('option', { value: '' }, 'Choose…'), ...cats.map(c => h('option', { value: c }, c)));
    const row = h('div', { class: 'it' }, h('span', null, it.t), sel); row._it = it; row._sel = sel; return row;
  });
  const out = h('div');
  el.append(h('div', { class: 'sorter' }, rows), h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { type: 'button', class: 'btn primary', onclick: check }, 'Check my answers'), h('button', { type: 'button', class: 'btn ghost', onclick: () => { rows.forEach(r => { r._sel.value = ''; r.className = 'it'; r.querySelector('small')?.remove(); }); out.innerHTML = ''; } }, 'Reset')), out);
  function check() {
    let ok = 0, blank = 0;
    rows.forEach(r => {
      r.querySelector('small')?.remove();
      if (!r._sel.value) { blank++; r.className = 'it'; return; }
      const good = r._sel.value === r._it.c; if (good) ok++;
      r.className = 'it ' + (good ? 'ok' : 'no');
      r.append(h('small', { style: 'grid-column:1/-1;color:var(--muted)' }, (good ? '✓ ' : `✗ Better: ${r._it.c}. `) + (r._it.why || '')));
    });
    out.innerHTML = '';
    out.append(fb(ok === rows.length ? 'ok' : 'mid', blank ? `Answer all ${rows.length} first (${blank} left).` : `${ok} of ${rows.length} correct. ${explain || ''}`));
    if (!blank) done();
  }
}

export const LABS = {

  hashLab: {
    title: 'Fingerprint any text with SHA-256',
    intro: 'Type anything, for example a line from a patient record. Your browser computes its real SHA-256 hash. Then change just one character and compare.',
    mount(el, done) {
      const ta = h('textarea', { 'aria-label': 'Text to hash' }); ta.value = 'Patient 042: Amoxicillin 500mg';
      const cur = h('div'), base = h('div'), stat = h('p', { class: 'muted', role: 'status' });
      let saved = null, last = '';
      const run = async () => { last = await sha256Hex(ta.value); cur.replaceChildren(h('b', null, 'Hash now'), hexDiff(saved, last)); if (saved) { let d = 0; for (let i = 0; i < 64; i++) if (saved[i] !== last[i]) d++; stat.textContent = `${d} of 64 characters differ from the saved fingerprint. Same text always gives the same hash; a tiny change gives a completely different one.`; if (d) done(); } };
      ta.addEventListener('input', run);
      el.append(ta, h('div', { class: 'row', style: 'margin:10px 0' }, h('button', { type: 'button', class: 'btn', onclick: async () => { saved = last; base.replaceChildren(h('b', null, 'Saved fingerprint'), h('div', { class: 'hex' }, saved)); stat.textContent = 'Now change one character in the text above.'; } }, 'Save this fingerprint'), h('span', { class: 'muted' }, 'Always 64 hexadecimal characters, whatever the length of the text.')), cur, h('div', { style: 'height:8px' }), base, stat);
      run();
    }
  },

  chainLab: {
    title: 'Break and repair a mini blockchain',
    intro: 'Four blocks of record updates. Each block stores the previous block\'s hash, and a valid hash must start with "000". Edit any block\'s data, watch the chain break, then mine to find a new nonce.',
    mount(el, done) {
      const DIFF = '000';
      const data = ['Genesis: ledger opened', 'Patient 042 admitted to Ward 7', 'Blood test ordered by Dr Shah', 'Discharge letter sent to GP'];
      const B = data.map(d => ({ data: d, nonce: 0, hash: '', prev: '' }));
      const wrap = h('div', { class: 'blocks' }), log = h('p', { class: 'muted', role: 'status' });
      const calc = b => sha256Hex(`${b.prev}|${b.data}|${b.nonce}`);
      async function refresh() {
        for (let i = 0; i < B.length; i++) { B[i].prev = i ? B[i - 1].hash : '0'.repeat(64); B[i].hash = await calc(B[i]); }
        render();
      }
      async function mine(i, quiet) {
        let tries = 0; B[i].prev = i ? B[i - 1].hash : '0'.repeat(64);
        const t0 = performance.now();
        while (true) { B[i].hash = await calc(B[i]); if (B[i].hash.startsWith(DIFF)) break; B[i].nonce++; tries++; if (tries % 400 === 0) await new Promise(r => setTimeout(r)); }
        if (!quiet) log.textContent = `Block ${i + 1} mined: ${tries.toLocaleString('en-GB')} guesses in ${Math.round(performance.now() - t0)} ms. That guessing is the "work" in Proof of Work.`;
        await refresh();
      }
      function render() {
        wrap.innerHTML = '';
        B.forEach((b, i) => {
          const valid = b.hash.startsWith(DIFF) && (i === 0 || b.prev === B[i - 1].hash);
          const inp = h('input', { type: 'text', value: b.data, 'aria-label': `Data in block ${i + 1}` });
          inp.addEventListener('change', async () => { b.data = inp.value; await refresh(); log.textContent = 'Changed! This block\'s hash no longer starts with 000, and every later block now points at a hash that does not match.'; });
          wrap.append(h('div', { class: 'blk' + (valid ? '' : ' bad') }, h('b', null, i === 0 ? 'Block 1 (genesis)' : `Block ${i + 1}`),
            h('label', null, 'Data'), inp, h('label', null, 'Nonce'), h('div', { class: 'h' }, String(b.nonce)),
            h('label', null, 'Previous hash'), h('div', { class: 'h' }, b.prev.slice(0, 20) + '…'),
            h('label', null, 'This block\'s hash'), h('div', { class: 'h' }, b.hash.slice(0, 20) + '…'),
            h('button', { type: 'button', class: 'btn', onclick: async e => { e.target.disabled = true; e.target.textContent = 'Mining…'; await mine(i); done(); } }, valid ? 'Mine again' : 'Mine this block')));
        });
      }
      el.append(wrap, log, h('p', { class: 'muted', style: 'font-size:.85rem' }, 'Tip: after fixing one block, the next ones still need re-mining. Rewriting history means redoing all that work, faster than everyone else.'));
      (async () => { log.textContent = 'Preparing the chain…'; for (let i = 0; i < B.length; i++) await mine(i, true); log.textContent = 'All four blocks are valid (green). Try editing block 2.'; })();
    }
  },

  merkleLab: {
    title: 'Watch a Merkle root change',
    intro: 'Four record entries are hashed in pairs, then the pairs are hashed again, giving one Merkle root that summarises them all. Edit any entry.',
    mount(el, done) {
      const vals = ['Temp 37.1', 'BP 128/82', 'Pulse 76', 'SpO2 97%'];
      const ins = vals.map((v, i) => { const x = h('input', { type: 'text', value: v, 'aria-label': `Entry ${i + 1}` }); x.addEventListener('input', run); return x; });
      const out = h('div', { class: 'stackv' }); let first = null;
      async function run() {
        const L = await Promise.all(ins.map(i => sha256Hex(i.value)));
        const P = [await sha256Hex(L[0] + L[1]), await sha256Hex(L[2] + L[3])];
        const R = await sha256Hex(P[0] + P[1]);
        if (!first) first = R;
        out.replaceChildren(
          h('div', { class: 'blocks' }, L.map((x, i) => h('div', { class: 'blk' }, h('label', null, `Entry ${i + 1} hash`), h('div', { class: 'h' }, x.slice(0, 16) + '…')))),
          h('div', { class: 'blocks' }, P.map((x, i) => h('div', { class: 'blk' }, h('label', null, `Pair ${i + 1} hash`), h('div', { class: 'h' }, x.slice(0, 16) + '…')))),
          h('div', { class: 'blk' + (R === first ? '' : ' bad') }, h('label', null, 'Merkle root'), hexDiff(first, R)),
          R === first ? h('p', { class: 'muted' }, 'Root unchanged.') : fb('no', 'The root changed, so any tampering is detected by checking one value, not every record.'));
        if (R !== first) done();
      }
      el.append(h('div', { class: 'blocks' }, ins), out); run();
    }
  },

  signLab: {
    title: 'Sign a prescription with a private key',
    intro: 'Your browser creates a real key pair. Sign the prescription with the private key, then anyone can check it with the public key. Edit one word and check again.',
    mount(el, done) {
      if (!(window.crypto && crypto.subtle)) { el.append(fb('mid', 'This browser does not offer Web Crypto, so the lab cannot run here.')); return; }
      const ta = h('textarea', { 'aria-label': 'Prescription text' }); ta.value = 'Dr Shah prescribes Patient 042: amoxicillin 500 mg, three times a day for 7 days.';
      const st = h('div', { class: 'stackv' }); let keys = null, sig = null;
      const enc = t => new TextEncoder().encode(t);
      const toHex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
      const gen = h('button', { type: 'button', class: 'btn', onclick: async () => { keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']); const pub = await crypto.subtle.exportKey('raw', keys.publicKey); st.replaceChildren(h('p', null, h('b', null, 'Key pair ready. '), 'The private key never leaves this page. Public key: '), h('div', { class: 'hex' }, toHex(pub).slice(0, 48) + '…')); signB.disabled = false; } }, '1. Create my key pair');
      const signB = h('button', { type: 'button', class: 'btn', disabled: true, onclick: async () => { sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, keys.privateKey, enc(ta.value)); st.append(h('p', null, h('b', null, 'Signed. '), 'Signature:'), h('div', { class: 'hex' }, toHex(sig).slice(0, 48) + '…')); verB.disabled = false; } }, '2. Sign with private key');
      const verB = h('button', { type: 'button', class: 'btn primary', disabled: true, onclick: async () => { const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, keys.publicKey, sig, enc(ta.value)); st.append(ok ? fb('ok', '✓ Valid: this exact text was signed by the holder of the private key.') : fb('no', '✗ Invalid: the text was changed after signing, so the network would reject it.')); if (!ok) done(); } }, '3. Verify with public key');
      el.append(ta, h('div', { class: 'row', style: 'margin:10px 0' }, gen, signB, verB), st, h('p', { class: 'muted', style: 'font-size:.85rem' }, 'Lose the private key and you cannot sign; leak it and someone else can sign as you. That is why key management matters.'));
    }
  },

  consensusLab: {
    title: 'Proof of Work or Proof of Stake?',
    intro: 'Move the sliders and compare. The bars are illustrative, to show the direction of each effect, not real measurements.',
    mount(el, done) {
      const miners = h('input', { type: 'range', min: 2, max: 50, value: 10, 'aria-label': 'Number of miners competing' });
      const conc = h('input', { type: 'range', min: 10, max: 90, value: 30, 'aria-label': 'Share of all stake held by the three largest stakers' });
      const out = h('div', { class: 'stackv' });
      const m = (n, v, c) => h('div', { class: 'meter' }, h('span', null, n), h('div', { class: 'bar' }, h('i', { style: `width:${Math.min(100, v)}%;background:${c}` })), h('span', { class: 'mono' }, ''));
      function run() {
        const n = +miners.value, k = +conc.value;
        out.replaceChildren(
          h('b', null, 'Proof of Work'), m('Energy used', n * 2, 'var(--bad)'), h('p', { class: 'muted' }, `${n} miners all race to solve the same puzzle; only one wins, so most of the effort is spent and thrown away. More miners, more energy.`),
          h('b', null, 'Proof of Stake'), m('Energy used', 6, 'var(--good)'), m('Centralisation risk', k, 'var(--signal)'),
          h('p', { class: 'muted' }, k > 50 ? `With ${k}% of the stake in three hands, a few large holders could dominate who validates blocks.` : `Stake is fairly spread out (${k}% held by the top three), so control is shared.`));
        done();
      }
      miners.addEventListener('input', run); conc.addEventListener('input', run);
      el.append(h('label', null, 'Miners competing (Proof of Work)'), miners, h('label', null, 'Share of stake held by the 3 largest stakers (Proof of Stake)'), conc, out); run();
    }
  },

  typeLab: {
    title: 'Choose the right type of blockchain',
    intro: 'For each healthcare situation, pick public, private or consortium.',
    mount(el, done) {
      sorter(el, done, [
        { t: 'One hospital\'s internal log of pharmacy stock movements', c: 'Private', why: 'One organisation runs it and controls who joins.' },
        { t: 'Five hospitals in a region sharing referral records', c: 'Consortium', why: 'Several known organisations share control.' },
        { t: 'An open cryptocurrency that anyone in the world can join', c: 'Public', why: 'Anyone can read, join and take part.' },
        { t: 'Universities and hospitals jointly logging clinical trial data hashes', c: 'Consortium', why: 'A known group of partners governs it together.' },
        { t: 'A GP practice\'s own audit trail of who opened records', c: 'Private', why: 'A single owner and a closed group of users.' },
        { t: 'A charity publishing donations so anyone can verify them', c: 'Public', why: 'Openness to everyone is the point.' }
      ], ['Public', 'Private', 'Consortium'], 'Regulated patient data usually suits private or consortium (permissioned) chains.');
    }
  },

  contractLab: {
    title: 'Run a medication-adherence smart contract',
    intro: 'The contract rewards a patient for each dose taken on time and alerts the doctor after too many missed doses. Set the rules, mark a week of doses, then run it.',
    mount(el, done) {
      const pts = h('input', { type: 'number', min: 1, max: 10, value: 2, style: 'width:80px', 'aria-label': 'Points per on-time dose' });
      const lim = h('input', { type: 'number', min: 1, max: 7, value: 2, style: 'width:80px', 'aria-label': 'Missed doses before alert' });
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], taken = [true, true, false, true, false, true, true];
      const dayRow = h('div', { class: 'row' });
      const drawDays = () => { dayRow.replaceChildren(...days.map((d, i) => h('button', { type: 'button', class: 'btn', style: `min-width:64px;${taken[i] ? 'border-color:var(--good);background:var(--good-soft)' : 'border-color:var(--bad);background:var(--bad-soft)'}`, 'aria-pressed': String(taken[i]), onclick: () => { taken[i] = !taken[i]; drawDays(); } }, `${d} ${taken[i] ? '✓' : '✗'}`))); };
      drawDays();
      const code = h('div', { class: 'codebox' }); const out = h('div', { class: 'stackv' });
      const drawCode = () => code.replaceChildren(h('div', null, `IF dose logged on time  THEN reward += ${pts.value}`), h('div', null, `IF missed doses >= ${lim.value}  THEN alert doctor`));
      pts.oninput = drawCode; lim.oninput = drawCode; drawCode();
      el.append(h('div', { class: 'row' }, h('label', null, 'Points per on-time dose ', pts), h('label', null, 'Alert after missed doses ', lim)), code, h('p', { class: 'muted', style: 'margin-top:8px' }, 'Click a day to mark the dose taken or missed:'), dayRow,
        h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { type: 'button', class: 'btn primary', onclick: run }, 'Run the contract')), out);
      function run() {
        let reward = 0, missed = 0, alert = null; const log = [];
        days.forEach((d, i) => { if (taken[i]) { reward += +pts.value; log.push(`${d}: on time, +${pts.value} points`); } else { missed++; log.push(`${d}: missed (${missed})`); if (!alert && missed >= +lim.value) { alert = d; log.push(`${d}: ALERT sent to doctor`); } } });
        out.replaceChildren(h('div', { class: 'codebox' }, log.map(l => h('div', { class: /ALERT/.test(l) ? 'cur' : '' }, l))), fb(alert ? 'mid' : 'ok', `Total reward: ${reward} points. ${alert ? `Doctor alerted on ${alert}.` : 'No alert needed.'} The same inputs always give the same result, with no one processing it by hand.`));
        done();
      }
    }
  },

  careLevelLab: {
    title: 'Sort services into levels of care',
    intro: 'Place each service at its typical level of care. Exact boundaries vary between countries.',
    mount(el, done) {
      sorter(el, done, [
        { t: 'A first appointment with a GP about a cough', c: 'Primary', why: 'First-contact care.' },
        { t: 'Advice from a community pharmacist', c: 'Primary', why: 'First point of contact in the community.' },
        { t: 'A hospital outpatient clinic for a skin condition, after GP referral', c: 'Secondary', why: 'Specific diagnostic and treatment services.' },
        { t: 'An X-ray and cast for a broken wrist at a district hospital', c: 'Secondary', why: 'Specific diagnosis and treatment in hospital.' },
        { t: 'Complex brain surgery at a regional specialist centre', c: 'Tertiary', why: 'Highly specialised care in a specialised hospital.' },
        { t: 'An experimental treatment offered within a clinical trial', c: 'Quaternary', why: 'Advanced and experimental treatments.' }
      ], ['Primary', 'Secondary', 'Tertiary', 'Quaternary'], 'Each level builds on the one below.');
    }
  },

  telemedLab: {
    title: 'Who does what in a telemedicine service?',
    intro: 'Assign each job to the technology that does it in the chapter\'s telemedicine case.',
    mount(el, done) {
      sorter(el, done, [
        { t: 'Measure a patient\'s heart rate at home every minute', c: 'IoT', why: 'Wearables and sensors collect real-time data.' },
        { t: 'Send readings from the patient\'s home over the internet', c: 'IoT', why: 'Connected devices transmit what they measure.' },
        { t: 'Keep months of readings available to the care team', c: 'Cloud', why: 'Cloud services store and serve large amounts of data.' },
        { t: 'Spot an unusual pattern and flag a possible risk early', c: 'AI', why: 'Predictive analytics finds patterns in large datasets.' },
        { t: 'Keep a tamper-proof record of every access to the data', c: 'Blockchain', why: 'Immutable records give a trustworthy audit trail.' },
        { t: 'Allow only authorised clinicians to see the readings', c: 'Blockchain', why: 'Smart contracts can enforce access permissions.' }
      ], ['IoT', 'Cloud', 'AI', 'Blockchain'], 'Together they collect, store, analyse and secure the data.');
    }
  },

  layerLab: {
    title: 'Put each threat on the security map',
    intro: 'Is each threat mainly a problem for process security, data security or infrastructure security?',
    mount(el, done) {
      sorter(el, done, [
        { t: 'Re-entrancy attack on a smart contract', c: 'Process', why: 'It abuses how a contract runs.' },
        { t: 'Consensus manipulation', c: 'Process', why: 'It corrupts how blocks are agreed.' },
        { t: 'Transaction ordering attack', c: 'Process', why: 'It games the order in which transactions are processed.' },
        { t: 'Double spending', c: 'Data', why: 'The same value is recorded as spent twice.' },
        { t: 'Privacy breach of patient details on the ledger', c: 'Data', why: 'Confidentiality of the stored data fails.' },
        { t: 'Distributed denial of service (DDoS) on nodes', c: 'Infrastructure', why: 'It floods the machines and network links.' },
        { t: 'A Byzantine node that sends conflicting messages', c: 'Infrastructure', why: 'A faulty or dishonest node in the network.' },
        { t: 'Too few organisations running most of the nodes', c: 'Infrastructure', why: 'Node centralisation weakens the network.' }
      ], ['Process', 'Data', 'Infrastructure'], 'Consensus is so important that some schemes treat it as a fourth category.');
    }
  },

  attack51Lab: {
    title: 'Race an attacker against the honest chain',
    intro: 'An attacker starts two blocks behind and tries to secretly build a longer chain. Each new block goes to the attacker with probability equal to their share of mining power. Run many races.',
    mount(el, done) {
      const share = h('input', { type: 'range', min: 5, max: 70, value: 30, 'aria-label': 'Attacker share of mining power' });
      const lab = h('b', null); const vis = h('div', { class: 'race' }); const out = h('div');
      const race = (q, rec) => { let a = 0, hn = 2; const seq = []; for (let k = 0; k < 60; k++) { if (Math.random() < q) { a++; seq.push('a'); } else { hn++; seq.push('h'); } if (a > hn) { rec && rec(seq); return true; } } rec && rec(seq); return false; };
      const upd = () => { lab.textContent = `Attacker controls ${share.value}% of mining power`; };
      share.addEventListener('input', upd); upd();
      el.append(lab, share, h('div', { class: 'row', style: 'margin:10px 0' }, h('button', { type: 'button', class: 'btn primary', onclick: run }, 'Run 500 races')), vis, out);
      function run() {
        const q = +share.value / 100; let wins = 0, shown = null;
        for (let i = 0; i < 500; i++) if (race(q, i === 0 ? s => { shown = s; } : null)) wins++;
        const row = (who, c) => h('div', { class: 'ln' }, h('span', { style: 'width:auto;background:none;margin-right:6px' }, who), ...shown.map(s => s === who[0].toLowerCase() ? h('span', { style: `background:${c}` }) : h('span', { style: 'background:var(--surface-2)' })));
        vis.replaceChildren(h('small', { class: 'muted' }, 'First race, block by block:'), row('Honest', 'var(--good)'), row('Attacker', 'var(--bad)'));
        const pct = Math.round(wins / 5);
        out.replaceChildren(fb(q > 0.5 ? 'no' : pct > 20 ? 'mid' : 'ok', `The attacker overtook the honest chain in ${wins} of 500 races (${pct}%). ${q > 0.5 ? 'With more than half the power, the attacker wins almost every time: that is a 51% attack.' : 'Below half, the attacker usually falls behind, and the more blocks they must catch up, the less likely they are to succeed.'}`));
        done();
      }
    }
  },

  reentrancyLab: {
    title: 'Step through a re-entrancy attack',
    intro: 'A claims fund lets a member withdraw their 1-unit balance. The attacker\'s wallet calls withdraw again the moment money arrives. Step through, then apply the fix.',
    mount(el, done) {
      let fixed = false, vault = 5, bal = 1, depth = 0, line = 0, stolen = 0, ended = false;
      const lines = () => fixed ? ['withdraw():', '  1. check balance > 0', '  2. set balance = 0', '  3. send 1 unit to caller'] : ['withdraw():', '  1. check balance > 0', '  2. send 1 unit to caller', '  3. set balance = 0'];
      const code = h('div', { class: 'codebox' }), state = h('div', { class: 'row', style: 'margin:10px 0' }), log = h('div', { class: 'codebox', style: 'min-height:60px' });
      const fixB = h('button', { type: 'button', class: 'btn', onclick: () => { fixed = !fixed; fixB.textContent = fixed ? 'Remove the fix' : 'Apply the fix'; reset(); } }, 'Apply the fix');
      el.append(code, state, h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn primary', onclick: step }, 'Step ▶'), h('button', { type: 'button', class: 'btn ghost', onclick: reset }, 'Reset'), fixB), h('p', { class: 'muted', style: 'margin:8px 0 4px' }, 'What happens:'), log);
      function draw() {
        code.replaceChildren(...lines().map((l, i) => h('div', { class: i === line && !ended ? 'cur' : '' }, l + (i === line && !ended && depth ? `   ← call #${depth}` : ''))));
        state.replaceChildren(h('span', { class: 'pill sig' }, `Fund: ${vault}`), h('span', { class: 'pill acc' }, `Attacker's recorded balance: ${bal}`), h('span', { class: 'pill' }, `Taken: ${stolen}`));
      }
      const say = (t, c) => log.append(h('div', { style: c ? `color:${c}` : '' }, t));
      function reset() { vault = 5; bal = 1; depth = 1; line = 1; stolen = 0; ended = false; log.innerHTML = ''; say('Attacker calls withdraw().'); draw(); }
      function step() {
        if (ended) return;
        const L = lines()[line];
        if (/check/.test(L)) { if (bal > 0 && vault > 0) { say(`Check passes (balance is ${bal}).`); line++; } else { say(bal > 0 ? 'Fund is empty.' : 'Check fails: balance is 0. Request refused.', 'var(--good)'); end(); return; } }
        else if (/send/.test(L)) { vault--; stolen++; say(`Sent 1 unit. Fund now ${vault}.`); if (!fixed || bal > 0 || true) { if (vault > 0) { depth++; line = 1; say(`Attacker's wallet immediately calls withdraw() again (call #${depth}).`, 'var(--bad)'); } else { say('Fund drained.', 'var(--bad)'); end(); } } }
        else if (/set balance/.test(L)) { bal = 0; say('Balance set to 0.'); line++; if (line >= lines().length) { end(); return; } }
        draw();
      }
      function end() { ended = true; draw(); say(fixed ? `Done: the attacker got ${stolen} unit, exactly what they were owed.` : `Done: the attacker took ${stolen} units while owed only 1. The balance was updated too late.`, fixed ? 'var(--good)' : 'var(--bad)'); done(); }
      reset();
    }
  },

  multisigLab: {
    title: 'Release a record with 2 of 3 keys',
    intro: 'A sensitive record is released only when two of three key holders sign. Try different combinations, including a thief who has copied one key.',
    mount(el, done) {
      const holders = [['dr', 'Dr Ahmed'], ['ph', 'Pharmacist Lee'], ['nu', 'Nurse Patel']];
      const signed = new Set(); let thief = false;
      const btns = h('div', { class: 'row' }), out = h('div');
      function draw() {
        btns.replaceChildren(...holders.map(([id, n]) => h('button', { type: 'button', class: 'btn', 'aria-pressed': String(signed.has(id)), style: signed.has(id) ? 'border-color:var(--good);background:var(--good-soft)' : '', onclick: () => { signed.has(id) ? signed.delete(id) : signed.add(id); draw(); } }, `${signed.has(id) ? '🔑 ' : ''}${n}`)),
          h('button', { type: 'button', class: 'btn', style: thief ? 'border-color:var(--bad);background:var(--bad-soft)' : '', onclick: () => { thief = !thief; draw(); } }, thief ? '🦹 Thief signs with stolen nurse key' : 'Add a thief with a stolen nurse key'));
        const keys = new Set(signed); if (thief) keys.add('nu');
        const open = keys.size >= 2;
        const thiefOnly = thief && signed.size === 0, thiefHelped = thief && !signed.has('nu') && open && signed.size === 1;
        out.replaceChildren(fb(open ? (thiefHelped ? 'no' : 'ok') : 'mid', open ? (thiefHelped ? 'Released, but one of the two signatures came from a stolen key. Multi-signature only protects you while fewer keys than the threshold are compromised, so keys must be guarded.' : 'Released: two genuine signatures were collected.') : (thiefOnly ? 'Still locked: one stolen key is not enough on its own.' : `Locked: ${keys.size} of 2 signatures.`)));
        if (open || thiefOnly) done();
      }
      el.append(btns, out); draw();
    }
  },

  tradeoffLab: {
    title: 'Balance security and performance',
    intro: 'Switch protections on and off. The scores are illustrative: they show the direction of the trade-off, not real measurements.',
    mount(el, done) {
      const opts = [['Multi-signature approval', 18, 10], ['Audit check on every transaction', 15, 18], ['Encrypted channels', 14, 6], ['Zero-knowledge proofs', 16, 20], ['More validating nodes', 12, 14]];
      const on = new Set([2]);
      const list = h('div', { class: 'stackv' }), out = h('div', { class: 'stackv', style: 'margin-top:10px' });
      function draw() {
        list.replaceChildren(...opts.map(([n], i) => h('label', { class: 'row', style: 'gap:8px' }, h('input', { type: 'checkbox', checked: on.has(i), onchange: e => { e.target.checked ? on.add(i) : on.delete(i); draw(); done(); } }), n)));
        let sec = 25, spd = 100; on.forEach(i => { sec += opts[i][1]; spd -= opts[i][2]; });
        const m = (n, v, c) => h('div', { class: 'meter' }, h('span', null, n), h('div', { class: 'bar' }, h('i', { style: `width:${Math.max(0, Math.min(100, v))}%;background:${c}` })), h('span', { class: 'mono' }, Math.max(0, Math.min(100, v))));
        out.replaceChildren(m('Security', sec, 'var(--accent)'), m('Speed', spd, 'var(--signal)'),
          h('p', { class: 'muted' }, sec >= 80 && spd < 45 ? 'Very secure, but slow: a busy hospital system might struggle.' : sec < 50 ? 'Fast, but exposed: important protections are missing.' : 'A middle path: judge it against how sensitive the data is and how fast the service must be.'));
      }
      el.append(list, out); draw();
    }
  }
};
