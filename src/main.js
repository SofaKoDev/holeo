import './styles.css';
import { MAPS, TIERS, tierForRadius, tierProgressForRadius } from './catalog.js';
import { createGame, startGame, togglePause, stepGame } from './engine.js';
import { renderGame } from './render.js';
import { playSwallow, playLevelUp, playPersonFall, playVehicleHonk, playBikeBell, playSciFiHonk, playToySqueak } from './audio.js';

const BEST_KEY_PREFIX = 'holeo-arcade-best-v1';
const SOUND_KEY = 'holeo-sound-v1';
const LEVIS_GAMES_URL = 'https://sofakodev.github.io/levis-games/';
const $ = (sel) => document.querySelector(sel);

const bestScoreCache = new Map();

function bestKeyFor(mapId) {
  return mapId === 'town' ? BEST_KEY_PREFIX : `${BEST_KEY_PREFIX}-${mapId}`;
}

function readBest(mapId = 'town') {
  if (bestScoreCache.has(mapId)) return bestScoreCache.get(mapId);
  try {
    const val = Number(localStorage.getItem(bestKeyFor(mapId)));
    const best = Number.isFinite(val) && val > 0 ? val : 0;
    bestScoreCache.set(mapId, best);
    return best;
  } catch {
    return 0;
  }
}

function writeBest(score, mapId = 'town') {
  bestScoreCache.set(mapId, score);
  try {
    localStorage.setItem(bestKeyFor(mapId), String(score));
  } catch {
    // Ignore storage failures
  }
}

function readSoundEnabled() {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val === null ? true : val !== 'false';
  } catch {
    return true;
  }
}

function writeSoundEnabled(enabled) {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {
    // Ignore storage failures
  }
}

document.querySelector('#app').innerHTML = `
  <main class="holeo-app">
    <canvas id="game-canvas" aria-label="Holeo town map"></canvas>

    <header class="hud" id="hud" hidden>
      <div class="hud-pill hud-pill-tier">
        <small>SIZE</small>
        <strong id="hud-tier">Lv.1 · Tiny</strong>
        <div class="tier-progress" aria-hidden="true"><span id="hud-tier-bar"></span></div>
      </div>
      <div class="hud-pill">
        <small id="hud-mid-label">TOWN</small>
        <strong id="hud-mid-val">0%</strong>
      </div>
      <div class="hud-pill">
        <small>SCORE</small>
        <strong id="hud-score">0</strong>
      </div>
      <div class="hud-actions">
        <button id="btn-sound" type="button" aria-pressed="true" aria-label="Toggle sound">🔊</button>
        <button id="btn-pause" type="button" aria-label="Pause">⏸</button>
      </div>
    </header>

    <div id="milestone-banner" class="milestone-banner" role="status" hidden></div>

    <section id="overlay-start" class="overlay">
      <div class="card">
        <div class="logo-hole" aria-hidden="true"><span></span></div>
        <p class="kicker">SWALLOW THE WHOLE TOWN</p>
        <h1>Holeo</h1>
        <p class="subtitle">Start small, grow huge, and swallow everything in sight!</p>
        <div class="map-picker" id="map-picker" role="radiogroup" aria-label="Choose a map">
          ${MAPS.map(
            (m, i) => `
            <button type="button" class="map-chip${i === 0 ? ' active' : ''}" data-map="${m.id}" role="radio" aria-checked="${i === 0}">
              <span class="map-badge" aria-hidden="true">${m.badge}</span>
              <span class="map-copy">
                <strong>${m.name}</strong>
                <small>${m.subtitle}</small>
              </span>
            </button>`,
          ).join('')}
        </div>
        <div class="mode-buttons">
          <button id="play-sandbox" class="btn-primary" type="button">
            <strong>Relaxed Sandbox</strong>
            <small>No timer · Swallow 100% of the town</small>
          </button>
          <button id="play-arcade" class="btn-secondary" type="button">
            <strong>2-Minute Arcade</strong>
            <small id="arcade-best-label">Beat the clock!</small>
          </button>
          <a id="btn-levis-games" class="btn-ghost" href="${LEVIS_GAMES_URL}">← Back to Levi's Games</a>
        </div>
        <p class="controls-hint">Touch &amp; drag anywhere, drag with mouse, or use WASD / Arrow keys.</p>
      </div>
    </section>

    <section id="overlay-pause" class="overlay" hidden>
      <div class="card compact">
        <h2>Paused</h2>
        <p class="subtitle">Take a breather — the town isn't going anywhere!</p>
        <div class="stack-buttons">
          <button id="btn-resume" class="btn-primary" type="button">Keep Playing</button>
          <button id="btn-restart-pause" class="btn-secondary" type="button">Restart Town</button>
          <button id="btn-menu-pause" class="btn-ghost" type="button">Main Menu</button>
        </div>
      </div>
    </section>

    <section id="overlay-finish" class="overlay" hidden>
      <div class="card compact">
        <p class="kicker" id="finish-kicker">ROUND COMPLETE</p>
        <h2 id="finish-title">Town Swallowed!</h2>
        <strong id="finish-score" class="big-score">0</strong>
        <p id="finish-summary" class="subtitle"></p>
        <div class="stack-buttons">
          <button id="btn-play-again" class="btn-primary" type="button">Play Again</button>
          <button id="btn-menu-finish" class="btn-secondary" type="button">Main Menu</button>
        </div>
      </div>
    </section>
  </main>
`;

