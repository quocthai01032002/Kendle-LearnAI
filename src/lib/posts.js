const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const hljs = require('highlight.js');
const config = require('../config');

const POSTS_DIR = path.join(__dirname, '..', '..', 'content', 'posts');

function slugifyHeading(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function createRenderer(toc) {
  const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );
  marked.use({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugifyHeading(text);
        if (depth === 2 || depth === 3) toc.push({ id, text: text.replace(/<[^>]+>/g, ''), depth });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith(config.siteUrl);
        const t = title ? ` title="${title}"` : '';
        return external
          ? `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
          : `<a href="${href}"${t}>${text}</a>`;
      },
      image({ href, title, text }) {
        const t = title ? ` title="${title}"` : '';
        return `<img src="${href}" alt="${text}"${t} loading="lazy" decoding="async">`;
      }
    }
  });
  return marked;
}

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function hashHue(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 360;
}

function loadLocale(locale) {
  const dir = path.join(POSTS_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      if (data.draft) return null;
      const slug = data.slug || file.replace(/\.md$/, '');
      const toc = [];
      const html = createRenderer(toc).parse(content);
      const plain = content.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`\[\]()!-]/g, ' ');
      return {
        locale,
        slug,
        key: data.key || slug,
        title: data.title || slug,
        description: data.description || '',
        date: new Date(data.date || Date.now()),
        updated: data.updated ? new Date(data.updated) : null,
        category: config.categories.includes(data.category) ? data.category : 'tutorials',
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author || 'Kendle Team',
        featured: Boolean(data.featured),
        cover: data.cover || null,
        hue: typeof data.hue === 'number' ? data.hue : hashHue(slug),
        readingTime: readingTime(plain),
        html,
        toc,
        searchText: `${data.title} ${data.description} ${(data.tags || []).join(' ')} ${plain}`.toLowerCase()
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.date - a.date);
}

let cache = null;
function all() {
  if (!cache || !config.isProd) {
    cache = {};
    for (const l of config.locales) cache[l] = loadLocale(l);
  }
  return cache;
}

function list(locale) {
  return all()[locale] || [];
}

function find(locale, slug) {
  return list(locale).find((p) => p.slug === slug) || null;
}

function translationOf(post, targetLocale) {
  return list(targetLocale).find((p) => p.key === post.key) || null;
}

function related(post, limit = 3) {
  return list(post.locale)
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: (p.category === post.category ? 3 : 0) + p.tags.filter((t) => post.tags.includes(t)).length
    }))
    .sort((a, b) => b.score - a.score || b.p.date - a.p.date)
    .slice(0, limit)
    .map((x) => x.p);
}

function search(locale, q) {
  const terms = String(q || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  if (!terms.length) return [];
  return list(locale)
    .map((p) => {
      let score = 0;
      for (const t of terms) {
        if (!p.searchText.includes(t)) return null;
        if (p.title.toLowerCase().includes(t)) score += 5;
        if (p.tags.some((tag) => tag.toLowerCase().includes(t))) score += 3;
        score += 1;
      }
      return { p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

function categoryCounts(locale) {
  const counts = Object.fromEntries(config.categories.map((c) => [c, 0]));
  for (const p of list(locale)) counts[p.category]++;
  return counts;
}

module.exports = { list, find, translationOf, related, search, categoryCounts };
