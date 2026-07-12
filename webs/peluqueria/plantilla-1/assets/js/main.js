(function () {
  var btn = document.querySelector('.top__btn');
  var nav = document.querySelector('.top__nav');
  var scrim = document.getElementById('scrim');
  var body = document.body;
  var BP = 768;

  function isMobile() {
    return window.matchMedia('(max-width: ' + BP + 'px)').matches;
  }

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
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
    if (btn) {
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Cerrar menú');
    }
    if (scrim) {
      scrim.hidden = false;
      scrim.classList.add('is-visible');
    }
  }

  if (btn && nav) {
    btn.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    if (scrim) scrim.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (!isMobile()) closeMenu();
    });
  }
})();
