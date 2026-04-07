// ══════════════════════════════════════════════════════════
//  routes/email.js — Send alert + test emails
// ══════════════════════════════════════════════════════════

const router     = require('express').Router();
const nodemailer = require('nodemailer');
const authMw     = require('../middleware/auth');

router.use(authMw);

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls:    { rejectUnauthorized: false },
    });
  }
  return transporter;
}

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// POST /email/send-alert
router.post('/send-alert', async (req, res) => {
  const { to, subject, alerts, senderName, sheetName } = req.body;
  if (!to || !Array.isArray(alerts) || !alerts.length)
    return res.status(400).json({ error: 'Missing: to, alerts' });

  const now      = new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  const fromName = senderName || process.env.SMTP_FROM_NAME || "Joanne's PO Tracker";
  const fromMail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const hasDanger = alerts.some(a => a.level === 'DANGER');

  const poCardsHtml = alerts.map(a => {
    const isDanger   = a.level === 'DANGER';
    const thr        = a.threshold || {};
    const startQty   = Number(a.startingQty || 0);
    const totalUsed  = Number(a.totalUsed || 0);
    const balance    = Number(a.balance || 0);
    const pctUsed    = startQty > 0 ? Math.min(100, Math.round((totalUsed / startQty) * 100)) : 0;
    const pctLeft    = 100 - pctUsed;

    // Colors
    const accentClr  = isDanger ? '#ef4444' : '#f59e0b';
    const accentBg   = isDanger ? '#fef2f2' : '#fffbeb';
    const accentBdr  = isDanger ? '#fecaca' : '#fde68a';
    const badgeBg    = isDanger ? '#ef4444' : '#f59e0b';
    const barBg      = isDanger ? '#ef4444' : '#f59e0b';
    const warnLbl    = isDanger ? 'CRITICAL — DANGER ZONE' : 'WARNING — THRESHOLD REACHED';

    // Format last hauling date nicely
    let lastDateFmt  = esc(a.lastDate || 'N/A');
    try {
      if (a.lastDate && a.lastDate !== 'N/A') {
        const d = new Date(a.lastDate + 'T00:00:00');
        if (!isNaN(d.getTime())) {
          lastDateFmt = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }
    } catch(e) {}

    // Threshold context line
    const thrDesc = isDanger
      ? `Danger threshold: ≤ ${Number(thr.danger ?? 0).toLocaleString()}`
      : `Warning threshold: ≤ ${Number(thr.warn ?? 1000).toLocaleString()}`;

    return `
    <!-- PO Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${accentBdr};border-radius:14px;overflow:hidden;margin-bottom:18px;background:#ffffff;">

      <!-- Card Header -->
      <tr>
        <td style="background:${accentBg};padding:16px 22px;border-bottom:1px solid ${accentBdr};">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;">
                <div style="font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${accentClr};margin-bottom:4px;">Purchase Order</div>
                <div style="font-size:22px;font-weight:800;color:#18181b;letter-spacing:-0.5px;line-height:1;">${esc(a.po)}</div>
                ${a.wasteDescription ? `<div style="font-size:11px;color:#52525b;margin-top:4px;font-weight:500;">${esc(a.wasteDescription)}</div>` : ''}
              </td>
              <td style="vertical-align:middle;text-align:right;white-space:nowrap;">
                <span style="display:inline-block;background:${badgeBg};color:white;padding:6px 16px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">${esc(a.level)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Stats Grid — 2×2 on mobile via 50% wide cells -->
      <tr>
        <td style="padding:0;border-bottom:1px solid #f0f0f3;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <!-- Starting Qty -->
              <td width="50%" style="text-align:center;padding:18px 8px;border-right:1px solid #f0f0f3;border-bottom:1px solid #f0f0f3;">
                <div style="font-size:9px;font-weight:700;color:#a1a1aa;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:6px;">Starting Qty</div>
                <div style="font-size:20px;font-weight:700;color:#3f3f46;">${startQty.toLocaleString()}</div>
              </td>
              <!-- Total Hauled -->
              <td width="50%" style="text-align:center;padding:18px 8px;border-bottom:1px solid #f0f0f3;">
                <div style="font-size:9px;font-weight:700;color:#a1a1aa;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:6px;">Total Hauled</div>
                <div style="font-size:20px;font-weight:700;color:#3f3f46;">${totalUsed.toLocaleString()}</div>
              </td>
            </tr>
            <tr>
              <!-- Running Balance -->
              <td width="50%" style="text-align:center;padding:18px 8px;border-right:1px solid #f0f0f3;">
                <div style="font-size:9px;font-weight:700;color:#a1a1aa;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:6px;">Running Balance</div>
                <div style="font-size:26px;font-weight:800;color:${accentClr};">${balance.toLocaleString()}</div>
              </td>
              <!-- Last Hauling Date -->
              <td width="50%" style="text-align:center;padding:18px 8px;">
                <div style="font-size:9px;font-weight:700;color:#a1a1aa;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:6px;">Last Hauling</div>
                <div style="font-size:14px;font-weight:600;color:#3f3f46;">${lastDateFmt}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Progress Bar + Threshold Legend -->
      <tr>
        <td style="padding:16px 20px 18px;">

          <!-- % labels -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
            <tr>
              <td style="font-size:11px;font-weight:600;color:#71717a;">${pctUsed}% consumed</td>
              <td style="font-size:11px;font-weight:700;color:${accentClr};text-align:right;">${pctLeft}% remaining</td>
            </tr>
          </table>

          <!-- Progress track -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:999px;height:10px;overflow:hidden;">
            <tr>
              <td width="${pctUsed}%" style="background:${barBg};height:10px;line-height:10px;font-size:0;">&nbsp;</td>
              <td width="${100 - pctUsed}%" style="height:10px;line-height:10px;font-size:0;">&nbsp;</td>
            </tr>
          </table>

          <!-- Threshold legend -->
          <table cellpadding="0" cellspacing="0" style="margin-top:10px;">
            <tr>
              <td style="padding-right:4px;vertical-align:middle;">
                <div style="width:8px;height:8px;border-radius:50%;background:#ef4444;font-size:0;">&nbsp;</div>
              </td>
              <td style="font-size:10px;color:#a1a1aa;padding-right:12px;vertical-align:middle;white-space:nowrap;">Danger ≤ ${Number(thr.danger ?? 0).toLocaleString()}</td>
              <td style="padding-right:4px;vertical-align:middle;">
                <div style="width:8px;height:8px;border-radius:50%;background:#f59e0b;font-size:0;">&nbsp;</div>
              </td>
              <td style="font-size:10px;color:#a1a1aa;vertical-align:middle;white-space:nowrap;">Warning ≤ ${Number(thr.warn ?? 1000).toLocaleString()}</td>
            </tr>
          </table>

        </td>
      </tr>

    </table>`;
  }).join('');

  // Summary banner context
  const bannerSubtitle = hasDanger
    ? `${alerts.filter(a => a.level === 'DANGER').length} PO(s) in CRITICAL state — immediate attention required`
    : `${alerts.length} Purchase Order${alerts.length > 1 ? 's' : ''} reached warning threshold`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>PO Balance Alert</title>
</head>
<body style="margin:0;padding:0;background:#f1f1f3;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;">

  <div style="padding:36px 20px;">

    <div style="max-width:640px;margin:0 auto;">

      <!-- Header Card -->
      <div style="background:linear-gradient(135deg,#ff4d6d 0%,#ef4444 60%,#dc2626 100%);border-radius:20px 20px 0 0;padding:36px 36px 28px;text-align:center;box-shadow:0 8px 32px rgba(239,68,68,0.25);">
        <!-- Icon -->
        <div style="display:inline-block;background:rgba(255,255,255,0.2);width:52px;height:52px;border-radius:16px;line-height:52px;text-align:center;font-size:24px;margin-bottom:16px;">⚠️</div>
        <div style="color:white;font-size:24px;font-weight:800;letter-spacing:-0.5px;margin-bottom:8px;line-height:1.2;">PO Balance Alert</div>
        <div style="color:rgba(255,255,255,0.9);font-size:14px;font-weight:400;line-height:1.5;">${bannerSubtitle}</div>
      </div>
      ${sheetName ? `
      <!-- Sheet Name Strip -->
      <div style="background:#1c1c1e;border-radius:0 0 20px 20px;padding:10px 24px;margin-bottom:24px;text-align:center;">
        <span style="font-size:10px;font-weight:600;color:#6b7280;letter-spacing:1px;text-transform:uppercase;">From Sheet</span>
        &nbsp;&nbsp;
        <span style="font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">${esc(sheetName)}</span>
      </div>` : '<div style="margin-bottom:24px;"></div>'}

      <!-- Alert Context Note -->
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:14px 18px;margin-bottom:24px;display:flex;align-items:flex-start;gap:10px;">
        <span style="font-size:16px;flex-shrink:0;line-height:1.4;">💡</span>
        <div style="font-size:13px;color:#78350f;line-height:1.6;">
          <strong>What this means:</strong> The running balance of the purchase order${alerts.length > 1 ? 's' : ''} below has dropped to or below the set alert threshold. Please review and take the necessary action.
        </div>
      </div>

      <!-- PO Cards -->
      ${poCardsHtml}

      <!-- Footer -->
      <div style="text-align:center;padding:24px 0 8px;">
        <div style="font-size:13px;color:#71717a;margin-bottom:4px;">
          This alert was automatically sent by <strong style="color:#3f3f46;">${esc(fromName)}</strong>.
        </div>
        <div style="font-size:12px;color:#a1a1aa;">Generated on ${now}</div>
      </div>

    </div>

  </div>

</body>
</html>`;

  try {
    const info = await getTransporter().sendMail({
      from: `"${fromName}" <${fromMail}>`, to,
      subject: subject || `[ALERT] PO Balance Warning — ${alerts.length} item(s)`,
      text: alerts.map(a => `[${a.level}] ${a.po} — Balance: ${Number(a.balance).toLocaleString()}`).join('\n'),
      html,
    });
    console.log(`📧  Alert sent → ${to} (${info.messageId})`);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('❌  Email failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /email/test-email
router.post('/test-email', async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ error: 'Missing: to' });
  try {
    await getTransporter().sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to, subject: '✅ PO Dashboard — Email Test',
      text: 'Email is working!',
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:40px 20px;background:#f4f4f5;font-family:'Inter','Segoe UI',system-ui,sans-serif;-webkit-font-smoothing:antialiased">
<div style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;box-shadow:0 10px 40px rgba(0,0,0,0.04)">
  <div style="background:linear-gradient(135deg,#ff6b81,#ef4444);padding:32px;text-align:center;">
    <div style="display:inline-block;background:rgba(255,255,255,0.2);padding:10px;border-radius:50%;margin-bottom:12px;">
      <div style="font-size:24px;line-height:1;">✅</div>
    </div>
    <div style="color:white;font-size:22px;font-weight:800;letter-spacing:-0.5px">Email Configuration Successful</div>
  </div>
  <div style="background:#f4f4f5;padding:24px;text-align:center;border-top:1px solid #e4e4e7;">
    <div style="font-size:12px;color:#a1a1aa;">Sent from the Joanne's PO Tracker</div>
  </div>
</div>
</body></html>`,
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;