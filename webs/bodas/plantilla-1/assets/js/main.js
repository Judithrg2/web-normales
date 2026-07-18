(function () {
  'use strict';

  var FECHA = new Date('2026-09-20T17:30:00+02:00');

  /* Menú */
  var menuBtn = document.querySelector('.cab__menu');
  var menu = document.getElementById('menu-nav');
  var scrim = document.getElementById('scrim');
  var body = document.body;

  function cerrarMenu() {
    if (!menu) return;
    menu.classList.remove('abierto');
    if (scrim) scrim.hidden = true;
    body.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    }
  }

  function abrirMenu() {
    menu.classList.add('abierto');
    if (scrim) scrim.hidden = false;
    body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú');
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.classList.contains('abierto') ? cerrarMenu() : abrirMenu();
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });
    if (scrim) scrim.addEventListener('click', cerrarMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 768) cerrarMenu(); });
  }

  /* Cuenta atrás con segundos */
  var elD = document.getElementById('cd-d');
  var elH = document.getElementById('cd-h');
  var elM = document.getElementById('cd-m');
  var elS = document.getElementById('cd-s');

  function tick() {
    var diff = FECHA - Date.now();
    if (diff <= 0) {
      [elD, elH, elM, elS].forEach(function (el) { if (el) el.textContent = '0'; });
      return;
    }
    if (elD) elD.textContent = String(Math.floor(diff / 86400000));
    if (elH) elH.textContent = String(Math.floor((diff % 86400000) / 3600000));
    if (elM) elM.textContent = String(Math.floor((diff % 3600000) / 60000));
    if (elS) elS.textContent = String(Math.floor((diff % 60000) / 1000));
  }

  if (elD) {
    tick();
    setInterval(tick, 1000);
  }

  /* Nuestra canción — efecto visual */
  var btnCancion = document.getElementById('btn-cancion');
  if (btnCancion) {
    btnCancion.addEventListener('click', function () {
      var on = body.classList.toggle('cancion-on');
      btnCancion.setAttribute('aria-pressed', on ? 'true' : 'false');
      btnCancion.textContent = on ? '♫ Detener' : '♫ Escuchar un fragmento';
    });
  }

  /* Lightbox polaroids */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');

  var fondos = {
    'polar--a': 'linear-gradient(135deg, #f8bbd0, #d4728c)',
    'polar--b': 'linear-gradient(135deg, #e8d4b0, #c9a86c)',
    'polar--c': 'linear-gradient(135deg, #fce4ec, #f48fb1)',
    'polar--d': 'linear-gradient(135deg, #b2dfdb, #80cbc4)',
    'polar--e': 'linear-gradient(135deg, #fff9c4, #ffe082)',
    'polar--f': 'linear-gradient(135deg, #f8bbd0, #ec407a)'
  };

  document.querySelectorAll('.pol').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!lightbox) return;
      if (lbCap) lbCap.textContent = btn.getAttribute('data-cap') || '';
      if (lbImg) {
        var cls = (btn.className.match(/polar--\w/) || [''])[0];
        lbImg.style.background = fondos[cls] || fondos['polar--a'];
      }
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    });
  });

  if (lightbox) {
    lightbox.querySelector('.lightbox__x').addEventListener('click', function () { lightbox.close(); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
  }

  /* RSVP */
  var rsvp = document.getElementById('rsvp');
  var rsvpOk = document.getElementById('rsvp-ok');
  if (rsvp) {
    rsvp.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!rsvp.checkValidity()) { rsvp.reportValidity(); return; }
      rsvp.hidden = true;
      if (rsvpOk) rsvpOk.hidden = false;
    });
  }

  /* Libro de firmas */
  var firmaForm = document.getElementById('firma-form');
  var firmasLista = document.querySelector('.firmas__lista');
  if (firmaForm && firmasLista) {
    firmaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = firmaForm.querySelector('[name="firma-nombre"]').value.trim();
      var msg = firmaForm.querySelector('[name="firma-msg"]').value.trim();
      if (!nombre || !msg) return;
      var li = document.createElement('li');
      li.innerHTML = '<blockquote>«' + msg.replace(/</g, '&lt;') + '» <footer>— ' + nombre.replace(/</g, '&lt;') + ' ♥</footer></blockquote>';
      firmasLista.appendChild(li);
      firmaForm.reset();
      li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
})();
