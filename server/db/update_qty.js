require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('./connection');

async function upgrade() {
  const client = await pool.connect();
  console.log('🔧 Upgrading po_entries table...');
  try {
    await client.query(`ALTER TABLE po_entries ADD COLUMN IF NOT EXISTS starting_qty VARCHAR(100)`);
    console.log('✅ po_entries table upgraded successfully!');
  } catch (err) {
    console.error('❌ Upgrade failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

upgrade();
