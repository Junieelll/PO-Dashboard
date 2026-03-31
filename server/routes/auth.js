// ══════════════════════════════════════════════════════════
//  routes/auth.js — Register, Login, Me (PostgreSQL)
// ══════════════════════════════════════════════════════════

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../db/connection');
const authMw = require('../middleware/auth');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Hardcoded column definitions — every sheet uses the same columns
const DEFAULT_COLUMNS = [
  { id: 'po_number',        label: 'P.O. No.',        type: 'text',   width: 160, visible: true },
  { id: 'hauling_date',     label: 'Hauling Date',    type: 'date',   width: 130, visible: true },
  { id: 'quantity',         label: 'Quantity',        type: 'number', width: 110, visible: true },
  { id: 'running_balance',  label: 'Running Balance', type: 'number', width: 150, visible: true },
  { id: 'invoice_no',       label: 'Invoice No.',     type: 'text',   width: 120, visible: true },
];

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'username, email, and password are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username.trim(), email.trim().toLowerCase(), hash]
    );
    const userId = rows[0].id;

    // Default sheet
    const { rows: sheetRows } = await db.query(
      'INSERT INTO sheets (user_id, name, position) VALUES ($1, $2, 0) RETURNING id',
      [userId, 'Sheet1']
    );
    const sheetId = sheetRows[0].id;

    await db.query(
      'INSERT INTO thresholds (sheet_id, po_number, danger_val, warn_val) VALUES ($1, $2, $3, $4)',
      [sheetId, '*', 0, 1000]
    );
    await db.query(
      'INSERT INTO email_settings (sheet_id, sender_name, subject) VALUES ($1, $2, $3)',
      [sheetId, 'PO Tracker System', '[ALERT] PO Balance Warning']
    );

    const token = signToken({ id: userId, username, email });
    res.status(201).json({ token, user: { id: userId, username, email } });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Username or email already taken' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'username and password are required' });

  try {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username.trim()]
    );
    if (!rows.length)
      return res.status(401).json({ error: 'Invalid username or password' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Invalid username or password' });

    const token = signToken({ id: user.id, username: user.username, email: user.email });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /auth/me
router.get('/me', authMw, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
module.exports.DEFAULT_COLUMNS = DEFAULT_COLUMNS;