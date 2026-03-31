require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = require('./connection');

async function upgradeThresholds() {
  const client = await pool.connect();
  console.log('🔧 Upgrading thresholds table...');
  try {
    // 1. Drop existing unique constraint (it forces 1 threshold per sheet)
    await client.query(`ALTER TABLE thresholds DROP CONSTRAINT IF EXISTS thresholds_sheet_id_key`);
    
    // 2. Add po_number column with default value '*'
    await client.query(`ALTER TABLE thresholds ADD COLUMN IF NOT EXISTS po_number VARCHAR(100) NOT NULL DEFAULT '*'`);
    
    // 3. Add the new composite unique constraint (sheet_id, po_number)
    // We add it with IF NOT EXISTS logic via a trick or just wrap in try catch, but ADD CONSTRAINT IF NOT EXISTS isn't standard in old pg, so we'll drop then add.
    await client.query(`ALTER TABLE thresholds DROP CONSTRAINT IF EXISTS thresholds_sheet_id_po_number_key`);
    await client.query(`ALTER TABLE thresholds ADD CONSTRAINT thresholds_sheet_id_po_number_key UNIQUE (sheet_id, po_number)`);

    console.log('✅ thresholds table upgraded successfully!');
  } catch (err) {
    console.error('❌ Upgrade failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

upgradeThresholds();
