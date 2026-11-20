/* Kendle learnAI — client interactions (no dependencies) */
(function () {
  'use strict';
  const doc = document.documentElement;
  doc.classList.remove('no-js');
  doc.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function toast(msg) {
    const el = $('[data-toast]');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  document.addEventListener('DOMContentLoaded', () => {
    /* Header shadow on scroll + reading progress */
    const header = $('[data-header]');
    const bar = $('.read-progress span');
    const article = $('[data-article]');
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      header && header.classList.toggle('scrolled', window.scrollY > 8);
      if (bar && article) {
        const r = article.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
        bar.style.transform = `scaleX(${p})`;
      }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    /* Mobile menu */
    const toggle = $('[data-menu-toggle]');
    const mnav = $('#mobile-nav');
    if (toggle && mnav) {
      const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
        mnav.hidden = !open;
      };
      toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mnav.hidden) { setOpen(false); toggle.focus(); }
      });
      $$('[data-close-menu]', mnav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
      window.matchMedia('(min-width: 900px)').addEventListener('change', (m) => m.matches && setOpen(false));
    }

    /* Reveal on scroll with per-group stagger */
    const reveals = $$('.reveal');
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('in');
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach((el) => {
        const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal')) : [];
        el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 6) * 70}ms`);
        io.observe(el);
      });
    } else {
      reveals.forEach((el) => el.classList.add('in'));
    }

    /* Glow cards follow pointer */
    $$('.glow-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    /* TOC active section */
    const tocLinks = $$('[data-toc-link]');
    if (tocLinks.length && 'IntersectionObserver' in window) {
      const map = new Map(tocLinks.map((a) => [decodeURIComponent(a.getAttribute('href').slice(1)), a]));
      const heads = Array.from(map.keys()).map((id) => document.getElementById(id)).filter(Boolean);
      const tio = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            tocLinks.forEach((a) => a.classList.remove('active'));
            const a = map.get(en.target.id);
            a && a.classList.add('active');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      heads.forEach((h) => tio.observe(h));
    }

    /* Copy buttons on code blocks */
    $$('.prose pre').forEach((pre) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-code';
      const isVi = document.body.dataset.locale === 'vi';
      btn.textContent = isVi ? 'Sao chép' : 'Copy';
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector('code').innerText);
          btn.textContent = isVi ? 'Đã chép ✓' : 'Copied ✓';
          setTimeout(() => (btn.textContent = isVi ? 'Sao chép' : 'Copy'), 1600);
        } catch (_) { /* clipboard blocked */ }
      });
      pre.appendChild(btn);
    });

    /* Copy article link */
    $$('[data-copy-link]').forEach((b) => b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.copyLink); toast(b.dataset.copied); } catch (_) {}
    }));

    /* AJAX forms with inline validation */
    $$('form[data-ajax-form]').forEach((form) => {
      const status = $('.form-status', form);
      const btn = $('button[type="submit"]', form);
      const label = btn && $('.btn-label', btn);
      const original = label ? label.textContent : '';

      const clearErrors = () => {
        $$('[data-error-for]', form).forEach((p) => (p.textContent = ''));
        $$('[aria-invalid]', form).forEach((i) => i.removeAttribute('aria-invalid'));
      };
      $$('input, textarea', form).forEach((input) => input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid')) {
          input.removeAttribute('aria-invalid');
          const p = $(`[data-error-for="${input.name}"]`, form);
          if (p) p.textContent = '';
        }
      }));

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        status.className = 'form-status';
        status.textContent = '';
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        if (label) label.textContent = btn.dataset.sending;

        try {
          const res = await fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(form)))
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.ok) {
            status.className = 'form-status ok';
            status.textContent = data.message;
            form.reset();
          } else if (data.errors) {
            let first = null;
            Object.entries(data.errors).forEach(([name, msg]) => {
              const input = form.elements[name];
              const p = $(`[data-error-for="${name}"]`, form);
              if (p) p.textContent = msg;
              if (input) { input.setAttribute('aria-invalid', 'true'); first = first || input; }
            });
            first && first.focus();
          } else {
            status.className = 'form-status err';
            status.textContent = data.error || status.dataset.networkError;
          }
        } catch (_) {
          status.className = 'form-status err';
          status.textContent = status.dataset.networkError;
        } finally {
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
          if (label) label.textContent = original;
        }
      });
    });

    /* Hero neural network canvas */
    const canvas = $('[data-neural]');
    if (canvas && !reduceMotion) neural(canvas);
  });

  function neural(canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes, raf = null, visible = true;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6, hue: Math.random() < 0.5 ? 258 : 190
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const max = 140;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < max) {
            ctx.strokeStyle = `hsla(${a.hue}, 90%, 72%, ${(1 - d / max) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 180) {
          ctx.strokeStyle = `hsla(190, 95%, 65%, ${(1 - md / 180) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = `hsla(${a.hue}, 95%, 78%, 0.9)`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : null;
    }
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };

    resize();
    start();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    const hero = canvas.parentElement;
    hero.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; start(); }).observe(canvas);
    document.addEventListener('visibilitychange', start);
  }
})();
