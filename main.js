
//  AWARE — main.js
// ============================================================

// ── Custom cursor ───────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  ring.style.left   = e.clientX + 'px';
  ring.style.top    = e.clientY + 'px';
});

document.querySelectorAll('button, a, .feature-card, .step').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
    ring.style.width    = '50px';
    ring.style.height   = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
    ring.style.width    = '36px';
    ring.style.height   = '36px';
  });
});

// ── Nav scroll effect ───────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Scroll reveal ───────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Count-up animation ──────────────────────────────────────
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;

    const el  = e.target;
    const end = +el.dataset.target;
    const dur = 1800;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const pct  = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      el.childNodes[0].textContent = Math.floor(ease * end).toLocaleString();
      if (pct < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => countObs.observe(el));

// ── Live meters simulation ──────────────────────────────────
function rnd(base, spread) {
  return (base + (Math.random() * spread * 2 - spread)).toFixed(1);
}

function updateMeters() {
  const e = +rnd(24, 8);
  const g = +rnd(9, 4);
  const w = +rnd(145, 30);

  document.getElementById('elec-val').innerHTML  = e + '<span class="meter-unit">kWh</span>';
  document.getElementById('gas-val').innerHTML   = g + '<span class="meter-unit">m³</span>';
  document.getElementById('water-val').innerHTML = Math.round(w) + '<span class="meter-unit">L</span>';

  document.getElementById('elec-bar').style.width  = Math.min(100, (e / 60)  * 100) + '%';
  document.getElementById('gas-bar').style.width   = Math.min(100, (g / 20)  * 100) + '%';
  document.getElementById('water-bar').style.width = Math.min(100, (w / 250) * 100) + '%';
}

setInterval(updateMeters, 2200);

// ── Sparkline chart ─────────────────────────────────────────
const canvas = document.getElementById('sparkline');
const ctx    = canvas.getContext('2d');
const points = Array.from({ length: 24 }, () => 15 + Math.random() * 30);

function drawSparkline() {
  const W = canvas.offsetWidth;
  const H = 80;
  canvas.width  = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  const max   = Math.max(...points);
  const min   = Math.min(...points);
  const pad   = 8;
  const xStep = (W - pad * 2) / (points.length - 1);

  const toX = i => pad + i * xStep;
  const toY = v => pad + (1 - (v - min) / (max - min)) * (H - pad * 2);

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(0,229,176,0.2)');
  grad.addColorStop(1, 'rgba(0,229,176,0)');

  ctx.beginPath();
  ctx.moveTo(toX(0), toY(points[0]));
  for (let i = 1; i < points.length; i++) {
    const cx = (toX(i - 1) + toX(i)) / 2;
    ctx.bezierCurveTo(cx, toY(points[i - 1]), cx, toY(points[i]), toX(i), toY(points[i]));
  }
  ctx.lineTo(toX(points.length - 1), H);
  ctx.lineTo(toX(0), H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(points[0]));
  for (let i = 1; i < points.length; i++) {
    const cx = (toX(i - 1) + toX(i)) / 2;
    ctx.bezierCurveTo(cx, toY(points[i - 1]), cx, toY(points[i]), toX(i), toY(points[i]));
  }
  ctx.strokeStyle = 'rgba(0,229,176,0.7)';
  ctx.lineWidth   = 1.5;
  ctx.stroke();
}

drawSparkline();

// Roll sparkline data every interval
setInterval(() => {
  points.shift();
  points.push(15 + Math.random() * 30);
  drawSparkline();
}, 2200);

alert("professional software engineer login");
alert("i dont cqre qbout your review")
