// Flowy Lines Animated Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const LINE_COUNT = 6;
const POINTS_PER_LINE = 32;
const LINE_COLORS = [
  'rgba(0,200,255,0.7)',
  'rgba(0,180,255,0.5)',
  'rgba(0,160,255,0.4)'
];
const GLOW_COLOR = 'rgba(0,200,255,0.25)';
const GLOW_BLUR = 16;

let lines = [];

function initLines() {
  lines = [];
  for (let i = 0; i < LINE_COUNT; i++) {
    let points = [];
    let yBase = (height / (LINE_COUNT + 1)) * (i + 1);
    let amplitude = 40 + Math.random() * 40;
    let speed = 0.5 + Math.random() * 0.7;
    let phase = Math.random() * Math.PI * 2;
    for (let j = 0; j < POINTS_PER_LINE; j++) {
      let x = (width / (POINTS_PER_LINE - 1)) * j;
      points.push({ x, y: yBase, baseY: yBase, amplitude, speed, phase, offset: Math.random() * Math.PI * 2 });
    }
    lines.push({ points, color: LINE_COLORS[i % LINE_COLORS.length], amplitude, speed, phase });
  }
}

function drawLines(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const line of lines) {
    ctx.save();
    ctx.shadowColor = GLOW_COLOR;
    ctx.shadowBlur = GLOW_BLUR;
    ctx.beginPath();
    for (let i = 0; i < line.points.length; i++) {
      const p = line.points[i];
      let t = time * 0.0005 * line.speed + p.offset + line.phase;
      let y = p.baseY + Math.sin(t + i * 0.25) * line.amplitude;
      if (i === 0) {
        ctx.moveTo(p.x, y);
      } else {
        ctx.lineTo(p.x, y);
      }
    }
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function animateLines(time) {
  drawLines(time);
  requestAnimationFrame(animateLines);
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  initLines();
}

window.addEventListener('resize', resize);

canvas.addEventListener('mousedown', function(e) {
  // Ripple effect: temporarily increase amplitude of all lines near click
  for (const line of lines) {
    line.amplitude += 18;
    setTimeout(() => { line.amplitude -= 18; }, 400);
  }
});

canvas.style.pointerEvents = 'auto';

initLines();
requestAnimationFrame(animateLines); 