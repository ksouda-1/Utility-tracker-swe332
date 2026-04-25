const express = require('express');
const path    = require('path');
const cors    = require('cors');

const readingsRouter = require('./routes/readings');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static front-end files
app.use(express.static(path.join(__dirname, '../client')));

// API routes
app.use('/api/readings', readingsRouter);

// Catch-all: serve the dashboard for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Aware is running at http://localhost:${PORT}\n`);
});
