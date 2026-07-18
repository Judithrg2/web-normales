(function () {
  'use strict';

  var body = document.body;
  body.classList.remove('sin-js');

  var menuBtn = document.querySelector('.barra__menu');
  var nav = document.getElementById('nav');
  var velo = document.getElementById('velo');
  var form = document.getElementById('parte');
  var WA_NUM = '34976111222';
  var mqDesktop = window.matchMedia('(min-width: 768px)');
  var scrollTick = false;

  function esDesktop() {
    return mqDesktop.matches;
  }

  function cerrarMenu() {
    if (!nav) return;
    nav.classList.remove('abierto');
    if (velo) {
      velo.hidden = true;
      velo.setAttribute('aria-hidden', 'true');
    }
    body.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
      if (document.activeElement && nav.contains(document.activeElement)) {
        menuBtn.focus();
      }
    }
    nav.hidden = !esDesktop();
  }

  function abrirMenu() {
    if (!nav || !menuBtn) return;
    nav.hidden = false;
    requestAnimationFrame(function () {
      nav.classList.add('abierto');
      if (velo) {
        velo.hidden = false;
        velo.setAttribute('aria-hidden', 'false');
      }
      var primero = nav.querySelector('a');
      if (primero) primero.focus();
    });
    body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú');
  }

  if (menuBtn && nav) {
    nav.hidden = !esDesktop();

    menuBtn.addEventListener('click', function () {
      nav.classList.contains('abierto') ? cerrarMenu() : abrirMenu();
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!esDesktop()) cerrarMenu();
      });
    });

    if (velo) velo.addEventListener('click', cerrarMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu();
    });

    function onViewportChange() {
      cerrarMenu();
    }

    if (mqDesktop.addEventListener) {
      mqDesktop.addEventListener('change', onViewportChange);
    } else if (mqDesktop.addListener) {
      mqDesktop.addListener(onViewportChange);
    }
  }

  /* Cabecera con elevación al scroll */
  function actualizarScroll() {
    body.classList.toggle('scrolled', window.scrollY > 8);
    scrollTick = false;
  }

  window.addEventListener('scroll', function () {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(actualizarScroll);
  }, { passive: true });
  actualizarScroll();

  /* Nav activa */
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');
  var secciones = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) secciones.push({ el: el, link: a });
  });

  if (secciones.length && 'IntersectionObserver' in window) {
    var visible = new Map();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting && entry.intersectionRatio > 0);
      });

      var activa = null;
      secciones.forEach(function (s) {
        if (visible.get(s.el.id)) activa = s.link;
      });

      navLinks.forEach(function (a) {
        var on = activa !== null && a === activa;
        a.classList.toggle('activo', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.1, 0.25] });

    secciones.forEach(function (s) { obs.observe(s.el); });
  }

  /* FAB: ocultar con teclado (iOS visualViewport + focus) */
  function syncTeclado() {
    if (esDesktop()) {
      body.classList.remove('teclado-abierto');
      return;
    }
    var vv = window.visualViewport;
    var teclado = false;
    if (vv && window.innerHeight - vv.height > 120) teclado = true;
    if (form && form.contains(document.activeElement)) teclado = true;
    body.classList.toggle('teclado-abierto', teclado);
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncTeclado);
    window.visualViewport.addEventListener('scroll', syncTeclado);
  }

  if (form) {
    form.addEventListener('focusin', syncTeclado);
    form.addEventListener('focusout', function () {
      setTimeout(syncTeclado, 80);
    });
  }

  /* Parte → WhatsApp */
  var errorEl = document.getElementById('parte-error');
  var btnSubmit = form ? form.querySelector('button[type="submit"]') : null;

  function limpiarErrores() {
    if (!form) return;
    form.querySelectorAll('.campo--error').forEach(function (el) {
      el.classList.remove('campo--error');
    });
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
  }

  function abrirWhatsApp(texto) {
    var url = 'https://api.whatsapp.com/send?phone=' + WA_NUM + '&text=' + encodeURIComponent(texto);
    if (esDesktop()) {
      var win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) window.location.href = url;
    } else {
      window.location.href = url;
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      limpiarErrores();

      var nombreInput = document.getElementById('nombre');
      var zonaInput = document.getElementById('zona-campo');
      var averiaInput = document.getElementById('averia');
      var detalleInput = document.getElementById('detalle');

      var nombre = (nombreInput.value || '').trim();
      var zona = (zonaInput.value || '').trim();
      var averia = averiaInput.value;
      var detalle = (detalleInput.value || '').trim();

      if (!nombre || !zona) {
        if (!nombre) nombreInput.closest('.campo').classList.add('campo--error');
        if (!zona) zonaInput.closest('.campo').classList.add('campo--error');
        if (errorEl) {
          errorEl.textContent = 'Indica tu nombre y el barrio o la dirección.';
          errorEl.hidden = false;
        }
        (!nombre ? nombreInput : zonaInput).focus();
        return;
      }

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Abriendo WhatsApp…';
      }

      var lineas = [
        'Hola, quiero avisar una avería a Caudal.',
        '',
        'Nombre: ' + nombre,
        'Zona: ' + zona,
        'Avería: ' + averia
      ];
      if (detalle) lineas.push('Detalle: ' + detalle);
      lineas.push('', '¿Podéis confirmarme la disponibilidad?');

      abrirWhatsApp(lineas.join('\n'));

      setTimeout(function () {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Enviar por WhatsApp';
        }
      }, 1500);
    });

    form.addEventListener('input', limpiarErrores);
  }
})();
