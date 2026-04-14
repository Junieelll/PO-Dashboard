require('dotenv').config();
const db = require('./db/connection');

async function act() {
  const c = await db.connect();
  try {
    await c.query('ALTER TABLE po_entries ADD COLUMN remarks TEXT NOT NULL DEFAULT \'\'');
    console.log('Column remarks added successfully');
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
