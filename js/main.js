/* ==========================================================================
   Curriculum web — Nicolás Montiel Melendi
   JavaScript vanilla (sin dependencias externas)
   --------------------------------------------------------------------------
   1. Menú móvil
   2. Barra superior al hacer scroll
   3. Scroll-spy (resaltar la sección activa)
   4. Animaciones de entrada (IntersectionObserver)
   5. Barras de habilidades animadas
   6. Año del pie
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ======================================================================
     1. MENÚ MÓVIL
     ====================================================================== */
  const Nav = {
    init() {
      const toggle = $('#navToggle');
      const menu   = $('#navMenu');
      if (!toggle || !menu) return;

      const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        menu.classList.toggle('is-open', open);
      };

      toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });

      // Cerrar al pulsar un enlace
      $$('.nav__link', menu).forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
      });

      // Cerrar con la tecla Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
          setOpen(false);
          toggle.focus();
        }
      });

      // Cerrar al volver al ancho de escritorio
      window.addEventListener('resize', () => {
        if (window.innerWidth > 900) setOpen(false);
      });
    }
  };

  /* ======================================================================
     2. BARRA SUPERIOR AL HACER SCROLL
     ====================================================================== */
  const Topbar = {
    init() {
      const bar = $('#topbar');
      if (!bar) return;
      const onScroll = () => bar.classList.toggle('is-scrolled', window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  };

  /* ======================================================================
     3. SCROLL-SPY: sección activa en la navegación
     ====================================================================== */
  const ScrollSpy = {
    init() {
      const links = $$('.nav__link');
      if (!links.length) return;

      const sections = links
        .map((link) => {
          const id = link.getAttribute('href');
          return id && id.startsWith('#') ? document.querySelector(id) : null;
        })
        .filter(Boolean);

      if (!sections.length) return;

      const activate = (id) => {
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      };

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length) activate(visible[0].target.id);
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.5, 1] }
      );

      sections.forEach((s) => observer.observe(s));
    }
  };

  /* ======================================================================
     4. ANIMACIONES DE ENTRADA
     ====================================================================== */
  const Reveal = {
    init() {
      const items = $$('.reveal, .skill');
      if (!items.length) return;

      if (!('IntersectionObserver' in window) || prefersReducedMotion) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
      );

      items.forEach((el) => observer.observe(el));
    }
  };

  /* ======================================================================
     5. BARRAS DE HABILIDADES
     ====================================================================== */
  const Skills = {
    init() {
      const bars = $$('.skill__bar i');
      if (!bars.length) return;

      if (prefersReducedMotion) {
        bars.forEach((bar) => { bar.style.width = bar.style.getPropertyValue('--w') || '0%'; });
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.width = entry.target.style.getPropertyValue('--w') || '0%';
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      bars.forEach((bar) => observer.observe(bar));
    }
  };

  /* ======================================================================
     6. AÑO DEL PIE
     ====================================================================== */
  const Year = {
    init() {
      const el = $('#year');
      if (el) el.textContent = new Date().getFullYear();
    }
  };

  /* ======================================================================
     INICIALIZACIÓN
     ====================================================================== */
  const boot = () => {
    Nav.init();
    Topbar.init();
    ScrollSpy.init();
    Reveal.init();
    Skills.init();
    Year.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
