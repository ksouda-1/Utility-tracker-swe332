/* ── Aware — History ─────────────────────────────────────────────────────────── */

let allReadings = [];

// ── Helpers ───────────────────────────────────────────────────────────────────
function badgeClass(type) {
  return { electricity: 'elec', gas: 'gas', water: 'water' }[type] || '';
}

function fmtDate(raw) {
  return new Date(raw).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Set default date range: last 30 days
function setDefaultDates() {
  const to   = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  document.getElementById('filter-from').value = from.toISOString().split('T')[0];
  document.getElementById('filter-to').value   = to.toISOString().split('T')[0];
}

// ── Fetch readings ────────────────────────────────────────────────────────────
async function fetchReadings(type, from, to) {
  const tbody     = document.getElementById('history-tbody');
  const countEl   = document.getElementById('result-count');
  const summaryEl = document.getElementById('history-summary');

  tbody.innerHTML = '<tr><td colspan="4" class="state-msg">Loading…</td></tr>';
  summaryEl.style.display = 'none';

  try {
    let url = '/api/readings?';
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (from) params.append('from', from);
    if (to)   params.append('to', to);
    url += params.toString();

    const data = await fetch(url).then(r => r.json());
    allReadings = data;

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="state-msg">No readings found for this filter.</td></tr>';
      countEl.textContent = '0 records';
      return;
    }

    // Render table
    tbody.innerHTML = data.map(row => `
      <tr>
        <td>${fmtDate(row.date)}</td>
        <td><span class="badge ${badgeClass(row.utility_type)}">${row.utility_type}</span></td>
        <td><strong>${row.value}</strong></td>
        <td>${row.unit}</td>
      </tr>
    `).join('');

    countEl.textContent = `${data.length} record${data.length !== 1 ? 's' : ''}`;

    // Summary row
    renderSummary(data);

  } catch {
    tbody.innerHTML = '<tr><td colspan="4" class="state-msg">Could not load readings. Is the server running?</td></tr>';
  }
}

// ── Summary cards ─────────────────────────────────────────────────────────────
function renderSummary(data) {
  const summaryEl = document.getElementById('history-summary');

  const totals = { electricity: 0, gas: 0, water: 0 };
  data.forEach(row => {
    if (totals[row.utility_type] !== undefined) {
      totals[row.utility_type] += parseFloat(row.value);
    }
  });

  document.getElementById('hist-elec').innerHTML =
    `${totals.electricity.toFixed(2)}<span> kWh</span>`;
  document.getElementById('hist-gas').innerHTML =
    `${totals.gas.toFixed(2)}<span> m³</span>`;
  document.getElementById('hist-water').innerHTML =
    `${totals.water.toFixed(2)}<span> L</span>`;
  document.getElementById('hist-count').textContent = data.length;

  summaryEl.style.display = 'grid';
}

// ── Event listeners ───────────────────────────────────────────────────────────
document.getElementById('btn-apply').addEventListener('click', () => {
  const type = document.getElementById('filter-type').value;
  const from = document.getElementById('filter-from').value;
  const to   = document.getElementById('filter-to').value;
  fetchReadings(type, from, to);
});

document.getElementById('btn-reset').addEventListener('click', () => {
  document.getElementById('filter-type').value = 'all';
  setDefaultDates();
  loadDefault();
});

// ── Init ──────────────────────────────────────────────────────────────────────
function loadDefault() {
  const from = document.getElementById('filter-from').value;
  const to   = document.getElementById('filter-to').value;
  fetchReadings('all', from, to);
}

setDefaultDates();
loadDefault();
