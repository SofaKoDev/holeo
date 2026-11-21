export const MAPS = [
  { id: 'town', name: 'Cozy Town', subtitle: 'Park plaza, cottages & avenues', badge: '🏡' },
  { id: 'metro', name: 'Metro City', subtitle: 'Yellow cabs, cyclists & mega-towers', badge: '🏙️' },
  { id: 'mars', name: 'Mars Colony', subtitle: 'Aliens, hover-cars & biodomes', badge: '🪐' },
  { id: 'playroom', name: 'Playroom', subtitle: 'Toy blocks, plushies & play rug', badge: '🧸' },
];

export const TIERS = [
  { level: 1, minRadius: 20, label: 'Tiny Treasures' },
  { level: 2, minRadius: 26, label: 'Sidewalk Gear' },
  { level: 3, minRadius: 34, label: 'Park & Bushes' },
  { level: 4, minRadius: 42, label: 'Compact Cars' },
  { level: 5, minRadius: 54, label: 'Park Trees' },
  { level: 6, minRadius: 68, label: 'Trucks & Buses' },
  { level: 7, minRadius: 86, label: 'Cozy Cottages' },
  { level: 8, minRadius: 102, label: 'Town Houses' },
  { level: 9, minRadius: 130, label: 'Apartments' },
  { level: 10, minRadius: 150, label: 'City Offices' },
  { level: 11, minRadius: 180, label: 'Skyscrapers' },
  { level: 12, minRadius: 205, label: 'City Eater!' },
];

