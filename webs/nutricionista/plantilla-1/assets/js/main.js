(function () {
  var head = document.getElementById('site-head');
  var menuBtn = document.querySelector('.site-head__menu');
  var overlay = document.getElementById('nav-overlay');
  var body = document.body;
  var BP = 768;

  function offset() {
    return head ? head.getBoundingClientRect().height + 8 : 0;
  }

  function irA(dest) {
    if (!dest) return;
    var top = dest.getBoundingClientRect().top + window.scrollY - offset();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  if (head && window.matchMedia('(min-width: ' + BP + 'px)').matches) {
    window.addEventListener('scroll', function () {
      head.classList.toggle('site-head--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  function cerrarMenu() {
    if (!overlay) return;
    overlay.hidden = true;
    body.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    }
  }

  function abrirMenu() {
    if (!overlay) return;
    overlay.hidden = false;
    body.classList.add('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Cerrar menú');
    }
  }

  if (menuBtn && overlay) {
    menuBtn.addEventListener('click', function () {
      overlay.hidden ? abrirMenu() : cerrarMenu();
    });

    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          e.preventDefault();
          irA(document.querySelector(href));
        }
        cerrarMenu();
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) cerrarMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu();
    });

    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: ' + BP + 'px)').matches) cerrarMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href === '#') return;
    a.addEventListener('click', function (e) {
      var dest = document.querySelector(href);
      if (!dest) return;
      e.preventDefault();
      irA(dest);
      cerrarMenu();
    });
  });

  var form = document.getElementById('form');
  var ok = document.getElementById('ok');

  if (form) {
    var campos = [
      document.getElementById('nombre'),
      document.getElementById('tel'),
      document.getElementById('motivo')
    ];

    campos.forEach(function (c) {
      c.addEventListener('input', function () { c.removeAttribute('aria-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valido = true;
      campos.forEach(function (c) {
        if (!c.value.trim()) {
          c.setAttribute('aria-invalid', 'true');
          valido = false;
        }
      });
      if (!valido) return;
      form.reset();
      if (ok) {
        ok.hidden = false;
        setTimeout(function () { ok.hidden = true; }, 5000);
      }
    });
  }
})();
