require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 3000,
  siteUrl: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  siteName: 'Kendle learnAI',
  isProd: process.env.NODE_ENV === 'production',
  postsPerPage: 9,
  contactEmail: process.env.CONTACT_EMAIL || 'hello@kendlelearnai.com',
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  social: {
    facebook: process.env.SOCIAL_FACEBOOK || '',
    youtube: process.env.SOCIAL_YOUTUBE || '',
    linkedin: process.env.SOCIAL_LINKEDIN || '',
    github: process.env.SOCIAL_GITHUB || ''
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (process.env.SMTP_SECURE || 'true') === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || process.env.SMTP_USER || '',
    to: process.env.MAIL_TO || process.env.SMTP_USER || ''
  }
};

config.smtp.enabled = Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);

// Fixed category taxonomy — labels live in the i18n files.
config.categories = [
  'generative-ai',
  'machine-learning',
  'prompt-engineering',
  'ai-tools',
  'ai-ethics',
  'tutorials'
];

module.exports = config;
