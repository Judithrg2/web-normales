(function () {
  var toggle = document.querySelector('.mast__toggle');
  var nav = document.querySelector('.mast__nav');
  var scrim = document.getElementById('menu-scrim');
  var mast = document.querySelector('.mast');
  var body = document.body;
  var MOBILE = 768;

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    }
    if (scrim) {
      scrim.classList.remove('is-visible');
      scrim.hidden = true;
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
    if (scrim) {
      scrim.hidden = false;
      scrim.classList.add('is-visible');
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    if (scrim) scrim.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width: ' + MOBILE + 'px)').matches) closeMenu();
    });
  }

  if (mast) {
    var onScroll = function () {
      mast.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
