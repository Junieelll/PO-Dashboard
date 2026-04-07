// ══════════════════════════════════════════════════════════
//  db/connection.js — PostgreSQL connection pool (Supabase)
// ══════════════════════════════════════════════════════════

const dns = require('dns');
const { Pool } = require('pg');

// Force IPv4-first DNS resolution (Supabase often returns IPv6-only)
dns.setDefaultResultOrder('ipv4first');

// Parse the DATABASE_URL and build config with explicit options
const connStr = process.env.DATABASE_URL || '';
let url;
try {
  url = new URL(connStr);
} catch (e) {
  console.error('\n❌ CRITICAL ERROR: DATABASE_URL is missing or invalid in your hosting environment variables.\n');
  process.exit(1);
}

const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  database: url.pathname.replace('/', ''),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  ssl: connStr.includes('supabase') ? { rejectUnauthorized: false } : false,
  // Connection timeout
  connectionTimeoutMillis: 10000,
  // Force IPv4
  ...(connStr.includes('supabase') ? {
    options: '-c search_path=public',
  } : {}),
});

pool.on('error', (err) => {
  console.error('DB pool error:', err.message);
});

module.exports = pool;
