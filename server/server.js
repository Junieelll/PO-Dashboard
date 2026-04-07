// ══════════════════════════════════════════════════════════
//  server.js — PO Dashboard server (Express + PostgreSQL)
// ══════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── Serve static frontend from parent directory ──────────
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes ───────────────────────────────────────────
app.use('/auth',   require('./routes/auth'));
app.use('/sheets', require('./routes/sheets'));
app.use('/data',   require('./routes/data'));
app.use('/email',  require('./routes/email'));
app.use('/share',  require('./routes/share'));

// ── Health ───────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── SPA fallback ─────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/auth') || req.path.startsWith('/sheets') ||
      req.path.startsWith('/data') || req.path.startsWith('/email') ||
      req.path.startsWith('/share')) return;
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n⚡  PO Dashboard running → http://localhost:${PORT}\n`);
  });
}

module.exports = app;
