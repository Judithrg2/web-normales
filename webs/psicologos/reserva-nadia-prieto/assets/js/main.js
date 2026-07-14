(function () {
  var head = document.getElementById('archivo-head');
  var menuBtn = document.querySelector('.archivo-head__menu');
  var panel = document.getElementById('menu-panel');
  var body = document.body;
  var BP = 769;

  function offset() {
    return head ? head.getBoundingClientRect().height + 10 : 0;
  }

  function irA(dest) {
    if (!dest) return;
    var top = dest.getBoundingClientRect().top + window.scrollY - offset();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function cerrarMenu() {
    if (!panel) return;
    panel.hidden = true;
    body.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    }
  }

  function abrirMenu() {
    if (!panel) return;
    panel.hidden = false;
    body.classList.add('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Cerrar menú');
    }
  }

  if (menuBtn && panel) {
    menuBtn.addEventListener('click', function () {
      panel.hidden ? abrirMenu() : cerrarMenu();
    });

    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          e.preventDefault();
          irA(document.querySelector(href));
        }
        cerrarMenu();
      });
    });

    panel.addEventListener('click', function (e) {
      if (e.target === panel) cerrarMenu();
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

  var tabsRoot = document.querySelector('[data-tabs]');
  if (tabsRoot) {
    var tabBtns = tabsRoot.querySelectorAll('[role="tab"]');
    var tabPanels = tabsRoot.querySelectorAll('[role="tabpanel"]');

    function activarTab(btn) {
      tabBtns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      tabPanels.forEach(function (p) {
        p.hidden = p.id !== btn.getAttribute('aria-controls');
      });
    }

    tabBtns.forEach(function (btn, i) {
      btn.addEventListener('click', function () { activarTab(btn); });

      btn.addEventListener('keydown', function (e) {
        var next = i;
        if (e.key === 'ArrowRight') next = (i + 1) % tabBtns.length;
        else if (e.key === 'ArrowLeft') next = (i - 1 + tabBtns.length) % tabBtns.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabBtns.length - 1;
        else return;
        e.preventDefault();
        activarTab(tabBtns[next]);
        tabBtns[next].focus();
      });
    });
  }

  var form = document.getElementById('form');
  var ok = document.getElementById('ok');

  if (form) {
    var campos = [
      document.getElementById('nombre'),
      document.getElementById('email'),
      document.getElementById('mensaje')
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
        } else if (c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value)) {
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
