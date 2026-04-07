// ══════════════════════════════════════════════════════════
//  app.js — Core Express Application
// ══════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── Serve static frontend from parent directory ──────────
// (This is mostly for local dev. Netlify handles static files natively)
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes (Must be mounted identically for local and lambda) ─
const apiRouter = express.Router();
apiRouter.use('/auth',   require('./routes/auth'));
apiRouter.use('/sheets', require('./routes/sheets'));
apiRouter.use('/data',   require('./routes/data'));
apiRouter.use('/email',  require('./routes/email'));
apiRouter.use('/share',  require('./routes/share'));

// Mount both at root AND at /.netlify/functions/api so routing matches natively
app.use('/', apiRouter);
app.use('/.netlify/functions/api', apiRouter);

// ── Health ───────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── SPA fallback ─────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/auth') || req.path.startsWith('/sheets') ||
      req.path.startsWith('/data') || req.path.startsWith('/email') ||
      req.path.startsWith('/share')) return;
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;
