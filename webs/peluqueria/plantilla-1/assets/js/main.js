(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  var backdrop = document.getElementById('nav-backdrop');
  var body = document.body;
  var MOBILE_BP = 768;

  function isMobile() {
    return window.matchMedia('(max-width: ' + MOBILE_BP + 'px)').matches;
  }

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    }
    if (backdrop) {
      backdrop.classList.remove('is-visible');
      backdrop.hidden = true;
    }
  }

  function openMenu() {
    if (!nav) return;
    nav.classList.add('is-open');
    body.classList.add('menu-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
    }
    if (backdrop) {
      backdrop.hidden = false;
      backdrop.classList.add('is-visible');
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    if (backdrop) backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (!isMobile()) closeMenu();
    });
  }

  var form = document.getElementById('contact-form');
  var ok = document.getElementById('form-ok');

  if (form) {
    var nombre = form.querySelector('#nombre');
    var telefono = form.querySelector('#telefono');
    var servicio = form.querySelector('#servicio');

    [nombre, telefono, servicio].forEach(function (el) {
      el.addEventListener('input', function () { el.removeAttribute('aria-invalid'); });
      el.addEventListener('change', function () { el.removeAttribute('aria-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      [nombre, telefono, servicio].forEach(function (el) {
        if (!el.value.trim()) {
          el.setAttribute('aria-invalid', 'true');
          valid = false;
        }
      });

      if (!valid) return;

      form.reset();
      if (ok) {
        ok.hidden = false;
        setTimeout(function () { ok.hidden = true; }, 5000);
      }
    });
  }
})();
