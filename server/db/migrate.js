// ══════════════════════════════════════════════════════════
//  db/migrate.js — Create all tables (PostgreSQL / Supabase)
//  Usage: node db/migrate.js
// ══════════════════════════════════════════════════════════

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('./connection');

async function migrate() {
  const client = await pool.connect();
  console.log('🔧  Running migrations...\n');

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        username   VARCHAR(80)  NOT NULL UNIQUE,
        email      VARCHAR(160) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ  DEFAULT NOW()
      )
    `);
    console.log('✅  Table: users');

    await client.query(`
      CREATE TABLE IF NOT EXISTS sheets (
        id         SERIAL PRIMARY KEY,
        user_id    INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name       VARCHAR(100) NOT NULL DEFAULT 'Sheet1',
        position   INT          NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ  DEFAULT NOW(),
        updated_at TIMESTAMPTZ  DEFAULT NOW()
      )
    `);
    console.log('✅  Table: sheets');

    await client.query(`
      CREATE TABLE IF NOT EXISTS po_entries (
        id              SERIAL PRIMARY KEY,
        sheet_id        INT  NOT NULL REFERENCES sheets(id) ON DELETE CASCADE,
        position        INT  NOT NULL DEFAULT 0,
        po_number       TEXT NOT NULL DEFAULT '',
        hauling_date    TEXT NOT NULL DEFAULT '',
        quantity        TEXT NOT NULL DEFAULT '',
        running_balance TEXT NOT NULL DEFAULT '',
        invoice_no      TEXT NOT NULL DEFAULT '',
        created_at      TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅  Table: po_entries');

    await client.query(`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id                SERIAL PRIMARY KEY,
        sheet_id          INT  NOT NULL REFERENCES sheets(id) ON DELETE CASCADE,
        po_number         TEXT NOT NULL DEFAULT '',
        starting_qty      TEXT NOT NULL DEFAULT '',
        waste_description TEXT NOT NULL DEFAULT '',
        created_at        TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (sheet_id, po_number)
      )
    `);
    console.log('✅  Table: purchase_orders');


    await client.query(`
      CREATE TABLE IF NOT EXISTS thresholds (
        id         SERIAL PRIMARY KEY,
        sheet_id   INT              NOT NULL REFERENCES sheets(id) ON DELETE CASCADE,
        po_number  VARCHAR(100)     NOT NULL DEFAULT '*',
        danger_val DOUBLE PRECISION NOT NULL DEFAULT 0,
        warn_val   DOUBLE PRECISION NOT NULL DEFAULT 1000,
        UNIQUE (sheet_id, po_number)
      )
    `);
    console.log('✅  Table: thresholds');

    await client.query(`
      CREATE TABLE IF NOT EXISTS email_settings (
        id          SERIAL PRIMARY KEY,
        sheet_id    INT          NOT NULL UNIQUE REFERENCES sheets(id) ON DELETE CASCADE,
        recipient   TEXT,
        sender_name VARCHAR(100) NOT NULL DEFAULT 'PO Tracker System',
        subject     VARCHAR(200) NOT NULL DEFAULT '[ALERT] PO Balance Warning'
      )
    `);
    console.log('✅  Table: email_settings');

    await client.query(`
      CREATE TABLE IF NOT EXISTS alert_log (
        id         SERIAL PRIMARY KEY,
        sheet_id   INT          NOT NULL REFERENCES sheets(id) ON DELETE CASCADE,
        sent_at    TIMESTAMPTZ  DEFAULT NOW(),
        recipient  TEXT         NOT NULL,
        item_count INT          NOT NULL DEFAULT 0,
        levels     VARCHAR(100),
        status     VARCHAR(20)  NOT NULL DEFAULT 'sent',
        error_msg  TEXT
      )
    `);
    console.log('✅  Table: alert_log');

    await client.query(`
      CREATE TABLE IF NOT EXISTS share_links (
        id         SERIAL PRIMARY KEY,
        sheet_id   INT          NOT NULL REFERENCES sheets(id) ON DELETE CASCADE,
        token      VARCHAR(64)  NOT NULL UNIQUE,
        label      VARCHAR(100),
        expires_at TIMESTAMPTZ  DEFAULT NULL,
        created_at TIMESTAMPTZ  DEFAULT NOW()
      )
    `);
    console.log('✅  Table: share_links');

    // ── Indexes ────────────────────────────────────────────
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sheets_user_id            ON sheets     (user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_po_entries_sheet_position  ON po_entries  (sheet_id, position)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_alert_log_sheet_sent       ON alert_log   (sheet_id, sent_at DESC)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_share_links_expires        ON share_links (expires_at) WHERE expires_at IS NOT NULL`);
    console.log('✅  Indexes created');

    console.log('\n🎉  All migrations complete.');
  } catch (err) {
    console.error('❌  Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

migrate();