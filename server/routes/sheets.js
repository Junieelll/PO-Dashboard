// ══════════════════════════════════════════════════════════
//  routes/sheets.js — Sheet CRUD (PostgreSQL)
// ══════════════════════════════════════════════════════════

const router = require('express').Router();
const db     = require('../db/connection');
const authMw = require('../middleware/auth');
const { DEFAULT_COLUMNS } = require('./auth');

router.use(authMw);

// GET /sheets
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, position FROM sheets WHERE user_id = $1 ORDER BY position ASC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /sheets
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Sheet name is required' });

  try {
    const { rows: [{ maxpos }] } = await db.query(
      'SELECT COALESCE(MAX(position), -1) AS maxpos FROM sheets WHERE user_id = $1',
      [req.user.id]
    );
    const pos = maxpos + 1;

    const { rows } = await db.query(
      'INSERT INTO sheets (user_id, name, position) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, name.trim(), pos]
    );
    const sheetId = rows[0].id;

    // Seed default threshold & email settings (no column seeding needed)
    await db.query(
      'INSERT INTO thresholds (sheet_id, po_number, danger_val, warn_val) VALUES ($1, $2, $3, $4)',
      [sheetId, '*', 0, 1000]
    );
    await db.query(
      'INSERT INTO email_settings (sheet_id, sender_name, subject) VALUES ($1, $2, $3)',
      [sheetId, 'PO Tracker System', '[ALERT] PO Balance Warning']
    );

    res.status(201).json({ id: sheetId, name: name.trim(), position: pos });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /sheets/:id
router.patch('/:id', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    await db.query(
      'UPDATE sheets SET name = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3',
      [name.trim(), req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /sheets/:id
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id FROM sheets WHERE user_id = $1', [req.user.id]
    );
    if (rows.length <= 1)
      return res.status(400).json({ error: 'Cannot delete your only sheet' });

    await db.query(
      'DELETE FROM sheets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /sheets/:id/full
router.get('/:id/full', async (req, res) => {
  const sheetId = req.params.id;
  try {
    const { rows: owned } = await db.query(
      'SELECT id FROM sheets WHERE id = $1 AND user_id = $2',
      [sheetId, req.user.id]
    );
    if (!owned.length) return res.status(403).json({ error: 'Access denied' });

    const { rows: entries } = await db.query(
      `SELECT po_number, hauling_date, quantity, running_balance, invoice_no, remarks
       FROM po_entries WHERE sheet_id = $1 ORDER BY position ASC`,
      [sheetId]
    );

    const { rows: purchaseOrders } = await db.query(
      `SELECT po_number, starting_qty, waste_description FROM purchase_orders WHERE sheet_id = $1`,
      [sheetId]
    );

    const { rows: thresholdRows } = await db.query(
      'SELECT po_number, danger_val AS danger, warn_val AS warn FROM thresholds WHERE sheet_id = $1',
      [sheetId]
    );

    const thresholdDict = thresholdRows.reduce((acc, t) => {
      acc[t.po_number] = { danger: t.danger, warn: t.warn };
      return acc;
    }, {});
    
    // Ensure default '*' exists
    if (!thresholdDict['*']) {
      thresholdDict['*'] = { danger: 0, warn: 1000 };
    }

    const { rows: [emailSettings] } = await db.query(
      'SELECT recipient AS "to", sender_name AS name, subject AS subj FROM email_settings WHERE sheet_id = $1',
      [sheetId]
    );

    const { rows: alertLog } = await db.query(
      'SELECT sent_at AS time, recipient AS "to", item_count AS count, levels, status, error_msg AS error FROM alert_log WHERE sheet_id = $1 ORDER BY sent_at DESC LIMIT 50',
      [sheetId]
    );

    res.json({
      columns: DEFAULT_COLUMNS,
      cellData: entries,
      purchaseOrders: purchaseOrders,
      thresholds: thresholdDict,
      emailSettings: emailSettings || { to: '', name: 'PO Tracker System', subj: '[ALERT] PO Balance Warning' },
      alertLog: alertLog.map(l => ({
        ...l,
        levels: l.levels ? l.levels.split(',') : [],
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;