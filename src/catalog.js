export const TIERS = [
  { level: 1, minRadius: 20, label: 'Tiny Treasures' },
  { level: 2, minRadius: 31, label: 'Street Gear' },
  { level: 3, minRadius: 46, label: 'Cars & Bushes' },
  { level: 4, minRadius: 70, label: 'Trees & Trucks' },
  { level: 5, minRadius: 104, label: 'Houses & Cafes' },
  { level: 6, minRadius: 148, label: 'City Blocks' },
  { level: 7, minRadius: 205, label: 'Skyscrapers!' },
];

export const PROPS = {
  // Tier 1: Tiny (radius 9-15)
  cone: { name: 'Traffic Cone', tier: 1, radius: 10, height: 14, mass: 12, points: 10, shape: 'cone', color: '#f2784b', accent: '#fff7e8' },
  flower: { name: 'Flower Pot', tier: 1, radius: 11, height: 12, mass: 13, points: 10, shape: 'flower', color: '#d47c54', accent: '#f58ca8' },
  hydrant: { name: 'Fire Hydrant', tier: 1, radius: 12, height: 16, mass: 16, points: 15, shape: 'hydrant', color: '#e65564', accent: '#ffd269' },
  bollard: { name: 'Sidewalk Post', tier: 1, radius: 11, height: 15, mass: 14, points: 12, shape: 'cylinder', color: '#7a8ea3', accent: '#ffe184' },

  // Tier 2: Small (radius 18-26)
  trashcan: { name: 'Trash Can', tier: 2, radius: 19, height: 22, mass: 34, points: 25, shape: 'cylinder', color: '#589e8c', accent: '#3d7567' },
  mailbox: { name: 'Mailbox', tier: 2, radius: 18, height: 26, mass: 32, points: 25, shape: 'box', color: '#4d82b8', accent: '#e85868' },
  bench: { name: 'Park Bench', tier: 2, radius: 24, height: 16, mass: 48, points: 35, shape: 'bench', color: '#c4834f', accent: '#546473' },
  lamp: { name: 'Street Lamp', tier: 2, radius: 20, height: 42, mass: 42, points: 30, shape: 'lamp', color: '#4f6275', accent: '#ffe896' },

  // Tier 3: Medium (radius 30-42)
  bush: { name: 'Round Bush', tier: 3, radius: 30, height: 22, mass: 85, points: 50, shape: 'bush', color: '#5cb370', accent: '#80d48f' },
  carRed: { name: 'Red Car', tier: 3, radius: 36, height: 24, mass: 145, points: 80, shape: 'car', color: '#ea5c6a', accent: '#d8f1ff' },
  carBlue: { name: 'Blue Car', tier: 3, radius: 36, height: 24, mass: 145, points: 80, shape: 'car', color: '#5595d9', accent: '#d8f1ff' },
  carYellow: { name: 'Taxi Cab', tier: 3, radius: 37, height: 24, mass: 150, points: 85, shape: 'car', color: '#f5c249', accent: '#d8f1ff' },

  // Tier 4: Large (radius 48-64)
  pine: { name: 'Pine Tree', tier: 4, radius: 48, height: 64, mass: 260, points: 120, shape: 'pine', color: '#3f8c6e', accent: '#5db38e' },
  oak: { name: 'Oak Tree', tier: 4, radius: 52, height: 56, mass: 290, points: 130, shape: 'oak', color: '#56a863', accent: '#7bc977' },
  truck: { name: 'Delivery Truck', tier: 4, radius: 54, height: 34, mass: 340, points: 160, shape: 'truck', color: '#fff8ec', accent: '#5ca89a' },
  bus: { name: 'School Bus', tier: 4, radius: 60, height: 34, mass: 410, points: 190, shape: 'bus', color: '#f7bc3b', accent: '#3d5061' },

  // Tier 5: Huge (radius 74-96)
  cottage: { name: 'Cozy Cottage', tier: 5, radius: 76, height: 62, mass: 760, points: 320, shape: 'house', color: '#fff4df', accent: '#e06c65' },
  cafe: { name: 'Corner Cafe', tier: 5, radius: 84, height: 66, mass: 920, points: 380, shape: 'house', color: '#f9e3cf', accent: '#4d9c8a' },
  houseBlue: { name: 'Blue House', tier: 5, radius: 90, height: 72, mass: 1080, points: 420, shape: 'house', color: '#dcecf7', accent: '#5482b3' },

  // Tier 6: Giant (radius 112-136)
  apartments: { name: 'Apartments', tier: 6, radius: 118, height: 115, mass: 2100, points: 750, shape: 'tower', color: '#f2d0b6', accent: '#d98a6c' },
  office: { name: 'City Office', tier: 6, radius: 130, height: 135, mass: 2600, points: 900, shape: 'tower', color: '#c4d9e8', accent: '#5f8eb0' },

  // Tier 7: Colossal (radius 158-185)
  skyscraper: { name: 'Skyscraper', tier: 7, radius: 162, height: 195, mass: 4600, points: 1600, shape: 'skyscraper', color: '#9ec4de', accent: '#49799e' },
  cityHall: { name: 'Grand City Hall', tier: 7, radius: 182, height: 175, mass: 6200, points: 2500, shape: 'cityHall', color: '#f7ebd4', accent: '#f2c14e' },
};

export function tierForRadius(radius) {
  let current = TIERS[0];
  for (const t of TIERS) {
    if (radius >= t.minRadius) current = t;
  }
  return current;
}
