const express = require('express');
const rateLimit = require('express-rate-limit');
const { sendContact, sendSubscribe } = require('../lib/mailer');
const i18n = require('../i18n');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ ok: false, error: t(req)('form.errors.rate') })
});

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

function t(req) {
  const locale = req.body && req.body.locale === 'en' ? 'en' : 'vi';
  return (key) => i18n.t(locale, key);
}

const clean = (v, max) => String(v || '').trim().slice(0, max);

router.post('/contact', limiter, async (req, res) => {
  const tr = t(req);
  // Honeypot: real users never fill this hidden field.
  if (req.body.website) return res.json({ ok: true, message: tr('form.contact.success') });

  const data = {
    name: clean(req.body.name, 100),
    email: clean(req.body.email, 200),
    topic: clean(req.body.topic, 100),
    message: clean(req.body.message, 5000),
    locale: req.body.locale === 'en' ? 'en' : 'vi'
  };
  const errors = {};
  if (data.name.length < 2) errors.name = tr('form.errors.name');
  if (!EMAIL_RE.test(data.email)) errors.email = tr('form.errors.email');
  if (data.message.length < 10) errors.message = tr('form.errors.message');
  if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors });

  try {
    await sendContact(data);
    res.json({ ok: true, message: tr('form.contact.success') });
  } catch (err) {
    console.error('[contact]', err.message);
    res.status(500).json({ ok: false, error: tr('form.errors.server') });
  }
});

router.post('/subscribe', limiter, async (req, res) => {
  const tr = t(req);
  if (req.body.website) return res.json({ ok: true, message: tr('form.newsletter.success') });
  const email = clean(req.body.email, 200);
  if (!EMAIL_RE.test(email)) return res.status(422).json({ ok: false, errors: { email: tr('form.errors.email') } });
  try {
    await sendSubscribe({ email, locale: req.body.locale === 'en' ? 'en' : 'vi' });
    res.json({ ok: true, message: tr('form.newsletter.success') });
  } catch (err) {
    console.error('[subscribe]', err.message);
    res.status(500).json({ ok: false, error: tr('form.errors.server') });
  }
});

module.exports = router;
