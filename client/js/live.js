/* ── Aware — Live Monitor ────────────────────────────────────────────────────── */

const RATES = { electricity: 0.28, gas: 0.07, water: 0.003 };

// ── Meter Configuration ───────────────────────────────────────────────────────
const meters = {
  electricity: {
    id      : 'elec',
    base    : 1.8,    // kWh base value
    spread  : 0.4,    // max random fluctuation
    min     : 0.5,
    max     : 4.0,
    unit    : 'kWh',
    color   : '#3b82f6',
    normalMax: 3.0,
    value   : 1.8,
    history : [],
    today   : 0,
    chart   : null,
  },
  gas: {
    id      : 'gas',
    base    : 0.6,
    spread  : 0.15,
    min     : 0.1,
    max     : 2.0,
    unit    : 'm³/h',
    color   : '#f59e0b',
    normalMax: 1.4,
    value   : 0.6,
    history : [],
    today   : 0,
    chart   : null,
  },
  water: {
    id      : 'water',
    base    : 8.0,
    spread  : 2.0,
    min     : 2.0,
    max     : 20.0,
    unit    : 'L/min',
    color   : '#06b6d4',
    normalMax: 15.0,
    value   : 8.0,
    history : [],
    today   : 0,
    chart   : null,
  },
};

const SPARK_POINTS = 30;

// ── Build sparkline charts ────────────────────────────────────────────────────
function initSparklines() {
  Object.values(meters).forEach(m => {
    const ctx = document.getElementById(`${m.id}-spark`);
    if (!ctx) return;

    m.history = Array(SPARK_POINTS).fill(m.base);
    m.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels  : Array(SPARK_POINTS).fill(''),
        datasets: [{
          data           : [...m.history],
          borderColor    : m.color,
          backgroundColor: m.color + '18',
          borderWidth    : 2,
          pointRadius    : 0,
          fill           : true,
          tension        : 0.4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation : { duration: 400 },
        plugins   : { legend: { display: false }, tooltip: { enabled: false } },
        scales    : {
          x: { display: false },
          y: { display: false, min: m.min, max: m.max },
        },
      },
    });
  });
}

// ── Tick — update one meter ───────────────────────────────────────────────────
function updateMeter(m) {
  const delta = (Math.random() - 0.48) * m.spread;
  m.value = parseFloat(
    Math.max(m.min, Math.min(m.max, m.value + delta)).toFixed(2)
  );

  // Running daily total (each tick = 1.5s ≈ 1/2400 of an hour for rate-based calcs)
  m.today = parseFloat((m.today + m.value * (1.5 / 3600)).toFixed(4));

  // Update sparkline history
  m.history.push(m.value);
  if (m.history.length > SPARK_POINTS) m.history.shift();

  // DOM updates
  document.getElementById(`${m.id}-value`).textContent = m.value.toFixed(2);
  document.getElementById(`${m.id}-today`).textContent = m.today.toFixed(2);

  // Average of history
  const avg = (m.history.reduce((a, b) => a + b, 0) / m.history.length).toFixed(2);
  document.getElementById(`${m.id}-avg`).textContent = avg;

  // Status badge
  const statusEl = document.getElementById(`${m.id}-status`);
  if (m.value > m.normalMax) {
    statusEl.textContent = 'High';
    statusEl.className = 'meter-status high';
  } else if (m.value < m.min * 1.5) {
    statusEl.textContent = 'Low';
    statusEl.className = 'meter-status low';
  } else {
    statusEl.textContent = 'Normal';
    statusEl.className = 'meter-status normal';
  }

  // Update sparkline chart data
  if (m.chart) {
    m.chart.data.datasets[0].data = [...m.history];
    m.chart.update('none');
  }
}

// ── Update estimated cost ─────────────────────────────────────────────────────
function updateCost() {
  const cost = (
    meters.electricity.today * RATES.electricity +
    meters.gas.today         * RATES.gas +
    meters.water.today       * RATES.water
  ).toFixed(4);
  document.getElementById('cost-today').textContent = `£${cost}`;
}

// ── Timestamp ─────────────────────────────────────────────────────────────────
function updateTimestamp() {
  document.getElementById('last-updated').textContent =
    'Last updated: ' + new Date().toLocaleTimeString('en-GB');
}

// ── Main loop ─────────────────────────────────────────────────────────────────
function tick() {
  Object.values(meters).forEach(updateMeter);
  updateCost();
  updateTimestamp();
}

// ── Init ──────────────────────────────────────────────────────────────────────
initSparklines();
tick(); // immediate first tick
setInterval(tick, 1500);
