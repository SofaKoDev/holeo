let ctx = null;

function getContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) ctx = new AudioCtx();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
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
