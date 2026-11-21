function drawTownGround(ctx, town) {
  const half = town.halfSize;

  // Cozy sunlit grass base
  ctx.fillStyle = '#c5e2b5';
  ctx.fillRect(-half, -half, half * 2, half * 2);

  // Outer town border meadow
  ctx.strokeStyle = '#9ec78e';
  ctx.lineWidth = 28;
  ctx.strokeRect(-half, -half, half * 2, half * 2);

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

  // Paved sidewalks & avenues
  const roadW = 104;
  const sideW = 132;
  ctx.fillStyle = '#eee3ce';
  for (const r of town.roads) {
    ctx.fillRect(-half, r - sideW / 2, half * 2, sideW);
    ctx.fillRect(r - sideW / 2, -half, sideW, half * 2);
  }
  ctx.fillStyle = '#626f82';
  for (const r of town.roads) {
    ctx.fillRect(-half, r - roadW / 2, half * 2, roadW);
    ctx.fillRect(r - roadW / 2, -half, roadW, half * 2);
  }

  // Dashed cream lane lines
  ctx.save();
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
  ctx.restore();

  // Intersections & crosswalk stripes
  ctx.fillStyle = '#626f82';
  for (const rx of town.roads) {
    for (const ry of town.roads) {
      ctx.fillRect(rx - roadW / 2, ry - roadW / 2, roadW, roadW);
      ctx.fillStyle = 'rgba(255, 252, 242, 0.75)';
      for (let s = -34; s <= 34; s += 17) {
        ctx.fillRect(rx + s - 4, ry - roadW / 2 - 14, 8, 12);
        ctx.fillRect(rx + s - 4, ry + roadW / 2 + 2, 8, 12);
        ctx.fillRect(rx - roadW / 2 - 14, ry + s - 4, 12, 8);
        ctx.fillRect(rx + roadW / 2 + 2, ry + s - 4, 12, 8);
      }
      ctx.fillStyle = '#626f82';
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
  const s = p.swallowing ? Math.max(0.05, 1 - p.swallowProgress * 0.92) : 1;
  const sinkY = p.swallowing ? p.swallowProgress * 18 : 0;
  const wobble = p.bump > 0 ? Math.sin(p.bump * 18) * 0.14 : 0;
  const r = p.radius;
  const h = p.height * 0.55;

  ctx.save();
  ctx.translate(p.x, p.y + sinkY);
  ctx.scale(s, s);
  if (p.swallowing) ctx.globalAlpha = Math.max(0, 1 - p.swallowProgress * 0.85);
  if (wobble) ctx.rotate(wobble);

  // Soft cast ground shadow
  if (!p.swallowing) {
    ctx.fillStyle = 'rgba(44, 58, 48, 0.22)';
    ctx.beginPath();
    ctx.ellipse(r * 0.14, r * 0.22, r * 1.04, r * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  switch (p.shape) {
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
  }

  ctx.restore();
}

export function renderGame(ctx, state, width, height, pointerGuide = null) {
  ctx.clearRect(0, 0, width, height);

  // Outer sky/meadow backdrop
  ctx.fillStyle = '#b4d8a5';
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

  // Frustum cull & sort props by y so 2.5D overlap feels right
  const viewHalfW = (width / 2) / cam.zoom + 240;
  const viewHalfH = (height / 2) / cam.zoom + 280;
  const visible = state.town.props
    .filter(
      (p) =>
        !p.swallowed &&
        Math.abs(p.x - cam.x) < viewHalfW &&
        Math.abs(p.y - cam.y) < viewHalfH,
    )
    .sort((a, b) => a.y - b.y);

  for (const p of visible) {
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
