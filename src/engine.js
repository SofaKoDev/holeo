import { tierForRadius } from './catalog.js';
import { createTown } from './world.js';

export const ARCADE_DURATION = 120; // seconds
export const START_RADIUS = 22;
const SWALLOW_RATIO = 0.88; // prop fits if prop.radius <= hole.radius * SWALLOW_RATIO

export function radiusFromMass(mass) {
  return Math.sqrt(mass / Math.PI) * 1.18;
}

export function massFromRadius(radius) {
  const r = radius / 1.18;
  return Math.PI * r * r;
}

export function cameraZoomForRadius(radius) {
  // Smoothly zoom out from 1.35x (tiny hole) down to 0.30x (colossal city-eater)
  const t = Math.max(0, Math.min(1, (radius - START_RADIUS) / 230));
  return 1.35 / (1 + t * 3.4);
}

export function createGame({ mode = 'sandbox', seed = 20261120 } = {}) {
  const town = createTown(seed);
  const startMass = massFromRadius(START_RADIUS);
  return {
    mode,
    phase: 'ready', // 'ready' | 'playing' | 'paused' | 'finished'
    town,
    hole: {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      mass: startMass,
      radius: START_RADIUS,
      tier: tierForRadius(START_RADIUS).level,
    },
    camera: {
      x: 0,
      y: 0,
      zoom: cameraZoomForRadius(START_RADIUS),
      shake: 0,
    },
    score: 0,
    swallowedCount: 0,
    totalProps: town.props.length,
    timeLeft: mode === 'arcade' ? ARCADE_DURATION : 0,
    elapsed: 0,
    popups: [],
    banner: null,
    finishedReason: null, // 'cleared' | 'time'
  };
}

export function startGame(state) {
  state.phase = 'playing';
}

export function togglePause(state) {
  if (state.phase === 'playing') state.phase = 'paused';
  else if (state.phase === 'paused') state.phase = 'playing';
}

export function stepGame(state, dt, inputX = 0, inputY = 0) {
  if (state.phase !== 'playing') return { swallowed: [], leveledUp: null };
  const clampedDt = Math.min(Math.max(dt, 0), 0.05);
  state.elapsed += clampedDt;

  if (state.mode === 'arcade') {
    state.timeLeft = Math.max(0, state.timeLeft - clampedDt);
    if (state.timeLeft === 0) {
      state.phase = 'finished';
      state.finishedReason = 'time';
      return { swallowed: [], leveledUp: null };
    }
  }

  const hole = state.hole;
  // Speed scales gently with hole size so crossing the city feels brisk when huge
  const maxSpeed = 195 + (hole.radius - START_RADIUS) * 1.45;
  const mag = Math.hypot(inputX, inputY);
  const nx = mag > 1 ? inputX / mag : inputX;
  const ny = mag > 1 ? inputY / mag : inputY;

  const targetVx = nx * maxSpeed;
  const targetVy = ny * maxSpeed;
  const accel = 1 - Math.exp(-12 * clampedDt);
  hole.vx += (targetVx - hole.vx) * accel;
  hole.vy += (targetVy - hole.vy) * accel;

  const limit = state.town.halfSize - hole.radius * 0.4;
  hole.x = Math.max(-limit, Math.min(limit, hole.x + hole.vx * clampedDt));
  hole.y = Math.max(-limit, Math.min(limit, hole.y + hole.vy * clampedDt));

  const swallowedNow = [];
  let leveledUp = null;

  for (const prop of state.town.props) {
    if (prop.swallowed) continue;
    if (prop.bump > 0) prop.bump = Math.max(0, prop.bump - clampedDt * 4.5);

    const dx = hole.x - prop.x;
    const dy = hole.y - prop.y;
    const dist = Math.hypot(dx, dy);

    if (prop.swallowing) {
      // Pull rapidly into center and shrink/tilt down
      prop.swallowProgress = Math.min(1, prop.swallowProgress + clampedDt * 3.8);
      const pull = 1 - Math.exp(-16 * clampedDt);
      prop.x += dx * pull;
      prop.y += dy * pull;
      prop.angle += clampedDt * 5.2;

      if (prop.swallowProgress >= 1) {
        prop.swallowed = true;
        state.swallowedCount++;
        hole.mass += prop.mass * 1.35;
        hole.radius = radiusFromMass(hole.mass);
        state.score += prop.points;
        swallowedNow.push(prop);

        if (prop.tier >= 3) {
          state.camera.shake = Math.min(10, state.camera.shake + prop.tier * 1.15);
        }

        state.popups.push({
          x: hole.x + (Math.random() - 0.5) * hole.radius * 0.4,
          y: hole.y - hole.radius * 0.35,
          text: `+${prop.points}`,
          age: 0,
          tier: prop.tier,
        });

        const nextTier = tierForRadius(hole.radius);
        if (nextTier.level > hole.tier) {
          hole.tier = nextTier.level;
          leveledUp = nextTier;
          state.banner = { text: `Size Up! ${nextTier.label}`, age: 0 };
        }
      }
      continue;
    }

    const fits = prop.radius <= hole.radius * SWALLOW_RATIO;
    const captureDist = hole.radius - prop.radius * 0.25;
    if (fits && dist < captureDist) {
      prop.swallowing = true;
      prop.swallowProgress = 0.05;
    } else if (!fits && dist < hole.radius + prop.radius * 0.55) {
      prop.bump = 1;
    }
  }

  // Update floating popups & milestone banner
  for (const p of state.popups) p.age += clampedDt;
  state.popups = state.popups.filter((p) => p.age < 0.85);
  if (state.banner) {
    state.banner.age += clampedDt;
    if (state.banner.age > 2.4) state.banner = null;
  }

  // Smooth camera tracking & zoom
  const camLerp = 1 - Math.exp(-8 * clampedDt);
  state.camera.x += (hole.x - state.camera.x) * camLerp;
  state.camera.y += (hole.y - state.camera.y) * camLerp;
  const targetZoom = cameraZoomForRadius(hole.radius);
  state.camera.zoom += (targetZoom - state.camera.zoom) * (1 - Math.exp(-3.5 * clampedDt));
  if (state.camera.shake > 0) state.camera.shake = Math.max(0, state.camera.shake - clampedDt * 24);

  // Check if entire town is swallowed!
  if (state.swallowedCount >= state.totalProps) {
    state.phase = 'finished';
    state.finishedReason = 'cleared';
  }

  return { swallowed: swallowedNow, leveledUp };
}
