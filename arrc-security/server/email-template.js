import { company } from '../src/data/company.js';

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function renderEmail({ title, intro, fields, message, resumeName }) {
  const rows = fields.filter(([, value]) => value !== '' && value !== undefined && value !== null)
    .map(([label, value]) => `<tr><th align="left" valign="top" style="padding:12px 14px;border-bottom:1px solid #e7eaf0;font-size:13px;color:#64748b;font-weight:500;width:35%">${escapeHtml(label)}</th><td valign="top" style="padding:12px 14px;border-bottom:1px solid #e7eaf0;font-size:14px;color:#172238;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f5fa;font-family:Arial,Helvetica,sans-serif;color:#172238">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f5fa"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e3e7ef;border-radius:12px;overflow:hidden">
<tr><td style="background:#34358c;padding:26px 28px;color:#ffffff"><div style="font-size:25px;font-weight:700;letter-spacing:2px">ARRC</div><div style="font-size:12px;letter-spacing:1px;margin-top:6px;color:#e0e3ff">${escapeHtml(company.tagline)}</div></td></tr>
<tr><td style="padding:28px"><p style="margin:0 0 10px;color:#6366a2;font-size:11px;font-weight:700;letter-spacing:1px">WEBSITE SUBMISSION</p><h1 style="margin:0 0 12px;font-size:24px;line-height:1.3">${escapeHtml(title)}</h1><p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#64748b">${escapeHtml(intro)}</p>
<table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e7eaf0;border-radius:8px;border-collapse:collapse">${rows}</table>
${message ? `<h2 style="font-size:16px;margin:26px 0 12px">Requirements</h2><div style="padding:18px;background:#f5f6fb;border-left:3px solid #34358c;font-size:14px;line-height:1.8;overflow-wrap:anywhere">${escapeHtml(message).replace(/\r?\n/g, '<br>')}</div>` : ''}
${resumeName ? `<div style="margin-top:24px;padding:16px;background:#f5f6fb;font-size:14px;line-height:1.7"><strong>Resume attached</strong><br>${escapeHtml(resumeName)}</div>` : ''}
<p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#64748b">Use Reply to contact the ${resumeName ? 'applicant' : 'sender'} directly.</p></td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #e7eaf0;font-size:12px;line-height:1.7;color:#64748b"><strong>${escapeHtml(company.name)}</strong><br>Sent from the website ${resumeName ? 'careers' : 'enquiry'} form.</td></tr>
</table></td></tr></table></body></html>`;
}
