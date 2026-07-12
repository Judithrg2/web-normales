(function () {
  var btn = document.querySelector('.nav-btn');
  var nav = document.querySelector('.nav');
  var body = document.body;

  if (!btn || !nav) return;

  function closeMenu() {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }

  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
    body.classList.toggle('menu-open', open);
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();
