window.addEventListener('DOMContentLoaded', () => {

  // ── CURSOR
  const cur = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (cur && ring) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    });
    (function rl() {
      rx += (mx - rx) * .1; ry += (my - ry) * .1;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(rl);
    })();
    document.querySelectorAll('a,button,.bento,.p-card,.tc,.art,.fi-btn').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
    });
  }

  // ── NAV SCROLL
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60), { passive: true });

  // ── HAMBURGER
  const ham = document.getElementById('ham');
  const mobNav = document.getElementById('mob-nav');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobNav.classList.toggle('open');
  });
  mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open');
    mobNav.classList.remove('open');
  }));

  // ── LOADER
  const lbar = document.getElementById('lbar');
  const lpct = document.getElementById('lpct');
  const loader = document.getElementById('loader');
  let p = 0, gsapOk = false;
  const gsapCheck = setInterval(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsapOk = true;
      clearInterval(gsapCheck);
    }
  }, 50);
  const loaderInt = setInterval(() => {
    p += Math.random() * 12 + 3;
    if (p >= 100) {
      p = 100;
      lbar.style.width = '100%';
      lpct.textContent = '100%';
      clearInterval(loaderInt);
      const finish = () => {
        if (!gsapOk) { setTimeout(finish, 50); return; }
        setTimeout(() => {
          loader.style.opacity = '0';
          loader.style.pointerEvents = 'none';
          setTimeout(() => { loader.style.display = 'none'; initApp(); }, 700);
        }, 200);
      };
      finish();
    }
    lbar.style.width = p + '%';
    lpct.textContent = Math.floor(p) + '%';
  }, 90);

  // ── MAIN INIT (GSAP ready)
  function initApp() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('hero-loaded');

    // Hero parallax
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 18, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 }
      });
    }

    // Scroll reveal
    const seen = new WeakSet();
    ScrollTrigger.batch('.rv', {
      start: 'top 90%',
      onEnter: batch => batch.forEach(el => { if (!seen.has(el)) { seen.add(el); el.classList.add('in'); } })
    });
    ScrollTrigger.batch('.rv-l', {
      start: 'top 88%',
      onEnter: batch => batch.forEach(el => { if (!seen.has(el)) { seen.add(el); el.classList.add('in'); } })
    });
    ScrollTrigger.batch('.rv-s', {
      start: 'top 90%',
      onEnter: batch => batch.forEach(el => { if (!seen.has(el)) { seen.add(el); el.classList.add('in'); } })
    });

    // Counters
    const counted = new WeakSet();
    document.querySelectorAll('[data-count]').forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => {
          if (counted.has(el)) return;
          counted.add(el);
          const t = parseInt(el.dataset.count);
          const suffix = t === 100 ? '%' : '+';
          gsap.to({ v: 0 }, {
            v: t, duration: 1.8, ease: 'power2.out',
            onUpdate: function () { el.textContent = Math.floor(this.targets()[0].v) + suffix; },
            onComplete: () => { el.textContent = t + suffix; }
          });
        }
      });
    });

    // Bento spotlight hover
    document.querySelectorAll('.bento').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
        const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
        b.style.background = `radial-gradient(circle at ${x}% ${y}%,rgba(232,160,32,.07),transparent 60%),var(--void2)`;
      });
      b.addEventListener('mouseleave', () => { b.style.background = ''; });
    });

    // FAQ accordion
    document.querySelectorAll('.fi-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.fi');
        const ans = item.querySelector('.fi-ans');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.fi').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.fi-ans').style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    });
  }

  // ── CONTACT FORM
  const cf = document.getElementById('cf');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      const d = new FormData(this);
      const sub = encodeURIComponent('Project Inquiry from ' + d.get('name'));
      const body = encodeURIComponent(
        'Name: ' + d.get('name') +
        '\nEmail: ' + d.get('email') +
        '\nService: ' + d.get('service') +
        '\nBudget: ' + (d.get('budget') || 'Not specified') +
        '\n\nMessage:\n' + d.get('message')
      );
      window.location.href = 'mailto:aryx.k6@gmail.com?subject=' + sub + '&body=' + body;
      const fd = document.getElementById('fdone');
      if (fd) { fd.style.display = 'block'; }
      this.reset();
      setTimeout(() => { if (fd) fd.style.display = 'none'; }, 6000);
    });
  }

  // ── TAB VISIBILITY - pause animations
  document.addEventListener('visibilitychange', () => {
    const state = document.hidden ? 'paused' : 'running';
    document.querySelectorAll('.gallery-row, .mq-track, .aurora-orb, .grain').forEach(el => {
      el.style.animationPlayState = state;
    });
  });

});
