require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('./connection');

async function upgrade() {
  const client = await pool.connect();
  console.log('🔧 Upgrading share_links table...');
  try {
    await client.query(`ALTER TABLE share_links ADD COLUMN IF NOT EXISTS po_list JSONB DEFAULT NULL`);
    console.log('✅ share_links table upgraded successfully!');
  } catch (err) {
    console.error('❌ Upgrade failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

upgrade();
