require('dotenv').config();
const db = require('./db/connection');

async function act() {
  const c = await db.connect();
  try {
    await c.query('ALTER TABLE purchase_orders ADD COLUMN waste_description TEXT DEFAULT \'\'');
    console.log('Column waste_description added successfully');
  } catch (e) {
    if (e.code === '42701') {
      console.log('Column already exists.');
    } else {
      console.error('Error:', e.message);
    }
  } finally {
    c.release();
    db.end();
  }
}

act();
