import { PROPS } from './catalog.js';

export const WORLD_HALF = 1400; // 2800 x 2800 town
export const LANE_OFFSET = 26;

const SHIRT_COLORS = ['#e8636b', '#5294d8', '#f2b84b', '#5db57d', '#9b74d6', '#e88b58', '#4fa8a6'];
const HAIR_COLORS = ['#4a3525', '#7c5132', '#d4a14c', '#2d3340', '#b8563c'];

export function makeRng(seed = 20261120) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function createTown(seed = 20261120) {
  const rand = makeRng(seed);
  const props = [];
  let nextId = 1;

  const canPlace = (x, y, radius, pad = 10) => {
    if (Math.abs(x) > WORLD_HALF - radius - 40 || Math.abs(y) > WORLD_HALF - radius - 40) return false;
    // Keep exact starting spot clear so the player spawns cleanly
    if (Math.hypot(x, y) < radius + 34) return false;
    for (const p of props) {
      if (Math.hypot(x - p.x, y - p.y) < radius + p.radius + pad) return false;
    }
    return true;
  };

  const add = (type, x, y, angle = 0, extra = {}) => {
    const def = PROPS[type];
    if (!canPlace(x, y, def.radius)) return false;
    props.push({
      id: nextId++,
      type,
      ...def,
      ...extra,
      x,
      y,
      angle,
      vx: 0,
      vy: 0,
      z: 0,
      vz: 0,
      tilt: 0,
      tiltAngle: 0,
      spinVel: 0,
      swallowing: false,
      swallowProgress: 0,
      swallowed: false,
      bump: 0,
    });
    return true;
  };

  const makePersonExtra = () => ({
    color: SHIRT_COLORS[Math.floor(rand() * SHIRT_COLORS.length)],
    accent: HAIR_COLORS[Math.floor(rand() * HAIR_COLORS.length)],
    wander: {
      dir: rand() * Math.PI * 2,
      speed: 24 + rand() * 18,
      timer: 1.2 + rand() * 2.8,
      pauseTimer: rand() < 0.25 ? 0.5 + rand() * 1.2 : 0,
      walkPhase: rand() * Math.PI * 2,
    },
  });

  // Road centers: horizontal & vertical avenues dividing the town into cozy blocks
  const roads = [-760, -240, 240, 760];

  // 1. Starter ring of Tiny & Small props + park visitors right around the central park plaza (0, 0)
  const starterTiny = ['cone', 'flower', 'hydrant', 'bollard'];
  for (let i = 0; i < 34; i++) {
    const a = (i / 34) * Math.PI * 2 + rand() * 0.25;
    const dist = 58 + rand() * 195;
    add(starterTiny[i % starterTiny.length], Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2);
  }
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + rand() * 0.4;
    const dist = 68 + rand() * 145;
    add('person', Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makePersonExtra());
  }
  const starterSmall = ['trashcan', 'mailbox', 'bench', 'lamp'];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2 + rand() * 0.3;
    const dist = 155 + rand() * 175;
    add(starterSmall[i % starterSmall.length], Math.cos(a) * dist, Math.sin(a) * dist, a + Math.PI / 2);
  }

  // 2. Cars, trucks & buses neatly aligned along the paved avenues (moving along road grid)
  const cars = ['carRed', 'carBlue', 'carYellow'];
  const bigVehicles = ['truck', 'bus'];
  for (const roadY of roads) {
    for (let x = -1200; x <= 1200; x += 175) {
      if (roads.some((rx) => Math.abs(x - rx) < 110)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const isBig = rand() >= 0.72;
      const pick = isBig ? bigVehicles[Math.floor(rand() * bigVehicles.length)] : cars[Math.floor(rand() * cars.length)];
      const angle = dir > 0 ? 0 : Math.PI;
      const speed = isBig ? 42 + rand() * 20 : 58 + rand() * 32;
      add(pick, x + (rand() - 0.5) * 30, roadY + lane, angle, {
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1200; y <= 1200; y += 185) {
      if (roads.some((ry) => Math.abs(y - ry) < 110)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const isBig = rand() >= 0.72;
      const pick = isBig ? bigVehicles[Math.floor(rand() * bigVehicles.length)] : cars[Math.floor(rand() * cars.length)];
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const speed = isBig ? 42 + rand() * 20 : 58 + rand() * 32;
      add(pick, roadX + lane, y + (rand() - 0.5) * 30, angle, {
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 3. Landmark colossal buildings in outer downtown corners (Tier 7)
  add('cityHall', 0, -1080, 0);
  add('skyscraper', -1060, -1060, 0);
  add('skyscraper', 1060, -1060, 0);
  add('skyscraper', -1060, 1060, 0);
  add('skyscraper', 1060, 1060, 0);

  // 4. Giant city blocks (Tier 6) in outer districts
  const giantSpots = [
    [-500, -1060], [500, -1060],
    [-1060, -500], [1060, -500],
    [-1060, 0], [1060, 0],
    [-1060, 500], [1060, 500],
    [-500, 1060], [500, 1060], [0, 1060],
  ];
  giantSpots.forEach(([gx, gy], idx) => {
    add(idx % 2 === 0 ? 'apartments' : 'office', gx + (rand() - 0.5) * 40, gy + (rand() - 0.5) * 40, 0);
  });

  // 5. Cozy residential houses & cafes (Tier 5) in mid-ring blocks
  const houseTypes = ['cottage', 'cafe', 'houseBlue'];
  const midBlocks = [
    [-500, -500], [0, -500], [500, -500],
    [-500, 0], [500, 0],
    [-500, 500], [0, 500], [500, 500],
  ];
  for (const [bx, by] of midBlocks) {
    for (const [ox, oy] of [[-85, -80], [85, -80], [-85, 85], [85, 85]]) {
      add(houseTypes[Math.floor(rand() * houseTypes.length)], bx + ox + (rand() - 0.5) * 24, by + oy + (rand() - 0.5) * 24, 0);
    }
  }

  // 6. Scatter lush pine & oak trees (Tier 4), bushes (Tier 3), and sidewalk details (Tier 1-2)
  const scatter = [
    ['pine', 38],
    ['oak', 34],
    ['bush', 48],
    ['bench', 22],
    ['lamp', 28],
    ['trashcan', 26],
    ['mailbox', 24],
    ['cone', 30],
    ['flower', 36],
    ['hydrant', 24],
    ['person', 36],
  ];
  for (const [type, count] of scatter) {
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < count * 12) {
      attempts++;
      const x = (rand() * 2 - 1) * (WORLD_HALF - 90);
      const y = (rand() * 2 - 1) * (WORLD_HALF - 90);
      // Avoid putting trees/bushes/benches/people directly in the middle of roads
      if (roads.some((r) => Math.abs(x - r) < 62 || Math.abs(y - r) < 62)) continue;
      const extra = type === 'person' ? makePersonExtra() : {};
      if (add(type, x, y, rand() * Math.PI * 2, extra)) placed++;
    }
  }

  return { halfSize: WORLD_HALF, roads, props };
}
