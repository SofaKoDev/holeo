import { PROPS } from './catalog.js';

export const WORLD_HALF = 1400; // 2800 x 2800 Cozy Town
export const METRO_HALF = 1650; // 3300 x 3300 Metro City
export const LANE_OFFSET = 26;
export const BIKE_LANE_OFFSET = 43;

const SHIRT_COLORS = ['#e8636b', '#5294d8', '#f2b84b', '#5db57d', '#9b74d6', '#e88b58', '#4fa8a6'];
const HAIR_COLORS = ['#4a3525', '#7c5132', '#d4a14c', '#2d3340', '#b8563c'];
const BIKE_COLORS = ['#e85858', '#3c99dc', '#45b87c', '#f2a93b', '#9a6bd6', '#334155'];

export function makeRng(seed = 20261120) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function createTown(seed = 20261120, mapId = 'town') {
  if (mapId === 'metro') return createMetroCity(seed);
  if (mapId === 'mars') return createMarsColony(seed);
  if (mapId === 'playroom') return createPlayroom(seed);
  if (mapId === 'reef') return createCoralReef(seed);
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

  return { mapId: 'town', halfSize: WORLD_HALF, roads, props };
}

function createMetroCity(seed = 20261120) {
  const rand = makeRng((seed ^ 0x51f2a9c3) >>> 0);
  const halfSize = METRO_HALF;
  const roads = [-980, -320, 320, 980];
  const props = [];
  let nextId = 1;

  const canPlace = (x, y, radius, pad = 10) => {
    if (Math.abs(x) > halfSize - radius - 40 || Math.abs(y) > halfSize - radius - 40) return false;
    if (Math.hypot(x, y) < radius + 34) return false;
    // Keep Central Park pond clear of props
    if (Math.hypot((x + 95) / 62, (y + 90) / 44) < 1) return false;
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
      speed: 28 + rand() * 20,
      timer: 1.0 + rand() * 2.4,
      pauseTimer: rand() < 0.18 ? 0.4 + rand() * 0.8 : 0,
      walkPhase: rand() * Math.PI * 2,
    },
  });

  // 1. Central Park starter oasis around (0, 0)
  const starterTiny = ['cone', 'flower', 'hydrant', 'newsstand', 'bollard'];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2 + rand() * 0.25;
    const dist = 58 + rand() * 225;
    add(starterTiny[i % starterTiny.length], Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2);
  }
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + rand() * 0.4;
    const dist = 72 + rand() * 175;
    add('person', Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makePersonExtra());
  }
  const starterSmall = ['hotdogCart', 'subwaySign', 'bench', 'trashcan', 'lamp'];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2 + rand() * 0.3;
    const dist = 135 + rand() * 110;
    add(starterSmall[i % starterSmall.length], Math.cos(a) * dist, Math.sin(a) * dist, a + Math.PI / 2);
  }

  // 2. Bustling yellow-cab avenues + trucks & buses
  const pickVehicle = () => {
    const r = rand();
    if (r < 0.52) return 'carYellow'; // NYC yellow cabs!
    if (r < 0.65) return 'carRed';
    if (r < 0.78) return 'carBlue';
    if (r < 0.90) return 'bus';
    return 'truck';
  };

  for (const roadY of roads) {
    for (let x = -1460; x <= 1460; x += 185) {
      if (roads.some((rx) => Math.abs(x - rx) < 120)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const pick = pickVehicle();
      const isBig = pick === 'truck' || pick === 'bus';
      const angle = dir > 0 ? 0 : Math.PI;
      const speed = isBig ? 46 + rand() * 20 : 66 + rand() * 34;
      add(pick, x + (rand() - 0.5) * 30, roadY + lane, angle, {
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          laneWidth: LANE_OFFSET,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1460; y <= 1460; y += 195) {
      if (roads.some((ry) => Math.abs(y - ry) < 120)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const pick = pickVehicle();
      const isBig = pick === 'truck' || pick === 'bus';
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const speed = isBig ? 46 + rand() * 20 : 66 + rand() * 34;
      add(pick, roadX + lane, y + (rand() - 0.5) * 30, angle, {
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          laneWidth: LANE_OFFSET,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 3. City cyclists riding in the street bike lanes (±43px along each avenue)
  for (const roadY of roads) {
    for (let x = -1350; x <= 1350; x += 440) {
      if (roads.some((rx) => Math.abs(x - rx) < 110)) continue;
      const dir = rand() < 0.5 ? 1 : -1;
      const lane = dir > 0 ? BIKE_LANE_OFFSET : -BIKE_LANE_OFFSET;
      const angle = dir > 0 ? 0 : Math.PI;
      add('cyclist', x + (rand() - 0.5) * 80, roadY + lane, angle, {
        color: SHIRT_COLORS[Math.floor(rand() * SHIRT_COLORS.length)],
        accent: BIKE_COLORS[Math.floor(rand() * BIKE_COLORS.length)],
        pedalPhase: rand() * Math.PI * 2,
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          laneWidth: BIKE_LANE_OFFSET,
          dir,
          speed: 52 + rand() * 24,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1350; y <= 1350; y += 440) {
      if (roads.some((ry) => Math.abs(y - ry) < 110)) continue;
      const dir = rand() < 0.5 ? 1 : -1;
      const lane = dir > 0 ? BIKE_LANE_OFFSET : -BIKE_LANE_OFFSET;
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      add('cyclist', roadX + lane, y + (rand() - 0.5) * 80, angle, {
        color: SHIRT_COLORS[Math.floor(rand() * SHIRT_COLORS.length)],
        accent: BIKE_COLORS[Math.floor(rand() * BIKE_COLORS.length)],
        pedalPhase: rand() * Math.PI * 2,
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          laneWidth: BIKE_LANE_OFFSET,
          dir,
          speed: 52 + rand() * 24,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 4. Towering NYC Landmarks & Glass Skyscrapers (Tier 7)
  add('metroSpire', 0, -1320, 0);
  add('wedgeTower', -1320, -1320, 0);
  add('wedgeTower', 1320, 1320, 0);
  add('glassTower', 1320, -1320, 0);
  add('glassTower', -1320, 1320, 0);
  add('glassTower', -650, -1320, 0);
  add('glassTower', 650, -1320, 0);
  add('glassTower', -650, 1320, 0);
  add('glassTower', 650, 1320, 0);
  add('skyscraper', 0, 1320, 0);

  // 5. High-Rise Water Tower Blocks & City Offices (Tier 6)
  const highRiseSpots = [
    [-1320, -650], [1320, -650],
    [-1320, 0], [1320, 0],
    [-1320, 650], [1320, 650],
    [-650, -650], [650, -650],
    [-650, 650], [650, 650],
  ];
  highRiseSpots.forEach(([gx, gy], idx) => {
    const pick = idx % 3 === 0 ? 'waterTowerBlock' : idx % 3 === 1 ? 'office' : 'apartments';
    add(pick, gx + (rand() - 0.5) * 35, gy + (rand() - 0.5) * 35, 0);
  });

  // 6. Classic Brownstones & Corner Cafes (Tier 5) in inner avenues
  const midBlocks = [
    [0, -650], [-650, 0], [650, 0], [0, 650],
    [-650, -650], [650, -650], [-650, 650], [650, 650],
  ];
  for (const [bx, by] of midBlocks) {
    for (const [ox, oy] of [[-125, -125], [125, -125], [-125, 125], [125, 125]]) {
      const pick = rand() < 0.7 ? 'brownstone' : 'cafe';
      add(pick, bx + ox + (rand() - 0.5) * 20, by + oy + (rand() - 0.5) * 20, 0);
    }
  }

  // 7. Scatter Central Park trees, sidewalk details, hot dog carts, subway signs & commuters
  const scatter = [
    ['oak', 26],
    ['pine', 22],
    ['bush', 34],
    ['hotdogCart', 18],
    ['subwaySign', 20],
    ['newsstand', 26],
    ['bench', 22],
    ['lamp', 34],
    ['trashcan', 28],
    ['hydrant', 28],
    ['cone', 26],
    ['person', 42],
  ];
  for (const [type, count] of scatter) {
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < count * 12) {
      attempts++;
      const x = (rand() * 2 - 1) * (halfSize - 95);
      const y = (rand() * 2 - 1) * (halfSize - 95);
      if (roads.some((r) => Math.abs(x - r) < 68 || Math.abs(y - r) < 68)) continue;
      const extra = type === 'person' ? makePersonExtra() : {};
      if (add(type, x, y, rand() * Math.PI * 2, extra)) placed++;
    }
  }

  return { mapId: 'metro', halfSize, roads, props };
}

function createMarsColony(seed = 20261120) {
  const rand = makeRng((seed ^ 0x7c4b31e9) >>> 0);
  const halfSize = WORLD_HALF;
  const roads = [-760, -240, 240, 760];
  const props = [];
  let nextId = 1;

  // Deterministic red-planet craters for ground texture
  const craters = [];
  for (let i = 0; i < 42; i++) {
    const cx = (rand() * 2 - 1) * (halfSize - 120);
    const cy = (rand() * 2 - 1) * (halfSize - 120);
    if (Math.hypot(cx, cy) < 230) continue;
    if (roads.some((r) => Math.abs(cx - r) < 85 || Math.abs(cy - r) < 85)) continue;
    craters.push({ x: cx, y: cy, r: 22 + rand() * 48 });
  }

  const canPlace = (x, y, radius, pad = 10) => {
    if (Math.abs(x) > halfSize - radius - 40 || Math.abs(y) > halfSize - radius - 40) return false;
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

  const alienTints = ['#69db6e', '#7af298', '#52cf85', '#a6eb5c', '#5ce0c4'];
  const makeAlienExtra = () => ({
    color: alienTints[Math.floor(rand() * alienTints.length)],
    accent: '#23593a',
    wander: {
      dir: rand() * Math.PI * 2,
      speed: 26 + rand() * 18,
      timer: 1.1 + rand() * 2.5,
      pauseTimer: rand() < 0.2 ? 0.4 + rand() * 0.9 : 0,
      walkPhase: rand() * Math.PI * 2,
    },
  });

  // 1. Central Landing Pad starter ring around (0, 0)
  const starterTiny = ['marsRock', 'marsCrystal'];
  for (let i = 0; i < 34; i++) {
    const a = (i / 34) * Math.PI * 2 + rand() * 0.25;
    const dist = 58 + rand() * 185;
    add(starterTiny[i % starterTiny.length], Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2);
  }
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + rand() * 0.4;
    const dist = 68 + rand() * 140;
    add('alien', Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makeAlienExtra());
  }
  const starterSmall = ['solarPanel', 'beacon'];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + rand() * 0.3;
    const dist = 120 + rand() * 80;
    add(starterSmall[i % starterSmall.length], Math.cos(a) * dist, Math.sin(a) * dist, a + Math.PI / 2);
  }

  // 2. Colossal Martian Landmarks (Tier 7) — placed before vehicles so landmarks always spawn
  add('mothership', 0, -1080, 0);
  add('marsRocket', -1060, -1060, 0);
  add('marsRocket', 1060, -1060, 0);
  add('marsRocket', -1060, 1060, 0);
  add('marsRocket', 1060, 1060, 0);

  // 3. Spaceship cars, mini UFOs, rovers & hover-haulers along the glowing hover-highways
  const pickCraft = () => {
    const r = rand();
    if (r < 0.40) return 'hoverCar';
    if (r < 0.72) return 'saucerCar';
    if (r < 0.87) return 'marsRover';
    return 'hoverHauler';
  };
  for (const roadY of roads) {
    for (let x = -1200; x <= 1200; x += 180) {
      if (roads.some((rx) => Math.abs(x - rx) < 110)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const pick = pickCraft();
      const isBig = pick === 'marsRover' || pick === 'hoverHauler';
      const angle = dir > 0 ? 0 : Math.PI;
      const speed = isBig ? 46 + rand() * 20 : 68 + rand() * 34;
      add(pick, x + (rand() - 0.5) * 30, roadY + lane, angle, {
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          laneWidth: LANE_OFFSET,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1200; y <= 1200; y += 190) {
      if (roads.some((ry) => Math.abs(y - ry) < 110)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const pick = pickCraft();
      const isBig = pick === 'marsRover' || pick === 'hoverHauler';
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const speed = isBig ? 46 + rand() * 20 : 68 + rand() * 34;
      add(pick, roadX + lane, y + (rand() - 0.5) * 30, angle, {
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          laneWidth: LANE_OFFSET,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 4. Hover-scooter aliens zipping along the outer glowing hover-lanes
  for (const roadY of roads) {
    for (let x = -1150; x <= 1150; x += 460) {
      if (roads.some((rx) => Math.abs(x - rx) < 105)) continue;
      const dir = rand() < 0.5 ? 1 : -1;
      const lane = dir > 0 ? BIKE_LANE_OFFSET : -BIKE_LANE_OFFSET;
      const angle = dir > 0 ? 0 : Math.PI;
      add('hoverScooter', x + (rand() - 0.5) * 70, roadY + lane, angle, {
        color: alienTints[Math.floor(rand() * alienTints.length)],
        accent: '#5be9f5',
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          laneWidth: BIKE_LANE_OFFSET,
          dir,
          speed: 58 + rand() * 24,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1150; y <= 1150; y += 460) {
      if (roads.some((ry) => Math.abs(y - ry) < 105)) continue;
      const dir = rand() < 0.5 ? 1 : -1;
      const lane = dir > 0 ? BIKE_LANE_OFFSET : -BIKE_LANE_OFFSET;
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      add('hoverScooter', roadX + lane, y + (rand() - 0.5) * 70, angle, {
        color: alienTints[Math.floor(rand() * alienTints.length)],
        accent: '#5be9f5',
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          laneWidth: BIKE_LANE_OFFSET,
          dir,
          speed: 58 + rand() * 24,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 5. Giant Colony Spires & Comms Arrays (Tier 6)
  const giantSpots = [
    [-500, -1060], [500, -1060],
    [-1060, -500], [1060, -500],
    [-1060, 0], [1060, 0],
    [-1060, 500], [1060, 500],
    [-500, 1060], [500, 1060], [0, 1060],
  ];
  giantSpots.forEach(([gx, gy], idx) => {
    add(idx % 2 === 0 ? 'colonyTower' : 'radarDish', gx + (rand() - 0.5) * 40, gy + (rand() - 0.5) * 40, 0);
  });

  // 6. Glass Martian Biodomes (Tier 5)
  const midBlocks = [
    [-500, -500], [0, -500], [500, -500],
    [-500, 0], [500, 0],
    [-500, 500], [0, 500], [500, 500],
  ];
  for (const [bx, by] of midBlocks) {
    for (const [ox, oy] of [[-85, -80], [85, -80], [-85, 85], [85, 85]]) {
      add('habDome', bx + ox + (rand() - 0.5) * 24, by + oy + (rand() - 0.5) * 24, 0);
    }
  }

  // 7. Scatter crystal spires, alien flora pods, solar arrays, beacons, rocks & wandering aliens
  const scatter = [
    ['crystalSpire', 44],
    ['marsPod', 46],
    ['solarPanel', 32],
    ['beacon', 28],
    ['marsCrystal', 38],
    ['marsRock', 38],
    ['alien', 38],
  ];
  for (const [type, count] of scatter) {
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < count * 12) {
      attempts++;
      const x = (rand() * 2 - 1) * (halfSize - 90);
      const y = (rand() * 2 - 1) * (halfSize - 90);
      if (roads.some((r) => Math.abs(x - r) < 66 || Math.abs(y - r) < 66)) continue;
      const extra = type === 'alien' ? makeAlienExtra() : {};
      if (add(type, x, y, rand() * Math.PI * 2, extra)) placed++;
    }
  }

  return { mapId: 'mars', halfSize, roads, craters, props };
}

function createPlayroom(seed = 20261120) {
  const rand = makeRng((seed ^ 0x3b9a4d71) >>> 0);
  const halfSize = WORLD_HALF;
  const roads = [-760, -240, 240, 760];
  const props = [];
  let nextId = 1;

  // Colorful foam play-mat tiles scattered in the non-road blocks
  const tilePalette = ['#ffd9df', '#d7f2e3', '#dceeff', '#fff0c4', '#eadcfc'];
  const playTiles = [];
  const blockCenters = [
    [-500, -500], [0, -500], [500, -500],
    [-500, 0], [500, 0],
    [-500, 500], [0, 500], [500, 500],
  ];
  for (const [bx, by] of blockCenters) {
    playTiles.push({
      x: bx,
      y: by,
      size: 320,
      color: tilePalette[Math.floor(rand() * tilePalette.length)],
    });
  }

  const canPlace = (x, y, radius, pad = 10) => {
    if (Math.abs(x) > halfSize - radius - 40 || Math.abs(y) > halfSize - radius - 40) return false;
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

  const brickColors = [
    ['#ef5b5b', '#ff8a8a'],
    ['#4da3e8', '#82c4f8'],
    ['#f7c548', '#ffe17d'],
    ['#52b874', '#85dc9f'],
    ['#a16ae8', '#c7a0f8'],
  ];
  const crayonColors = [
    ['#ef5b5b', '#b83b3b'],
    ['#4da3e8', '#2a6ea3'],
    ['#56b874', '#33854d'],
    ['#f5a442', '#bf731d'],
    ['#9e6be6', '#693eb0'],
    ['#f074a8', '#b84273'],
  ];
  const abcLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const abcAccents = ['#ef5b5b', '#4da3e8', '#52b874', '#f29f38', '#9c6be6'];
  const bunnyColors = [
    ['#f7dce4', '#f29eb6'],
    ['#f7f1e3', '#f2b8c6'],
    ['#e6e2f7', '#bfa8f0'],
    ['#f2e2d2', '#e0b090'],
  ];
  const teddyColors = [
    ['#c48652', '#edd0ae'],
    ['#a66d42', '#e2c29d'],
    ['#d9a573', '#f5e1c6'],
    ['#8f654a', '#d8b798'],
  ];
  const dinoColors = [
    ['#64c47d', '#ffd152'],
    ['#5cb8b2', '#ff8c69'],
    ['#8fc95b', '#f7b249'],
    ['#9b7be6', '#74e6c8'],
  ];
  const windupColors = ['#ff708d', '#4da3e8', '#52c47d', '#f5a842', '#a874f0'];

  const makeWindupExtra = () => ({
    color: windupColors[Math.floor(rand() * windupColors.length)],
    accent: '#ffd447',
    wander: {
      dir: rand() * Math.PI * 2,
      speed: 25 + rand() * 17,
      timer: 1.0 + rand() * 2.4,
      pauseTimer: rand() < 0.22 ? 0.35 + rand() * 0.8 : 0,
      walkPhase: rand() * Math.PI * 2,
    },
  });

  const makePropExtra = (type) => {
    if (type === 'windupToy') return makeWindupExtra();
    if (type === 'toyBrick') {
      const [c, a] = brickColors[Math.floor(rand() * brickColors.length)];
      return { color: c, accent: a };
    }
    if (type === 'crayon') {
      const [c, a] = crayonColors[Math.floor(rand() * crayonColors.length)];
      return { color: c, accent: a };
    }
    if (type === 'abcBlock') {
      return {
        accent: abcAccents[Math.floor(rand() * abcAccents.length)],
        letter: abcLetters[Math.floor(rand() * abcLetters.length)],
      };
    }
    if (type === 'plushBunny') {
      const [c, a] = bunnyColors[Math.floor(rand() * bunnyColors.length)];
      return { color: c, accent: a };
    }
    if (type === 'teddyBear') {
      const [c, a] = teddyColors[Math.floor(rand() * teddyColors.length)];
      return { color: c, accent: a };
    }
    if (type === 'plushDino') {
      const [c, a] = dinoColors[Math.floor(rand() * dinoColors.length)];
      return { color: c, accent: a };
    }
    return {};
  };

  // 1. Central Rainbow Play-Rug starter ring around (0, 0)
  const starterTiny = ['toyBrick', 'crayon', 'rubberDuck'];
  for (let i = 0; i < 34; i++) {
    const a = (i / 34) * Math.PI * 2 + rand() * 0.25;
    const dist = 58 + rand() * 185;
    const pick = starterTiny[i % starterTiny.length];
    add(pick, Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makePropExtra(pick));
  }
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + rand() * 0.4;
    const dist = 68 + rand() * 140;
    add('windupToy', Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makeWindupExtra());
  }
  const starterSmall = ['abcBlock', 'ringStack', 'plushBunny'];
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 + rand() * 0.3;
    const dist = 122 + rand() * 82;
    const pick = starterSmall[i % starterSmall.length];
    add(pick, Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makePropExtra(pick));
  }

  // 2. Colossal Playroom Landmarks (Tier 7) — placed before vehicles so landmarks always spawn
  add('blockCastle', 0, -1080, 0);
  add('playTent', -1060, -1060, 0);
  add('playTent', 1060, -1060, 0);
  add('blockCastle', -1060, 1060, 0);
  add('blockCastle', 1060, 1060, 0);

  // 3. Toy cars, wooden trains & dump trucks cruising the play-rug roads
  const pickToyVehicle = () => {
    const r = rand();
    if (r < 0.26) return 'toyCarRed';
    if (r < 0.50) return 'toyCarBlue';
    if (r < 0.72) return 'toyCarYellow';
    if (r < 0.87) return 'toyTruck';
    return 'toyTrain';
  };
  for (const roadY of roads) {
    for (let x = -1200; x <= 1200; x += 180) {
      if (roads.some((rx) => Math.abs(x - rx) < 110)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const pick = pickToyVehicle();
      const isBig = pick === 'toyTruck' || pick === 'toyTrain';
      const angle = dir > 0 ? 0 : Math.PI;
      const speed = isBig ? 44 + rand() * 20 : 62 + rand() * 32;
      add(pick, x + (rand() - 0.5) * 30, roadY + lane, angle, {
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          laneWidth: LANE_OFFSET,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1200; y <= 1200; y += 190) {
      if (roads.some((ry) => Math.abs(y - ry) < 110)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const pick = pickToyVehicle();
      const isBig = pick === 'toyTruck' || pick === 'toyTrain';
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const speed = isBig ? 44 + rand() * 20 : 62 + rand() * 32;
      add(pick, roadX + lane, y + (rand() - 0.5) * 30, angle, {
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          laneWidth: LANE_OFFSET,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 4. Ride-on toy scooters zipping along the outer play-rug lanes
  for (const roadY of roads) {
    for (let x = -1150; x <= 1150; x += 460) {
      if (roads.some((rx) => Math.abs(x - rx) < 105)) continue;
      const dir = rand() < 0.5 ? 1 : -1;
      const lane = dir > 0 ? BIKE_LANE_OFFSET : -BIKE_LANE_OFFSET;
      const angle = dir > 0 ? 0 : Math.PI;
      add('toyScooter', x + (rand() - 0.5) * 70, roadY + lane, angle, {
        color: windupColors[Math.floor(rand() * windupColors.length)],
        accent: '#ffd447',
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          laneWidth: BIKE_LANE_OFFSET,
          dir,
          speed: 54 + rand() * 22,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1150; y <= 1150; y += 460) {
      if (roads.some((ry) => Math.abs(y - ry) < 105)) continue;
      const dir = rand() < 0.5 ? 1 : -1;
      const lane = dir > 0 ? BIKE_LANE_OFFSET : -BIKE_LANE_OFFSET;
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      add('toyScooter', roadX + lane, y + (rand() - 0.5) * 70, angle, {
        color: windupColors[Math.floor(rand() * windupColors.length)],
        accent: '#ffd447',
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          laneWidth: BIKE_LANE_OFFSET,
          dir,
          speed: 54 + rand() * 22,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 5. Giant ABC Block Towers & Toy Chests (Tier 6)
  const giantSpots = [
    [-500, -1060], [500, -1060],
    [-1060, -500], [1060, -500],
    [-1060, 0], [1060, 0],
    [-1060, 500], [1060, 500],
    [-500, 1060], [500, 1060], [0, 1060],
  ];
  giantSpots.forEach(([gx, gy], idx) => {
    add(idx % 2 === 0 ? 'blockTower' : 'toyChest', gx + (rand() - 0.5) * 40, gy + (rand() - 0.5) * 40, 0);
  });

  // 6. Stacked Wooden Block Cottages & Archways (Tier 5)
  const midBlocks = [
    [-500, -500], [0, -500], [500, -500],
    [-500, 0], [500, 0],
    [-500, 500], [0, 500], [500, 500],
  ];
  for (const [bx, by] of midBlocks) {
    for (const [ox, oy] of [[-85, -80], [85, -80], [-85, 85], [85, 85]]) {
      const pick = rand() < 0.58 ? 'blockHouse' : 'blockArch';
      add(pick, bx + ox + (rand() - 0.5) * 24, by + oy + (rand() - 0.5) * 24, 0, {
        accent: abcAccents[Math.floor(rand() * abcAccents.length)],
      });
    }
  }

  // 7. Scatter hobby horses, plush animals, wooden blocks, stacking rings & tiny toys
  const scatter = [
    ['rockingHorse', 24],
    ['plushElephant', 22],
    ['teddyBear', 26],
    ['plushDino', 24],
    ['abcBlock', 30],
    ['ringStack', 24],
    ['plushBunny', 24],
    ['toyBrick', 36],
    ['crayon', 32],
    ['rubberDuck', 26],
    ['windupToy', 34],
  ];
  for (const [type, count] of scatter) {
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < count * 12) {
      attempts++;
      const x = (rand() * 2 - 1) * (halfSize - 90);
      const y = (rand() * 2 - 1) * (halfSize - 90);
      if (roads.some((r) => Math.abs(x - r) < 66 || Math.abs(y - r) < 66)) continue;
      if (add(type, x, y, rand() * Math.PI * 2, makePropExtra(type))) placed++;
    }
  }

  return { mapId: 'playroom', halfSize, roads, playTiles, props };
}

function createCoralReef(seed = 20261120) {
  const rand = makeRng((seed ^ 0x6a2d8f53) >>> 0);
  const halfSize = WORLD_HALF;
  const roads = [-760, -240, 240, 760];
  const props = [];
  let nextId = 1;

  // Deterministic sunlit sand shoals & caustic shimmer spots on the seabed
  const sandPatches = [];
  for (let i = 0; i < 44; i++) {
    const sx = (rand() * 2 - 1) * (halfSize - 120);
    const sy = (rand() * 2 - 1) * (halfSize - 120);
    if (Math.hypot(sx, sy) < 230) continue;
    if (roads.some((r) => Math.abs(sx - r) < 88 || Math.abs(sy - r) < 88)) continue;
    sandPatches.push({
      x: sx,
      y: sy,
      rx: 28 + rand() * 52,
      ry: 20 + rand() * 36,
      rot: rand() * Math.PI,
    });
  }

  const canPlace = (x, y, radius, pad = 10) => {
    if (Math.abs(x) > halfSize - radius - 40 || Math.abs(y) > halfSize - radius - 40) return false;
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

  const mermanTails = ['#2ec4a6', '#3ca6e8', '#ff7b89', '#7d74e8', '#46d18a', '#f2a649'];
  const mermanHair = ['#f5c249', '#3b2e2a', '#d95b43', '#e8f4f8', '#6b4226'];
  const starfishColors = [
    ['#ff7b6b', '#ffd166'],
    ['#ff6ba8', '#ffe3a3'],
    ['#f5a442', '#fff0b8'],
    ['#b87cff', '#ffe184'],
  ];
  const shellColors = [
    ['#f7c6d4', '#fff4e6'],
    ['#b8f0e8', '#f0fffe'],
    ['#ffe0a8', '#fff8e8'],
    ['#d8c4f7', '#f7f0ff'],
  ];
  const coralColors = [
    ['#ff7b89', '#ffb8c4'],
    ['#ff8f5c', '#ffd199'],
    ['#c97be8', '#f2b8ff'],
    ['#4fd4c6', '#a8fff5'],
  ];
  const cottagePalettes = [
    ['#ff968a', '#56d6c8'],
    ['#f7a8b8', '#78e0d4'],
    ['#ffa87a', '#63c7e8'],
    ['#c99bf2', '#7ef2d4'],
  ];
  const villaPalettes = [
    ['#f7c9a8', '#e8749c'],
    ['#f7d9b8', '#4fd4c6'],
    ['#e8c4f2', '#ff8a7a'],
    ['#bfe8f0', '#f58ca8'],
  ];

  const makeMermanExtra = () => ({
    color: mermanTails[Math.floor(rand() * mermanTails.length)],
    accent: mermanHair[Math.floor(rand() * mermanHair.length)],
    wander: {
      dir: rand() * Math.PI * 2,
      speed: 28 + rand() * 18,
      timer: 1.0 + rand() * 2.4,
      pauseTimer: rand() < 0.16 ? 0.35 + rand() * 0.7 : 0,
      walkPhase: rand() * Math.PI * 2,
    },
  });

  const makeReefExtra = (type) => {
    if (type === 'merman') return makeMermanExtra();
    if (type === 'starfish') {
      const [c, a] = starfishColors[Math.floor(rand() * starfishColors.length)];
      return { color: c, accent: a };
    }
    if (type === 'seaShell') {
      const [c, a] = shellColors[Math.floor(rand() * shellColors.length)];
      return { color: c, accent: a };
    }
    if (type === 'coralBush' || type === 'staghornCoral' || type === 'seaAnemone') {
      const [c, a] = coralColors[Math.floor(rand() * coralColors.length)];
      return { color: c, accent: a };
    }
    return {};
  };

  // 1. Central Pearl Lagoon starter ring around (0, 0)
  const starterTiny = ['starfish', 'seaShell', 'pearlClam'];
  for (let i = 0; i < 34; i++) {
    const a = (i / 34) * Math.PI * 2 + rand() * 0.25;
    const dist = 58 + rand() * 185;
    const pick = starterTiny[i % starterTiny.length];
    add(pick, Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makeReefExtra(pick));
  }
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + rand() * 0.4;
    const dist = 68 + rand() * 140;
    add('merman', Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makeMermanExtra());
  }
  const starterSmall = ['seaAnemone', 'kelpLamp', 'treasureChest'];
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 + rand() * 0.3;
    const dist = 122 + rand() * 82;
    const pick = starterSmall[i % starterSmall.length];
    add(pick, Math.cos(a) * dist, Math.sin(a) * dist, rand() * Math.PI * 2, makeReefExtra(pick));
  }

  // 2. Colossal Coral Landmarks (Tier 7) — placed before vehicles so landmarks always spawn
  add('atlantisPalace', 0, -1080, 0);
  add('coralCitadel', -1060, -1060, 0);
  add('coralCitadel', 1060, -1060, 0);
  add('atlantisPalace', -1060, 1060, 0);
  add('atlantisPalace', 1060, 1060, 0);

  // 3. Shell cars, conch haulers & giant clam buses cruising the ocean-current highways
  const pickShellVehicle = () => {
    const r = rand();
    if (r < 0.27) return 'shellCarPink';
    if (r < 0.52) return 'shellCarTeal';
    if (r < 0.74) return 'shellCarGold';
    if (r < 0.88) return 'shellTruck';
    return 'shellBus';
  };
  for (const roadY of roads) {
    for (let x = -1200; x <= 1200; x += 180) {
      if (roads.some((rx) => Math.abs(x - rx) < 110)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const pick = pickShellVehicle();
      const isBig = pick === 'shellTruck' || pick === 'shellBus';
      const angle = dir > 0 ? 0 : Math.PI;
      const speed = isBig ? 46 + rand() * 20 : 66 + rand() * 32;
      add(pick, x + (rand() - 0.5) * 30, roadY + lane, angle, {
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          laneWidth: LANE_OFFSET,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1200; y <= 1200; y += 190) {
      if (roads.some((ry) => Math.abs(y - ry) < 110)) continue;
      const lane = rand() < 0.5 ? -LANE_OFFSET : LANE_OFFSET;
      const dir = lane > 0 ? 1 : -1;
      const pick = pickShellVehicle();
      const isBig = pick === 'shellTruck' || pick === 'shellBus';
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      const speed = isBig ? 46 + rand() * 20 : 66 + rand() * 32;
      add(pick, roadX + lane, y + (rand() - 0.5) * 30, angle, {
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          laneWidth: LANE_OFFSET,
          dir,
          speed,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 4. Mermen zipping along outer sea-current lanes on shell scooters
  for (const roadY of roads) {
    for (let x = -1150; x <= 1150; x += 460) {
      if (roads.some((rx) => Math.abs(x - rx) < 105)) continue;
      const dir = rand() < 0.5 ? 1 : -1;
      const lane = dir > 0 ? BIKE_LANE_OFFSET : -BIKE_LANE_OFFSET;
      const angle = dir > 0 ? 0 : Math.PI;
      add('shellScooter', x + (rand() - 0.5) * 70, roadY + lane, angle, {
        color: mermanTails[Math.floor(rand() * mermanTails.length)],
        accent: '#9ef7ff',
        road: {
          axis: 'x',
          roadCoord: roadY,
          laneOffset: lane,
          laneWidth: BIKE_LANE_OFFSET,
          dir,
          speed: 58 + rand() * 24,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }
  for (const roadX of roads) {
    for (let y = -1150; y <= 1150; y += 460) {
      if (roads.some((ry) => Math.abs(y - ry) < 105)) continue;
      const dir = rand() < 0.5 ? 1 : -1;
      const lane = dir > 0 ? BIKE_LANE_OFFSET : -BIKE_LANE_OFFSET;
      const angle = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      add('shellScooter', roadX + lane, y + (rand() - 0.5) * 70, angle, {
        color: mermanTails[Math.floor(rand() * mermanTails.length)],
        accent: '#9ef7ff',
        road: {
          axis: 'y',
          roadCoord: roadX,
          laneOffset: lane,
          laneWidth: BIKE_LANE_OFFSET,
          dir,
          speed: 58 + rand() * 24,
          targetAngle: angle,
          lastIntersection: null,
        },
      });
    }
  }

  // 5. Giant Coral Spires & Reef Pavilions (Tier 6)
  const giantSpots = [
    [-500, -1060], [500, -1060],
    [-1060, -500], [1060, -500],
    [-1060, 0], [1060, 0],
    [-1060, 500], [1060, 500],
    [-500, 1060], [500, 1060], [0, 1060],
  ];
  giantSpots.forEach(([gx, gy], idx) => {
    add(idx % 2 === 0 ? 'coralTower' : 'reefDome', gx + (rand() - 0.5) * 40, gy + (rand() - 0.5) * 40, 0);
  });

  // 6. Coral Cottages & Shell Villas (Tier 5) in mid-ring reef blocks
  const midBlocks = [
    [-500, -500], [0, -500], [500, -500],
    [-500, 0], [500, 0],
    [-500, 500], [0, 500], [500, 500],
  ];
  for (const [bx, by] of midBlocks) {
    for (const [ox, oy] of [[-85, -80], [85, -80], [-85, 85], [85, 85]]) {
      const isCottage = rand() < 0.56;
      const pick = isCottage ? 'coralCottage' : 'shellVilla';
      const pal = isCottage
        ? cottagePalettes[Math.floor(rand() * cottagePalettes.length)]
        : villaPalettes[Math.floor(rand() * villaPalettes.length)];
      add(pick, bx + ox + (rand() - 0.5) * 24, by + oy + (rand() - 0.5) * 24, 0, {
        color: pal[0],
        accent: pal[1],
      });
    }
  }

  // 7. Scatter giant kelp, staghorn coral, brain coral, anemones, kelp lamps, chests, shells & swimming mermen
  const scatter = [
    ['kelpTree', 26],
    ['staghornCoral', 24],
    ['coralBush', 42],
    ['seaAnemone', 28],
    ['kelpLamp', 28],
    ['treasureChest', 20],
    ['starfish', 34],
    ['seaShell', 32],
    ['pearlClam', 26],
    ['merman', 38],
  ];
  for (const [type, count] of scatter) {
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < count * 12) {
      attempts++;
      const x = (rand() * 2 - 1) * (halfSize - 90);
      const y = (rand() * 2 - 1) * (halfSize - 90);
      if (roads.some((r) => Math.abs(x - r) < 66 || Math.abs(y - r) < 66)) continue;
      if (add(type, x, y, rand() * Math.PI * 2, makeReefExtra(type))) placed++;
    }
  }

  return { mapId: 'reef', halfSize, roads, sandPatches, props };
}
