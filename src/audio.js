let ctx = null;
let lastPersonSfxAt = 0;
let lastHonkAt = 0;
let lastBellAt = 0;
let wilhelmBuffer = null;
let wilhelmLoading = false;

function getWilhelmUrl() {
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
  return `${base}sfx/wilhelm.mp3`;
}

function getContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) ctx = new AudioCtx();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  if (ctx && !wilhelmBuffer && !wilhelmLoading && typeof fetch === 'function') {
    wilhelmLoading = true;
    fetch(getWilhelmUrl())
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((buf) => (buf && ctx ? ctx.decodeAudioData(buf) : null))
      .then((decoded) => {
        if (decoded) wilhelmBuffer = decoded;
      })
      .catch(() => {})
      .finally(() => {
        wilhelmLoading = false;
      });
  }
  return ctx;
}

export function pickPersonFallSound(roll = Math.random(), isLastPerson = false) {
  if (isLastPerson) return 'wilhelm'; // real wilhelm.mp3 saved exclusively for the very last person!
  if (roll < 0.28) return 'yelp';     // ~28% quick comical falling yelp
  if (roll < 0.42) return 'scream';   // ~14% longer dramatic synth falling scream
  return 'none';
}

export function shouldPlayVehicleHonk(roll = Math.random()) {
  return roll < 0.5; // honk half as often so traffic feels natural
}

export function playSwallow(tier = 1, enabled = true) {
  if (!enabled) return;
  try {
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    // Tiny items make bright cute pops; huge buildings make deep satisfying gulps!
    const baseFreq = Math.max(110, 520 - tier * 58);
    osc.type = tier >= 5 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.15, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.52, now + 0.14);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  } catch {
    // Ignore audio errors on restricted devices
  }
}

export function playPersonFall(enabled = true, { isLastPerson = false, roll = Math.random() } = {}) {
  const kind = pickPersonFallSound(roll, isLastPerson);
  if (!enabled || kind === 'none') return kind;
  try {
    const ac = getContext();
    if (!ac) return kind;
    const now = ac.currentTime;
    if (kind !== 'wilhelm' && now - lastPersonSfxAt < 0.35) return 'none';
    lastPersonSfxAt = now + (kind === 'wilhelm' ? 1.2 : kind === 'scream' ? 0.5 : 0);

    if (kind === 'wilhelm') {
      if (wilhelmBuffer) {
        const src = ac.createBufferSource();
        const gain = ac.createGain();
        src.buffer = wilhelmBuffer;
        gain.gain.value = 0.55;
        src.connect(gain).connect(ac.destination);
        src.start(now);
      } else {
        playWilhelmNodes(ac, now);
      }
    } else if (kind === 'scream') {
      playWilhelmNodes(ac, now);
    } else {
      playYelpNodes(ac, now);
    }
  } catch {
    // Ignore audio errors
  }
  return kind;
}

function playYelpNodes(ac, now) {
  // Expressive falling "whoaa-aah!" yelp (~0.46s) clearly distinct from the short swallow pop
  const voiceScale = 0.88 + Math.random() * 0.36;
  const dur = 0.44 + Math.random() * 0.08;
  const osc = ac.createOscillator();
  const vib = ac.createOscillator();
  const vibGain = ac.createGain();
  const formant = ac.createBiquadFilter();
  const gain = ac.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(340 * voiceScale, now);
  osc.frequency.exponentialRampToValueAtTime(640 * voiceScale, now + 0.085);
  osc.frequency.exponentialRampToValueAtTime(490 * voiceScale, now + dur * 0.45);
  osc.frequency.exponentialRampToValueAtTime(215 * voiceScale, now + dur);

  vib.type = 'sine';
  vib.frequency.value = 11;
  vibGain.gain.setValueAtTime(9, now);
  vibGain.gain.exponentialRampToValueAtTime(3, now + dur);
  vib.connect(vibGain).connect(osc.frequency);

  formant.type = 'bandpass';
  formant.frequency.setValueAtTime(1250 * voiceScale, now);
  formant.frequency.exponentialRampToValueAtTime(680 * voiceScale, now + dur);
  formant.Q.value = 3.4;

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.115, now + 0.03);
  gain.gain.setValueAtTime(0.095, now + dur * 0.48);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.02);

  osc.connect(formant).connect(gain).connect(ac.destination);
  osc.start(now);
  vib.start(now);
  osc.stop(now + dur + 0.04);
  vib.stop(now + dur + 0.04);
}

function playWilhelmNodes(ac, now) {
  // Longer, unmistakable iconic "aaAAh-AAAaaagh!" contour (~1.05s) with dual vocal formants & vibrato
  const osc = ac.createOscillator();
  const vib = ac.createOscillator();
  const vibGain = ac.createGain();
  const f1 = ac.createBiquadFilter();
  const f2 = ac.createBiquadFilter();
  const master = ac.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(590, now + 0.11);
  osc.frequency.exponentialRampToValueAtTime(470, now + 0.23);
  osc.frequency.exponentialRampToValueAtTime(675, now + 0.41);
  osc.frequency.exponentialRampToValueAtTime(545, now + 0.64);
  osc.frequency.exponentialRampToValueAtTime(210, now + 1.04);

  // Expressive vocal vibrato
  vib.type = 'sine';
  vib.frequency.value = 13.5;
  vibGain.gain.setValueAtTime(14, now);
  vibGain.gain.exponentialRampToValueAtTime(28, now + 0.42);
  vibGain.gain.exponentialRampToValueAtTime(6, now + 1.02);
  vib.connect(vibGain).connect(osc.frequency);

  // Two parallel vocal formant filters ("AAH" vowel shape)
  f1.type = 'bandpass';
  f1.frequency.setValueAtTime(840, now);
  f1.frequency.exponentialRampToValueAtTime(600, now + 1.04);
  f1.Q.value = 4.2;

  f2.type = 'bandpass';
  f2.frequency.setValueAtTime(1980, now);
  f2.frequency.exponentialRampToValueAtTime(1250, now + 1.04);
  f2.Q.value = 5.0;

  master.gain.setValueAtTime(0.001, now);
  master.gain.exponentialRampToValueAtTime(0.15, now + 0.06);
  master.gain.setValueAtTime(0.135, now + 0.48);
  master.gain.exponentialRampToValueAtTime(0.001, now + 1.06);

  osc.connect(f1).connect(master);
  osc.connect(f2).connect(master);
  master.connect(ac.destination);

  osc.start(now);
  vib.start(now);
  osc.stop(now + 1.08);
  vib.stop(now + 1.08);
}

