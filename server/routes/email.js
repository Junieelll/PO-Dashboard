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

  const now      = new Date().toLocaleString();
  const fromName = senderName || process.env.SMTP_FROM_NAME || "Joanne's PO Tracker";
  const fromMail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const rowsHtml = alerts.map(a => {
    const isDanger  = a.level === 'DANGER';
    const badgeBg   = isDanger ? '#fee2e2' : '#fef3c7';
    const badgeClr  = isDanger ? '#dc2626' : '#d97706';
    const balClr    = isDanger ? '#dc2626' : '#d97706';
    const thr       = a.threshold || {};
    return `
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #e4e4e7;color:#18181b;font-weight:700;font-size:14px;white-space:nowrap">${esc(a.po)}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #e4e4e7;text-align:center;">
        <span style="display:inline-block;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:800;letter-spacing:0.8px;background:${badgeBg};color:${badgeClr}">${esc(a.level)}</span>
      </td>
      <td style="padding:14px 16px;border-bottom:1px solid #e4e4e7;text-align:right;font-size:13px;color:#52525b;font-variant-numeric:tabular-nums;">${Number(a.startingQty||0).toLocaleString()}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #e4e4e7;text-align:right;font-size:13px;font-weight:600;color:#18181b;font-variant-numeric:tabular-nums;">${Number(a.lastQty||0).toLocaleString()}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #e4e4e7;text-align:right;font-weight:800;font-size:15px;color:${balClr};font-variant-numeric:tabular-nums;">${Number(a.balance).toLocaleString()}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #e4e4e7;text-align:right;font-size:12px;color:#71717a;white-space:nowrap">${esc(a.lastDate)}</td>
    </tr>
    <tr>
      <td colspan="6" style="padding:6px 16px 14px;border-bottom:1px solid #f0f0f0;background:#fafafa;">
        <table role="presentation" style="border-collapse:collapse;border:none;">
          <tr>
            <td style="padding:0 4px 0 0;line-height:1;vertical-align:middle;">
              <div style="width:10px;height:10px;border-radius:50%;background:#dc2626;font-size:0;line-height:0;">&nbsp;</div>
            </td>
            <td style="padding:0 16px 0 0;font-size:11px;color:#a1a1aa;vertical-align:middle;white-space:nowrap;">Danger ≤ ${Number(thr.danger??0).toLocaleString()}</td>
            <td style="padding:0 4px 0 0;line-height:1;vertical-align:middle;">
              <div style="width:10px;height:10px;border-radius:50%;background:#d97706;font-size:0;line-height:0;">&nbsp;</div>
            </td>
            <td style="padding:0;font-size:11px;color:#a1a1aa;vertical-align:middle;white-space:nowrap;">Warning ≤ ${Number(thr.warn??1000).toLocaleString()}</td>
          </tr>
        </table>
      </td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:40px 20px;background:#f4f4f5;font-family:'Inter','Segoe UI',system-ui,sans-serif;-webkit-font-smoothing:antialiased">
<div style="max-width:860px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;box-shadow:0 10px 40px rgba(0,0,0,0.04)">

  <div style="background:linear-gradient(135deg,#f472b6,#ec4899);padding:36px 36px 32px;text-align:center;">
    <div style="color:white;font-size:22px;font-weight:800;letter-spacing:-0.5px;margin-bottom:6px">Action Required: PO Balance Alert</div>
    <div style="color:rgba(255,255,255,0.88);font-size:14px;font-weight:500;margin-bottom:4px">
      ${alerts.length} Purchase Order${alerts.length>1?'s':''} dropped below threshold limits
    </div>
    ${sheetName ? `<div style="display:inline-block;margin-top:10px;background:rgba(255,255,255,0.18);border-radius:20px;padding:4px 14px;font-size:12px;color:white;font-weight:600;letter-spacing:0.3px">${esc(sheetName)}</div>` : ''}
  </div>

  <div style="padding:32px 36px 12px 36px">
    <div style="border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.02)">
      <table style="width:100%;border-collapse:collapse;background:#fafafa;">
        <thead>
          <tr style="border-bottom:1px solid #e4e4e7;background:#f4f4f5;">
            <th style="padding:12px 16px;text-align:left;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:1px;font-weight:700;white-space:nowrap">P.O. No.</th>
            <th style="padding:12px 16px;text-align:center;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:1px;font-weight:700;white-space:nowrap">Status</th>
            <th style="padding:12px 16px;text-align:right;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:1px;font-weight:700;white-space:nowrap">Starting Qty</th>
            <th style="padding:12px 16px;text-align:right;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:1px;font-weight:700;white-space:nowrap">Quantity</th>
            <th style="padding:12px 16px;text-align:right;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:1px;font-weight:700;white-space:nowrap">Running Balance</th>
            <th style="padding:12px 16px;text-align:right;font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:1px;font-weight:700;white-space:nowrap">Hauling Date</th>
          </tr>
        </thead>
        <tbody style="background:#ffffff">
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  </div>

  <div style="background:#f4f4f5;padding:22px 36px;text-align:center;border-top:1px solid #e4e4e7;">
    <div style="font-size:13px;color:#52525b;margin-bottom:6px">This message was automatically generated by <strong style="color:#18181b">${esc(fromName)}</strong>.</div>
    <div style="font-size:12px;color:#a1a1aa;">Generated on ${now}</div>
  </div>

</div>
</body></html>`;

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
  <div style="background:linear-gradient(135deg,#f472b6,#ec4899);padding:32px;text-align:center;">
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