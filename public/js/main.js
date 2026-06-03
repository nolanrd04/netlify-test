// ── Content loading ───────────────────────────────────────────────────────

/**
 * Fetch a JSON content file and populate matching elements.
 * mappings: { '#css-selector': 'jsonKey', ... }
 * Falls back silently so default inline HTML content shows when no server.
 */
async function loadContent(jsonPath, mappings) {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) return;
    const data = await res.json();

    Object.entries(mappings).forEach(([selector, key]) => {
      if (data[key] === undefined) return;
      const el = document.querySelector(selector);
      if (!el) return;

      if (el.dataset.html === 'true') {
        el.innerHTML = data[key];
      } else {
        el.textContent = data[key];
      }
    });
  } catch {
    // Running from file:// or content missing — defaults stay in place
  }
}

/**
 * Load site-wide settings (title, footer) from general.json.
 */
async function loadSettings() {
  try {
    const res = await fetch('/content/settings/general.json');
    if (!res.ok) return;
    const s = await res.json();

    if (s.siteTitle) {
      document.title = document.title.replace(/^.*? —/, s.siteTitle + ' —');
      document.querySelectorAll('.logo').forEach(el => (el.textContent = s.siteTitle));
    }

    if (s.footerText) {
      const f = document.getElementById('footer-text');
      if (f) f.textContent = s.footerText;
    }
  } catch { /* settings file missing */ }
}

// ── Mobile nav ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Active nav link ───────────────────────────────────────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    const isHome = href === '/' || href === '/index.html';
    const onHome = path === '/' || path.endsWith('/index.html');

    if ((isHome && onHome) || (!isHome && path.endsWith(href.replace(/^\//, '')))) {
      link.classList.add('active');
    }
  });
});

// ── Contact form (Netlify Forms) ──────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });

      if (res.ok) {
        form.style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      alert('Something went wrong. Please email us directly.');
    }
  });
});