export function playVehicleHonk(shape = 'car', enabled = true, roll = Math.random()) {
  if (!enabled || !shouldPlayVehicleHonk(roll)) return false;
  try {
    const ac = getContext();
    if (!ac) return false;
    const now = ac.currentTime;
    if (now - lastHonkAt < 0.25) return false;
    lastHonkAt = now;

    const isHeavy = shape === 'truck' || shape === 'bus';
    const pitchJitter = 0.94 + Math.random() * 0.12;
    const fLow = (isHeavy ? 185 : 349) * pitchJitter;
    const fHigh = (isHeavy ? 233 : 440) * pitchJitter;

    // Cars occasionally do a quick double "beep-beep!", trucks/buses do a single deep honk
    const doubleBeep = !isHeavy && Math.random() < 0.45;
    const bursts = doubleBeep
      ? [
          { start: now, dur: 0.095, droop: 0.95 },
          { start: now + 0.125, dur: 0.14, droop: 0.86 },
        ]
      : [{ start: now, dur: isHeavy ? 0.28 : 0.21, droop: 0.87 }];

    for (const b of bursts) {
      const o1 = ac.createOscillator();
      const o2 = ac.createOscillator();
      const filter = ac.createBiquadFilter();
      const gain = ac.createGain();

      o1.type = 'sawtooth';
      o2.type = 'sawtooth';
      o1.frequency.setValueAtTime(fLow, b.start);
      o1.frequency.exponentialRampToValueAtTime(fLow * b.droop, b.start + b.dur);
      o2.frequency.setValueAtTime(fHigh, b.start);
      o2.frequency.exponentialRampToValueAtTime(fHigh * b.droop, b.start + b.dur);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isHeavy ? 950 : 1650, b.start);
      filter.Q.value = 1.4;

      gain.gain.setValueAtTime(0.001, b.start);
      gain.gain.exponentialRampToValueAtTime(isHeavy ? 0.085 : 0.075, b.start + 0.015);
      gain.gain.setValueAtTime(isHeavy ? 0.08 : 0.07, b.start + b.dur * 0.72);
      gain.gain.exponentialRampToValueAtTime(0.001, b.start + b.dur);

      o1.connect(filter);
      o2.connect(filter);
      filter.connect(gain).connect(ac.destination);

      o1.start(b.start);
      o2.start(b.start);
      o1.stop(b.start + b.dur + 0.02);
      o2.stop(b.start + b.dur + 0.02);
    }
  } catch {
    // Ignore audio errors
  }
}

export function playBikeBell(enabled = true) {
  if (!enabled) return;
  try {
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    if (now - lastBellAt < 0.22) return;
    lastBellAt = now;

    // Bright two-ding metallic bicycle bell ("ring-ring!")
    const dings = [now, now + 0.095];
    for (const start of dings) {
      for (const [freq, amp] of [[2480, 0.06], [4960, 0.032]]) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(amp, start + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.22);
        osc.connect(gain).connect(ac.destination);
        osc.start(start);
        osc.stop(start + 0.23);
      }
    }
  } catch {
    // Ignore audio errors
  }
}

export function playSciFiHonk(shape = 'hoverCar', enabled = true, roll = Math.random()) {
  if (!enabled || !shouldPlayVehicleHonk(roll)) return false;
  try {
    const ac = getContext();
    if (!ac) return false;
    const now = ac.currentTime;
    if (now - lastHonkAt < 0.25) return false;
    lastHonkAt = now;

    // Playful retro sci-fi UFO warble / laser-horn that droops as it falls
    const isHeavy = shape === 'marsRover' || shape === 'hoverHauler';
    const isScooter = shape === 'hoverScooter';
    const base = isScooter ? 760 : isHeavy ? 260 : 520;
    const dur = isScooter ? 0.17 : isHeavy ? 0.28 : 0.24;

    const osc = ac.createOscillator();
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    const gain = ac.createGain();

    osc.type = isHeavy ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 0.62, now + dur);

    lfo.type = 'sine';
    lfo.frequency.value = isScooter ? 26 : 18;
    lfoGain.gain.value = isHeavy ? 24 : 58;
    lfo.connect(lfoGain).connect(osc.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + dur + 0.02);
    lfo.stop(now + dur + 0.02);
    return true;
  } catch {
    return false;
  }
}

export function playLevelUp(enabled = true) {
  if (!enabled) return;
  try {
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = now + i * 0.07;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.11, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  } catch {
    // Ignore audio errors
  }
}
