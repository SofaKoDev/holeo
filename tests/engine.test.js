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
});
