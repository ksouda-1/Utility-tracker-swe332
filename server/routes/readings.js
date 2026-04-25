const express = require('express');
const mysql   = require('mysql2/promise');
const router  = express.Router();

// ── Database connection pool ──────────────────────────────────────────────────
const pool = mysql.createPool({
  host    : process.env.DB_HOST     || 'localhost',
  user    : process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'aware_db',
  waitForConnections: true,
  connectionLimit   : 10,
});

// ── GET /api/readings ─────────────────────────────────────────────────────────
// Query params: type (electricity|gas|water), days (number), limit (number),
//               from (YYYY-MM-DD), to (YYYY-MM-DD)
router.get('/', async (req, res) => {
  try {
    const { type, days, limit, from, to } = req.query;
    let query  = 'SELECT * FROM readings WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      query += ' AND utility_type = ?';
      params.push(type);
    }
    if (days) {
      query += ' AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)';
      params.push(parseInt(days));
    }
    if (from) {
      query += ' AND date >= ?';
      params.push(from);
    }
    if (to) {
      query += ' AND date <= ?';
      params.push(to);
    }

    query += ' ORDER BY date DESC, id DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ── GET /api/readings/summary ─────────────────────────────────────────────────
// Returns current-month totals per utility type
router.get('/summary', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        utility_type,
        ROUND(SUM(value), 2)  AS total,
        ROUND(AVG(value), 2)  AS daily_avg,
        COUNT(*)              AS days_recorded
      FROM readings
      WHERE MONTH(date) = MONTH(CURDATE())
        AND YEAR(date)  = YEAR(CURDATE())
      GROUP BY utility_type
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ── GET /api/readings/monthly ─────────────────────────────────────────────────
// Returns monthly totals per utility for the last 6 months (for bar chart)
router.get('/monthly', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        DATE_FORMAT(date, '%Y-%m') AS month,
        utility_type,
        ROUND(SUM(value), 2)       AS total
      FROM readings
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month, utility_type
      ORDER BY month ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ── GET /api/readings/daily ───────────────────────────────────────────────────
// Returns daily totals per utility for the last N days (for line chart)
router.get('/daily', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const [rows] = await pool.execute(`
      SELECT
        date,
        utility_type,
        ROUND(SUM(value), 2) AS total
      FROM readings
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY date, utility_type
      ORDER BY date ASC
    `, [days]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
