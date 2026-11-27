import { describe, it, expect } from 'vitest';
import { TIERS, tierProgressForRadius } from '../src/catalog.js';
import { pickPersonFallSound, shouldPlayVehicleHonk } from '../src/audio.js';
import { createGame, startGame, stepGame, togglePause, START_RADIUS, ARCADE_DURATION } from '../src/engine.js';

describe('Holeo engine', () => {
  it('generates a rich seeded town with starter props near the center', () => {
    const game = createGame({ mode: 'sandbox', seed: 42 });
    expect(game.totalProps).toBeGreaterThan(200);
    const tinyNearStart = game.town.props.filter(
      (p) => p.tier === 1 && Math.hypot(p.x, p.y) < 280,
    );
    expect(tinyNearStart.length).toBeGreaterThanOrEqual(15);
    // Exact spawn center is clear
    for (const p of game.town.props) {
      expect(Math.hypot(p.x, p.y)).toBeGreaterThanOrEqual(p.radius + 30);
    }
  });

  it('swallows smaller props, grows the hole, and increases score', () => {
    const game = createGame({ mode: 'sandbox', seed: 42 });
    startGame(game);
    const tiny = game.town.props.find((p) => p.tier === 1);
    game.hole.x = tiny.x;
    game.hole.y = tiny.y;

    for (let i = 0; i < 20; i++) stepGame(game, 0.04, 0, 0);

    expect(tiny.swallowed).toBe(true);
    expect(game.swallowedCount).toBeGreaterThanOrEqual(1);
    expect(game.hole.radius).toBeGreaterThan(START_RADIUS);
    expect(game.score).toBeGreaterThanOrEqual(tiny.points);
  });

  it('does not swallow huge skyscrapers while the hole is still tiny', () => {
    const game = createGame({ mode: 'sandbox', seed: 42 });
    startGame(game);
    const skyscraper = game.town.props.find((p) => p.shape === 'skyscraper');
    game.hole.x = skyscraper.x;
    game.hole.y = skyscraper.y;

    for (let i = 0; i < 10; i++) stepGame(game, 0.04, 0, 0);

    expect(skyscraper.swallowed).toBe(false);
    expect(skyscraper.swallowing).toBe(false);
  });

  it('pauses simulation and finishes Arcade mode when the timer reaches zero', () => {
    const game = createGame({ mode: 'arcade', seed: 42 });
    startGame(game);
    expect(game.timeLeft).toBe(ARCADE_DURATION);

    togglePause(game);
    const before = game.timeLeft;
    stepGame(game, 0.05, 1, 0);
    expect(game.timeLeft).toBe(before);

    togglePause(game);
    game.timeLeft = 0.03;
    stepGame(game, 0.05, 0, 0);
    expect(game.phase).toBe('finished');
    expect(game.finishedReason).toBe('time');
  });

  it('moves vehicles along the road network and keeps them on street paths', () => {
    const game = createGame({ mode: 'sandbox', seed: 42 });
    startGame(game);
    const vehicles = game.town.props.filter((p) => p.motion === 'road');
    expect(vehicles.length).toBeGreaterThan(10);

    const startPositions = vehicles.map((v) => ({ x: v.x, y: v.y }));
    for (let i = 0; i < 120; i++) stepGame(game, 0.04, 0, 0);

    let movedCount = 0;
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      if (Math.hypot(v.x - startPositions[i].x, v.y - startPositions[i].y) > 5) movedCount++;
      // Every active vehicle must stay within road width (<= 46px from a horizontal or vertical road center)
      const onRoad = game.town.roads.some((r) => Math.abs(v.x - r) <= 46 || Math.abs(v.y - r) <= 46);
      expect(onRoad).toBe(true);
    }
    expect(movedCount).toBeGreaterThan(vehicles.length * 0.7);
  });

  it('wanders townspeople around the map over time', () => {
    const game = createGame({ mode: 'sandbox', seed: 42 });
    startGame(game);
    const people = game.town.props.filter((p) => p.shape === 'person');
    expect(people.length).toBeGreaterThan(20);

    const startPositions = people.map((p) => ({ x: p.x, y: p.y }));
    for (let i = 0; i < 80; i++) stepGame(game, 0.04, 0, 0);

    const moved = people.filter((p, i) => Math.hypot(p.x - startPositions[i].x, p.y - startPositions[i].y) > 4);
    expect(moved.length).toBeGreaterThan(people.length * 0.6);
  });

  it('applies gravity drop and tipping physics to props falling into the hole', () => {
    const game = createGame({ mode: 'sandbox', seed: 42 });
    startGame(game);
    const tiny = game.town.props.find((p) => p.tier === 1 && p.shape === 'cone');
    game.hole.x = tiny.x;
    game.hole.y = tiny.y;

    stepGame(game, 0.04, 0, 0);
    expect(tiny.swallowing).toBe(true);
    const vz1 = tiny.vz;
    const z1 = tiny.z;

    stepGame(game, 0.04, 0, 0);
    expect(tiny.vz).toBeLessThan(vz1); // accelerating downward under gravity
    expect(tiny.z).toBeLessThan(z1);
    expect(tiny.tilt).toBeGreaterThan(0);
  });

  it('levels up quickly through a 12-level ladder as starter props are swallowed', () => {
    expect(TIERS.length).toBe(12);
    expect(tierProgressForRadius(START_RADIUS)).toBeGreaterThan(0);
    expect(tierProgressForRadius(START_RADIUS)).toBeLessThan(1);

    const game = createGame({ mode: 'sandbox', seed: 42 });
    startGame(game);
    const starters = game.town.props.filter((p) => p.tier === 1).slice(0, 12);
    for (const prop of starters) {
      game.hole.x = prop.x;
      game.hole.y = prop.y;
      for (let i = 0; i < 20; i++) stepGame(game, 0.04, 0, 0);
    }

    expect(game.hole.tier).toBeGreaterThanOrEqual(2);
  });

  it('emits captured events for falling people/cars and saves wilhelm scream for the last person', () => {
    expect(pickPersonFallSound(0.99, true)).toBe('wilhelm');
    expect(pickPersonFallSound(0.10, false)).toBe('yelp');
    expect(pickPersonFallSound(0.35, false)).toBe('scream');
    expect(pickPersonFallSound(0.45, false)).toBe('none');
    expect(pickPersonFallSound(0.95, false)).toBe('none');
    expect(shouldPlayVehicleHonk(0.2)).toBe(true);
    expect(shouldPlayVehicleHonk(0.75)).toBe(false);

    const game = createGame({ mode: 'sandbox', seed: 42 });
    startGame(game);
    const person = game.town.props.find((p) => p.shape === 'person');
    game.hole.x = person.x;
    game.hole.y = person.y;
    const step = stepGame(game, 0.04, 0, 0);
    expect(step.captured).toContain(person);
  });

  it('generates Metro City with taller towers and street-riding cyclists', () => {
    const game = createGame({ mode: 'sandbox', mapId: 'metro', seed: 42 });
    startGame(game);
    expect(game.town.mapId).toBe('metro');
    expect(game.town.props.some((p) => p.shape === 'metroSpire')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'wedgeTower')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'glassTower')).toBe(true);

    const cyclists = game.town.props.filter((p) => p.shape === 'cyclist');
    expect(cyclists.length).toBeGreaterThan(8);
    const startPos = cyclists.map((c) => ({ x: c.x, y: c.y }));

    for (let i = 0; i < 100; i++) stepGame(game, 0.04, 0, 0);

    let moved = 0;
    for (let i = 0; i < cyclists.length; i++) {
      const c = cyclists[i];
      if (Math.hypot(c.x - startPos[i].x, c.y - startPos[i].y) > 5) moved++;
      const onStreet = game.town.roads.some((r) => Math.abs(c.x - r) <= 56 || Math.abs(c.y - r) <= 56);
      expect(onStreet).toBe(true);
    }
    expect(moved).toBeGreaterThan(cyclists.length * 0.7);
  });

  it('generates Mars Colony with wandering aliens, spaceship traffic, and Martian landmarks', () => {
    const game = createGame({ mode: 'sandbox', mapId: 'mars', seed: 42 });
    startGame(game);
    expect(game.town.mapId).toBe('mars');
    expect(game.town.props.some((p) => p.shape === 'mothership')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'marsRocket')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'habDome')).toBe(true);

    const aliens = game.town.props.filter((p) => p.shape === 'alien');
    const crafts = game.town.props.filter((p) => p.motion === 'road');
    expect(aliens.length).toBeGreaterThan(20);
    expect(crafts.length).toBeGreaterThan(15);

    const alienStart = aliens.map((a) => ({ x: a.x, y: a.y }));
    const craftStart = crafts.map((c) => ({ x: c.x, y: c.y }));
    for (let i = 0; i < 80; i++) stepGame(game, 0.04, 0, 0);

    const movedAliens = aliens.filter((a, i) => Math.hypot(a.x - alienStart[i].x, a.y - alienStart[i].y) > 4);
    expect(movedAliens.length).toBeGreaterThan(aliens.length * 0.6);

    let movedCrafts = 0;
    for (let i = 0; i < crafts.length; i++) {
      const c = crafts[i];
      if (Math.hypot(c.x - craftStart[i].x, c.y - craftStart[i].y) > 5) movedCrafts++;
      const onLane = game.town.roads.some((r) => Math.abs(c.x - r) <= 56 || Math.abs(c.y - r) <= 56);
      expect(onLane).toBe(true);
    }
    expect(movedCrafts).toBeGreaterThan(crafts.length * 0.7);
  });

  it('generates Playroom with block buildings, stuffed animals, hobby horses, wind-up toys, and toy road vehicles', () => {
    const game = createGame({ mode: 'sandbox', mapId: 'playroom', seed: 42 });
    startGame(game);
    expect(game.town.mapId).toBe('playroom');
    expect(game.town.props.some((p) => p.shape === 'blockCastle')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'playTent')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'blockTower')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'blockHouse')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'rockingHorse')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'teddyBear')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'plushDino')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'plushElephant')).toBe(true);

    const windups = game.town.props.filter((p) => p.shape === 'windupToy');
    const vehicles = game.town.props.filter((p) => p.motion === 'road');
    expect(windups.length).toBeGreaterThan(20);
    expect(vehicles.length).toBeGreaterThan(15);

    const windupStart = windups.map((w) => ({ x: w.x, y: w.y }));
    const vehicleStart = vehicles.map((v) => ({ x: v.x, y: v.y }));
    for (let i = 0; i < 80; i++) stepGame(game, 0.04, 0, 0);

    const movedWindups = windups.filter((w, i) => Math.hypot(w.x - windupStart[i].x, w.y - windupStart[i].y) > 4);
    expect(movedWindups.length).toBeGreaterThan(windups.length * 0.6);

    let movedVehicles = 0;
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      if (Math.hypot(v.x - vehicleStart[i].x, v.y - vehicleStart[i].y) > 5) movedVehicles++;
      const onLane = game.town.roads.some((r) => Math.abs(v.x - r) <= 56 || Math.abs(v.y - r) <= 56);
      expect(onLane).toBe(true);
    }
    expect(movedVehicles).toBeGreaterThan(vehicles.length * 0.7);
  });

  it('generates Coral Reef with swimming mermen, shell cars, and coral buildings', () => {
    const game = createGame({ mode: 'sandbox', mapId: 'reef', seed: 42 });
    startGame(game);
    expect(game.town.mapId).toBe('reef');
    expect(game.town.props.some((p) => p.shape === 'atlantisPalace')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'coralCitadel')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'coralTower')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'reefDome')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'coralCottage')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'shellVilla')).toBe(true);
    expect(game.town.props.some((p) => p.shape === 'shellCar')).toBe(true);

    const mermen = game.town.props.filter((p) => p.shape === 'merman');
    const vehicles = game.town.props.filter((p) => p.motion === 'road');
    expect(mermen.length).toBeGreaterThan(20);
    expect(vehicles.length).toBeGreaterThan(15);

    const mermanStart = mermen.map((m) => ({ x: m.x, y: m.y }));
    const vehicleStart = vehicles.map((v) => ({ x: v.x, y: v.y }));
    for (let i = 0; i < 80; i++) stepGame(game, 0.04, 0, 0);

    const movedMermen = mermen.filter((m, i) => Math.hypot(m.x - mermanStart[i].x, m.y - mermanStart[i].y) > 4);
    expect(movedMermen.length).toBeGreaterThan(mermen.length * 0.6);

    let movedVehicles = 0;
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      if (Math.hypot(v.x - vehicleStart[i].x, v.y - vehicleStart[i].y) > 5) movedVehicles++;
      const onLane = game.town.roads.some((r) => Math.abs(v.x - r) <= 56 || Math.abs(v.y - r) <= 56);
      expect(onLane).toBe(true);
    }
    expect(movedVehicles).toBeGreaterThan(vehicles.length * 0.7);
  });
});