const canvas = $('#game-canvas');
const ctx = canvas.getContext('2d');

const ui = {
  hud: $('#hud'),
  hudTier: $('#hud-tier'),
  hudTierBar: $('#hud-tier-bar'),
  hudMidLabel: $('#hud-mid-label'),
  hudMidVal: $('#hud-mid-val'),
  hudScore: $('#hud-score'),
  btnSound: $('#btn-sound'),
  milestoneBanner: $('#milestone-banner'),
  overlayStart: $('#overlay-start'),
  overlayPause: $('#overlay-pause'),
  overlayFinish: $('#overlay-finish'),
  arcadeBestLabel: $('#arcade-best-label'),
  finishKicker: $('#finish-kicker'),
  finishTitle: $('#finish-title'),
  finishScore: $('#finish-score'),
  finishSummary: $('#finish-summary'),
};

let selectedMapId = MAPS[0].id;
let state = createGame({ mode: 'sandbox', mapId: selectedMapId });
let soundEnabled = readSoundEnabled();
let width = window.innerWidth;
let height = window.innerHeight;
let lastTime = 0;
let rafId = 0;

function syncSoundButton() {
  ui.btnSound.textContent = soundEnabled ? '🔊' : '🔇';
  ui.btnSound.setAttribute('aria-pressed', String(soundEnabled));
}

// Keyboard state
const keys = new Set();
window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && state.phase === 'playing') {
    e.preventDefault();
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
    keys.add(e.key.toLowerCase());
  }
  if (e.key === 'Escape' && (state.phase === 'playing' || state.phase === 'paused')) {
    togglePause(state);
    syncUi();
    if (state.phase === 'playing') scheduleLoop();
    else stopLoop();
  }
});
window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
window.addEventListener('blur', () => {
  keys.clear();
  pointer.active = false;
  if (state.phase === 'playing') {
    togglePause(state);
    syncUi();
    stopLoop();
  }
});

// Touch / mouse drag joystick
const pointer = { active: false, id: null, originX: 0, originY: 0, knobX: 0, knobY: 0, dx: 0, dy: 0 };
const MAX_DRAG = 52;

