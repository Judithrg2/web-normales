(function () {
  'use strict';

  var menuBtn = document.querySelector('.ruta__menu');
  var menuMovil = document.getElementById('ruta-movil');
  var body = document.body;

  function cerrar() {
    if (!menuMovil) return;
    menuMovil.classList.remove('abierto');
    body.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    }
    setTimeout(function () {
      if (!menuMovil.classList.contains('abierto')) menuMovil.hidden = true;
    }, 300);
  }

  function abrir() {
    menuMovil.hidden = false;
    requestAnimationFrame(function () { menuMovil.classList.add('abierto'); });
    body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú');
  }

  if (menuBtn && menuMovil) {
    menuBtn.addEventListener('click', function () {
      menuMovil.classList.contains('abierto') ? cerrar() : abrir();
    });
    menuMovil.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', cerrar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrar();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) cerrar();
    });
  }

  /* Turno día/noche en comedor */
  var turnoBtns = document.querySelectorAll('[data-turno]');
  if (turnoBtns.length) {
    turnoBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = btn.dataset.turno;
        turnoBtns.forEach(function (b) { b.classList.toggle('activo', b === btn); });
        document.querySelectorAll('[data-panel]').forEach(function (p) {
          p.hidden = p.dataset.panel !== t;
        });
      });
    });
  }

  /* Formulario parada */
  var form = document.getElementById('form-parada');
  var formOk = document.getElementById('form-ok');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.hidden = true;
      if (formOk) formOk.hidden = false;
    });
  }
})();
