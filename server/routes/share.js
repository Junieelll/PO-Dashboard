// ══════════════════════════════════════════════════════════
//  routes/share.js — Share link generation + public view (PostgreSQL)
// ══════════════════════════════════════════════════════════

const router = require('express').Router();
const db     = require('../db/connection');
const crypto = require('crypto');
const authMw = require('../middleware/auth');
const { DEFAULT_COLUMNS } = require('./auth');

// GET /share/:sheetId  (auth) — list existing links
router.get('/:sheetId', authMw, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT sl.token, sl.label, sl.expires_at, sl.created_at, sl.po_list
       FROM share_links sl
       JOIN sheets s ON s.id = sl.sheet_id
       WHERE sl.sheet_id = $1 AND s.user_id = $2
       ORDER BY sl.created_at DESC`,
      [req.params.sheetId, req.user.id]
    );
    res.json({ links: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /share/:sheetId  (auth) — create new link
router.post('/:sheetId', authMw, async (req, res) => {
  const { sheetId } = req.params;
  const { label, expiresInDays, selectedPOs } = req.body;
  try {
    const { rows: [sheet] } = await db.query(
      'SELECT id, name FROM sheets WHERE id = $1 AND user_id = $2', [sheetId, req.user.id]
    );
    if (!sheet) return res.status(403).json({ error: 'Access denied' });

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 86400000) : null;
    const poList = Array.isArray(selectedPOs) && selectedPOs.length > 0 ? JSON.stringify(selectedPOs) : null;

    await db.query(
      'INSERT INTO share_links (sheet_id, token, label, expires_at, po_list) VALUES ($1, $2, $3, $4, $5)',
      [sheetId, token, label || sheet.name, expiresAt, poList]
    );
    res.json({ token, expiresAt });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /share/:sheetId  (auth) — delete all links for sheet
router.delete('/:sheetId', authMw, async (req, res) => {
  try {
    await db.query(
      `DELETE FROM share_links WHERE sheet_id = $1
       AND sheet_id IN (SELECT id FROM sheets WHERE user_id = $2)`,
      [req.params.sheetId, req.user.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /share/:sheetId/:token  (auth) — edit label, expiry, po_list
router.patch('/:sheetId/:token', authMw, async (req, res) => {
  const { sheetId, token } = req.params;
  const { label, expiresInDays, selectedPOs } = req.body;
  try {
    const { rows: [link] } = await db.query(
      `SELECT sl.id FROM share_links sl
       JOIN sheets s ON s.id = sl.sheet_id
       WHERE sl.token = $1 AND sl.sheet_id = $2 AND s.user_id = $3`,
      [token, sheetId, req.user.id]
    );
    if (!link) return res.status(403).json({ error: 'Access denied or link not found' });

    const expiresAt = expiresInDays > 0 ? new Date(Date.now() + expiresInDays * 86400000) : null;
    const poList = Array.isArray(selectedPOs) && selectedPOs.length > 0 ? JSON.stringify(selectedPOs) : null;

    await db.query(
      `UPDATE share_links SET label = $1, expires_at = $2, po_list = $3 WHERE id = $4`,
      [label, expiresAt, poList, link.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /share/:sheetId/:token  (auth) — delete single link
router.delete('/:sheetId/:token', authMw, async (req, res) => {
  try {
    await db.query(
      `DELETE FROM share_links WHERE token = $1 AND sheet_id = $2
       AND sheet_id IN (SELECT id FROM sheets WHERE user_id = $3)`,
      [req.params.token, req.params.sheetId, req.user.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /share/view/:token  (public, no auth)
router.get('/view/:token', async (req, res) => {
  try {
    const { rows: [link] } = await db.query(
      'SELECT sheet_id, label, expires_at, po_list FROM share_links WHERE token = $1',
      [req.params.token]
    );
    if (!link) return res.status(404).json({ error: 'Share link not found or revoked' });
    if (link.expires_at && new Date(link.expires_at) < new Date())
      return res.status(410).json({ error: 'Share link has expired' });

    const sheetId = link.sheet_id;

    const { rows: [sheet] } = await db.query(
      'SELECT s.name, u.username FROM sheets s JOIN users u ON u.id = s.user_id WHERE s.id = $1',
      [sheetId]
    );

    let entries = [];
    let poRows  = [];

    if (link.po_list && Array.isArray(link.po_list)) {
      // Filtered by selected POs
      const { rows } = await db.query(
        `SELECT po_number, hauling_date, quantity, running_balance, invoice_no
         FROM po_entries WHERE sheet_id = $1 AND po_number = ANY($2::text[]) ORDER BY position ASC`,
        [sheetId, link.po_list]
      );
      entries = rows;

      const { rows: pos } = await db.query(
        `SELECT po_number, starting_qty, waste_description
         FROM purchase_orders WHERE sheet_id = $1 AND po_number = ANY($2::text[])`,
        [sheetId, link.po_list]
      );
      poRows = pos;
    } else {
      // All POs
      const { rows } = await db.query(
        `SELECT po_number, hauling_date, quantity, running_balance, invoice_no
         FROM po_entries WHERE sheet_id = $1 ORDER BY position ASC`,
        [sheetId]
      );
      entries = rows;

      const { rows: pos } = await db.query(
        `SELECT po_number, starting_qty, waste_description
         FROM purchase_orders WHERE sheet_id = $1`,
        [sheetId]
      );
      poRows = pos;
    }

    res.json({
      sheetName: sheet.name, owner: sheet.username, label: link.label,
      expiresAt: link.expires_at, sharedAt: new Date().toISOString(),
      columns: DEFAULT_COLUMNS,
      cellData: entries,
      purchaseOrders: poRows,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;