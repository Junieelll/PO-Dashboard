// ══════════════════════════════════════════════════════════
//  routes/data.js — PO Entries, Threshold, Email (PostgreSQL)
// ══════════════════════════════════════════════════════════

const router = require('express').Router();
const db     = require('../db/connection');
const authMw = require('../middleware/auth');

router.use(authMw);

async function ownsSheet(userId, sheetId) {
  const { rows } = await db.query(
    'SELECT id FROM sheets WHERE id = $1 AND user_id = $2', [sheetId, userId]
  );
  return rows.length > 0;
}

// PUT /data/:sheetId/columns — no-op (columns are fixed)
router.put('/:sheetId/columns', async (req, res) => {
  if (!await ownsSheet(req.user.id, req.params.sheetId))
    return res.status(403).json({ error: 'Access denied' });
  res.json({ success: true });
});

// PUT /data/:sheetId/rows — save all PO entries (batch)
router.put('/:sheetId/rows', async (req, res) => {
  const { sheetId } = req.params;
  const { cellData } = req.body;
  if (!Array.isArray(cellData)) return res.status(400).json({ error: 'cellData must be an array' });
  if (!await ownsSheet(req.user.id, sheetId)) return res.status(403).json({ error: 'Access denied' });

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM po_entries WHERE sheet_id = $1', [sheetId]);

    if (cellData.length > 0) {
      const cols = ['sheet_id', 'position', 'po_number', 'hauling_date', 'quantity', 'running_balance', 'invoice_no', 'starting_qty'];
      const values = [];
      const params = [];
      let pi = 1;

      for (let i = 0; i < cellData.length; i++) {
        const r = cellData[i];
        values.push(`($${pi++}, $${pi++}, $${pi++}, $${pi++}, $${pi++}, $${pi++}, $${pi++}, $${pi++})`);
        params.push(
          sheetId, i,
          r.po_number       ?? '',
          r.hauling_date    ?? '',
          r.quantity        ?? '',
          r.running_balance ?? '',
          r.invoice_no      ?? '',
          r.starting_qty    ?? ''
        );
      }

      await client.query(
        `INSERT INTO po_entries (${cols.join(', ')}) VALUES ${values.join(', ')}`,
        params
      );
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

// PUT /data/:sheetId/threshold
router.put('/:sheetId/threshold', async (req, res) => {
  const { sheetId } = req.params;
  const { po_number, danger, warn } = req.body;
  const po = po_number || '*'; // fallback to default
  if (!await ownsSheet(req.user.id, sheetId)) return res.status(403).json({ error: 'Access denied' });
  try {
    await db.query(
      `INSERT INTO thresholds (sheet_id, po_number, danger_val, warn_val) VALUES ($1, $2, $3, $4)
       ON CONFLICT (sheet_id, po_number) DO UPDATE SET danger_val = $3, warn_val = $4`,
      [sheetId, po, danger, warn]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /data/:sheetId/email
router.put('/:sheetId/email', async (req, res) => {
  const { sheetId } = req.params;
  const { to, name, subj } = req.body;
  if (!await ownsSheet(req.user.id, sheetId)) return res.status(403).json({ error: 'Access denied' });
  try {
    await db.query(
      `INSERT INTO email_settings (sheet_id, recipient, sender_name, subject) VALUES ($1, $2, $3, $4)
       ON CONFLICT (sheet_id) DO UPDATE SET recipient = $2, sender_name = $3, subject = $4`,
      [sheetId, to, name, subj]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /data/:sheetId/alert-log
router.post('/:sheetId/alert-log', async (req, res) => {
  const { sheetId } = req.params;
  const { recipient, item_count, levels, status, error_msg } = req.body;
  if (!await ownsSheet(req.user.id, sheetId)) return res.status(403).json({ error: 'Access denied' });
  try {
    await db.query(
      'INSERT INTO alert_log (sheet_id, recipient, item_count, levels, status, error_msg) VALUES ($1, $2, $3, $4, $5, $6)',
      [sheetId, recipient, item_count || 0, Array.isArray(levels) ? levels.join(',') : levels, status || 'sent', error_msg || null]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /data/:sheetId/alert-log
router.delete('/:sheetId/alert-log', async (req, res) => {
  const { sheetId } = req.params;
  if (!await ownsSheet(req.user.id, sheetId)) return res.status(403).json({ error: 'Access denied' });
  try {
    await db.query('DELETE FROM alert_log WHERE sheet_id = $1', [sheetId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;