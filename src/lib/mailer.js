const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const config = require('../config');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

let transporter = null;
if (config.smtp.enabled) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: { user: config.smtp.user, pass: config.smtp.pass }
  });
}

/** Append a record to data/<name>.jsonl as a local backup of every submission. */
function backup(name, record) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(path.join(DATA_DIR, `${name}.jsonl`), JSON.stringify(record) + '\n');
  } catch (err) {
    console.error(`[store] could not write ${name}:`, err.message);
  }
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

async function send({ subject, text, html, replyTo }) {
  if (!transporter) {
    console.log(`[mail] SMTP not configured — would send: ${subject}`);
    return { skipped: true };
  }
  return transporter.sendMail({
    from: `"${config.siteName}" <${config.smtp.from}>`,
    to: config.smtp.to,
    replyTo,
    subject,
    text,
    html
  });
}

async function sendContact({ name, email, topic, message, locale }) {
  backup('contacts', { name, email, topic, message, locale, at: new Date().toISOString() });
  return send({
    subject: `[Kendle learnAI] Liên hệ mới từ ${name}${topic ? ` — ${topic}` : ''}`,
    replyTo: email,
    text: `Tên: ${name}\nEmail: ${email}\nChủ đề: ${topic || '-'}\nNgôn ngữ: ${locale}\n\n${message}`,
    html: `<h2>Liên hệ mới</h2>
      <p><b>Tên:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Chủ đề:</b> ${esc(topic || '-')}<br><b>Ngôn ngữ:</b> ${esc(locale)}</p>
      <p style="white-space:pre-wrap">${esc(message)}</p>`
  });
}

async function sendSubscribe({ email, locale }) {
  backup('subscribers', { email, locale, at: new Date().toISOString() });
  return send({
    subject: `[Kendle learnAI] Đăng ký newsletter mới: ${email}`,
    replyTo: email,
    text: `Email: ${email}\nNgôn ngữ: ${locale}`,
    html: `<p>Người đăng ký mới: <b>${esc(email)}</b> (${esc(locale)})</p>`
  });
}

module.exports = { sendContact, sendSubscribe };
