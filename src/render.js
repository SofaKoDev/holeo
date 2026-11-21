function drawTownGround(ctx, town) {
  const half = town.halfSize;
  const isMetro = town.mapId === 'metro';
  const isMars = town.mapId === 'mars';

  // Base terrain: sunlit grass for Cozy Town, urban concrete for Metro City, red desert for Mars
  ctx.fillStyle = isMars ? '#d47a57' : isMetro ? '#cfd5dc' : '#c5e2b5';
  ctx.fillRect(-half, -half, half * 2, half * 2);

  // Outer border
  ctx.strokeStyle = isMars ? '#a8573b' : isMetro ? '#8f9aa8' : '#9ec78e';
  ctx.lineWidth = 28;
  ctx.strokeRect(-half, -half, half * 2, half * 2);

  if (isMars) {
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

  // Paved sidewalks & avenues / Martian hover-highways
  const roadW = isMetro || isMars ? 116 : 104;
  const sideW = isMetro || isMars ? 148 : 132;
  ctx.fillStyle = isMars ? '#8c6252' : isMetro ? '#e3e6ea' : '#eee3ce';
  for (const r of town.roads) {
    ctx.fillRect(-half, r - sideW / 2, half * 2, sideW);
    ctx.fillRect(r - sideW / 2, -half, sideW, half * 2);
  }
  ctx.fillStyle = isMars ? '#364354' : isMetro ? '#4a5566' : '#626f82';
  for (const r of town.roads) {
    ctx.fillRect(-half, r - roadW / 2, half * 2, roadW);
    ctx.fillRect(r - roadW / 2, -half, roadW, half * 2);
  }

  // Outer bike lanes (Metro) or glowing cyan hover-scooter lanes (Mars)
  if (isMetro || isMars) {
    ctx.fillStyle = isMars ? 'rgba(94, 240, 255, 0.22)' : 'rgba(72, 180, 118, 0.36)';
    for (const r of town.roads) {
      ctx.fillRect(-half, r - 50, half * 2, 14);
      ctx.fillRect(-half, r + 36, half * 2, 14);
      ctx.fillRect(r - 50, -half, 14, half * 2);
      ctx.fillRect(r + 36, -half, 14, half * 2);
    }
  }

  // Center lane lines
  ctx.save();
  if (isMars) {
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
  const roadColor = isMars ? '#364354' : isMetro ? '#4a5566' : '#626f82';
  ctx.fillStyle = roadColor;
  for (const rx of town.roads) {
    for (const ry of town.roads) {
      ctx.fillRect(rx - roadW / 2, ry - roadW / 2, roadW, roadW);
      ctx.fillStyle = isMars ? 'rgba(94, 240, 255, 0.6)' : 'rgba(255, 252, 242, 0.75)';
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
      p.shape !== 'bench' &&
      p.shape !== 'person' &&
      p.shape !== 'alien'
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
      const moving = p.wander && (Math.abs(p.vx) > 2 || Math.abs(p.vy) > 2);
      const bob = moving && !p.swallowing ? Math.abs(Math.sin(phase)) * 3.2 : 0;
      const stride = moving && !p.swallowing ? Math.sin(phase) * 3.8 : 0;

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
      // Arms swinging slightly
      ctx.fillStyle = '#ffd9ba';
      ctx.beginPath();
      ctx.arc(-7.2, -1 - bob - stride * 0.4, 2.3, 0, Math.PI * 2);
      ctx.arc(7.2, -1 - bob + stride * 0.4, 2.3, 0, Math.PI * 2);
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
  }

  ctx.restore();
}

export function renderGame(ctx, state, width, height, pointerGuide = null) {
  ctx.clearRect(0, 0, width, height);

  // Outer backdrop matching the active map
  ctx.fillStyle = state.town.mapId === 'mars' ? '#bd6646' : state.town.mapId === 'metro' ? '#b8c1cc' : '#b4d8a5';
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
