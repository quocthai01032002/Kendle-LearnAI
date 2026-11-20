const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./src/config');
const posts = require('./src/lib/posts');
const { buildRouter, makeLocals } = require('./src/routes/pages');
const apiRouter = require('./src/routes/api');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1); // Hostinger runs the app behind a proxy
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        upgradeInsecureRequests: config.isProd ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false
  })
);
app.use(compression());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: config.isProd ? '7d' : 0,
    etag: true
  })
);

// Strip trailing slashes (except root) for clean canonical URLs.
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const q = req.url.slice(req.path.length);
    return res.redirect(301, req.path.slice(0, -1) + q);
  }
  next();
});

app.use((req, res, next) => {
  res.locals.siteName = config.siteName;
  res.locals.siteUrl = config.siteUrl;
  res.locals.social = config.social;
  res.locals.year = new Date().getFullYear();
  next();
});

app.use('/api', apiRouter);

app.get('/healthz', (req, res) => res.json({ ok: true }));

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const urls = [];
  for (const locale of config.locales) {
    const p = locale === 'en' ? '/en' : '';
    for (const s of ['', '/blog', '/about', '/contact']) urls.push({ loc: `${config.siteUrl}${p}${s}` || '/' });
    for (const c of config.categories) urls.push({ loc: `${config.siteUrl}${p}/category/${c}` });
    for (const post of posts.list(locale)) {
      urls.push({ loc: `${config.siteUrl}${p}/blog/${post.slug}`, lastmod: (post.updated || post.date).toISOString() });
    }
  }
  const body = urls
    .map((u) => `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`);
});

app.use('/en', buildRouter('en'));
app.use('/', buildRouter('vi'));

app.use((req, res) => {
  const locale = req.path.startsWith('/en') ? 'en' : 'vi';
  Object.assign(res.locals, makeLocals(locale, req));
  res.status(404).render('404', { page: '404' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(config.port, () => {
  console.log(`Kendle learnAI running at http://localhost:${config.port}`);
});
