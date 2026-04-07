// ══════════════════════════════════════════════════════════
//  server.js — Local Dev Server Entry Point
// ══════════════════════════════════════════════════════════

const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n⚡  PO Dashboard running locally → http://localhost:${PORT}\n`);
});
