import { tierForRadius } from './catalog.js';
import { createTown, LANE_OFFSET, makeRng } from './world.js';

export const ARCADE_DURATION = 120; // seconds
export const START_RADIUS = 22;
const SWALLOW_RATIO = 0.90; // prop fits if prop.radius <= hole.radius * SWALLOW_RATIO
const MASS_GROWTH_MULTIPLIER = 3.2; // brisk, evenly paced growth across all 12 levels

function lerpAngle(a, b, t) {
  let diff = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

function headingForRoad(axis, dir) {
  if (axis === 'x') return dir > 0 ? 0 : Math.PI;
  return dir > 0 ? Math.PI / 2 : -Math.PI / 2;
}

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
    rand: makeRng((seed ^ 0x9e3779b9) >>> 0),
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

function updateRoadVehicle(prop, state, dt) {
  const r = prop.road;
  if (!r) return;
  const { roads, halfSize, props } = state.town;

  // Check if another active vehicle is directly ahead in the same lane
  let blocked = false;
  for (const other of props) {
    if (other === prop || other.swallowed || other.swallowing || !other.road) continue;
    if (other.road.axis !== r.axis || other.road.roadCoord !== r.roadCoord || other.road.dir !== r.dir) continue;
    const ahead = r.axis === 'x' ? (other.x - prop.x) * r.dir : (other.y - prop.y) * r.dir;
    const minGap = prop.radius + other.radius + 32;
    if (ahead > 0 && ahead < minGap) {
      blocked = true;
      break;
    }
  }

  const moveSpeed = blocked ? 0 : r.speed;
  const laneSpring = 1 - Math.exp(-8 * dt);

  if (r.axis === 'x') {
    const prevX = prop.x;
    prop.x += r.dir * moveSpeed * dt;
    const targetY = r.roadCoord + r.laneOffset;
    prop.y += (targetY - prop.y) * laneSpring;
    prop.vx = (prop.x - prevX) / Math.max(dt, 1e-4);
    prop.vy = 0;

    // Check intersections to randomly go straight, turn left, or turn right
    for (const crossX of roads) {
      if (r.lastIntersection === crossX) continue;
      if (Math.abs(prop.x - crossX) < 16) {
        r.lastIntersection = crossX;
        const roll = state.rand();
        if (roll >= 0.56) {
          const newDir = roll < 0.78 ? 1 : -1;
          r.axis = 'y';
          r.roadCoord = crossX;
          r.dir = newDir;
          r.laneOffset = newDir > 0 ? LANE_OFFSET : -LANE_OFFSET;
          r.targetAngle = headingForRoad('y', newDir);
          break;
        }
      }
    }

    // Smooth U-turn at town borders so cars always stay on the road network
    const edge = halfSize - 85;
    if ((r.dir > 0 && prop.x > edge) || (r.dir < 0 && prop.x < -edge)) {
      prop.x = Math.max(-edge, Math.min(edge, prop.x));
      r.dir = -r.dir;
      r.laneOffset = r.dir > 0 ? LANE_OFFSET : -LANE_OFFSET;
      r.lastIntersection = null;
      r.targetAngle = headingForRoad('x', r.dir);
    }
  } else {
    const prevY = prop.y;
    prop.y += r.dir * moveSpeed * dt;
    const targetX = r.roadCoord + r.laneOffset;
    prop.x += (targetX - prop.x) * laneSpring;
    prop.vx = 0;
    prop.vy = (prop.y - prevY) / Math.max(dt, 1e-4);

    for (const crossY of roads) {
      if (r.lastIntersection === crossY) continue;
      if (Math.abs(prop.y - crossY) < 16) {
        r.lastIntersection = crossY;
        const roll = state.rand();
        if (roll >= 0.56) {
          const newDir = roll < 0.78 ? 1 : -1;
          r.axis = 'x';
          r.roadCoord = crossY;
          r.dir = newDir;
          r.laneOffset = newDir > 0 ? LANE_OFFSET : -LANE_OFFSET;
          r.targetAngle = headingForRoad('x', newDir);
          break;
        }
      }
    }

    const edge = halfSize - 85;
    if ((r.dir > 0 && prop.y > edge) || (r.dir < 0 && prop.y < -edge)) {
      prop.y = Math.max(-edge, Math.min(edge, prop.y));
      r.dir = -r.dir;
      r.laneOffset = r.dir > 0 ? LANE_OFFSET : -LANE_OFFSET;
      r.lastIntersection = null;
      r.targetAngle = headingForRoad('y', r.dir);
    }
  }

  prop.angle = lerpAngle(prop.angle, r.targetAngle, 1 - Math.exp(-10 * dt));
}

function updateWanderer(prop, state, dt) {
  const w = prop.wander;
  if (!w) return;
  const hole = state.hole;
  const dxHole = prop.x - hole.x;
  const dyHole = prop.y - hole.y;
  const distHole = Math.hypot(dxHole, dyHole);
  const scared = prop.radius <= hole.radius * SWALLOW_RATIO && distHole < hole.radius + 95;

  if (scared) {
    w.pauseTimer = 0;
    w.dir = Math.atan2(dyHole, dxHole);
  } else if (w.pauseTimer > 0) {
    w.pauseTimer -= dt;
    prop.vx = 0;
    prop.vy = 0;
    return;
  } else {
    w.timer -= dt;
    if (w.timer <= 0) {
      if (state.rand() < 0.22) {
        w.pauseTimer = 0.45 + state.rand() * 0.9;
      } else {
        w.dir += (state.rand() - 0.5) * 2.6;
      }
      w.timer = 1.4 + state.rand() * 2.8;
    }
  }

  const speed = scared ? w.speed * 1.4 : w.speed;
  const nextX = prop.x + Math.cos(w.dir) * speed * dt;
  const nextY = prop.y + Math.sin(w.dir) * speed * dt;

  // Keep people inside town borders
  const limit = state.town.halfSize - 70;
  let blocked = Math.abs(nextX) > limit || Math.abs(nextY) > limit;

  // Gently steer around large buildings so people don't walk through houses
  if (!blocked) {
    for (const other of state.town.props) {
      if (other.swallowed || other.swallowing || other.tier < 5) continue;
      if (Math.hypot(nextX - other.x, nextY - other.y) < other.radius + prop.radius + 6) {
        blocked = true;
        break;
      }
    }
  }

  if (blocked) {
    w.dir += Math.PI * (0.65 + state.rand() * 0.7);
    prop.vx = 0;
    prop.vy = 0;
  } else {
    prop.vx = (nextX - prop.x) / Math.max(dt, 1e-4);
    prop.vy = (nextY - prop.y) / Math.max(dt, 1e-4);
    prop.x = nextX;
    prop.y = nextY;
    w.walkPhase += speed * dt * 0.28;
  }

  prop.angle = lerpAngle(prop.angle, w.dir, 1 - Math.exp(-9 * dt));
}

export function stepGame(state, dt, inputX = 0, inputY = 0) {
  if (state.phase !== 'playing') return { captured: [], swallowed: [], leveledUp: null };
  const clampedDt = Math.min(Math.max(dt, 0), 0.05);
  state.elapsed += clampedDt;

  if (state.mode === 'arcade') {
    state.timeLeft = Math.max(0, state.timeLeft - clampedDt);
    if (state.timeLeft === 0) {
      state.phase = 'finished';
      state.finishedReason = 'time';
      return { captured: [], swallowed: [], leveledUp: null };
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

  const capturedNow = [];
  const swallowedNow = [];
  let leveledUp = null;

  for (const prop of state.town.props) {
    if (prop.swallowed) continue;
    if (prop.bump > 0) prop.bump = Math.max(0, prop.bump - clampedDt * 4.5);

    if (!prop.swallowing) {
      if (prop.motion === 'road') updateRoadVehicle(prop, state, clampedDt);
      else if (prop.motion === 'wander') updateWanderer(prop, state, clampedDt);
    }

    const dx = hole.x - prop.x;
    const dy = hole.y - prop.y;
    const dist = Math.hypot(dx, dy);

    if (prop.swallowing) {
      // Real falling-in physics: momentum + inward funnel pull + gravity + tumble
      const pullAccel = 18;
      const damp = Math.exp(-5.5 * clampedDt);
      prop.vx = prop.vx * damp + dx * pullAccel * clampedDt;
      prop.vy = prop.vy * damp + dy * pullAccel * clampedDt;
      prop.x += prop.vx * clampedDt;
      prop.y += prop.vy * clampedDt;

      // Keep falling prop funneling inside the pit walls
      const ndx = prop.x - hole.x;
      const ndy = prop.y - hole.y;
      const ndist = Math.hypot(ndx, ndy);
      const maxPitDist = Math.max(2, hole.radius - prop.radius * 0.2);
      if (ndist > maxPitDist) {
        const s = maxPitDist / ndist;
        prop.x = hole.x + ndx * s;
        prop.y = hole.y + ndy * s;
      }

      // Vertical gravity acceleration downward into the hole
      const gravity = 680 + prop.tier * 45;
      prop.vz -= gravity * clampedDt;
      prop.z += prop.vz * clampedDt;

      // Tip and tumble as it drops
      prop.tilt = Math.min(1.25, prop.tilt + clampedDt * 3.4);
      prop.angle += prop.spinVel * clampedDt;

      const fallTarget = Math.max(58, prop.height * 1.15 + 32);
      prop.swallowProgress = Math.min(1, -prop.z / fallTarget);

      if (prop.swallowProgress >= 1) {
        prop.swallowed = true;
        state.swallowedCount++;
        hole.mass += prop.mass * MASS_GROWTH_MULTIPLIER;
        hole.radius = radiusFromMass(hole.mass);
        state.score += prop.points;
        swallowedNow.push(prop);

        if (prop.tier >= 3) {
          state.camera.shake = Math.min(10, state.camera.shake + prop.tier * 1.15);
        }

        state.popups.push({
          x: hole.x + (state.rand() - 0.5) * hole.radius * 0.4,
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
    const rimDist = hole.radius + prop.radius * 0.42;

    if (fits && dist < captureDist) {
      prop.swallowing = true;
      prop.swallowProgress = 0.02;
      prop.z = 0;
      prop.vz = -42;
      const invDist = dist > 1 ? 1 / dist : 0;
      const tipSpeed = 55 + prop.tier * 10;
      // Inherit existing velocity (e.g., driving car / running person) + tip-over impulse
      prop.vx = prop.vx * 0.65 + dx * invDist * tipSpeed;
      prop.vy = prop.vy * 0.65 + dy * invDist * tipSpeed;
      prop.tiltAngle = Math.atan2(dy, dx);
      prop.spinVel = (state.rand() < 0.5 ? -1 : 1) * (2.6 + state.rand() * 3.0) / Math.sqrt(prop.tier);
      capturedNow.push(prop);
    } else if (fits && dist < rimDist) {
      // Rim tipping: prop leans toward the hole and begins sliding over the edge
      const edgeFactor = 1 - Math.max(0, dist - captureDist) / Math.max(1, rimDist - captureDist);
      prop.tiltAngle = Math.atan2(dy, dx);
      prop.tilt += (edgeFactor * 0.55 - prop.tilt) * (1 - Math.exp(-14 * clampedDt));
      if (dist > 1) {
        const slide = (42 + edgeFactor * 55) * clampedDt;
        prop.x += (dx / dist) * slide;
        prop.y += (dy / dist) * slide;
      }
    } else {
      if (prop.tilt > 0) prop.tilt = Math.max(0, prop.tilt - clampedDt * 6);
      if (!fits && dist < hole.radius + prop.radius * 0.55) {
        prop.bump = 1;
      }
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

  return { captured: capturedNow, swallowed: swallowedNow, leveledUp };
}
