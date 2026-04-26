/* ── Aware — Dashboard ───────────────────────────────────────────────────────── */

const RATES = { electricity: 0.28, gas: 0.07, water: 0.003 };
const COLORS = {
  electricity: '#3b82f6',
  gas        : '#f59e0b',
  water      : '#06b6d4',
};

// Show today's date in the header
document.getElementById('current-date').textContent =
  new Date().toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

// ── Helper ────────────────────────────────────────────────────────────────────
function badgeClass(type) {
  return { electricity: 'elec', gas: 'gas', water: 'water' }[type] || '';
}

function fmtDate(raw) {
  return new Date(raw).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

// ── Summary Cards ─────────────────────────────────────────────────────────────
async function loadSummary() {
  const container = document.getElementById('summary-cards');
  try {
    const data = await fetch('/api/readings/summary').then(r => r.json());

    const map = {};
    data.forEach(row => { map[row.utility_type] = row; });

    const electricityTotal = map.electricity?.total ?? 0;
    const gasTotal         = map.gas?.total         ?? 0;
    const waterTotal       = map.water?.total        ?? 0;
    const costTotal = (
      electricityTotal * RATES.electricity +
      gasTotal         * RATES.gas +
      waterTotal       * RATES.water
    ).toFixed(2);

    container.innerHTML = `
      <div class="card">
        <div class="card-icon elec">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="card-label">Electricity — This Month</div>
        <div class="card-value">${electricityTotal}<span> kWh</span></div>
        <div class="card-sub">Avg ${map.electricity?.daily_avg ?? '—'} kWh/day</div>
      </div>
      <div class="card">
        <div class="card-icon gas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2c0 6-8 8-8 14a8 8 0 0 0 16 0c0-6-8-8-8-14z"/>
          </svg>
        </div>
        <div class="card-label">Gas — This Month</div>
        <div class="card-value">${gasTotal}<span> m³</span></div>
        <div class="card-sub">Avg ${map.gas?.daily_avg ?? '—'} m³/day</div>
      </div>
      <div class="card">
        <div class="card-icon water">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        </div>
        <div class="card-label">Water — This Month</div>
        <div class="card-value">${waterTotal}<span> L</span></div>
        <div class="card-sub">Avg ${map.water?.daily_avg ?? '—'} L/day</div>
      </div>
      <div class="card">
        <div class="card-icon cost">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="card-label">Est. Cost — This Month</div>
        <div class="card-value">£${costTotal}</div>
        <div class="card-sub">Electricity + Gas + Water</div>
      </div>
    `;
  } catch {
    container.innerHTML = '<div class="state-msg">Could not load summary.</div>';
  }
}

// ── Monthly Bar Chart ─────────────────────────────────────────────────────────
async function loadMonthlyChart() {
  try {
    const data = await fetch('/api/readings/monthly').then(r => r.json());

    // Build sorted unique months
    const months = [...new Set(data.map(r => r.month))].sort();

    const datasets = ['electricity', 'gas', 'water'].map(type => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      data : months.map(m => {
        const row = data.find(r => r.month === m && r.utility_type === type);
        return row ? parseFloat(row.total) : 0;
      }),
      backgroundColor: COLORS[type] + 'cc',
      borderRadius: 4,
      borderSkipped: false,
    }));

    new Chart(document.getElementById('chart-monthly'), {
      type: 'bar',
      data: { labels: months.map(m => {
        const [y, mo] = m.split('-');
        return new Date(y, mo - 1).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
      }), datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
        },
      },
    });
  } catch { /* silent */ }
}

// ── Daily Line Chart ──────────────────────────────────────────────────────────
async function loadDailyChart() {
  try {
    const data = await fetch('/api/readings/daily?days=30').then(r => r.json());

    const dates = [...new Set(data.map(r => r.date.split('T')[0]))].sort();

    const datasets = ['electricity', 'gas', 'water'].map(type => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      data : dates.map(d => {
        const row = data.find(r => r.date.split('T')[0] === d && r.utility_type === type);
        return row ? parseFloat(row.total) : null;
      }),
      borderColor    : COLORS[type],
      backgroundColor: COLORS[type] + '18',
      borderWidth: 2,
      pointRadius: 2,
      fill: true,
      tension: 0.4,
      spanGaps: true,
    }));

    new Chart(document.getElementById('chart-daily'), {
      type: 'line',
      data: { labels: dates.map(d => {
        const dt = new Date(d);
        return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      }), datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, maxTicksLimit: 8 } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
        },
      },
    });
  } catch { /* silent */ }
}

// ── Recent Readings Table ─────────────────────────────────────────────────────
async function loadRecentReadings() {
  const tbody = document.getElementById('recent-tbody');
  try {
    const data = await fetch('/api/readings?limit=12').then(r => r.json());

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="state-msg">No readings found.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(row => `
      <tr>
        <td>${fmtDate(row.date)}</td>
        <td><span class="badge ${badgeClass(row.utility_type)}">${row.utility_type}</span></td>
        <td><strong>${row.value}</strong></td>
        <td>${row.unit}</td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="4" class="state-msg">Could not load readings.</td></tr>';
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadSummary();
loadMonthlyChart();
loadDailyChart();
loadRecentReadings();
