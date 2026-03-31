require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const pool = require('./server/db/connection');

async function test() {
  console.log('🧪 Testing Database...');
  try {
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Connection OK! Total Users: ${rows[0].count}`);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
  } finally {
    await pool.end();
  }
}
test();
