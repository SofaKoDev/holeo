function drawTownGround(ctx, town) {
  const half = town.halfSize;
  const isMetro = town.mapId === 'metro';
  const isMars = town.mapId === 'mars';
  const isPlayroom = town.mapId === 'playroom';
  const isReef = town.mapId === 'reef';
  const isStampede = town.mapId === 'stampede';

  // Base terrain: sunlit grass for Cozy Town, concrete for Metro, red desert for Mars, hardwood for Playroom, turquoise seabed for Coral Reef, stadium turf for Turbo Crowd
  ctx.fillStyle = isStampede
    ? '#8fd17f'
    : isReef
      ? '#69c0cf'
      : isPlayroom
        ? '#e6c79c'
        : isMars
          ? '#d47a57'
          : isMetro
            ? '#cfd5dc'
            : '#c5e2b5';
  ctx.fillRect(-half, -half, half * 2, half * 2);

  // Subtle mowed turf stripes in Turbo Crowd stadium
  if (isStampede) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let x = -half; x < half; x += 180) {
      ctx.fillRect(x, -half, 90, half * 2);
    }
  }

  // Subtle underwater caustic ripple bands in Coral Reef
  if (isReef) {
    ctx.strokeStyle = 'rgba(205, 250, 255, 0.16)';
    ctx.lineWidth = 6;
    for (let y = -half + 60; y <= half; y += 140) {
      ctx.beginPath();
      for (let x = -half; x <= half; x += 140) {
        const wy = y + Math.sin(x * 0.008 + y * 0.01) * 18;
        if (x === -half) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  }

  // Subtle hardwood floor planks in the Playroom
  if (isPlayroom) {
    ctx.strokeStyle = 'rgba(156, 108, 62, 0.16)';
    ctx.lineWidth = 2;
    for (let y = -half; y <= half; y += 72) {
      ctx.beginPath();
      ctx.moveTo(-half, y);
      ctx.lineTo(half, y);
      ctx.stroke();
    }
  }

  // Outer border
  ctx.strokeStyle = isStampede ? '#63a858' : isReef ? '#3a8ea3' : isPlayroom ? '#b88856' : isMars ? '#a8573b' : isMetro ? '#8f9aa8' : '#9ec78e';
  ctx.lineWidth = 28;
  ctx.strokeRect(-half, -half, half * 2, half * 2);

  if (isStampede) {
    // Giant terracotta oval running track looping around the stadium field
    ctx.save();
    ctx.strokeStyle = '#d96b52';
    ctx.lineWidth = 148;
    ctx.beginPath();
    ctx.ellipse(0, 0, 740, 560, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Crisp white track lane dividers
    ctx.strokeStyle = 'rgba(255, 252, 245, 0.72)';
    ctx.lineWidth = 3.5;
    for (const offset of [-66, -22, 22, 66]) {
      ctx.beginPath();
      ctx.ellipse(0, 0, 740 + offset, 560 + offset, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Checkered finish strip on the top & bottom straightaways
    for (const fy of [-560, 560]) {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(35, 45, 58, 0.65)';
          ctx.fillRect(-20 + c * 20, fy - 66 + r * 22, 20, 22);
        }
      }
    }

    // Sunny central start plaza at (0, 0)
    ctx.fillStyle = '#f5ebd6';
    ctx.beginPath();
    ctx.arc(0, 0, 155, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d96b52';
    ctx.lineWidth = 6;
    ctx.setLineDash([14, 12]);
    ctx.beginPath();
    ctx.arc(0, 0, 132, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffe599';
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (isReef) {
    // Sunlit sand shoals & caustic shimmer spots on the ocean floor
    if (town.sandPatches) {
      for (const sp of town.sandPatches) {
        ctx.fillStyle = 'rgba(218, 247, 232, 0.24)';
        ctx.beginPath();
        ctx.ellipse(sp.x, sp.y, sp.rx, sp.ry, sp.rot, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(225, 255, 255, 0.22)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(sp.x - sp.rx * 0.1, sp.y - sp.ry * 0.1, sp.rx * 0.68, sp.ry * 0.68, sp.rot, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // Central Pearl Lagoon Plaza at (0, 0)
    ctx.fillStyle = '#bdebe8';
    ctx.beginPath();
    ctx.roundRect(-195, -195, 390, 390, 56);
    ctx.fill();
    ctx.fillStyle = '#87d8e0';
    ctx.beginPath();
    ctx.roundRect(-170, -170, 340, 340, 44);
    ctx.fill();
    ctx.strokeStyle = 'rgba(235, 255, 255, 0.55)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 122, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#e5fbfa';
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6be6db';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 9]);
    ctx.beginPath();
    ctx.arc(0, 0, 72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (isPlayroom) {
    // Pastel foam play-mat tiles in each block
    if (town.playTiles) {
      for (const tile of town.playTiles) {
        const s = tile.size;
        ctx.fillStyle = tile.color;
        ctx.beginPath();
        ctx.roundRect(tile.x - s / 2, tile.y - s / 2, s, s, 26);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 5;
        ctx.stroke();
      }
    }
    // Cozy central rainbow play-rug at (0, 0)
    const rugRings = [
      { half: 198, rad: 46, color: '#ef767a' },
      { half: 184, rad: 40, color: '#ffd166' },
      { half: 170, rad: 34, color: '#7bd3a8' },
      { half: 156, rad: 28, color: '#fff8ea' },
    ];
    for (const ring of rugRings) {
      ctx.fillStyle = ring.color;
      ctx.beginPath();
      ctx.roundRect(-ring.half, -ring.half, ring.half * 2, ring.half * 2, ring.rad);
      ctx.fill();
    }
    // Sunny center medallion on the play-rug
    ctx.fillStyle = '#ffe599';
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f5b841';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, 72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (isMars) {
    // Martian craters scattered across the red desert
    if (town.craters) {
      for (const c of town.craters) {
        ctx.fillStyle = 'rgba(138, 62, 38, 0.28)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(232, 148, 108, 0.25)';
        ctx.beginPath();
        ctx.arc(c.x + c.r * 0.14, c.y + c.r * 0.14, c.r * 0.72, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Central Martian Landing Pad Plaza at (0, 0)
    ctx.fillStyle = '#536073';
    ctx.beginPath();
    ctx.roundRect(-195, -195, 390, 390, 48);
    ctx.fill();
    ctx.fillStyle = '#68778c';
    ctx.beginPath();
    ctx.roundRect(-170, -170, 340, 340, 36);
    ctx.fill();
    ctx.strokeStyle = 'rgba(94, 240, 255, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 118, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#475466';
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f2c14e';
    ctx.lineWidth = 4;
    ctx.setLineDash([14, 10]);
    ctx.beginPath();
    ctx.arc(0, 0, 62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (isMetro) {
    // Central Park green oasis in the heart of Metro City
    ctx.fillStyle = '#e5e0d4';
    ctx.beginPath();
    ctx.roundRect(-245, -245, 490, 490, 36);
    ctx.fill();
    ctx.fillStyle = '#a5d495';
    ctx.beginPath();
    ctx.roundRect(-220, -220, 440, 440, 28);
    ctx.fill();
    // Little Central Park pond
    ctx.fillStyle = '#7ec4e8';
    ctx.beginPath();
    ctx.ellipse(-95, -90, 56, 38, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath();
    ctx.ellipse(-108, -98, 22, 11, -0.25, 0, Math.PI * 2);
    ctx.fill();
    // Park walking paths
    ctx.fillStyle = '#efe8d8';
    ctx.fillRect(-245, -26, 490, 52);
    ctx.fillRect(-26, -245, 52, 490);
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Cozy central park plaza at (0, 0)
    ctx.fillStyle = '#f2e6cf';
    ctx.beginPath();
    ctx.roundRect(-195, -195, 390, 390, 44);
    ctx.fill();
    ctx.fillStyle = '#b4dca4';
    ctx.beginPath();
    ctx.roundRect(-170, -170, 340, 340, 34);
    ctx.fill();
    // Cross park paths
    ctx.fillStyle = '#f5ebd8';
    ctx.fillRect(-195, -26, 390, 52);
    ctx.fillRect(-26, -195, 52, 390);
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.fill();
  }

  // Paved sidewalks & avenues / Martian hover-highways / Play-rug toy roads / Ocean-current highways
  const roadW = isMetro || isMars || isPlayroom || isReef ? 116 : 104;
  const sideW = isMetro || isMars || isPlayroom || isReef ? 148 : 132;
  ctx.fillStyle = isReef ? '#b2e6e4' : isPlayroom ? '#bfe8c4' : isMars ? '#8c6252' : isMetro ? '#e3e6ea' : '#eee3ce';
  for (const r of town.roads) {
    ctx.fillRect(-half, r - sideW / 2, half * 2, sideW);
    ctx.fillRect(r - sideW / 2, -half, sideW, half * 2);
  }
  ctx.fillStyle = isReef ? '#29728f' : isPlayroom ? '#5a6678' : isMars ? '#364354' : isMetro ? '#4a5566' : '#626f82';
  for (const r of town.roads) {
    ctx.fillRect(-half, r - roadW / 2, half * 2, roadW);
    ctx.fillRect(r - roadW / 2, -half, roadW, half * 2);
  }

  // Outer bike lanes (Metro), glowing cyan hover-scooter lanes (Mars), pastel scooter lanes (Playroom), or seafoam lanes (Reef)
  if (isMetro || isMars || isPlayroom || isReef) {
    ctx.fillStyle = isReef
      ? 'rgba(130, 245, 224, 0.28)'
      : isPlayroom
        ? 'rgba(255, 212, 71, 0.32)'
        : isMars
          ? 'rgba(94, 240, 255, 0.22)'
          : 'rgba(72, 180, 118, 0.36)';
    for (const r of town.roads) {
      ctx.fillRect(-half, r - 50, half * 2, 14);
      ctx.fillRect(-half, r + 36, half * 2, 14);
      ctx.fillRect(r - 50, -half, 14, half * 2);
      ctx.fillRect(r + 36, -half, 14, half * 2);
    }
  }

  // Center lane lines
  ctx.save();
  if (isReef) {
    ctx.strokeStyle = 'rgba(205, 252, 255, 0.82)';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 18]);
    for (const r of town.roads) {
      ctx.beginPath();
      ctx.moveTo(-half + 30, r);
      ctx.lineTo(half - 30, r);
      ctx.moveTo(r, -half + 30);
      ctx.lineTo(r, half - 30);
      ctx.stroke();
    }
  } else if (isPlayroom) {
    ctx.strokeStyle = 'rgba(255, 224, 102, 0.9)';
    ctx.lineWidth = 4;
    ctx.setLineDash([22, 16]);
    for (const r of town.roads) {
      ctx.beginPath();
      ctx.moveTo(-half + 30, r);
      ctx.lineTo(half - 30, r);
      ctx.moveTo(r, -half + 30);
      ctx.lineTo(r, half - 30);
      ctx.stroke();
    }
  } else if (isMars) {
    ctx.strokeStyle = 'rgba(94, 240, 255, 0.78)';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([28, 18]);
    for (const r of town.roads) {
      ctx.beginPath();
      ctx.moveTo(-half + 30, r);
      ctx.lineTo(half - 30, r);
      ctx.moveTo(r, -half + 30);
      ctx.lineTo(r, half - 30);
      ctx.stroke();
    }
  } else if (isMetro) {
    ctx.strokeStyle = 'rgba(247, 206, 82, 0.85)';
    ctx.lineWidth = 3;
    for (const r of town.roads) {
      for (const off of [-3, 3]) {
        ctx.beginPath();
        ctx.moveTo(-half + 30, r + off);
        ctx.lineTo(half - 30, r + off);
        ctx.moveTo(r + off, -half + 30);
        ctx.lineTo(r + off, half - 30);
        ctx.stroke();
      }
    }
  } else {
    ctx.strokeStyle = 'rgba(255, 246, 214, 0.72)';
    ctx.lineWidth = 4;
    ctx.setLineDash([22, 20]);
    for (const r of town.roads) {
      ctx.beginPath();
      ctx.moveTo(-half + 30, r);
      ctx.lineTo(half - 30, r);
      ctx.moveTo(r, -half + 30);
      ctx.lineTo(r, half - 30);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Intersections & crosswalks / glowing hover-pads
  const roadColor = isReef ? '#29728f' : isPlayroom ? '#5a6678' : isMars ? '#364354' : isMetro ? '#4a5566' : '#626f82';
  ctx.fillStyle = roadColor;
  for (const rx of town.roads) {
    for (const ry of town.roads) {
      ctx.fillRect(rx - roadW / 2, ry - roadW / 2, roadW, roadW);
      ctx.fillStyle = isReef ? 'rgba(210, 252, 255, 0.72)' : isMars ? 'rgba(94, 240, 255, 0.6)' : 'rgba(255, 252, 242, 0.75)';
      for (let s = -38; s <= 38; s += 19) {
        ctx.fillRect(rx + s - 4, ry - roadW / 2 - 14, 8, 12);
        ctx.fillRect(rx + s - 4, ry + roadW / 2 + 2, 8, 12);
        ctx.fillRect(rx - roadW / 2 - 14, ry + s - 4, 12, 8);
        ctx.fillRect(rx + roadW / 2 + 2, ry + s - 4, 12, 8);
      }
      ctx.fillStyle = roadColor;
    }
  }
}

function drawHole(ctx, hole, elapsed) {
  ctx.save();
  ctx.translate(hole.x, hole.y);

  // Subtle sunlit ground rim bevel
  ctx.fillStyle = 'rgba(255, 245, 222, 0.55)';
  ctx.beginPath();
  ctx.arc(0, 0, hole.radius + Math.max(4, hole.radius * 0.08), 0, Math.PI * 2);
  ctx.fill();

  // Main hole opening
  const voidGrad = ctx.createRadialGradient(0, -hole.radius * 0.15, hole.radius * 0.15, 0, 0, hole.radius);
  voidGrad.addColorStop(0, '#070912');
  voidGrad.addColorStop(0.68, '#141a2b');
  voidGrad.addColorStop(1, '#29324a');
  ctx.fillStyle = voidGrad;
  ctx.beginPath();
  ctx.arc(0, 0, hole.radius, 0, Math.PI * 2);
  ctx.fill();

  // Subtle swirling depth ring inside the void
  ctx.strokeStyle = 'rgba(245, 206, 112, 0.28)';
  ctx.lineWidth = Math.max(2, hole.radius * 0.045);
  ctx.beginPath();
  ctx.arc(0, 0, hole.radius * 0.94, elapsed * 1.1, elapsed * 1.1 + Math.PI * 1.2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = Math.max(1.5, hole.radius * 0.03);
  ctx.beginPath();
  ctx.arc(0, 0, hole.radius * 0.62, -elapsed * 0.8, -elapsed * 0.8 + Math.PI);
  ctx.stroke();

  ctx.restore();
}

function drawProp(ctx, p) {
  const depth = p.swallowing ? p.swallowProgress : 0;
  // Perspective shrink as it falls deeper into the pit (driven by actual z gravity drop)
  const s = p.swallowing ? Math.max(0.28, 1 - depth * 0.62) : 1;
  const sinkY = p.swallowing ? -p.z * 0.68 : 0;
  const wobble = p.bump > 0 ? Math.sin(p.bump * 18) * 0.14 : 0;
  const r = p.radius;
  const h = p.height * 0.55;

  ctx.save();
  ctx.translate(p.x, p.y + sinkY);

  // Directional lean/tipping toward the hole rim (both pre-fall and while tumbling in)
  if (p.tilt > 0.01) {
    const lean = Math.min(1.25, p.tilt);
    const leanX = Math.cos(p.tiltAngle) * lean * 0.36;
    const leanY = Math.sin(p.tiltAngle) * lean * 0.18;
    ctx.transform(1, leanY, leanX, Math.max(0.45, 1 - lean * 0.32), 0, 0);
  }

  ctx.scale(s, s);
  if (p.swallowing) {
    // Tumble rotation for non-oriented props (vehicles/cyclists/benches/people/aliens use p.angle inside)
    if (
      p.shape !== 'car' &&
      p.shape !== 'truck' &&
      p.shape !== 'bus' &&
      p.shape !== 'cyclist' &&
      p.shape !== 'hoverCar' &&
      p.shape !== 'saucerCar' &&
      p.shape !== 'marsRover' &&
      p.shape !== 'hoverHauler' &&
      p.shape !== 'hoverScooter' &&
      p.shape !== 'toyCar' &&
      p.shape !== 'toyTruck' &&
      p.shape !== 'toyTrain' &&
      p.shape !== 'toyScooter' &&
      p.shape !== 'shellCar' &&
      p.shape !== 'shellTruck' &&
      p.shape !== 'shellBus' &&
      p.shape !== 'shellScooter' &&
      p.shape !== 'bench' &&
      p.shape !== 'person' &&
      p.shape !== 'alien' &&
      p.shape !== 'windupToy' &&
      p.shape !== 'merman'
    ) {
      ctx.rotate(p.angle * 0.55);
    }
    ctx.globalAlpha = Math.max(0, 1 - Math.pow(depth, 1.8) * 0.92);
  }
  if (wobble) ctx.rotate(wobble);

  // Soft cast ground shadow (fades out as prop tips over the rim)
  if (!p.swallowing) {
    ctx.fillStyle = `rgba(44, 58, 48, ${(0.22 * Math.max(0, 1 - p.tilt * 1.4)).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(r * 0.14, r * 0.22, r * 1.04, r * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  switch (p.shape) {
    case 'person': {
      const phase = p.wander ? p.wander.walkPhase : 0;
      const speed = Math.hypot(p.vx, p.vy);
      const moving = p.wander && speed > 2;
      const resting = Boolean(p.wander && p.wander.resting && !p.swallowing);
      const sprinting = moving && speed > 95 && !p.swallowing;
      const stamina = p.wander && typeof p.wander.stamina === 'number' ? p.wander.stamina : 1;
      const pant = resting ? Math.sin(p.wander.restPhase || 0) * 1.1 : 0;
      const bob = moving && !p.swallowing ? Math.abs(Math.sin(phase)) * (sprinting ? 4.4 : 3.2) : pant;
      const stride = moving && !p.swallowing ? Math.sin(phase) * (sprinting ? 5.2 : 3.8) : 0;

      // Trailing speed lines when running really fast (fades slightly as stamina drains)
      if (sprinting) {
        const backX = -p.vx / speed;
        const backY = -p.vy / speed;
        const perpX = -backY;
        const perpY = backX;
        const lineAlpha = 0.35 + stamina * 0.42;
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha.toFixed(2)})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (const [off, len] of [[-5, 16], [0, 22], [5, 14]]) {
          const sx = backX * 8 + perpX * off;
          const sy = backY * 8 + perpY * off - 3;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + backX * len * (0.65 + stamina * 0.35), sy + backY * len * (0.65 + stamina * 0.35));
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.save();
      if (p.swallowing) ctx.rotate(p.angle);
      // Tiny stepping shoes
      ctx.fillStyle = '#333d4b';
      ctx.beginPath();
      ctx.arc(-3.5, 4 + stride * 0.6, 2.8, 0, Math.PI * 2);
      ctx.arc(3.5, 4 - stride * 0.6, 2.8, 0, Math.PI * 2);
      ctx.fill();
      // Cozy shirt torso
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-6.5, -8 - bob, 13, 13, 5);
      ctx.fill();
      // Arms swinging slightly (or resting down when catching breath)
      ctx.fillStyle = '#ffd9ba';
      ctx.beginPath();
      const armY = resting ? 1.5 - bob : -1 - bob;
      ctx.arc(-7.2, armY - stride * 0.4, 2.3, 0, Math.PI * 2);
      ctx.arc(7.2, armY + stride * 0.4, 2.3, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#ffd9ba';
      ctx.beginPath();
      ctx.arc(0, -12.5 - bob, 5.6, 0, Math.PI * 2);
      ctx.fill();
      // Hair / cap
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -14 - bob, 5.4, Math.PI, Math.PI * 2);
      ctx.fill();
      // Resting sweat drop + mini stamina recharge bar
      if (resting) {
        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath();
        ctx.arc(7.5, -15 - pant * 0.8, 2.1, 0, Math.PI * 2);
        ctx.fill();
        const barW = 16;
        const barH = 3.5;
        ctx.fillStyle = 'rgba(20, 32, 38, 0.45)';
        ctx.beginPath();
        ctx.roundRect(-barW / 2, -23.5, barW, barH, 2);
        ctx.fill();
        ctx.fillStyle = '#5eead4';
        ctx.beginPath();
        ctx.roundRect(-barW / 2, -23.5, Math.max(2, barW * stamina), barH, 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case 'cone': {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -r - h * 0.8);
      ctx.lineTo(-r * 0.65, r * 0.35);
      ctx.lineTo(r * 0.65, r * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.fillRect(-r * 0.38, -r * 0.45, r * 0.76, r * 0.35);
      break;
    }
    case 'flower': {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 2, r * 0.88, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5eb06d';
      ctx.beginPath();
      ctx.arc(0, -3, r * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r * 0.36, -5 + Math.sin(a) * r * 0.36, r * 0.26, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffe169';
      ctx.beginPath();
      ctx.arc(0, -5, r * 0.24, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'hydrant': {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 0.62, -h, r * 1.24, h + r * 0.55, 6);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'cylinder': {
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-r * 0.78, -h * 0.85, r * 1.56, h * 0.85 + r * 0.65, r * 0.45);
      ctx.fill();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.8, r * 0.78, r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.2, -h * 0.9, r * 0.32, r * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'box': {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 0.75, -h, r * 1.5, h + r * 0.65, 6);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath();
      ctx.roundRect(-r * 0.75, -h, r * 1.5, r * 0.8, 6);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.fillRect(r * 0.55, -h + 4, 5, 12);
      break;
    }
    case 'bench': {
      ctx.save();
      ctx.rotate(p.angle);
      ctx.fillStyle = p.accent;
      ctx.fillRect(-r * 0.95, -r * 0.45, 6, r * 0.9);
      ctx.fillRect(r * 0.95 - 6, -r * 0.45, 6, r * 0.9);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 1.05, -r * 0.45, r * 2.1, r * 0.4, 4);
      ctx.roundRect(-r * 1.05, 1, r * 2.1, r * 0.4, 4);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'lamp': {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(0, -h * 1.1);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 234, 150, 0.35)';
      ctx.beginPath();
      ctx.arc(0, -h * 1.15, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 1.15, r * 0.46, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'bush': {
      ctx.fillStyle = '#3f8a52';
      ctx.beginPath();
      ctx.arc(0, 4, r * 0.96, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(-r * 0.25, -3, r * 0.72, 0, Math.PI * 2);
      ctx.arc(r * 0.28, -2, r * 0.68, 0, Math.PI * 2);
      ctx.arc(0, -r * 0.28, r * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(-r * 0.16, -r * 0.38, r * 0.34, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'car':
    case 'truck':
    case 'bus': {
      ctx.save();
      ctx.rotate(p.angle);
      const len = p.shape === 'car' ? r * 1.85 : r * 2.05;
      const wid = p.shape === 'car' ? r * 1.05 : r * 0.98;
      // Wheels
      ctx.fillStyle = '#2d3745';
      ctx.fillRect(-len * 0.36, -wid * 0.56, len * 0.2, wid * 1.12);
      ctx.fillRect(len * 0.16, -wid * 0.56, len * 0.2, wid * 1.12);
      // Chassis
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-len / 2, -wid / 2, len, wid, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Cabin / windshield
      if (p.shape === 'car') {
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.roundRect(-len * 0.22, -wid * 0.38, len * 0.48, wid * 0.76, 6);
        ctx.fill();
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(-len * 0.14, -wid * 0.3, len * 0.28, wid * 0.6, 5);
        ctx.fill();
      } else if (p.shape === 'truck') {
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.roundRect(len * 0.16, -wid * 0.44, len * 0.32, wid * 0.88, 7);
        ctx.fill();
        ctx.fillStyle = '#d8f1ff';
        ctx.fillRect(len * 0.32, -wid * 0.34, len * 0.12, wid * 0.68);
      } else {
        ctx.fillStyle = p.accent;
        ctx.fillRect(-len * 0.42, -wid * 0.4, len * 0.82, 4);
        ctx.fillRect(-len * 0.42, wid * 0.4 - 4, len * 0.82, 4);
        ctx.fillStyle = '#d8f1ff';
        ctx.fillRect(len * 0.32, -wid * 0.34, len * 0.12, wid * 0.68);
      }
      // Headlights
      ctx.fillStyle = '#fff5b8';
      ctx.fillRect(len / 2 - 4, -wid * 0.34, 4, 6);
      ctx.fillRect(len / 2 - 4, wid * 0.34 - 6, 4, 6);
      ctx.restore();
      break;
    }
    case 'pine': {
      // Trunk
      ctx.fillStyle = '#7d5336';
      ctx.beginPath();
      ctx.arc(0, 6, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      // 3 stacked concentric pine boughs offset upward for 2.5D height
      const layers = [
        { y: -4, rad: r * 0.96, c: '#2e7056' },
        { y: -h * 0.52, rad: r * 0.74, c: p.color },
        { y: -h * 0.96, rad: r * 0.46, c: p.accent },
      ];
      for (const l of layers) {
        ctx.fillStyle = l.c;
        ctx.beginPath();
        ctx.arc(0, l.y, l.rad, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'oak': {
      ctx.fillStyle = '#7d5336';
      ctx.beginPath();
      ctx.arc(0, 6, r * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3e854d';
      ctx.beginPath();
      ctx.arc(0, -h * 0.45, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(-r * 0.26, -h * 0.65, r * 0.62, 0, Math.PI * 2);
      ctx.arc(r * 0.26, -h * 0.58, r * 0.58, 0, Math.PI * 2);
      ctx.arc(0, -h * 0.85, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(-r * 0.14, -h * 0.94, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'house': {
      const w = r * 1.55;
      const d = r * 1.25;
      // Front 2.5D wall
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.55, w, d + h * 0.55, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Cozy door & windows on front face
      ctx.fillStyle = '#8b5e3c';
      ctx.beginPath();
      ctx.roundRect(-10, d / 2 - 22, 20, 22, 4);
      ctx.fill();
      ctx.fillStyle = '#bfe8ff';
      ctx.fillRect(-w * 0.34, d / 2 - 24, 16, 14);
      ctx.fillRect(w * 0.34 - 16, d / 2 - 24, 16, 14);
      // Pitched roof
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-w / 2 - 6, -d / 2 - h * 0.72, w + 12, d * 0.95, 10);
      ctx.fill();
      // Roof ridge highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.38)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-w * 0.42, -h * 0.72);
      ctx.lineTo(w * 0.42, -h * 0.72);
      ctx.stroke();
      break;
    }
    case 'tower':
    case 'skyscraper':
    case 'cityHall': {
      const w = r * 1.52;
      const d = r * 1.38;
      // Tall 2.5D extruded facade
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h, w, d + h, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Window grid on front face
      ctx.fillStyle = p.shape === 'skyscraper' ? '#e1f4ff' : '#fff4cf';
      const cols = p.shape === 'skyscraper' ? 5 : 4;
      const rows = p.shape === 'skyscraper' ? 5 : 3;
      const padX = w * 0.14;
      const cellW = (w - padX * 2) / cols;
      const startY = -d / 2 - h + d * 0.92;
      const rowH = (h + d * 0.15) / (rows + 0.6);
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          ctx.fillRect(-w / 2 + padX + cc * cellW + 4, startY + rr * rowH, cellW - 8, Math.max(8, rowH * 0.52));
        }
      }

      // Roof deck
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-w / 2 - 3, -d / 2 - h - 4, w + 6, d * 0.88, 10);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath();
      ctx.roundRect(-w * 0.36, -d * 0.36 - h - 4, w * 0.72, d * 0.56, 6);
      ctx.fill();

      // Golden dome for Grand City Hall
      if (p.shape === 'cityHall') {
        ctx.fillStyle = '#f5c654';
        ctx.beginPath();
        ctx.arc(0, -h - 8, r * 0.34, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff3b8';
        ctx.beginPath();
        ctx.arc(-r * 0.1, -h - 14, r * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'newsstand': {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 0.72, -h * 0.95, r * 1.44, h * 0.95 + r * 0.58, 4);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.fillRect(-r * 0.5, -h * 0.75, r, h * 0.45);
      ctx.fillStyle = '#2d3745';
      ctx.fillRect(-r * 0.38, -h * 0.62, r * 0.76, 2.5);
      ctx.fillRect(-r * 0.38, -h * 0.45, r * 0.58, 2.5);
      break;
    }
    case 'subwaySign': {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(0, -h * 1.05);
      ctx.stroke();
      ctx.fillStyle = 'rgba(72, 196, 121, 0.3)';
      ctx.beginPath();
      ctx.arc(0, -h * 1.08, r * 0.76, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 1.08, r * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.48)';
      ctx.beginPath();
      ctx.arc(-r * 0.14, -h * 1.16, r * 0.15, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'hotdogCart': {
      // Metallic cart base
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 0.82, -r * 0.48, r * 1.64, r * 0.96, 5);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Classic red-and-yellow striped umbrella canopy
      const uY = -h * 0.75;
      const uR = r * 0.92;
      const slices = 6;
      for (let i = 0; i < slices; i++) {
        ctx.fillStyle = i % 2 === 0 ? p.accent : '#ffd152';
        ctx.beginPath();
        ctx.moveTo(0, uY);
        ctx.arc(0, uY, uR, (i / slices) * Math.PI * 2, ((i + 1) / slices) * Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = '#fff5db';
      ctx.beginPath();
      ctx.arc(0, uY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'cyclist': {
      const pedal = Math.sin(p.pedalPhase || 0) * 3.2;
      ctx.save();
      ctx.rotate(p.angle);
      // Narrow bike tires (front & rear)
      ctx.fillStyle = '#252e3a';
      ctx.beginPath();
      ctx.roundRect(-r * 0.92, -2.5, r * 0.65, 5, 2.5);
      ctx.roundRect(r * 0.28, -2.5, r * 0.65, 5, 2.5);
      ctx.fill();
      // Bike frame & handlebars
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, 0);
      ctx.lineTo(r * 0.52, 0);
      ctx.moveTo(r * 0.42, -r * 0.45);
      ctx.lineTo(r * 0.42, r * 0.45);
      ctx.stroke();
      // Pedaling feet
      ctx.fillStyle = '#333d4b';
      ctx.beginPath();
      ctx.arc(-2 + pedal, -6.5, 2.4, 0, Math.PI * 2);
      ctx.arc(-2 - pedal, 6.5, 2.4, 0, Math.PI * 2);
      ctx.fill();
      // Rider torso & arms reaching handlebars
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-7, -6.5, 13, 13, 5);
      ctx.fill();
      ctx.strokeStyle = '#ffd9ba';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(3, -4.5);
      ctx.lineTo(r * 0.4, -r * 0.35);
      ctx.moveTo(3, 4.5);
      ctx.lineTo(r * 0.4, r * 0.35);
      ctx.stroke();
      // Helmeted head
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(2, 0, 5.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(2, 0, 4.6, -Math.PI * 0.7, Math.PI * 0.7);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'brownstone': {
      const w = r * 1.48;
      const d = r * 1.24;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h, w, d + h, 7);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Front stoop steps & door
      ctx.fillStyle = '#9aa2ab';
      ctx.fillRect(-14, d / 2 - 14, 28, 16);
      ctx.fillStyle = '#4a3228';
      ctx.fillRect(-8, d / 2 - 24, 16, 16);
      // Warm brownstone windows
      ctx.fillStyle = '#ffeec4';
      for (let rr = 0; rr < 2; rr++) {
        for (const cx of [-w * 0.3, 0, w * 0.3]) {
          if (rr === 1 && cx === 0) continue;
          ctx.fillRect(cx - 8, -h * 0.25 + rr * 22, 16, 14);
        }
      }
      // Flat cornice roof
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-w / 2 - 4, -d / 2 - h - 4, w + 8, d * 0.88, 7);
      ctx.fill();
      break;
    }
    case 'waterTowerBlock': {
      const w = r * 1.5;
      const d = r * 1.36;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h, w, d + h, 9);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Window grid
      ctx.fillStyle = '#fff0c7';
      const cols = 4;
      const rows = 4;
      const padX = w * 0.14;
      const cellW = (w - padX * 2) / cols;
      const startY = -d / 2 - h + d * 0.92;
      const rowH = (h + d * 0.12) / (rows + 0.5);
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          ctx.fillRect(-w / 2 + padX + cc * cellW + 4, startY + rr * rowH, cellW - 8, Math.max(8, rowH * 0.5));
        }
      }
      // Tar rooftop deck
      ctx.fillStyle = '#6f7885';
      ctx.beginPath();
      ctx.roundRect(-w / 2 - 2, -d / 2 - h - 3, w + 4, d * 0.88, 9);
      ctx.fill();
      // Iconic wooden NYC rooftop water tower!
      ctx.fillStyle = '#9e734e';
      ctx.beginPath();
      ctx.arc(w * 0.18, -h - 8, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6b4d35';
      ctx.beginPath();
      ctx.moveTo(w * 0.18, -h - 26);
      ctx.lineTo(w * 0.18 - r * 0.24, -h - 6);
      ctx.lineTo(w * 0.18 + r * 0.24, -h - 6);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'glassTower': {
      const w = r * 1.48;
      const d = r * 1.35;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h, w, d + h, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(28, 58, 84, 0.28)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Glass curtain-wall strips & diagonal sky sheen
      ctx.fillStyle = 'rgba(230, 248, 255, 0.55)';
      for (let rr = 0; rr < 7; rr++) {
        const y = -d / 2 - h + d * 0.9 + rr * ((h + d * 0.1) / 7.4);
        ctx.fillRect(-w * 0.42, y, w * 0.84, Math.max(8, h * 0.065));
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.beginPath();
      ctx.moveTo(-w * 0.35, -h + 10);
      ctx.lineTo(-w * 0.05, -h + 10);
      ctx.lineTo(-w * 0.35, d * 0.3);
      ctx.closePath();
      ctx.fill();
      // Glass rooftop helipad / deck
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-w / 2 - 2, -d / 2 - h - 4, w + 4, d * 0.86, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -h - 6, r * 0.26, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 'wedgeTower': {
      // Iconic Flatiron-style triangular limestone skyscraper!
      const w = r * 1.56;
      const d = r * 1.4;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -d * 0.65 - h);
      ctx.lineTo(w * 0.54, d * 0.45 - h);
      ctx.lineTo(w * 0.54, d * 0.45);
      ctx.lineTo(0, d * 0.62);
      ctx.lineTo(-w * 0.54, d * 0.45);
      ctx.lineTo(-w * 0.54, d * 0.45 - h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Vertical window bays
      ctx.fillStyle = '#fff5d8';
      for (let rr = 0; rr < 6; rr++) {
        const y = -h + d * 0.55 + rr * (h / 6.6);
        for (const cx of [-w * 0.3, -w * 0.12, w * 0.12, w * 0.3]) {
          ctx.fillRect(cx - 7, y, 14, Math.max(8, h * 0.06));
        }
      }
      // Triangular roof deck
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(0, -d * 0.68 - h);
      ctx.lineTo(w * 0.56, d * 0.44 - h);
      ctx.lineTo(-w * 0.56, d * 0.44 - h);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'metroSpire': {
      // Tiered Art-Deco Empire-style Mega-Skyscraper with gleaming spire!
      const w = r * 1.54;
      const d = r * 1.38;
      // Lower base tower
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.68, w, d + h * 0.68, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Upper stepped Art-Deco crown
      const w2 = w * 0.68;
      ctx.fillStyle = '#e4ebf2';
      ctx.beginPath();
      ctx.roundRect(-w2 / 2, -d * 0.4 - h, w2, h * 0.55 + d * 0.55, 8);
      ctx.fill();
      ctx.stroke();
      // Window bands
      ctx.fillStyle = '#e6f5ff';
      for (let rr = 0; rr < 6; rr++) {
        const y = -h * 0.52 + rr * ((h * 0.55 + d * 0.3) / 6.2);
        ctx.fillRect(-w * 0.4, y, w * 0.8, 10);
      }
      for (let rr = 0; rr < 4; rr++) {
        const y = -h * 0.92 + rr * ((h * 0.36) / 4);
        ctx.fillRect(-w2 * 0.36, y, w2 * 0.72, 9);
      }
      // Crown roof & gleaming spire needle
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-w2 * 0.46, -d * 0.36 - h - 4, w2 * 0.92, d * 0.62, 6);
      ctx.fill();
      ctx.strokeStyle = '#f5d26b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -h - 8);
      ctx.lineTo(0, -h - 68);
      ctx.stroke();
      ctx.fillStyle = '#fff5bd';
      ctx.beginPath();
      ctx.arc(0, -h - 70, 6.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'marsRock': {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-r * 0.9, r * 0.45);
      ctx.lineTo(-r * 0.55, -r * 0.72);
      ctx.lineTo(r * 0.28, -r * 0.85);
      ctx.lineTo(r * 0.92, -r * 0.1);
      ctx.lineTo(r * 0.65, r * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(-r * 0.45, -r * 0.55);
      ctx.lineTo(r * 0.22, -r * 0.68);
      ctx.lineTo(r * 0.48, -r * 0.12);
      ctx.lineTo(-r * 0.15, r * 0.05);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'marsCrystal': {
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, r * 0.4);
      ctx.lineTo(-r * 0.72, -h * 0.7);
      ctx.lineTo(-r * 0.1, -h * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-r * 0.35, r * 0.5);
      ctx.lineTo(0, -h * 1.1);
      ctx.lineTo(r * 0.45, r * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.moveTo(0, -h * 1.05);
      ctx.lineTo(-r * 0.16, r * 0.1);
      ctx.lineTo(r * 0.08, r * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'alien': {
      const phase = p.wander ? p.wander.walkPhase : 0;
      const moving = p.wander && (Math.abs(p.vx) > 2 || Math.abs(p.vy) > 2);
      const bob = moving && !p.swallowing ? Math.abs(Math.sin(phase)) * 3.5 : 0;
      const stride = moving && !p.swallowing ? Math.sin(phase) * 3.8 : 0;
      ctx.save();
      if (p.swallowing) ctx.rotate(p.angle);
      // Little alien feet
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(-3.5, 4 + stride * 0.6, 2.7, 0, Math.PI * 2);
      ctx.arc(3.5, 4 - stride * 0.6, 2.7, 0, Math.PI * 2);
      ctx.fill();
      // Sleek silver-white spacesuit torso
      ctx.fillStyle = '#e8f0f5';
      ctx.beginPath();
      ctx.roundRect(-6, -7.5 - bob, 12, 12, 5);
      ctx.fill();
      ctx.fillStyle = '#5be9f5';
      ctx.fillRect(-3.5, -4 - bob, 7, 3);
      // Wiggling antennae
      const wiggle = Math.sin(phase * 1.3) * 1.8;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-3, -16 - bob);
      ctx.lineTo(-5 + wiggle, -21 - bob);
      ctx.moveTo(3, -16 - bob);
      ctx.lineTo(5 + wiggle, -21 - bob);
      ctx.stroke();
      ctx.fillStyle = '#a8ff82';
      ctx.beginPath();
      ctx.arc(-5 + wiggle, -21.5 - bob, 2, 0, Math.PI * 2);
      ctx.arc(5 + wiggle, -21.5 - bob, 2, 0, Math.PI * 2);
      ctx.fill();
      // Cute green alien head + big dark eyes
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, -12.5 - bob, 6.4, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#141c24';
      ctx.beginPath();
      ctx.ellipse(-2.6, -12.2 - bob, 1.9, 2.5, -0.25, 0, Math.PI * 2);
      ctx.ellipse(2.6, -12.2 - bob, 1.9, 2.5, 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'solarPanel': {
      ctx.fillStyle = '#8b98a8';
      ctx.fillRect(-3, -4, 6, 10);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 0.92, -h * 0.95, r * 1.84, r * 1.15, 4);
      ctx.fill();
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-r * 0.84, -h * 0.88, r * 1.68, r * 1.0);
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.88);
      ctx.lineTo(0, -h * 0.88 + r);
      ctx.moveTo(-r * 0.84, -h * 0.88 + r * 0.5);
      ctx.lineTo(r * 0.84, -h * 0.88 + r * 0.5);
      ctx.stroke();
      break;
    }
    case 'beacon': {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(0, -h * 1.1);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 107, 87, 0.32)';
      ctx.beginPath();
      ctx.arc(0, -h * 1.12, r * 0.78, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 1.12, r * 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'hoverScooter': {
      ctx.save();
      ctx.rotate(p.angle);
      // Glowing cyan hover pads
      ctx.fillStyle = 'rgba(91, 233, 245, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.55, 0, 6, 4.5, 0, 0, Math.PI * 2);
      ctx.ellipse(r * 0.55, 0, 6, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Sleek hover-bike chassis
      ctx.fillStyle = '#e2ebf2';
      ctx.beginPath();
      ctx.roundRect(-r * 0.82, -5.5, r * 1.64, 11, 5.5);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.fillRect(-r * 0.4, -2, r * 0.9, 4);
      // Alien rider
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, 5.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#141c24';
      ctx.beginPath();
      ctx.arc(2.5, -2, 1.5, 0, Math.PI * 2);
      ctx.arc(2.5, 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'marsPod': {
      ctx.fillStyle = '#6e3ba6';
      ctx.beginPath();
      ctx.arc(0, 3, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(-r * 0.24, -4, r * 0.64, 0, Math.PI * 2);
      ctx.arc(r * 0.28, -3, r * 0.6, 0, Math.PI * 2);
      ctx.arc(0, -r * 0.3, r * 0.66, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(-r * 0.16, -r * 0.35, r * 0.28, 0, Math.PI * 2);
      ctx.arc(r * 0.22, -r * 0.12, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'hoverCar': {
      ctx.save();
      ctx.rotate(p.angle);
      const len = r * 1.9;
      const wid = r * 1.04;
      // Glowing thruster exhaust
      ctx.fillStyle = 'rgba(108, 242, 255, 0.55)';
      ctx.beginPath();
      ctx.ellipse(-len * 0.52, -wid * 0.22, 8, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(-len * 0.52, wid * 0.22, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Sleek spaceship-car hull
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(len * 0.54, 0);
      ctx.quadraticCurveTo(len * 0.42, -wid * 0.52, -len * 0.42, -wid * 0.46);
      ctx.lineTo(-len * 0.48, wid * 0.46);
      ctx.quadraticCurveTo(len * 0.42, wid * 0.52, len * 0.54, 0);
      ctx.closePath();
      ctx.fill();
      // Glowing cyan cockpit canopy
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(len * 0.06, 0, len * 0.24, wid * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'saucerCar': {
      ctx.save();
      ctx.rotate(p.angle);
      // Outer metallic saucer ring
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Ring lights
      ctx.fillStyle = p.accent;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r * 0.68, Math.sin(a) * r * 0.68, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Translucent glass dome
      ctx.fillStyle = '#8ef5ff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(-r * 0.14, -r * 0.14, r * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'marsRover':
    case 'hoverHauler': {
      ctx.save();
      ctx.rotate(p.angle);
      const len = r * 2.0;
      const wid = r * 0.98;
      if (p.shape === 'marsRover') {
        // 6 chunky Mars rover wheels
        ctx.fillStyle = '#2d3745';
        for (const wx of [-len * 0.38, -len * 0.05, len * 0.26]) {
          ctx.fillRect(wx, -wid * 0.58, len * 0.16, wid * 1.16);
        }
      } else {
        // Glowing hover-hauler underside glow
        ctx.fillStyle = 'rgba(91, 233, 245, 0.45)';
        ctx.beginPath();
        ctx.roundRect(-len * 0.54, -wid * 0.54, len * 1.08, wid * 1.08, 12);
        ctx.fill();
      }
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-len / 2, -wid / 2, len, wid, 9);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(len * 0.14, -wid * 0.38, len * 0.3, wid * 0.76, 6);
      ctx.fill();
      ctx.fillStyle = '#2b5d99';
      ctx.fillRect(-len * 0.4, -wid * 0.34, len * 0.44, wid * 0.68);
      ctx.restore();
      break;
    }
    case 'crystalSpire': {
      ctx.fillStyle = '#5346ba';
      ctx.beginPath();
      ctx.moveTo(-r * 0.85, r * 0.35);
      ctx.lineTo(-r * 0.35, -h * 0.88);
      ctx.lineTo(r * 0.2, r * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-r * 0.45, r * 0.45);
      ctx.lineTo(r * 0.1, -h * 1.12);
      ctx.lineTo(r * 0.78, r * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(r * 0.1, -h * 1.08);
      ctx.lineTo(-r * 0.15, r * 0.15);
      ctx.lineTo(r * 0.25, r * 0.2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'habDome': {
      // Metallic ring base
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.96, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Glass biodome interior with little green Martian greenhouse plants!
      ctx.fillStyle = '#c8f2f5';
      ctx.beginPath();
      ctx.arc(0, -h * 0.28, r * 0.82, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(-r * 0.22, -h * 0.24, r * 0.26, 0, Math.PI * 2);
      ctx.arc(r * 0.2, -h * 0.18, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      // Geodesic glass ribs + shine
      ctx.strokeStyle = 'rgba(255,255,255,0.62)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -h * 0.28, r * 0.82, 0, Math.PI * 2);
      ctx.moveTo(-r * 0.82, -h * 0.28);
      ctx.lineTo(r * 0.82, -h * 0.28);
      ctx.moveTo(0, -h * 0.28 - r * 0.82);
      ctx.lineTo(0, -h * 0.28 + r * 0.82);
      ctx.stroke();
      break;
    }
    case 'radarDish': {
      const w = r * 1.25;
      const d = r * 1.15;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.72, w, d + h * 0.72, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Giant angled satellite dish on top
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -h * 0.85, r * 0.56, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 0.85, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'colonyTower': {
      const w = r * 1.42;
      const d = r * 1.28;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h, w, d + h, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Glowing cyan viewport bands
      ctx.fillStyle = p.accent;
      for (let rr = 0; rr < 4; rr++) {
        const y = -h * 0.78 + rr * (h * 0.24);
        ctx.beginPath();
        ctx.roundRect(-w * 0.38, y, w * 0.76, 12, 6);
        ctx.fill();
      }
      ctx.fillStyle = '#c8d6e3';
      ctx.beginPath();
      ctx.arc(0, -h - 4, r * 0.46, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'marsRocket': {
      // Launchpad base
      ctx.fillStyle = '#5c6b7a';
      ctx.beginPath();
      ctx.arc(0, 6, r * 0.88, 0, Math.PI * 2);
      ctx.fill();
      // Rocket fins
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(-r * 0.68, 12);
      ctx.lineTo(-r * 0.35, -h * 0.45);
      ctx.lineTo(-r * 0.2, 12);
      ctx.moveTo(r * 0.68, 12);
      ctx.lineTo(r * 0.35, -h * 0.45);
      ctx.lineTo(r * 0.2, 12);
      ctx.closePath();
      ctx.fill();
      // Tall white Starship fuselage
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -h * 1.22);
      ctx.quadraticCurveTo(r * 0.48, -h * 0.72, r * 0.38, 10);
      ctx.lineTo(-r * 0.38, 10);
      ctx.quadraticCurveTo(-r * 0.48, -h * 0.72, 0, -h * 1.22);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Red nosecone & cyan porthole
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(0, -h * 1.22);
      ctx.quadraticCurveTo(r * 0.3, -h * 0.94, r * 0.32, -h * 0.8);
      ctx.lineTo(-r * 0.32, -h * 0.8);
      ctx.quadraticCurveTo(-r * 0.3, -h * 0.94, 0, -h * 1.22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#6cf2ff';
      ctx.beginPath();
      ctx.arc(0, -h * 0.55, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'mothership': {
      // Colossal UFO Mothership with glowing cyan rim lights!
      ctx.fillStyle = '#6a7f96';
      ctx.beginPath();
      ctx.arc(0, -h * 0.35, r * 1.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, -h * 0.46, r * 0.88, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r * 0.7, -h * 0.46 + Math.sin(a) * r * 0.7, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#c4fbff';
      ctx.beginPath();
      ctx.arc(0, -h * 0.54, r * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.arc(-r * 0.14, -h * 0.62, r * 0.15, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'toyBrick': {
      // Classic colorful studded plastic building brick
      const bw = r * 1.65;
      const bd = r * 1.1;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -bd / 2 - h * 0.45, bw, bd + h * 0.45, 3);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -bd / 2 - h * 0.45, bw, bd * 0.85, 3);
      ctx.fill();
      // 4 raised brick studs on top
      ctx.fillStyle = p.color;
      for (const sx of [-bw * 0.24, bw * 0.24]) {
        for (const sy of [-bd * 0.28 - h * 0.45, bd * 0.08 - h * 0.45]) {
          ctx.beginPath();
          ctx.arc(sx, sy, r * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case 'crayon': {
      ctx.save();
      ctx.rotate(p.angle);
      // Wax barrel
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 1.05, -r * 0.38, r * 1.7, r * 0.76, 3);
      ctx.fill();
      // Pointed wax tip
      ctx.beginPath();
      ctx.moveTo(r * 0.65, -r * 0.34);
      ctx.lineTo(r * 1.15, 0);
      ctx.lineTo(r * 0.65, r * 0.34);
      ctx.closePath();
      ctx.fill();
      // Paper wrapper & dark bands
      ctx.fillStyle = 'rgba(255,255,255,0.32)';
      ctx.fillRect(-r * 0.72, -r * 0.38, r * 1.12, r * 0.76);
      ctx.fillStyle = p.accent;
      ctx.fillRect(-r * 0.62, -r * 0.38, r * 0.16, r * 0.76);
      ctx.fillRect(r * 0.16, -r * 0.38, r * 0.16, r * 0.76);
      ctx.restore();
      break;
    }
    case 'rubberDuck': {
      // Plump yellow rubber duck body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(-1, 1, r * 0.86, r * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
      // Wing detail
      ctx.fillStyle = '#f2be2c';
      ctx.beginPath();
      ctx.ellipse(-r * 0.18, 1.5, r * 0.45, r * 0.28, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Duck head
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(r * 0.32, -h * 0.78, r * 0.56, 0, Math.PI * 2);
      ctx.fill();
      // Orange bill
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(r * 0.86, -h * 0.72, r * 0.34, r * 0.2, 0.1, 0, Math.PI * 2);
      ctx.fill();
      // Cute eye
      ctx.fillStyle = '#212b36';
      ctx.beginPath();
      ctx.arc(r * 0.46, -h * 0.9, 1.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'windupToy': {
      const phase = p.wander ? p.wander.walkPhase : 0;
      const moving = p.wander && (Math.abs(p.vx) > 2 || Math.abs(p.vy) > 2);
      const bob = moving && !p.swallowing ? Math.abs(Math.sin(phase)) * 3.4 : 0;
      const stride = moving && !p.swallowing ? Math.sin(phase) * 3.8 : 0;
      ctx.save();
      if (p.swallowing) ctx.rotate(p.angle);
      // Little clacking toy feet
      ctx.fillStyle = '#f7c548';
      ctx.beginPath();
      ctx.roundRect(-6.5, 2 + stride * 0.5, 5.5, 4.5, 2);
      ctx.roundRect(1, 2 - stride * 0.5, 5.5, 4.5, 2);
      ctx.fill();
      // Golden wind-up key on back/top
      const keySpin = Math.sin(phase * 1.4) * 2.5;
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, -14 - bob);
      ctx.lineTo(0, -20 - bob);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-3.5, -20.5 - bob, Math.max(1.5, 3.2 - Math.abs(keySpin) * 0.4), 2.5, 0, 0, Math.PI * 2);
      ctx.ellipse(3.5, -20.5 - bob, Math.max(1.5, 3.2 - Math.abs(keySpin) * 0.4), 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Cute toy robot/chibi body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-7, -9 - bob, 14, 13, 5);
      ctx.fill();
      // Head with big button eyes
      ctx.fillStyle = '#fff5e4';
      ctx.beginPath();
      ctx.arc(0, -12.5 - bob, 5.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#253240';
      ctx.beginPath();
      ctx.arc(-2.2, -12.5 - bob, 1.4, 0, Math.PI * 2);
      ctx.arc(2.2, -12.5 - bob, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'abcBlock': {
      const s = r * 1.55;
      // Chunky wooden cube
      ctx.fillStyle = '#e8c484';
      ctx.beginPath();
      ctx.roundRect(-s / 2, -s / 2 - h * 0.55, s, s + h * 0.55, 5);
      ctx.fill();
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 3;
      ctx.stroke();
      // Top lighter wooden face
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-s / 2 + 2, -s / 2 - h * 0.55 + 2, s - 4, s * 0.78, 4);
      ctx.fill();
      // Bold painted alphabet letter
      ctx.fillStyle = p.accent;
      ctx.font = `900 ${Math.round(r * 0.92)}px ui-rounded, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.letter || 'A', 0, -h * 0.42);
      break;
    }
    case 'ringStack': {
      // Wooden base & stacked rainbow rings
      ctx.fillStyle = '#d4a36a';
      ctx.beginPath();
      ctx.ellipse(0, 4, r * 0.92, r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      const rings = [
        { y: -1, rx: r * 0.84, c: '#ef5b5b' },
        { y: -7, rx: r * 0.72, c: '#f5a442' },
        { y: -13, rx: r * 0.6, c: '#ffd447' },
        { y: -19, rx: r * 0.48, c: '#52b874' },
        { y: -24, rx: r * 0.36, c: '#4da3e8' },
      ];
      for (const rg of rings) {
        ctx.fillStyle = rg.c;
        ctx.beginPath();
        ctx.ellipse(0, rg.y, rg.rx, rg.rx * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // Wooden topper knob
      ctx.fillStyle = '#e6bd8a';
      ctx.beginPath();
      ctx.arc(0, -28, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'plushBunny': {
      // Soft bunny body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 1, r * 0.76, r * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
      // Floppy ears
      ctx.beginPath();
      ctx.ellipse(-r * 0.34, -h * 1.15, r * 0.22, r * 0.56, -0.22, 0, Math.PI * 2);
      ctx.ellipse(r * 0.34, -h * 1.15, r * 0.22, r * 0.56, 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(-r * 0.34, -h * 1.12, r * 0.11, r * 0.38, -0.22, 0, Math.PI * 2);
      ctx.ellipse(r * 0.34, -h * 1.12, r * 0.11, r * 0.38, 0.22, 0, Math.PI * 2);
      ctx.fill();
      // Bunny head, button eyes & pink nose
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, -h * 0.52, r * 0.58, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2c3540';
      ctx.beginPath();
      ctx.arc(-r * 0.2, -h * 0.58, 2.2, 0, Math.PI * 2);
      ctx.arc(r * 0.2, -h * 0.58, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 0.44, 2.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'toyScooter': {
      ctx.save();
      ctx.rotate(p.angle);
      // Chunky toy wheels
      ctx.fillStyle = '#33404f';
      ctx.beginPath();
      ctx.roundRect(-r * 0.85, -3.5, r * 0.55, 7, 3);
      ctx.roundRect(r * 0.32, -3.5, r * 0.55, 7, 3);
      ctx.fill();
      // Colorful wooden scooter deck & handlebars
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-r * 0.72, -5.5, r * 1.44, 11, 5);
      ctx.fill();
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(r * 0.45, -r * 0.48);
      ctx.lineTo(r * 0.45, r * 0.48);
      ctx.stroke();
      // Cute plush bear rider head
      ctx.fillStyle = '#d49a6a';
      ctx.beginPath();
      ctx.arc(-2, 0, 5.5, 0, Math.PI * 2);
      ctx.arc(-5, -4.5, 2.3, 0, Math.PI * 2);
      ctx.arc(-5, 4.5, 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'teddyBear': {
      // Huggable stuffed teddy bear
      ctx.fillStyle = p.color;
      // Legs & arms
      ctx.beginPath();
      ctx.arc(-r * 0.48, r * 0.38, r * 0.32, 0, Math.PI * 2);
      ctx.arc(r * 0.48, r * 0.38, r * 0.32, 0, Math.PI * 2);
      ctx.arc(-r * 0.62, -r * 0.14, r * 0.28, 0, Math.PI * 2);
      ctx.arc(r * 0.62, -r * 0.14, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      // Torso & lighter tummy patch
      ctx.beginPath();
      ctx.ellipse(0, 2, r * 0.62, r * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(0, 3, r * 0.36, r * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
      // Round ears & head
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(-r * 0.42, -h * 0.92, r * 0.24, 0, Math.PI * 2);
      ctx.arc(r * 0.42, -h * 0.92, r * 0.24, 0, Math.PI * 2);
      ctx.arc(0, -h * 0.62, r * 0.52, 0, Math.PI * 2);
      ctx.fill();
      // Snout, button eyes & red bow tie
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.5, r * 0.24, r * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b221e';
      ctx.beginPath();
      ctx.arc(-r * 0.18, -h * 0.68, 2.4, 0, Math.PI * 2);
      ctx.arc(r * 0.18, -h * 0.68, 2.4, 0, Math.PI * 2);
      ctx.arc(0, -h * 0.54, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef5b5b';
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.22);
      ctx.lineTo(-8, -h * 0.32);
      ctx.lineTo(-8, -h * 0.12);
      ctx.moveTo(0, -h * 0.22);
      ctx.lineTo(8, -h * 0.32);
      ctx.lineTo(8, -h * 0.12);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'plushDino': {
      // Friendly plush green dinosaur with yellow back spines
      ctx.fillStyle = p.accent;
      for (let i = 0; i < 4; i++) {
        const sy = -h * 0.9 + i * 7.5;
        ctx.beginPath();
        ctx.moveTo(-r * 0.34, sy);
        ctx.lineTo(-r * 0.62, sy + 3);
        ctx.lineTo(-r * 0.34, sy + 7);
        ctx.closePath();
        ctx.fill();
      }
      // Tail & plump body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, r * 0.3);
      ctx.quadraticCurveTo(-r * 0.95, r * 0.35, -r * 0.85, -r * 0.1);
      ctx.quadraticCurveTo(-r * 0.55, r * 0.05, -r * 0.25, -r * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 2, r * 0.58, r * 0.56, 0, 0, Math.PI * 2);
      ctx.fill();
      // Neck & cute snouted head
      ctx.beginPath();
      ctx.ellipse(r * 0.26, -h * 0.72, r * 0.48, r * 0.36, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-r * 0.12, -h * 0.65, r * 0.42, h * 0.55);
      // Lighter belly & happy eye
      ctx.fillStyle = '#e9f7d5';
      ctx.beginPath();
      ctx.ellipse(r * 0.18, 4, r * 0.28, r * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#223029';
      ctx.beginPath();
      ctx.arc(r * 0.36, -h * 0.8, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'toyCar': {
      ctx.save();
      ctx.rotate(p.angle);
      const len = r * 1.82;
      const wid = r * 1.12;
      // Chunky wooden/plastic toy wheels
      ctx.fillStyle = '#2e3846';
      ctx.beginPath();
      ctx.roundRect(-len * 0.36, -wid * 0.58, len * 0.24, wid * 1.16, 4);
      ctx.roundRect(len * 0.14, -wid * 0.58, len * 0.24, wid * 1.16, 4);
      ctx.fill();
      // Rounded toy car body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-len / 2, -wid / 2, len, wid, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Racing stripe
      ctx.fillStyle = p.accent;
      ctx.fillRect(-len * 0.46, -wid * 0.12, len * 0.92, wid * 0.24);
      // Cute rounded wooden cab dome
      ctx.fillStyle = '#fff5e0';
      ctx.beginPath();
      ctx.roundRect(-len * 0.18, -wid * 0.32, len * 0.38, wid * 0.64, 9);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'rockingHorse': {
      // Classic wooden hobby / rocking horse!
      const w = r * 1.85;
      // Curved wooden rocker runner at the base
      ctx.strokeStyle = '#9e6234';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, -r * 0.38, r * 1.1, Math.PI * 0.22, Math.PI * 0.78);
      ctx.stroke();
      // Front & back wooden legs
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(-w * 0.24, -h * 0.18);
      ctx.lineTo(-w * 0.32, r * 0.48);
      ctx.moveTo(w * 0.24, -h * 0.18);
      ctx.lineTo(w * 0.32, r * 0.48);
      ctx.stroke();
      // Yarn tail
      ctx.strokeStyle = '#754624';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-w * 0.36, -h * 0.34);
      ctx.quadraticCurveTo(-w * 0.56, -h * 0.12, -w * 0.48, r * 0.18);
      ctx.stroke();
      // Horse torso
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w * 0.38, -h * 0.55, w * 0.76, r * 0.52, 14);
      ctx.fill();
      // Bright painted saddle
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-w * 0.15, -h * 0.58, w * 0.3, r * 0.4, 7);
      ctx.fill();
      // Neck & cute horse head
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(w * 0.16, -h * 0.32);
      ctx.lineTo(w * 0.36, -h * 1.05);
      ctx.lineTo(w * 0.56, -h * 0.88);
      ctx.lineTo(w * 0.36, -h * 0.22);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.45, -h * 0.92, r * 0.34, r * 0.22, 0.35, 0, Math.PI * 2);
      ctx.fill();
      // Mane, ear, handle peg & eye
      ctx.fillStyle = '#754624';
      ctx.beginPath();
      ctx.arc(w * 0.28, -h * 0.86, 5, 0, Math.PI * 2);
      ctx.arc(w * 0.24, -h * 0.7, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#25211e';
      ctx.beginPath();
      ctx.arc(w * 0.48, -h * 0.96, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineCap = 'butt';
      break;
    }
    case 'plushElephant': {
      // Big floppy pink-lined ears
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(-r * 0.66, -h * 0.5, r * 0.42, r * 0.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.66, -h * 0.5, r * 0.42, r * 0.5, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(-r * 0.64, -h * 0.48, r * 0.25, r * 0.32, -0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.64, -h * 0.48, r * 0.25, r * 0.32, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Chubby body & feet
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(-r * 0.42, r * 0.35, r * 0.28, 0, Math.PI * 2);
      ctx.arc(r * 0.42, r * 0.35, r * 0.28, 0, Math.PI * 2);
      ctx.ellipse(0, 0, r * 0.66, r * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head & curled trunk
      ctx.beginPath();
      ctx.arc(0, -h * 0.52, r * 0.54, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.color;
      ctx.lineWidth = r * 0.26;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.36);
      ctx.quadraticCurveTo(r * 0.14, r * 0.05, r * 0.36, -r * 0.06);
      ctx.stroke();
      ctx.lineCap = 'butt';
      // Button eyes
      ctx.fillStyle = '#253240';
      ctx.beginPath();
      ctx.arc(-r * 0.2, -h * 0.6, 3, 0, Math.PI * 2);
      ctx.arc(r * 0.2, -h * 0.6, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'toyTruck': {
      ctx.save();
      ctx.rotate(p.angle);
      const len = r * 2.0;
      const wid = r * 1.05;
      // Chunky toy dump truck wheels
      ctx.fillStyle = '#2d3745';
      ctx.fillRect(-len * 0.38, -wid * 0.58, len * 0.22, wid * 1.16);
      ctx.fillRect(len * 0.16, -wid * 0.58, len * 0.22, wid * 1.16);
      // Yellow chassis & cab
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-len / 2, -wid / 2, len, wid, 10);
      ctx.fill();
      ctx.fillStyle = '#d8f1ff';
      ctx.fillRect(len * 0.26, -wid * 0.34, len * 0.14, wid * 0.68);
      // Bright red dump bed carrying colorful mini blocks!
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-len * 0.44, -wid * 0.42, len * 0.56, wid * 0.84, 7);
      ctx.fill();
      ctx.fillStyle = '#4da3e8';
      ctx.fillRect(-len * 0.36, -wid * 0.28, len * 0.18, wid * 0.24);
      ctx.fillStyle = '#52b874';
      ctx.fillRect(-len * 0.14, -wid * 0.24, len * 0.18, wid * 0.24);
      ctx.fillStyle = '#ffd447';
      ctx.fillRect(-len * 0.28, wid * 0.04, len * 0.22, wid * 0.24);
      ctx.restore();
      break;
    }
    case 'toyTrain': {
      ctx.save();
      ctx.rotate(p.angle);
      const len = r * 2.1;
      const wid = r * 0.96;
      // Bright red wooden train wheels
      ctx.fillStyle = p.accent;
      for (const wx of [-len * 0.38, -len * 0.04, len * 0.28]) {
        ctx.fillRect(wx, -wid * 0.58, len * 0.16, wid * 1.16);
      }
      // Wooden locomotive boiler & cab
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-len / 2, -wid / 2, len, wid, 10);
      ctx.fill();
      // Cozy red cab roof at rear
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.roundRect(-len * 0.46, -wid * 0.42, len * 0.38, wid * 0.84, 6);
      ctx.fill();
      // Golden bell & black smokestack in front
      ctx.fillStyle = '#ffd447';
      ctx.beginPath();
      ctx.arc(len * 0.06, 0, wid * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2d3745';
      ctx.beginPath();
      ctx.arc(len * 0.32, 0, wid * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'blockHouse': {
      // Stacked wooden building blocks forming a cozy cottage
      const w = r * 1.54;
      const d = r * 1.2;
      // Left & right pillar blocks
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.45, w * 0.34, d + h * 0.45, 6);
      ctx.roundRect(w / 2 - w * 0.34, -d / 2 - h * 0.45, w * 0.34, d + h * 0.45, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Center lintel block
      ctx.fillStyle = '#a8dcff';
      ctx.beginPath();
      ctx.roundRect(-w * 0.18, -d / 2 - h * 0.45, w * 0.36, d * 0.55 + h * 0.2, 5);
      ctx.fill();
      ctx.stroke();
      // Big bright triangular prism roof block!
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(0, -d / 2 - h * 1.18);
      ctx.lineTo(w * 0.58, -d / 2 - h * 0.38);
      ctx.lineTo(-w * 0.58, -d / 2 - h * 0.38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'blockArch': {
      // Wooden pillar blocks + big rainbow arch block
      const w = r * 1.58;
      const d = r * 1.24;
      ctx.fillStyle = '#f5d99e';
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.5, w * 0.3, d + h * 0.5, 6);
      ctx.roundRect(w / 2 - w * 0.3, -d / 2 - h * 0.5, w * 0.3, d + h * 0.5, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Colorful arch bridge block on top
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w * 0.54, -d / 2 - h * 0.92, w * 1.08, h * 0.55 + d * 0.35, 16);
      ctx.fill();
      ctx.stroke();
      // Inner arch cutout accent
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 0.38, w * 0.24, Math.PI, 0);
      ctx.fill();
      break;
    }
    case 'blockTower': {
      // Multi-story stacked colorful wooden ABC block tower!
      const w = r * 1.38;
      const d = r * 1.22;
      const stack = [
        { y: -d * 0.2 - h * 0.32, ww: w, hh: d * 0.72 + h * 0.36, c: '#f7d89c', border: '#ef5b5b', ch: 'A' },
        { y: -d * 0.2 - h * 0.68, ww: w * 0.86, hh: h * 0.38 + d * 0.2, c: '#bce6ff', border: '#4da3e8', ch: 'B' },
        { y: -d * 0.2 - h * 1.0, ww: w * 0.72, hh: h * 0.34 + d * 0.16, c: '#c8f2d4', border: '#52b874', ch: 'C' },
      ];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const blk of stack) {
        ctx.fillStyle = blk.c;
        ctx.beginPath();
        ctx.roundRect(-blk.ww / 2, blk.y, blk.ww, blk.hh, 8);
        ctx.fill();
        ctx.strokeStyle = blk.border;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = blk.border;
        ctx.font = `900 ${Math.round(blk.ww * 0.34)}px ui-rounded, system-ui, sans-serif`;
        ctx.fillText(blk.ch, 0, blk.y + blk.hh * 0.55);
      }
      // Pointed wooden cone block on top
      ctx.fillStyle = '#ffd447';
      ctx.beginPath();
      ctx.moveTo(0, -d * 0.2 - h * 1.48);
      ctx.lineTo(w * 0.32, -d * 0.2 - h * 0.98);
      ctx.lineTo(-w * 0.32, -d * 0.2 - h * 0.98);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      break;
    }
    case 'toyChest': {
      // Big cozy wooden toy chest with toys peeking out!
      const w = r * 1.62;
      const d = r * 1.24;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.62, w, d + h * 0.62, 12);
      ctx.fill();
      ctx.strokeStyle = '#99582e';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      // Decorative yellow star latch
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, d * 0.08, 12, 0, Math.PI * 2);
      ctx.fill();
      // Open wooden lid rim & colorful plush/ball peeking out
      ctx.fillStyle = '#6e3f22';
      ctx.beginPath();
      ctx.roundRect(-w * 0.44, -d / 2 - h * 0.66, w * 0.88, d * 0.56, 8);
      ctx.fill();
      ctx.fillStyle = '#ef5b5b';
      ctx.beginPath();
      ctx.arc(-w * 0.2, -d / 2 - h * 0.52, r * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4da3e8';
      ctx.beginPath();
      ctx.roundRect(-w * 0.02, -d / 2 - h * 0.72, r * 0.38, r * 0.38, 5);
      ctx.fill();
      ctx.fillStyle = '#ffd447';
      ctx.beginPath();
      ctx.arc(w * 0.24, -d / 2 - h * 0.48, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'playTent': {
      // Cozy striped playroom teepee tent with wooden poles!
      // Crossed wooden poles sticking out top
      ctx.strokeStyle = '#b57c47';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-r * 0.22, -h * 1.24);
      ctx.lineTo(r * 0.18, -h * 0.75);
      ctx.moveTo(r * 0.22, -h * 1.24);
      ctx.lineTo(-r * 0.18, -h * 0.75);
      ctx.stroke();
      ctx.lineCap = 'butt';
      // Cream canvas cone body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -h * 1.12);
      ctx.lineTo(r * 0.92, r * 0.48);
      ctx.quadraticCurveTo(0, r * 0.72, -r * 0.92, r * 0.48);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Cheerful coral-red canvas stripe
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(0, -h * 1.12);
      ctx.lineTo(r * 0.46, r * 0.58);
      ctx.lineTo(r * 0.2, r * 0.62);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -h * 1.12);
      ctx.lineTo(-r * 0.46, r * 0.58);
      ctx.lineTo(-r * 0.2, r * 0.62);
      ctx.closePath();
      ctx.fill();
      // Cozy dark doorway opening
      ctx.fillStyle = '#47364d';
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.25);
      ctx.lineTo(r * 0.28, r * 0.58);
      ctx.lineTo(-r * 0.28, r * 0.58);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'blockCastle': {
      // Colossal wooden block castle with twin turrets, central keep & flags!
      const w = r * 1.62;
      const d = r * 1.25;
      // Central castle wall & arch gate
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w * 0.42, -d * 0.35 - h * 0.62, w * 0.84, d * 0.85 + h * 0.62, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Castle archway door
      ctx.fillStyle = '#63473a';
      ctx.beginPath();
      ctx.arc(0, d * 0.32, w * 0.16, Math.PI, 0);
      ctx.lineTo(w * 0.16, d * 0.5);
      ctx.lineTo(-w * 0.16, d * 0.5);
      ctx.closePath();
      ctx.fill();
      // Left & right cylindrical wooden block turrets
      for (const side of [-1, 1]) {
        const tx = side * w * 0.42;
        ctx.fillStyle = '#f2cc8f';
        ctx.beginPath();
        ctx.roundRect(tx - w * 0.16, -d * 0.3 - h * 0.92, w * 0.32, d * 0.8 + h * 0.92, 10);
        ctx.fill();
        ctx.stroke();
        // Cone turret roof
        ctx.fillStyle = side < 0 ? '#ef5b5b' : '#52b874';
        ctx.beginPath();
        ctx.moveTo(tx, -d * 0.3 - h * 1.36);
        ctx.lineTo(tx + w * 0.2, -d * 0.3 - h * 0.88);
        ctx.lineTo(tx - w * 0.2, -d * 0.3 - h * 0.88);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      // Tall center keep + bright blue roof & golden pennant flag
      ctx.fillStyle = '#fff0cc';
      ctx.beginPath();
      ctx.roundRect(-w * 0.22, -d * 0.35 - h * 1.05, w * 0.44, h * 0.52 + d * 0.25, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(0, -d * 0.35 - h * 1.54);
      ctx.lineTo(w * 0.26, -d * 0.35 - h * 1.02);
      ctx.lineTo(-w * 0.26, -d * 0.35 - h * 1.02);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Fluttering golden flag on top!
      ctx.strokeStyle = '#6b4d35';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -d * 0.35 - h * 1.54);
      ctx.lineTo(0, -d * 0.35 - h * 1.76);
      ctx.stroke();
      ctx.fillStyle = '#ffd447';
      ctx.beginPath();
      ctx.moveTo(0, -d * 0.35 - h * 1.76);
      ctx.lineTo(24, -d * 0.35 - h * 1.68);
      ctx.lineTo(0, -d * 0.35 - h * 1.6);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'starfish': {
      // Plump 5-pointed ocean starfish
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const rad = i % 2 === 0 ? r * 1.02 : r * 0.44;
        const px = Math.cos(a) * rad;
        const py = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      // Decorative center dots
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
        ctx.arc(Math.cos(a) * r * 0.48, Math.sin(a) * r * 0.48, r * 0.11, 0, Math.PI * 2);
      }
      ctx.fill();
      break;
    }
    case 'seaShell': {
      // Plump, unmistakable scalloped seashell with fluted lobes, hinge ears & pearl sheen
      const rad = r * 0.98;
      // Little hinge wings at bottom base
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-rad * 0.46, rad * 0.24, rad * 0.92, rad * 0.36, 4);
      ctx.fill();
      ctx.strokeStyle = 'rgba(72, 46, 56, 0.28)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Main scalloped fan silhouette (5 rounded fluted lobes along top edge)
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-rad * 0.34, rad * 0.42);
      ctx.lineTo(-rad * 0.96, -rad * 0.14);
      const lobes = 5;
      for (let i = 0; i < lobes; i++) {
        const a0 = Math.PI * (1.08 + (i / lobes) * 0.84);
        const aMid = Math.PI * (1.08 + ((i + 0.5) / lobes) * 0.84);
        const a1 = Math.PI * (1.08 + ((i + 1) / lobes) * 0.84);
        ctx.quadraticCurveTo(
          Math.cos(aMid) * rad * 1.18,
          Math.sin(aMid) * rad * 1.08 + 2,
          Math.cos(a1) * rad * 0.92,
          Math.sin(a1) * rad * 0.88 + 2,
        );
      }
      ctx.lineTo(rad * 0.34, rad * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Shaded grooves & sunlit highlights radiating from the hinge
      for (let i = 1; i < lobes; i++) {
        const a = Math.PI * (1.08 + (i / lobes) * 0.84);
        ctx.strokeStyle = 'rgba(72, 46, 56, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, rad * 0.38);
        ctx.lineTo(Math.cos(a) * rad * 0.86, Math.sin(a) * rad * 0.82 + 2);
        ctx.stroke();
      }
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 1.8;
      for (let i = 0; i < lobes; i++) {
        const aMid = Math.PI * (1.08 + ((i + 0.5) / lobes) * 0.84);
        ctx.beginPath();
        ctx.moveTo(0, rad * 0.32);
        ctx.lineTo(Math.cos(aMid) * rad * 0.78, Math.sin(aMid) * rad * 0.74 + 2);
        ctx.stroke();
      }
      break;
    }
    case 'pearlClam': {
      // Scalloped bivalve clam shell open to reveal a luminous pearl
      const rad = r * 1.02;
      // Back/upper scalloped lid tilted upward
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-rad * 0.86, 0);
      for (let i = 0; i < 5; i++) {
        const x0 = -rad * 0.86 + (i / 5) * (rad * 1.72);
        const x1 = -rad * 0.86 + ((i + 1) / 5) * (rad * 1.72);
        const xm = (x0 + x1) / 2;
        const arch = Math.sin(((i + 0.5) / 5) * Math.PI);
        ctx.quadraticCurveTo(xm, -rad * (0.65 + arch * 0.55), x1, -rad * (0.28 + Math.sin(((i + 1) / 5) * Math.PI) * 0.45));
      }
      ctx.lineTo(rad * 0.86, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(46, 28, 82, 0.32)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner dark velvet shell cavity
      ctx.fillStyle = '#5a3b96';
      ctx.beginPath();
      ctx.ellipse(0, 1, rad * 0.78, rad * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lower scalloped lip framing the pearl
      ctx.fillStyle = '#b494f2';
      ctx.beginPath();
      ctx.ellipse(0, 3.5, rad * 0.88, rad * 0.46, 0, 0.08 * Math.PI, 0.92 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Luminous glowing pearl nestled inside
      ctx.fillStyle = 'rgba(255, 252, 235, 0.32)';
      ctx.beginPath();
      ctx.arc(0, -1, rad * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -1, rad * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-rad * 0.12, -2.6, rad * 0.13, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'merman': {
      // Swimming merman with swishing fish tail, flowing hair & tiny golden trident!
      const phase = p.wander ? p.wander.walkPhase : 0;
      const moving = p.wander && (Math.abs(p.vx) > 2 || Math.abs(p.vy) > 2);
      const bob = moving && !p.swallowing ? Math.sin(phase) * 2.6 : 0;
      const swish = moving && !p.swallowing ? Math.sin(phase * 1.2) * 3.8 : 0;

      ctx.save();
      if (p.swallowing) ctx.rotate(p.angle);
      // Forked fish tail fin swishing behind/below
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-4, 1 - bob * 0.4);
      ctx.quadraticCurveTo(swish * 0.6, 8, -5.5 + swish, 11.5);
      ctx.lineTo(swish * 0.8, 8.5);
      ctx.lineTo(5.5 + swish, 11.5);
      ctx.quadraticCurveTo(swish * 0.6, 8, 4, 1 - bob * 0.4);
      ctx.closePath();
      ctx.fill();
      // Shimmering scale belt
      ctx.fillStyle = '#ffe58f';
      ctx.fillRect(-5, -1 - bob * 0.5, 10, 2.5);
      // Torso & swimming arms
      ctx.fillStyle = '#ffd5b5';
      ctx.beginPath();
      ctx.roundRect(-5.8, -8.5 - bob, 11.6, 9, 4.5);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-7.2, -4 - bob, 2.2, 0, Math.PI * 2);
      ctx.arc(7.2, -4 - bob, 2.2, 0, Math.PI * 2);
      ctx.fill();
      // Tiny golden trident held in right hand!
      ctx.strokeStyle = '#f5c249';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(8.5, 3 - bob);
      ctx.lineTo(8.5, -15 - bob);
      ctx.moveTo(6, -12 - bob);
      ctx.lineTo(6, -16 - bob);
      ctx.moveTo(11, -12 - bob);
      ctx.lineTo(11, -16 - bob);
      ctx.moveTo(6, -12 - bob);
      ctx.lineTo(11, -12 - bob);
      ctx.stroke();
      // Head & flowing hair
      ctx.fillStyle = '#ffd5b5';
      ctx.beginPath();
      ctx.arc(0, -13 - bob, 5.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -14.5 - bob, 5.4, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
      // Golden sea-crown accent
      ctx.fillStyle = '#ffd447';
      ctx.beginPath();
      ctx.moveTo(-3.5, -17.5 - bob);
      ctx.lineTo(-1.8, -20.5 - bob);
      ctx.lineTo(0, -18 - bob);
      ctx.lineTo(1.8, -20.5 - bob);
      ctx.lineTo(3.5, -17.5 - bob);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'seaAnemone': {
      // Lush layered sea anemone anchored on a small reef stone with two rings of curving tentacles
      // Small reef stone base
      ctx.fillStyle = '#5c7c8a';
      ctx.beginPath();
      ctx.ellipse(0, 5, r * 0.88, r * 0.56, 0, 0, Math.PI * 2);
      ctx.fill();
      // Plump fleshy anemone foot
      ctx.fillStyle = '#9e3e6a';
      ctx.beginPath();
      ctx.ellipse(0, 1, r * 0.68, r * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(64, 24, 46, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer ring of 10 graceful curving tentacles
      ctx.lineCap = 'round';
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const bx = Math.cos(a) * r * 0.34;
        const by = Math.sin(a) * r * 0.22;
        const tx = Math.cos(a) * r * 0.96;
        const ty = -h * 0.32 + Math.sin(a) * r * 0.62;
        const cx = (bx + tx) * 0.5 + Math.cos(a + 1.2) * 3.5;
        const cy = (by + ty) * 0.5 - 5;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 4.6;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(cx, cy, tx, ty);
        ctx.stroke();
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.7, 0, Math.PI * 2);
        ctx.fill();
      }
      // Inner crown of shorter upright tentacles
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        const tx = Math.cos(a) * r * 0.46;
        const ty = -h * 0.58 + Math.sin(a) * r * 0.26;
        ctx.strokeStyle = '#ff9ec4';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.14, -2);
        ctx.quadraticCurveTo(tx * 0.5, ty - 3, tx, ty);
        ctx.stroke();
        ctx.fillStyle = '#fff5b8';
        ctx.beginPath();
        ctx.arc(tx, ty, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineCap = 'butt';
      break;
    }
    case 'kelpLamp': {
      // Curved kelp stalk with glowing bioluminescent pearl lantern
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.quadraticCurveTo(-8, -h * 0.55, 0, -h * 1.08);
      ctx.stroke();
      ctx.lineCap = 'butt';
      ctx.fillStyle = 'rgba(158, 247, 255, 0.34)';
      ctx.beginPath();
      ctx.arc(0, -h * 1.12, r * 0.88, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 1.12, r * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-r * 0.14, -h * 1.2, r * 0.15, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'treasureChest': {
      // Sunken wooden chest overflowing with gold coins
      const w = r * 1.6;
      const d = r * 1.15;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.45, w, d + h * 0.45, 6);
      ctx.fill();
      ctx.strokeStyle = '#6e4020';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Brass bands
      ctx.fillStyle = '#e6b23c';
      ctx.fillRect(-w * 0.34, -d / 2 - h * 0.45, 5, d + h * 0.45);
      ctx.fillRect(w * 0.34 - 5, -d / 2 - h * 0.45, 5, d + h * 0.45);
      // Gleaming gold coins inside open top
      ctx.fillStyle = p.accent;
      for (const [cx, cy] of [[-7, -h * 0.38], [0, -h * 0.48], [7, -h * 0.36], [-3, -h * 0.28], [4, -h * 0.26]]) {
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'shellScooter': {
      // Cute minnow-fish sea scooter with forked tail, side fins, fish eyes & merman rider!
      ctx.save();
      ctx.rotate(p.angle);
      // Bubble jet trail
      ctx.fillStyle = 'rgba(225, 253, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(-r * 1.05, -2.5, 3, 0, Math.PI * 2);
      ctx.arc(-r * 1.24, 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
      // Forked fish tail fin at back
      ctx.fillStyle = '#ff9c6e';
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, 0);
      ctx.lineTo(-r * 1.02, -7.5);
      ctx.lineTo(-r * 0.82, 0);
      ctx.lineTo(-r * 1.02, 7.5);
      ctx.closePath();
      ctx.fill();
      // Little side pectoral fins
      ctx.beginPath();
      ctx.ellipse(r * 0.08, -7.5, 4.5, 2.4, -0.5, 0, Math.PI * 2);
      ctx.ellipse(r * 0.08, 7.5, 4.5, 2.4, 0.5, 0, Math.PI * 2);
      ctx.fill();
      // Sleek fish scooter body
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.ellipse(r * 0.14, 0, r * 0.78, 6.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 42, 30, 0.25)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      // Cute fish eyes on nose
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(r * 0.62, -3.2, 2.2, 0, Math.PI * 2);
      ctx.arc(r * 0.62, 3.2, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1b2838';
      ctx.beginPath();
      ctx.arc(r * 0.66, -3.2, 1.2, 0, Math.PI * 2);
      ctx.arc(r * 0.66, 3.2, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // Merman rider (tail + head + golden crown)
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(-r * 0.22, 0, 5.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd5b5';
      ctx.beginPath();
      ctx.arc(r * 0.14, 0, 4.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f5c249';
      ctx.beginPath();
      ctx.arc(r * 0.14, 0, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'coralBush': {
      // Sculpted reef brain-coral cluster on a rocky base with winding maze grooves & tiny polyps
      // Reef rock pedestal
      ctx.fillStyle = '#5a7e8c';
      ctx.beginPath();
      ctx.ellipse(0, 6, r * 0.98, r * 0.66, 0, 0, Math.PI * 2);
      ctx.fill();

      // Layered domed brain-coral mounds (darker back lobes + bright front dome)
      const mounds = [
        { x: -r * 0.34, y: -3, rx: r * 0.56, ry: r * 0.46, fill: p.color },
        { x: r * 0.36, y: -2, rx: r * 0.52, ry: r * 0.44, fill: p.color },
        { x: 0, y: -r * 0.24, rx: r * 0.68, ry: r * 0.58, fill: p.color },
      ];
      ctx.strokeStyle = 'rgba(68, 28, 42, 0.24)';
      ctx.lineWidth = 2;
      for (const m of mounds) {
        ctx.fillStyle = m.fill;
        ctx.beginPath();
        ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Soft sunlit highlight cap on the main coral dome
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.1, -r * 0.44, r * 0.38, r * 0.24, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Winding brain-coral maze grooves
      ctx.strokeStyle = 'rgba(84, 30, 48, 0.26)';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-r * 0.42, -r * 0.18);
      ctx.bezierCurveTo(-r * 0.24, -r * 0.52, r * 0.04, -r * 0.12, r * 0.22, -r * 0.44);
      ctx.moveTo(-r * 0.28, r * 0.04);
      ctx.bezierCurveTo(-r * 0.02, -r * 0.24, r * 0.18, r * 0.12, r * 0.44, -r * 0.12);
      ctx.stroke();

      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-r * 0.42, -r * 0.22);
      ctx.bezierCurveTo(-r * 0.24, -r * 0.56, r * 0.04, -r * 0.16, r * 0.22, -r * 0.48);
      ctx.moveTo(-r * 0.28, 0);
      ctx.bezierCurveTo(-r * 0.02, -r * 0.28, r * 0.18, r * 0.08, r * 0.44, -r * 0.16);
      ctx.stroke();
      ctx.lineCap = 'butt';

      // Tiny glowing coral polyps dotted on top
      ctx.fillStyle = '#fff5cc';
      for (const [px, py] of [[-r * 0.46, 0], [r * 0.48, 1], [-r * 0.08, -r * 0.6], [r * 0.2, -r * 0.22]]) {
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'shellCar': {
      // Adorable tropical fish car with forked tail fin, side pectoral fins, clownfish stripes, glossy fish eyes & bubble canopy!
      ctx.save();
      ctx.rotate(p.angle);
      const len = r * 1.96;
      const wid = r * 1.18;

      // Trailing bubbles behind the tail fin
      ctx.fillStyle = 'rgba(225, 253, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(-len * 0.62, -wid * 0.16, 4.4, 0, Math.PI * 2);
      ctx.arc(-len * 0.72, wid * 0.12, 3, 0, Math.PI * 2);
      ctx.fill();

      // Side pectoral fins fanning outward left & right
      ctx.fillStyle = p.accent;
      ctx.strokeStyle = 'rgba(42, 34, 48, 0.24)';
      ctx.lineWidth = 1.6;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(len * 0.08, side * wid * 0.36);
        ctx.quadraticCurveTo(len * 0.04, side * wid * 0.74, -len * 0.22, side * wid * 0.64);
        ctx.quadraticCurveTo(-len * 0.18, side * wid * 0.44, -len * 0.08, side * wid * 0.36);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Big flared forked tail fin at rear
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(-len * 0.3, 0);
      ctx.quadraticCurveTo(-len * 0.48, -wid * 0.46, -len * 0.62, -wid * 0.44);
      ctx.quadraticCurveTo(-len * 0.5, 0, -len * 0.62, wid * 0.44);
      ctx.quadraticCurveTo(-len * 0.48, wid * 0.46, -len * 0.3, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Plump torpedo fish-car body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(len * 0.52, 0);
      ctx.bezierCurveTo(len * 0.46, -wid * 0.54, -len * 0.14, -wid * 0.52, -len * 0.36, -wid * 0.12);
      ctx.lineTo(-len * 0.36, wid * 0.12);
      ctx.bezierCurveTo(-len * 0.14, wid * 0.52, len * 0.46, wid * 0.54, len * 0.52, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tropical clownfish white/cream accent stripe across the back
      ctx.fillStyle = 'rgba(255, 252, 240, 0.78)';
      ctx.beginPath();
      ctx.roundRect(-len * 0.22, -wid * 0.36, len * 0.11, wid * 0.72, 4);
      ctx.fill();

      // Glossy sea-glass bubble windshield / sunroof cabin
      ctx.fillStyle = '#c8fcff';
      ctx.beginPath();
      ctx.ellipse(len * 0.06, 0, len * 0.19, wid * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(30, 88, 108, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.beginPath();
      ctx.ellipse(len * 0.11, -wid * 0.08, len * 0.08, wid * 0.08, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Cute dorsal fin ridge along center behind cabin
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(-len * 0.22, 0, len * 0.11, wid * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();

      // Expressive glossy fish eyes near the front nose (acting like headlights!)
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(len * 0.32, side * wid * 0.24, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#182433';
        ctx.beginPath();
        ctx.arc(len * 0.35, side * wid * 0.24, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(len * 0.37, side * wid * 0.22, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case 'kelpTree': {
      // Lush Giant Kelp cluster anchored on ocean rocks with wavy ribbon blades, golden air bladders & bubbles!
      // Smooth reef boulder holdfast
      ctx.fillStyle = '#4e7382';
      ctx.beginPath();
      ctx.ellipse(-6, 8, r * 0.62, r * 0.36, -0.1, 0, Math.PI * 2);
      ctx.ellipse(12, 10, r * 0.44, r * 0.28, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6893a3';
      ctx.beginPath();
      ctx.ellipse(-8, 5, r * 0.36, r * 0.18, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // 3 graceful swaying kelp stalks with alternating pointed kelp leaves
      const stalks = [
        { ox: -r * 0.34, hMul: 0.9, sway: -1, stem: '#1d7a5e', leaf: '#2ea37e', hi: '#6ae0b2' },
        { ox: r * 0.34, hMul: 0.84, sway: 1, stem: '#228a6b', leaf: '#35b38a', hi: '#78ebb9' },
        { ox: 0, hMul: 1.12, sway: 0.6, stem: '#259976', leaf: '#40c496', hi: '#96f7cf' },
      ];
      for (const s of stalks) {
        const topY = -h * s.hMul;
        const c1x = s.ox - 12 * s.sway;
        const c2x = s.ox + 14 * s.sway;

        // Alternating leafy kelp blades along the stalk
        for (let i = 1; i <= 4; i++) {
          const t = i / 4.6;
          const inv = 1 - t;
          const px = inv * inv * inv * s.ox + 3 * inv * inv * t * c1x + 3 * inv * t * t * c2x + t * t * t * (s.ox - 3 * s.sway);
          const py = 6 * inv + topY * t;
          const side = i % 2 === 0 ? 1 : -1;
          const leafLen = (18 - i * 1.6) * (0.85 + s.hMul * 0.15);

          ctx.fillStyle = i >= 3 ? s.hi : s.leaf;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.quadraticCurveTo(px + side * leafLen * 0.65, py - 9, px + side * leafLen, py - 4);
          ctx.quadraticCurveTo(px + side * leafLen * 0.55, py + 5, px, py + 3);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = 'rgba(18, 72, 54, 0.22)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Tiny golden kelp air bladder at leaf base
          ctx.fillStyle = '#ffe07d';
          ctx.beginPath();
          ctx.arc(px + side * 3.5, py - 1, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main flexible kelp stem
        ctx.strokeStyle = s.stem;
        ctx.lineWidth = 4.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.ox, 6);
        ctx.bezierCurveTo(c1x, topY * 0.35, c2x, topY * 0.72, s.ox - 3 * s.sway, topY);
        ctx.stroke();

        // Top crown leaf
        ctx.fillStyle = s.hi;
        ctx.beginPath();
        ctx.ellipse(s.ox - 3 * s.sway, topY - 4, 5.5, 9, -0.2 * s.sway, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineCap = 'butt';

      // Tiny rising oxygen bubbles around the kelp canopy
      ctx.fillStyle = 'rgba(225, 253, 255, 0.78)';
      ctx.beginPath();
      ctx.arc(-r * 0.22, -h * 1.02, 3.2, 0, Math.PI * 2);
      ctx.arc(r * 0.24, -h * 0.88, 2.4, 0, Math.PI * 2);
      ctx.arc(r * 0.06, -h * 1.18, 2.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'staghornCoral': {
      // Sculpted branching Staghorn / Tree Coral growing from a reef stone with tapered curved limbs & glowing tips!
      // Reef rock base
      ctx.fillStyle = '#537887';
      ctx.beginPath();
      ctx.ellipse(0, 8, r * 0.76, r * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6c95a6';
      ctx.beginPath();
      ctx.ellipse(-6, 5, r * 0.42, r * 0.2, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Helper to draw a smoothly curved, tapered coral branch
      const drawBranch = (x0, y0, cx, cy, x1, y1, w0, w1, fill) => {
        ctx.strokeStyle = fill;
        ctx.lineCap = 'round';
        ctx.lineWidth = w0;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(cx, cy, (x0 + 2 * cx + x1) * 0.25, (y0 + 2 * cy + y1) * 0.25);
        ctx.stroke();
        ctx.lineWidth = w1;
        ctx.beginPath();
        ctx.moveTo((x0 + 2 * cx + x1) * 0.25, (y0 + 2 * cy + y1) * 0.25);
        ctx.quadraticCurveTo((cx + x1) * 0.5, (cy + y1) * 0.5, x1, y1);
        ctx.stroke();
      };

      // Back shaded coral limbs for 2.5D depth
      const backColor = 'rgba(138, 48, 56, 0.52)';
      drawBranch(-4, 4, -r * 0.46, -h * 0.32, -r * 0.62, -h * 0.78, 12, 8, backColor);
      drawBranch(4, 4, r * 0.48, -h * 0.36, r * 0.62, -h * 0.84, 12, 8, backColor);

      // Main sculpted coral trunk & curving forked antlers
      drawBranch(0, 6, -4, -h * 0.42, 0, -h * 0.94, 15, 10, p.color);
      drawBranch(-2, -h * 0.2, -r * 0.36, -h * 0.42, -r * 0.58, -h * 0.86, 12, 8, p.color);
      drawBranch(2, -h * 0.26, r * 0.38, -h * 0.46, r * 0.58, -h * 0.9, 12, 8, p.color);
      drawBranch(-r * 0.32, -h * 0.52, -r * 0.34, -h * 0.82, -r * 0.22, -h * 1.08, 9, 6.5, p.color);
      drawBranch(r * 0.3, -h * 0.56, r * 0.36, -h * 0.84, r * 0.24, -h * 1.1, 9, 6.5, p.color);

      // Soft sunlit highlight ridges on the coral branches
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-2, -h * 0.1);
      ctx.quadraticCurveTo(-5, -h * 0.45, -2, -h * 0.86);
      ctx.stroke();

      // Luminous pale coral growth tips & tiny reef polyps
      ctx.fillStyle = p.accent;
      for (const [tx, ty, tr] of [
        [0, -h * 0.96, 5.2],
        [-r * 0.58, -h * 0.88, 4.6],
        [r * 0.58, -h * 0.92, 4.6],
        [-r * 0.22, -h * 1.1, 4.2],
        [r * 0.24, -h * 1.12, 4.2],
      ]) {
        ctx.beginPath();
        ctx.arc(tx, ty, tr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tx - 1.2, ty - 1.2, tr * 0.38, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.accent;
      }
      ctx.lineCap = 'butt';
      break;
    }
    case 'shellTruck': {
      // Friendly whale-fish cargo hauler with big pectoral fins, tail fluke & pearl-filled cargo bed!
      ctx.save();
      ctx.rotate(p.angle);
      const len = r * 2.08;
      const wid = r * 1.12;
      // Bubble trail
      ctx.fillStyle = 'rgba(225, 253, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(-len * 0.62, -wid * 0.18, 5, 0, Math.PI * 2);
      ctx.arc(-len * 0.72, wid * 0.12, 3.6, 0, Math.PI * 2);
      ctx.fill();

      // Wide whale pectoral fins
      ctx.fillStyle = '#3d86c2';
      ctx.strokeStyle = 'rgba(24, 52, 78, 0.28)';
      ctx.lineWidth = 1.8;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(len * 0.24, side * wid * 0.36);
        ctx.quadraticCurveTo(len * 0.18, side * wid * 0.74, -len * 0.08, side * wid * 0.62);
        ctx.quadraticCurveTo(-len * 0.04, side * wid * 0.44, len * 0.04, side * wid * 0.38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Broad whale tail fluke at back
      ctx.fillStyle = '#3d86c2';
      ctx.beginPath();
      ctx.moveTo(-len * 0.36, 0);
      ctx.quadraticCurveTo(-len * 0.52, -wid * 0.48, -len * 0.64, -wid * 0.4);
      ctx.quadraticCurveTo(-len * 0.52, 0, -len * 0.64, wid * 0.4);
      ctx.quadraticCurveTo(-len * 0.52, wid * 0.48, -len * 0.36, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Chunky whale-fish hull
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(len * 0.52, 0);
      ctx.bezierCurveTo(len * 0.5, -wid * 0.52, -len * 0.24, -wid * 0.5, -len * 0.44, -wid * 0.18);
      ctx.lineTo(-len * 0.44, wid * 0.18);
      ctx.bezierCurveTo(-len * 0.24, wid * 0.5, len * 0.5, wid * 0.52, len * 0.52, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rear cargo bed holding gleaming pearls
      ctx.fillStyle = '#245d82';
      ctx.beginPath();
      ctx.roundRect(-len * 0.36, -wid * 0.32, len * 0.46, wid * 0.64, 12);
      ctx.fill();
      for (const [px, py] of [
        [-len * 0.24, -wid * 0.13],
        [-len * 0.06, -wid * 0.12],
        [-len * 0.18, wid * 0.13],
        [-len * 0.01, wid * 0.13],
      ]) {
        ctx.fillStyle = '#fff8eb';
        ctx.beginPath();
        ctx.arc(px, py, wid * 0.14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px - 2.5, py - 2.5, wid * 0.045, 0, Math.PI * 2);
        ctx.fill();
      }

      // Curved sea-glass windshield on the whale's brow
      ctx.fillStyle = '#c8fcff';
      ctx.beginPath();
      ctx.ellipse(len * 0.26, 0, len * 0.1, wid * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Friendly whale eyes near the front nose
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(len * 0.4, side * wid * 0.24, 5.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#182433';
        ctx.beginPath();
        ctx.arc(len * 0.43, side * wid * 0.24, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case 'shellBus': {
      // Giant reef-fish bus with flared tail fin, pectoral fins, porthole windows & friendly fish eyes!
      ctx.save();
      ctx.rotate(p.angle);
      const len = r * 2.16;
      const wid = r * 1.08;
      // Bubble jet trail
      ctx.fillStyle = 'rgba(225, 253, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(-len * 0.62, -wid * 0.18, 5.4, 0, Math.PI * 2);
      ctx.arc(-len * 0.62, wid * 0.18, 5.4, 0, Math.PI * 2);
      ctx.arc(-len * 0.74, 0, 3.6, 0, Math.PI * 2);
      ctx.fill();

      // Side pectoral fins
      ctx.fillStyle = '#ffd166';
      ctx.strokeStyle = 'rgba(72, 38, 28, 0.26)';
      ctx.lineWidth = 1.8;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(len * 0.18, side * wid * 0.36);
        ctx.quadraticCurveTo(len * 0.12, side * wid * 0.72, -len * 0.12, side * wid * 0.6);
        ctx.quadraticCurveTo(-len * 0.08, side * wid * 0.42, 0, side * wid * 0.38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Flared fish tail fin at back
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.moveTo(-len * 0.38, 0);
      ctx.quadraticCurveTo(-len * 0.54, -wid * 0.48, -len * 0.64, -wid * 0.42);
      ctx.quadraticCurveTo(-len * 0.52, 0, -len * 0.64, wid * 0.42);
      ctx.quadraticCurveTo(-len * 0.54, wid * 0.48, -len * 0.38, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Long streamlined fish-bus body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(len * 0.52, 0);
      ctx.bezierCurveTo(len * 0.48, -wid * 0.5, -len * 0.24, -wid * 0.5, -len * 0.44, -wid * 0.16);
      ctx.lineTo(-len * 0.44, wid * 0.16);
      ctx.bezierCurveTo(-len * 0.24, wid * 0.5, len * 0.48, wid * 0.5, len * 0.52, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Decorative tropical stripes along bus roof
      ctx.fillStyle = 'rgba(255, 250, 232, 0.72)';
      ctx.fillRect(-len * 0.24, -wid * 0.38, len * 0.07, wid * 0.76);
      ctx.fillRect(len * 0.02, -wid * 0.4, len * 0.07, wid * 0.8);

      // Pearl-rimmed porthole passenger windows along both flanks
      for (const wx of [-len * 0.32, -len * 0.1, len * 0.14]) {
        for (const wy of [-wid * 0.27, wid * 0.27]) {
          ctx.fillStyle = '#fff5d6';
          ctx.beginPath();
          ctx.arc(wx, wy, 6.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = p.accent;
          ctx.beginPath();
          ctx.arc(wx, wy, 4.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Curved front sea-glass windshield & big fish eyes
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(len * 0.28, 0, len * 0.1, wid * 0.27, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff5d6';
      ctx.lineWidth = 2;
      ctx.stroke();

      for (const side of [-1, 1]) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(len * 0.41, side * wid * 0.22, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#182433';
        ctx.beginPath();
        ctx.arc(len * 0.44, side * wid * 0.22, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case 'coralCottage': {
      // Organic porous coral-stone cottage with scalloped shell roof & sprouting coral!
      const w = r * 1.56;
      const d = r * 1.24;
      // Organic rounded coral-stone body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.56, w, d + h * 0.56, 22);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Porous coral dimples
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      for (const [cx, cy, cr] of [[-w * 0.32, -h * 0.1, 6], [w * 0.34, -h * 0.15, 5], [-w * 0.28, d * 0.28, 4.5], [w * 0.3, d * 0.26, 5.5]]) {
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
      }
      // Arched sea-glass doorway & glowing porthole windows
      ctx.fillStyle = '#25697a';
      ctx.beginPath();
      ctx.arc(0, d * 0.32, 12, Math.PI, 0);
      ctx.lineTo(12, d * 0.48);
      ctx.lineTo(-12, d * 0.48);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#b8fcff';
      ctx.beginPath();
      ctx.arc(-w * 0.28, d * 0.08, 8.5, 0, Math.PI * 2);
      ctx.arc(w * 0.28, d * 0.08, 8.5, 0, Math.PI * 2);
      ctx.fill();
      // Scalloped fan-shell roof with real fluted eaves
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.moveTo(-w * 0.58, -h * 0.48);
      ctx.quadraticCurveTo(0, -h * 1.18, w * 0.58, -h * 0.48);
      const eaves = 5;
      for (let i = eaves - 1; i >= 0; i--) {
        const x1 = -w * 0.58 + ((i + 1) / eaves) * (w * 1.16);
        const x0 = -w * 0.58 + (i / eaves) * (w * 1.16);
        ctx.quadraticCurveTo((x0 + x1) / 2, -h * 0.24, x0, -h * 0.48);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(32, 74, 78, 0.24)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.48)';
      ctx.lineWidth = 2.4;
      for (let i = 1; i < eaves; i++) {
        const ex = -w * 0.58 + (i / eaves) * (w * 1.16);
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.94);
        ctx.quadraticCurveTo(ex * 0.65, -h * 0.72, ex, -h * 0.48);
        ctx.stroke();
      }
      // Little coral antlers sprouting on the roof
      ctx.strokeStyle = '#ff6b8b';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w * 0.26, -h * 0.82);
      ctx.lineTo(w * 0.34, -h * 1.15);
      ctx.moveTo(w * 0.3, -h * 0.96);
      ctx.lineTo(w * 0.42, -h * 1.08);
      ctx.stroke();
      ctx.lineCap = 'butt';
      break;
    }
    case 'shellVilla': {
      // Coral-encrusted underwater villa with nautilus spiral dome & pearl balconies!
      const w = r * 1.56;
      const d = r * 1.24;
      // Coral-stone base with fluted columns
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -d / 2 - h * 0.58, w, d + h * 0.58, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Glowing arched sea-glass windows
      ctx.fillStyle = '#a8f8ff';
      for (const wx of [-w * 0.28, 0, w * 0.28]) {
        ctx.beginPath();
        ctx.arc(wx, d * 0.16, 9, Math.PI, 0);
        ctx.lineTo(wx + 9, d * 0.4);
        ctx.lineTo(wx - 9, d * 0.4);
        ctx.closePath();
        ctx.fill();
      }
      // Nautilus spiral shell dome with chamber ribs
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 0.68, r * 0.64, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(66, 36, 48, 0.26)';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      // Chamber lines radiating softly around the spiral
      ctx.strokeStyle = 'rgba(255,255,255,0.42)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.16, -h * 0.68 + Math.sin(a) * r * 0.16);
        ctx.quadraticCurveTo(
          Math.cos(a + 0.35) * r * 0.42,
          -h * 0.68 + Math.sin(a + 0.35) * r * 0.42,
          Math.cos(a + 0.2) * r * 0.62,
          -h * 0.68 + Math.sin(a + 0.2) * r * 0.62,
        );
        ctx.stroke();
      }
      // Smooth coiled spiral highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.72)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.04) {
        const ang = t * Math.PI * 3.4;
        const sr = t * r * 0.56;
        const sx = Math.cos(ang) * sr;
        const sy = -h * 0.68 + Math.sin(ang) * sr;
        if (t === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      // Glowing roof pearl
      ctx.fillStyle = '#fff9e6';
      ctx.beginPath();
      ctx.arc(0, -h * 0.68, r * 0.13, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'coralTower': {
      // Multi-tiered tubular organ-pipe coral skyscraper with glowing portholes!
      const w = r * 1.48;
      const d = r * 1.26;
      // Side coral tubes
      ctx.fillStyle = '#e06b6b';
      ctx.beginPath();
      ctx.roundRect(-w * 0.52, -d * 0.35 - h * 0.78, w * 0.34, d * 0.85 + h * 0.78, 18);
      ctx.roundRect(w * 0.18, -d * 0.35 - h * 0.86, w * 0.34, d * 0.85 + h * 0.86, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.14)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Tall center coral spire tube
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w * 0.28, -d * 0.35 - h * 1.08, w * 0.56, d * 0.88 + h * 1.08, 22);
      ctx.fill();
      ctx.stroke();
      // Bioluminescent porthole windows up the coral tubes
      ctx.fillStyle = p.accent;
      for (let rr = 0; rr < 4; rr++) {
        const wy = -h * 0.82 + rr * (h * 0.26);
        ctx.beginPath();
        ctx.arc(0, wy, 9, 0, Math.PI * 2);
        ctx.fill();
        if (rr >= 1) {
          ctx.beginPath();
          ctx.arc(-w * 0.35, wy + 12, 7, 0, Math.PI * 2);
          ctx.arc(w * 0.35, wy + 8, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Open coral-polyp rims on top of each tube
      ctx.fillStyle = '#ffd6c2';
      ctx.beginPath();
      ctx.ellipse(0, -d * 0.35 - h * 1.04, w * 0.2, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(-w * 0.35, -d * 0.35 - h * 0.74, w * 0.12, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(w * 0.35, -d * 0.35 - h * 0.82, w * 0.12, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'reefDome': {
      // Grand coral-ribbed underwater pavilion with iridescent pearl dome!
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.96, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Coral ribs radiating around the base
      ctx.strokeStyle = '#ff9cb5';
      ctx.lineWidth = 6;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62);
        ctx.lineTo(Math.cos(a) * r * 0.94, Math.sin(a) * r * 0.94);
        ctx.stroke();
      }
      // Luminous aqua glass dome
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(0, -h * 0.34, r * 0.74, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Pearl sheen highlight
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.arc(-r * 0.22, -h * 0.46, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'coralCitadel': {
      // Towering branching coral cathedral-tower with glowing aqua windows!
      const w = r * 1.54;
      const d = r * 1.24;
      // Wide scalloped coral foundation
      ctx.fillStyle = '#e87474';
      ctx.beginPath();
      ctx.roundRect(-w * 0.48, -d * 0.32 - h * 0.65, w * 0.96, d * 0.84 + h * 0.65, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Twin side coral spires
      for (const side of [-1, 1]) {
        const sx = side * w * 0.36;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(sx - w * 0.16, -d * 0.1 - h * 0.45);
        ctx.quadraticCurveTo(sx - side * 8, -h * 1.15, sx + side * 6, -h * 1.28);
        ctx.quadraticCurveTo(sx + w * 0.18, -h * 0.92, sx + w * 0.16, -d * 0.1 - h * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      // Central coral tower spire
      ctx.fillStyle = '#ffa494';
      ctx.beginPath();
      ctx.moveTo(-w * 0.24, d * 0.3);
      ctx.quadraticCurveTo(-w * 0.2, -h * 1.1, 0, -h * 1.48);
      ctx.quadraticCurveTo(w * 0.2, -h * 1.1, w * 0.24, d * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Glowing sea-glass stained windows
      ctx.fillStyle = p.accent;
      for (let rr = 0; rr < 4; rr++) {
        const wy = -h * 0.96 + rr * (h * 0.28);
        ctx.beginPath();
        ctx.ellipse(0, wy, 13, 18, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Pearl crown orb at peak
      ctx.fillStyle = '#fff9e6';
      ctx.beginPath();
      ctx.arc(0, -h * 1.48, 12, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'atlantisPalace': {
      // Colossal Atlantis Coral Palace with shell arches, twin coral turrets, pearl dome & golden trident!
      const w = r * 1.66;
      const d = r * 1.28;
      // Grand coral palace wall
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-w * 0.44, -d * 0.35 - h * 0.62, w * 0.88, d * 0.85 + h * 0.62, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Grand scalloped sea-glass palace archway
      ctx.fillStyle = '#246b7d';
      ctx.beginPath();
      ctx.arc(0, d * 0.3, w * 0.18, Math.PI, 0);
      ctx.lineTo(w * 0.18, d * 0.5);
      ctx.lineTo(-w * 0.18, d * 0.5);
      ctx.closePath();
      ctx.fill();
      // Twin coral-stone turrets with fluted shell domes
      for (const side of [-1, 1]) {
        const tx = side * w * 0.42;
        ctx.fillStyle = '#ff9c94';
        ctx.beginPath();
        ctx.roundRect(tx - w * 0.16, -d * 0.3 - h * 0.95, w * 0.32, d * 0.8 + h * 0.95, 16);
        ctx.fill();
        ctx.stroke();
        // Turret shell dome
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.arc(tx, -d * 0.3 - h * 0.95, w * 0.17, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Glowing porthole windows on turrets
        ctx.fillStyle = '#c2fcff';
        ctx.beginPath();
        ctx.arc(tx, -h * 0.65, 9, 0, Math.PI * 2);
        ctx.arc(tx, -h * 0.25, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      // Central coral keep & giant glowing pearl dome
      ctx.fillStyle = '#ffe5d4';
      ctx.beginPath();
      ctx.roundRect(-w * 0.24, -d * 0.35 - h * 1.05, w * 0.48, h * 0.54 + d * 0.25, 16);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#a8f7f0';
      ctx.beginPath();
      ctx.arc(0, -d * 0.35 - h * 1.08, w * 0.24, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Giant golden trident finial crowning the palace!
      const topY = -d * 0.35 - h * 1.32;
      ctx.strokeStyle = '#ffd447';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, topY + 8);
      ctx.lineTo(0, topY - 40);
      ctx.moveTo(-14, topY - 18);
      ctx.lineTo(-14, topY - 36);
      ctx.moveTo(14, topY - 18);
      ctx.lineTo(14, topY - 36);
      ctx.moveTo(-14, topY - 18);
      ctx.lineTo(14, topY - 18);
      ctx.stroke();
      ctx.lineCap = 'butt';
      break;
    }
  }

  ctx.restore();
}

export function renderGame(ctx, state, width, height, pointerGuide = null) {
  ctx.clearRect(0, 0, width, height);

  // Outer backdrop matching the active map
  ctx.fillStyle =
    state.town.mapId === 'stampede'
      ? '#74ba68'
      : state.town.mapId === 'reef'
        ? '#4fa6bd'
        : state.town.mapId === 'playroom'
          ? '#d4b083'
          : state.town.mapId === 'mars'
            ? '#bd6646'
            : state.town.mapId === 'metro'
              ? '#b8c1cc'
              : '#b4d8a5';
  ctx.fillRect(0, 0, width, height);

  const cam = state.camera;
  const shakeX = cam.shake > 0 ? (Math.random() - 0.5) * cam.shake : 0;
  const shakeY = cam.shake > 0 ? (Math.random() - 0.5) * cam.shake : 0;

  ctx.save();
  ctx.translate(width / 2 + shakeX, height / 2 + shakeY);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);

  drawTownGround(ctx, state.town);
  drawHole(ctx, state.hole, state.elapsed);

  // Frustum cull & split into falling (clipped inside hole pit) vs standing props
  const viewHalfW = (width / 2) / cam.zoom + 240;
  const viewHalfH = (height / 2) / cam.zoom + 280;
  const falling = [];
  const standing = [];
  for (const p of state.town.props) {
    if (p.swallowed) continue;
    if (Math.abs(p.x - cam.x) >= viewHalfW || Math.abs(p.y - cam.y) >= viewHalfH) continue;
    if (p.swallowing) falling.push(p);
    else standing.push(p);
  }

  // Draw falling props clipped to the hole opening so they genuinely drop below the rim!
  if (falling.length > 0) {
    falling.sort((a, b) => a.z - b.z); // deeper items behind shallower ones
    ctx.save();
    ctx.beginPath();
    ctx.arc(state.hole.x, state.hole.y, state.hole.radius, 0, Math.PI * 2);
    ctx.clip();
    for (const p of falling) {
      drawProp(ctx, p);
    }
    ctx.restore();
  }

  standing.sort((a, b) => a.y - b.y);
  for (const p of standing) {
    drawProp(ctx, p);
  }

  // Floating score popups
  for (const pop of state.popups) {
    const alpha = Math.max(0, 1 - pop.age / 0.85);
    const rise = pop.age * (45 / cam.zoom);
    ctx.save();
    ctx.globalAlpha = alpha;
    const fontSize = Math.round(Math.max(18, 16 / cam.zoom));
    ctx.font = `900 ${fontSize}px ui-rounded, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = Math.max(3, 4 / cam.zoom);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.strokeText(pop.text, pop.x, pop.y - rise);
    ctx.fillStyle = pop.tier >= 5 ? '#d96b27' : '#2e7d5f';
    ctx.fillText(pop.text, pop.x, pop.y - rise);
    ctx.restore();
  }

  ctx.restore();

  // Subtle touch/mouse drag joystick indicator (screen space)
  if (pointerGuide && pointerGuide.active && state.phase === 'playing') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillStyle = 'rgba(30, 38, 56, 0.14)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pointerGuide.originX, pointerGuide.originY, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(pointerGuide.knobX, pointerGuide.knobY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
