(function () {
  'use strict';

  var body = document.body;
  body.classList.remove('sin-js');

  var menuBtn = document.querySelector('.masthead__menu');
  var menu = document.getElementById('menu');
  var scrim = document.getElementById('scrim');
  var WA_NUM = '34931234567';

  function cerrarMenu() {
    if (!menu) return;
    menu.classList.remove('abierto');
    if (scrim) {
      scrim.hidden = true;
      scrim.setAttribute('aria-hidden', 'true');
    }
    body.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    }
    setTimeout(function () {
      if (menu && !menu.classList.contains('abierto')) menu.hidden = true;
    }, 280);
  }

  function abrirMenu() {
    menu.hidden = false;
    requestAnimationFrame(function () {
      menu.classList.add('abierto');
      if (scrim) {
        scrim.hidden = false;
        scrim.setAttribute('aria-hidden', 'false');
      }
    });
    body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú');
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
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

  /* Cabecera al scroll */
  var scrollTick = false;
  window.addEventListener('scroll', function () {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      body.classList.toggle('scrolled', window.scrollY > 10);
      scrollTick = false;
    });
  }, { passive: true });

  /* Nav activa */
  var navLinks = document.querySelectorAll('.masthead__nav a[href^="#"]');
  var secciones = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) secciones.push({ id: id, el: el, link: a });
  });

  if (secciones.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('activo', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    secciones.forEach(function (s) { obs.observe(s.el); });
  }

  /* WhatsApp con clase seleccionada */
  var claseSelect = document.getElementById('clase-select');
  var btnWa = document.getElementById('btn-wa');

  function actualizarWa() {
    if (!btnWa || !claseSelect) return;
    var clase = encodeURIComponent(claseSelect.value);
    btnWa.href = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent('Hola Lucía, me gustaría reservar una clase de ') + clase;
  }

  if (claseSelect && btnWa) {
    actualizarWa();
    claseSelect.addEventListener('change', actualizarWa);
  }
})();
