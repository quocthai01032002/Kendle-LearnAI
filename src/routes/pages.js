const express = require('express');
const config = require('../config');
const posts = require('../lib/posts');
const i18n = require('../i18n');

const prefixOf = (locale) => (locale === 'en' ? '/en' : '');

function makeLocals(locale, req) {
  const prefix = prefixOf(locale);
  const other = locale === 'en' ? 'vi' : 'en';
  const t = (key, vars) => i18n.t(locale, key, vars);
  const url = (p = '/') => {
    const full = prefix + (p === '/' ? '' : p);
    return full || '/';
  };
  // Path without the locale prefix, used for the default language switch target.
  const bare = req.path.replace(/^\/en(?=\/|$)/, '') || '/';
  return {
    locale,
    otherLocale: other,
    t,
    url,
    absUrl: (p) => config.siteUrl + url(p),
    altHref: prefixOf(other) + (bare === '/' ? '' : bare) || '/',
    currentPath: bare,
    canonical: config.siteUrl + (req.path === '/' ? '/' : req.path.replace(/\/$/, '')),
    formatDate: (d) =>
      new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }).format(d),
    categories: config.categories,
    catIcon: {
      'generative-ai': 'sparkles',
      'machine-learning': 'brain',
      'prompt-engineering': 'wand',
      'ai-tools': 'wrench',
      'ai-ethics': 'scale',
      tutorials: 'book'
    },
    categoryCounts: posts.categoryCounts(locale)
  };
}

function paginate(items, page) {
  const total = Math.max(1, Math.ceil(items.length / config.postsPerPage));
  const current = Math.min(Math.max(1, page), total);
  const start = (current - 1) * config.postsPerPage;
  return { items: items.slice(start, start + config.postsPerPage), current, total };
}

function buildRouter(locale) {
  const router = express.Router();

  router.use((req, res, next) => {
    Object.assign(res.locals, makeLocals(locale, req));
    next();
  });

  router.get('/', (req, res) => {
    const list = posts.list(locale);
    const featured = list.find((p) => p.featured) || list[0] || null;
    const rest = list.filter((p) => p !== featured);
    // Keep the 3-column grid full: show 6 when available, otherwise 3.
    const latest = rest.slice(0, rest.length >= 6 ? 6 : 3);
    res.render('home', { page: 'home', featured, latest, totalPosts: list.length });
  });

  router.get('/blog', (req, res) => {
    const pg = paginate(posts.list(locale), parseInt(req.query.page, 10) || 1);
    res.render('blog', { page: 'blog', pg, activeCategory: null, baseHref: res.locals.url('/blog') });
  });

  router.get('/category/:cat', (req, res, next) => {
    const cat = req.params.cat;
    if (!config.categories.includes(cat)) return next();
    const pg = paginate(
      posts.list(locale).filter((p) => p.category === cat),
      parseInt(req.query.page, 10) || 1
    );
    res.render('blog', { page: 'blog', pg, activeCategory: cat, baseHref: res.locals.url(`/category/${cat}`) });
  });

  router.get('/blog/:slug', (req, res, next) => {
    const post = posts.find(locale, req.params.slug);
    if (!post) return next();
    const translation = posts.translationOf(post, res.locals.otherLocale);
    if (translation) res.locals.altHref = `${prefixOf(res.locals.otherLocale)}/blog/${translation.slug}`;
    res.render('post', { page: 'post', post, translation, related: posts.related(post) });
  });

  router.get('/search', (req, res) => {
    const q = String(req.query.q || '').slice(0, 100);
    res.render('search', { page: 'search', q, results: q ? posts.search(locale, q) : [] });
  });

  router.get('/about', (req, res) => res.render('about', { page: 'about' }));
  router.get('/contact', (req, res) =>
    res.render('contact', { page: 'contact', contactEmail: config.contactEmail })
  );

  router.get('/rss.xml', (req, res) => {
    const list = posts.list(locale).slice(0, 20);
    const esc = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);
    const items = list
      .map(
        (p) => `<item><title>${esc(p.title)}</title><link>${res.locals.absUrl(`/blog/${p.slug}`)}</link><guid>${res.locals.absUrl(`/blog/${p.slug}`)}</guid><pubDate>${p.date.toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`
      )
      .join('');
    res.type('application/rss+xml').send(
      `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${config.siteName}</title><link>${res.locals.absUrl('/')}</link><description>${esc(res.locals.t('meta.description'))}</description><language>${locale}</language>${items}</channel></rss>`
    );
  });

  return router;
}

module.exports = { buildRouter, makeLocals };
