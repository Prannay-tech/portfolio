// Dynamic Neural Network Mesh Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = 0;
canvas.style.pointerEvents = 'none';

document.body.style.position = 'relative';

// Mesh settings
const POINTS_X = 18;
const POINTS_Y = 10;
const POINT_SPACING_X = () => width / (POINTS_X - 1);
const POINT_SPACING_Y = () => height / (POINTS_Y - 1);
const POINT_MOVE_RADIUS = 18;
const LINE_COLOR = 'rgba(0,200,255,0.25)';
const POINT_COLOR = 'rgba(0,200,255,0.85)';
const GLOW_COLOR = 'rgba(0,200,255,0.25)';
const GLOW_BLUR = 12;

let points = [];

function initPoints() {
  points = [];
  for (let y = 0; y < POINTS_Y; y++) {
    for (let x = 0; x < POINTS_X; x++) {
      const px = x * POINT_SPACING_X();
      const py = y * POINT_SPACING_Y();
      points.push({
        baseX: px,
        baseY: py,
        x: px,
        y: py,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.7,
        radius: POINT_MOVE_RADIUS * (0.5 + Math.random()),
        burst: 0
      });
    }
  }
}

function drawMesh() {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // Draw lines
  for (let y = 0; y < POINTS_Y; y++) {
    for (let x = 0; x < POINTS_X; x++) {
      const idx = y * POINTS_X + x;
      const p = points[idx];
      // Horizontal line
      if (x < POINTS_X - 1) {
        const p2 = points[idx + 1];
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      // Vertical line
      if (y < POINTS_Y - 1) {
        const p2 = points[idx + POINTS_X];
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  // Draw points
  for (const p of points) {
    ctx.save();
    ctx.shadowColor = GLOW_COLOR;
    ctx.shadowBlur = GLOW_BLUR;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.2 + p.burst, 0, Math.PI * 2);
    ctx.fillStyle = POINT_COLOR;
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function animateMesh(time) {
  for (const p of points) {
    // Animate in a circular motion
    p.x = p.baseX + Math.cos(time * 0.0005 * p.speed + p.angle) * p.radius;
    p.y = p.baseY + Math.sin(time * 0.0005 * p.speed + p.angle) * p.radius;
    // Animate burst
    if (p.burst > 0) {
      p.burst *= 0.92;
      if (p.burst < 0.1) p.burst = 0;
    }
  }
}

function render(time) {
  animateMesh(time);
  drawMesh();
  requestAnimationFrame(render);
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  initPoints();
}

window.addEventListener('resize', resize);

canvas.addEventListener('mousedown', function(e) {
  // Get mouse position relative to canvas
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
  const my = (e.clientY - rect.top) * (canvas.height / rect.height);
  // Burst effect: points near click get a burst
  for (const p of points) {
    const dx = p.x - mx;
    const dy = p.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      p.burst = 6 * (1 - dist / 120);
    }
  }
});

// Allow pointer events only for clicks (not to block scrolling)
canvas.style.pointerEvents = 'auto';

initPoints();
requestAnimationFrame(render); 