export const PROPS = {
  // Tier 1: Tiny (radius 9-15)
  cone: { name: 'Traffic Cone', tier: 1, radius: 10, height: 14, mass: 12, points: 10, shape: 'cone', color: '#f2784b', accent: '#fff7e8' },
  flower: { name: 'Flower Pot', tier: 1, radius: 11, height: 12, mass: 13, points: 10, shape: 'flower', color: '#d47c54', accent: '#f58ca8' },
  hydrant: { name: 'Fire Hydrant', tier: 1, radius: 12, height: 16, mass: 16, points: 15, shape: 'hydrant', color: '#e65564', accent: '#ffd269' },
  bollard: { name: 'Sidewalk Post', tier: 1, radius: 11, height: 15, mass: 14, points: 12, shape: 'cylinder', color: '#7a8ea3', accent: '#ffe184' },
  person: { name: 'Townsperson', tier: 1, radius: 12, height: 22, mass: 16, points: 18, shape: 'person', color: '#5c8fd6', accent: '#f2c14e', motion: 'wander' },
  newsstand: { name: 'Newspaper Box', tier: 1, radius: 13, height: 18, mass: 18, points: 18, shape: 'newsstand', color: '#3b73b5', accent: '#f7f4eb' },
  marsRock: { name: 'Martian Rock', tier: 1, radius: 11, height: 12, mass: 13, points: 10, shape: 'marsRock', color: '#a8533b', accent: '#c96f53' },
  marsCrystal: { name: 'Glow Crystal', tier: 1, radius: 12, height: 18, mass: 16, points: 16, shape: 'marsCrystal', color: '#5be9f5', accent: '#b87cff' },
  alien: { name: 'Martian Alien', tier: 1, radius: 12, height: 22, mass: 17, points: 20, shape: 'alien', color: '#69db6e', accent: '#48b84e', motion: 'wander' },
  toyBrick: { name: 'Toy Brick', tier: 1, radius: 11, height: 12, mass: 13, points: 10, shape: 'toyBrick', color: '#ef5b5b', accent: '#ff8a8a' },
  crayon: { name: 'Crayon', tier: 1, radius: 11, height: 15, mass: 13, points: 12, shape: 'crayon', color: '#4da3e8', accent: '#2c6ea3' },
  rubberDuck: { name: 'Rubber Duck', tier: 1, radius: 12, height: 16, mass: 15, points: 15, shape: 'rubberDuck', color: '#ffd447', accent: '#ff8c38' },
  windupToy: { name: 'Wind-Up Toy', tier: 1, radius: 12, height: 22, mass: 17, points: 20, shape: 'windupToy', color: '#ff708d', accent: '#ffd152', motion: 'wander' },

  // Tier 2: Small (radius 18-26)
  trashcan: { name: 'Trash Can', tier: 2, radius: 19, height: 22, mass: 34, points: 25, shape: 'cylinder', color: '#589e8c', accent: '#3d7567' },
  mailbox: { name: 'Mailbox', tier: 2, radius: 18, height: 26, mass: 32, points: 25, shape: 'box', color: '#4d82b8', accent: '#e85868' },
  bench: { name: 'Park Bench', tier: 2, radius: 24, height: 16, mass: 48, points: 35, shape: 'bench', color: '#c4834f', accent: '#546473' },
  lamp: { name: 'Street Lamp', tier: 2, radius: 20, height: 42, mass: 42, points: 30, shape: 'lamp', color: '#4f6275', accent: '#ffe896' },
  cyclist: { name: 'City Cyclist', tier: 2, radius: 18, height: 22, mass: 36, points: 40, shape: 'cyclist', color: '#e65c5c', accent: '#2c3e50', motion: 'road' },
  subwaySign: { name: 'Subway Entrance', tier: 2, radius: 20, height: 36, mass: 42, points: 35, shape: 'subwaySign', color: '#334454', accent: '#48c479' },
  hotdogCart: { name: 'Hot Dog Cart', tier: 2, radius: 22, height: 28, mass: 48, points: 45, shape: 'hotdogCart', color: '#d8dfe6', accent: '#e65555' },
  solarPanel: { name: 'Solar Array', tier: 2, radius: 22, height: 20, mass: 42, points: 35, shape: 'solarPanel', color: '#2b5d99', accent: '#80c8ff' },
  beacon: { name: 'Mars Beacon', tier: 2, radius: 19, height: 42, mass: 38, points: 32, shape: 'beacon', color: '#d9e0e8', accent: '#ff6b57' },
  hoverScooter: { name: 'Hover-Scooter', tier: 2, radius: 18, height: 22, mass: 38, points: 42, shape: 'hoverScooter', color: '#69db6e', accent: '#5be9f5', motion: 'road' },
  abcBlock: { name: 'ABC Block', tier: 2, radius: 20, height: 26, mass: 36, points: 28, shape: 'abcBlock', color: '#f7d89c', accent: '#e85d5d' },
  ringStack: { name: 'Stacking Rings', tier: 2, radius: 20, height: 34, mass: 38, points: 32, shape: 'ringStack', color: '#f26b6b', accent: '#58b8e8' },
  plushBunny: { name: 'Plush Bunny', tier: 2, radius: 22, height: 28, mass: 44, points: 38, shape: 'plushBunny', color: '#f7dce4', accent: '#f29eb6' },
  toyScooter: { name: 'Ride-On Scooter', tier: 2, radius: 18, height: 22, mass: 38, points: 42, shape: 'toyScooter', color: '#ff6b6b', accent: '#ffd447', motion: 'road' },

  // Tier 3: Medium (radius 30-42)
  bush: { name: 'Round Bush', tier: 3, radius: 30, height: 22, mass: 85, points: 50, shape: 'bush', color: '#5cb370', accent: '#80d48f' },
  marsPod: { name: 'Alien Flora Pod', tier: 3, radius: 30, height: 26, mass: 88, points: 55, shape: 'marsPod', color: '#9c5fd6', accent: '#62f0d5' },
  carRed: { name: 'Red Car', tier: 3, radius: 36, height: 24, mass: 145, points: 80, shape: 'car', color: '#ea5c6a', accent: '#d8f1ff', motion: 'road' },
  carBlue: { name: 'Blue Car', tier: 3, radius: 36, height: 24, mass: 145, points: 80, shape: 'car', color: '#5595d9', accent: '#d8f1ff', motion: 'road' },
  carYellow: { name: 'Taxi Cab', tier: 3, radius: 37, height: 24, mass: 150, points: 85, shape: 'car', color: '#f5c249', accent: '#d8f1ff', motion: 'road' },
  hoverCar: { name: 'Hover-Cruiser', tier: 3, radius: 36, height: 24, mass: 150, points: 88, shape: 'hoverCar', color: '#ff7b54', accent: '#6cf2ff', motion: 'road' },
  saucerCar: { name: 'Mini UFO', tier: 3, radius: 36, height: 24, mass: 155, points: 92, shape: 'saucerCar', color: '#c4d2e0', accent: '#7aff95', motion: 'road' },
  teddyBear: { name: 'Teddy Bear', tier: 3, radius: 32, height: 34, mass: 92, points: 58, shape: 'teddyBear', color: '#c48652', accent: '#edd0ae' },
  plushDino: { name: 'Plush Dino', tier: 3, radius: 32, height: 36, mass: 94, points: 60, shape: 'plushDino', color: '#64c47d', accent: '#ffd152' },
  toyCarRed: { name: 'Toy Racer', tier: 3, radius: 36, height: 24, mass: 148, points: 82, shape: 'toyCar', color: '#ef5b5b', accent: '#ffe169', motion: 'road' },
  toyCarBlue: { name: 'Wooden Car', tier: 3, radius: 36, height: 24, mass: 148, points: 82, shape: 'toyCar', color: '#4da3e8', accent: '#fff4d4', motion: 'road' },
  toyCarYellow: { name: 'Toy Buggy', tier: 3, radius: 36, height: 24, mass: 150, points: 86, shape: 'toyCar', color: '#f7c548', accent: '#ff708d', motion: 'road' },

  // Tier 4: Large (radius 48-64)
  pine: { name: 'Pine Tree', tier: 4, radius: 48, height: 64, mass: 260, points: 120, shape: 'pine', color: '#3f8c6e', accent: '#5db38e' },
  oak: { name: 'Oak Tree', tier: 4, radius: 52, height: 56, mass: 290, points: 130, shape: 'oak', color: '#56a863', accent: '#7bc977' },
  truck: { name: 'Delivery Truck', tier: 4, radius: 54, height: 34, mass: 340, points: 160, shape: 'truck', color: '#fff8ec', accent: '#5ca89a', motion: 'road' },
  bus: { name: 'School Bus', tier: 4, radius: 60, height: 34, mass: 410, points: 190, shape: 'bus', color: '#f7bc3b', accent: '#3d5061', motion: 'road' },
  marsRover: { name: 'Mars Rover', tier: 4, radius: 52, height: 36, mass: 330, points: 165, shape: 'marsRover', color: '#f2ece1', accent: '#e87a48', motion: 'road' },
  hoverHauler: { name: 'Hover-Hauler', tier: 4, radius: 58, height: 36, mass: 410, points: 195, shape: 'hoverHauler', color: '#dde6f0', accent: '#5be9f5', motion: 'road' },
  crystalSpire: { name: 'Crystal Spire', tier: 4, radius: 48, height: 68, mass: 280, points: 135, shape: 'crystalSpire', color: '#7a6bf0', accent: '#6ef5ff' },
  rockingHorse: { name: 'Hobby Horse', tier: 4, radius: 50, height: 56, mass: 285, points: 140, shape: 'rockingHorse', color: '#d4915a', accent: '#e85d5d' },
  plushElephant: { name: 'Plush Elephant', tier: 4, radius: 50, height: 50, mass: 280, points: 135, shape: 'plushElephant', color: '#8ab4d8', accent: '#f5b8c8' },
  toyTruck: { name: 'Toy Dump Truck', tier: 4, radius: 54, height: 36, mass: 345, points: 165, shape: 'toyTruck', color: '#f7c548', accent: '#ef5b5b', motion: 'road' },
  toyTrain: { name: 'Wooden Train', tier: 4, radius: 58, height: 38, mass: 410, points: 195, shape: 'toyTrain', color: '#4c94d8', accent: '#ef5b5b', motion: 'road' },

  // Tier 5: Huge (radius 74-96)
  cottage: { name: 'Cozy Cottage', tier: 5, radius: 76, height: 62, mass: 760, points: 320, shape: 'house', color: '#fff4df', accent: '#e06c65' },
  cafe: { name: 'Corner Cafe', tier: 5, radius: 84, height: 66, mass: 920, points: 380, shape: 'house', color: '#f9e3cf', accent: '#4d9c8a' },
  houseBlue: { name: 'Blue House', tier: 5, radius: 90, height: 72, mass: 1080, points: 420, shape: 'house', color: '#dcecf7', accent: '#5482b3' },
  brownstone: { name: 'Brownstone', tier: 5, radius: 86, height: 96, mass: 1020, points: 430, shape: 'brownstone', color: '#b86b52', accent: '#7a4536' },
  habDome: { name: 'Mars Biodome', tier: 5, radius: 86, height: 72, mass: 980, points: 410, shape: 'habDome', color: '#eef3f7', accent: '#69db9e' },
  blockHouse: { name: 'Block Cottage', tier: 5, radius: 82, height: 74, mass: 920, points: 390, shape: 'blockHouse', color: '#f5d99e', accent: '#ef5b5b' },
  blockArch: { name: 'Block Archway', tier: 5, radius: 86, height: 78, mass: 990, points: 420, shape: 'blockArch', color: '#a8dcff', accent: '#ffd447' },

  // Tier 6: Giant (radius 112-136)
  apartments: { name: 'Apartments', tier: 6, radius: 118, height: 115, mass: 2100, points: 750, shape: 'tower', color: '#f2d0b6', accent: '#d98a6c' },
  office: { name: 'City Office', tier: 6, radius: 130, height: 135, mass: 2600, points: 900, shape: 'tower', color: '#c4d9e8', accent: '#5f8eb0' },
  waterTowerBlock: { name: 'High-Rise Block', tier: 6, radius: 124, height: 165, mass: 2400, points: 860, shape: 'waterTowerBlock', color: '#cf9b82', accent: '#8c5f4d' },
  radarDish: { name: 'Comms Array', tier: 6, radius: 120, height: 145, mass: 2250, points: 820, shape: 'radarDish', color: '#e6edf5', accent: '#ff7b54' },
  colonyTower: { name: 'Colony Spire', tier: 6, radius: 130, height: 165, mass: 2650, points: 920, shape: 'colonyTower', color: '#edf2f7', accent: '#4fd1e8' },
  blockTower: { name: 'ABC Block Tower', tier: 6, radius: 122, height: 155, mass: 2350, points: 860, shape: 'blockTower', color: '#f7d89c', accent: '#56b385' },
  toyChest: { name: 'Toy Chest', tier: 6, radius: 128, height: 118, mass: 2550, points: 900, shape: 'toyChest', color: '#d98a54', accent: '#ffd447' },

  // Tier 7: Colossal (radius 158-185)
  skyscraper: { name: 'Skyscraper', tier: 7, radius: 162, height: 195, mass: 4600, points: 1600, shape: 'skyscraper', color: '#9ec4de', accent: '#49799e' },
  cityHall: { name: 'Grand City Hall', tier: 7, radius: 182, height: 175, mass: 6200, points: 2500, shape: 'cityHall', color: '#f7ebd4', accent: '#f2c14e' },
  glassTower: { name: 'Glass Skyscraper', tier: 7, radius: 158, height: 245, mass: 4700, points: 1650, shape: 'glassTower', color: '#8ac5e3', accent: '#3e7396' },
  wedgeTower: { name: 'Flatiron Tower', tier: 7, radius: 168, height: 270, mass: 5400, points: 2000, shape: 'wedgeTower', color: '#e6d7bd', accent: '#b8a382' },
  metroSpire: { name: 'Empire Spire', tier: 7, radius: 184, height: 320, mass: 6900, points: 2800, shape: 'metroSpire', color: '#d4dce6', accent: '#687f96' },
  marsRocket: { name: 'Starship Rocket', tier: 7, radius: 160, height: 280, mass: 4900, points: 1750, shape: 'marsRocket', color: '#f4f7fa', accent: '#e8584a' },
  mothership: { name: 'UFO Mothership', tier: 7, radius: 184, height: 190, mass: 6600, points: 2700, shape: 'mothership', color: '#9ab0c7', accent: '#6cf2ff' },
  playTent: { name: 'Playhouse Teepee', tier: 7, radius: 162, height: 225, mass: 4950, points: 1750, shape: 'playTent', color: '#fff4df', accent: '#ef6b6b' },
  blockCastle: { name: 'Grand Block Castle', tier: 7, radius: 184, height: 245, mass: 6600, points: 2700, shape: 'blockCastle', color: '#f7ddb0', accent: '#4da3e8' },
};

export function tierForRadius(radius) {
  let current = TIERS[0];
  for (const t of TIERS) {
    if (radius >= t.minRadius) current = t;
  }
  return current;
}

export function tierProgressForRadius(radius) {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (radius >= TIERS[i].minRadius) idx = i;
  }
  if (idx >= TIERS.length - 1) return 1;
  const cur = TIERS[idx].minRadius;
  const next = TIERS[idx + 1].minRadius;
  return Math.max(0, Math.min(1, (radius - cur) / Math.max(1, next - cur)));
}
