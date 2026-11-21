import { describe, it, expect } from 'vitest';
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
});
