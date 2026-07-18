(function () {
  'use strict';

  var btn = document.querySelector('.top__menu');
  var menu = document.getElementById('menu-movil');
  var scrim = document.getElementById('scrim');
  var body = document.body;

  function cerrarMenu() {
    if (!menu) return;
    menu.classList.remove('abierto');
    if (scrim) {
      scrim.classList.remove('visible');
      scrim.setAttribute('aria-hidden', 'true');
    }
    body.classList.remove('menu-open');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
    }
    setTimeout(function () {
      if (!menu.classList.contains('abierto')) menu.hidden = true;
      if (scrim && !menu.classList.contains('abierto')) scrim.hidden = true;
    }, 300);
  }

  function abrirMenu() {
    menu.hidden = false;
    if (scrim) {
      scrim.hidden = false;
      scrim.setAttribute('aria-hidden', 'false');
    }
    requestAnimationFrame(function () {
      menu.classList.add('abierto');
      if (scrim) scrim.classList.add('visible');
    });
    body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Cerrar menú');
  }

  if (btn && menu) {
    btn.addEventListener('click', function () {
      menu.classList.contains('abierto') ? cerrarMenu() : abrirMenu();
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', cerrarMenu);
    });
    if (scrim) scrim.addEventListener('click', cerrarMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) cerrarMenu();
    });
  }

  var scrollTick = false;
  window.addEventListener('scroll', function () {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      body.classList.toggle('scrolled', window.scrollY > 12);
      scrollTick = false;
    });
  }, { passive: true });
})();