canvas.addEventListener('pointerdown', (e) => {
  if (state.phase !== 'playing') return;
  pointer.active = true;
  pointer.id = e.pointerId;
  pointer.originX = e.clientX;
  pointer.originY = e.clientY;
  pointer.knobX = e.clientX;
  pointer.knobY = e.clientY;
  pointer.dx = 0;
  pointer.dy = 0;
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener('pointermove', (e) => {
  if (!pointer.active || e.pointerId !== pointer.id) return;
  const rx = e.clientX - pointer.originX;
  const ry = e.clientY - pointer.originY;
  const dist = Math.hypot(rx, ry);
  const clamped = Math.min(dist, MAX_DRAG);
  const angle = Math.atan2(ry, rx);
  pointer.knobX = pointer.originX + Math.cos(angle) * clamped;
  pointer.knobY = pointer.originY + Math.sin(angle) * clamped;
  pointer.dx = dist > 4 ? (Math.cos(angle) * clamped) / MAX_DRAG : 0;
  pointer.dy = dist > 4 ? (Math.sin(angle) * clamped) / MAX_DRAG : 0;
});

function releasePointer(e) {
  if (e.pointerId !== pointer.id) return;
  pointer.active = false;
  pointer.dx = 0;
  pointer.dy = 0;
}
canvas.addEventListener('pointerup', releasePointer);
canvas.addEventListener('pointercancel', releasePointer);

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  renderGame(ctx, state, width, height, pointer);
}
window.addEventListener('resize', resize);

function getInputVector() {
  let ix = pointer.active ? pointer.dx : 0;
  let iy = pointer.active ? pointer.dy : 0;
  if (keys.has('arrowleft') || keys.has('a')) ix -= 1;
  if (keys.has('arrowright') || keys.has('d')) ix += 1;
  if (keys.has('arrowup') || keys.has('w')) iy -= 1;
  if (keys.has('arrowdown') || keys.has('s')) iy += 1;
  return [ix, iy];
}

function formatTime(sec) {
  const s = Math.ceil(sec);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

function syncUi() {
  const best = readBest(selectedMapId);
  ui.arcadeBestLabel.textContent = best ? `Best score: ${best.toLocaleString()}` : '2 minutes · High score chase';

  ui.hud.hidden = state.phase === 'ready';
  ui.overlayStart.hidden = state.phase !== 'ready';
  ui.overlayPause.hidden = state.phase !== 'paused';
  ui.overlayFinish.hidden = state.phase !== 'finished';

  const tier = tierForRadius(state.hole.radius);
  ui.hudTier.textContent = `Lv.${tier.level}/${TIERS.length} · ${tier.label}`;
  const pctNext = Math.round(tierProgressForRadius(state.hole.radius) * 100);
  ui.hudTierBar.style.width = `${pctNext}%`;
  ui.hudScore.textContent = state.score.toLocaleString();

  if (state.mode === 'arcade') {
    ui.hudMidLabel.textContent = 'TIME';
    ui.hudMidVal.textContent = formatTime(state.timeLeft);
  } else {
    const pct = Math.min(100, Math.round((state.swallowedCount / state.totalProps) * 100));
    ui.hudMidLabel.textContent =
      state.mapId === 'metro' ? 'CITY' : state.mapId === 'mars' ? 'MARS' : state.mapId === 'playroom' ? 'ROOM' : 'TOWN';
    ui.hudMidVal.textContent = `${pct}%`;
  }

  if (state.banner) {
    ui.milestoneBanner.hidden = false;
    ui.milestoneBanner.textContent = state.banner.text;
  } else {
    ui.milestoneBanner.hidden = true;
  }

  if (state.phase === 'finished') {
    let newBest = false;
    if (state.mode === 'arcade' && state.score > readBest(state.mapId)) {
      writeBest(state.score, state.mapId);
      newBest = true;
    }
    const pct = Math.round((state.swallowedCount / state.totalProps) * 100);
    const mapMeta = MAPS.find((m) => m.id === state.mapId) || MAPS[0];
    ui.finishKicker.textContent = newBest ? 'NEW HIGH SCORE!' : state.finishedReason === 'cleared' ? '100% CLEARED!' : 'TIME IS UP!';
    ui.finishTitle.textContent = state.finishedReason === 'cleared' ? `You Swallowed ${mapMeta.name}!` : 'What a Giant Hole!';
    ui.finishScore.textContent = state.score.toLocaleString();
    ui.finishSummary.textContent = `Swallowed ${state.swallowedCount} of ${state.totalProps} items (${pct}%) · Reached Lv.${tier.level} (${tier.label})`;
  }
}

function scheduleLoop() {
  if (!rafId) rafId = requestAnimationFrame(loop);
}

function stopLoop() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  lastTime = 0;
}

function loop(now) {
  rafId = 0;
  const dt = lastTime ? (now - lastTime) / 1000 : 0.016;
  lastTime = now;

  if (state.phase === 'playing') {
    const prevScore = state.score;
    const prevSwallowed = state.swallowedCount;
    const prevTimeSec = Math.ceil(state.timeLeft);
    const prevBanner = state.banner ? state.banner.text : '';
    const prevPhase = state.phase;

    const [ix, iy] = getInputVector();
    const { captured, swallowed, leveledUp } = stepGame(state, dt, ix, iy);
    const isLivingWalker = (p) => p.shape === 'person' || p.shape === 'alien' || p.shape === 'windupToy';
    const capturedPeople = captured.filter(isLivingWalker);
    const anyStandingPersonLeft = capturedPeople.length > 0 && state.town.props.some(
      (p) => isLivingWalker(p) && !p.swallowing && !p.swallowed,
    );
    capturedPeople.forEach((p, idx) => {
      const isLastPerson = !anyStandingPersonLeft && idx === capturedPeople.length - 1;
      playPersonFall(soundEnabled, { isLastPerson });
    });
    for (const prop of captured) {
      if (
        prop.shape === 'car' ||
        prop.shape === 'truck' ||
        prop.shape === 'bus' ||
        prop.shape === 'toyCar' ||
        prop.shape === 'toyTruck' ||
        prop.shape === 'toyTrain'
      ) {
        playVehicleHonk(prop.shape === 'toyTruck' || prop.shape === 'toyTrain' ? 'truck' : prop.shape, soundEnabled);
      } else if (prop.shape === 'cyclist' || prop.shape === 'toyScooter') {
        playBikeBell(soundEnabled);
      } else if (
        prop.shape === 'rubberDuck' ||
        prop.shape === 'plushBunny' ||
        prop.shape === 'teddyBear' ||
        prop.shape === 'plushDino' ||
        prop.shape === 'plushElephant'
      ) {
        playToySqueak(soundEnabled);
      } else if (
        prop.shape === 'hoverCar' ||
        prop.shape === 'saucerCar' ||
        prop.shape === 'marsRover' ||
        prop.shape === 'hoverHauler' ||
        prop.shape === 'hoverScooter'
      ) {
        playSciFiHonk(prop.shape, soundEnabled);
      }
    }
    if (swallowed.length) playSwallow(swallowed[swallowed.length - 1].tier, soundEnabled);
    if (leveledUp) playLevelUp(soundEnabled);

    const nextTimeSec = Math.ceil(state.timeLeft);
    const nextBanner = state.banner ? state.banner.text : '';
    if (
      state.score !== prevScore ||
      state.swallowedCount !== prevSwallowed ||
      nextTimeSec !== prevTimeSec ||
      nextBanner !== prevBanner ||
      state.phase !== prevPhase
    ) {
      syncUi();
    }
  }

  renderGame(ctx, state, width, height, pointer);

  if (state.phase === 'playing') {
    scheduleLoop();
  } else {
    lastTime = 0;
  }
}

function begin(mode) {
  state = createGame({ mode, mapId: selectedMapId, seed: Math.floor(Math.random() * 1_000_000) });
  startGame(state);
  pointer.active = false;
  syncUi();
  scheduleLoop();
}

for (const btn of document.querySelectorAll('#map-picker .map-chip')) {
  btn.onclick = () => {
    selectedMapId = btn.dataset.map;
    for (const el of document.querySelectorAll('#map-picker .map-chip')) {
      const active = el.dataset.map === selectedMapId;
      el.classList.toggle('active', active);
      el.setAttribute('aria-checked', String(active));
    }
    if (state.phase === 'ready') {
      state = createGame({ mode: state.mode, mapId: selectedMapId });
      syncUi();
      renderGame(ctx, state, width, height, pointer);
    }
  };
}

$('#play-sandbox').onclick = () => begin('sandbox');
$('#play-arcade').onclick = () => begin('arcade');
$('#btn-pause').onclick = () => {
  togglePause(state);
  syncUi();
  if (state.phase === 'playing') scheduleLoop();
  else stopLoop();
};
$('#btn-resume').onclick = () => {
  if (state.phase === 'paused') togglePause(state);
  syncUi();
  scheduleLoop();
};
$('#btn-restart-pause').onclick = () => begin(state.mode);
$('#btn-play-again').onclick = () => begin(state.mode);
$('#btn-menu-pause').onclick = $('#btn-menu-finish').onclick = () => {
  stopLoop();
  state = createGame({ mode: state.mode, mapId: selectedMapId });
  syncUi();
  renderGame(ctx, state, width, height, pointer);
};
ui.btnSound.onclick = () => {
  soundEnabled = !soundEnabled;
  writeSoundEnabled(soundEnabled);
  syncSoundButton();
};

syncSoundButton();
resize();
syncUi();
