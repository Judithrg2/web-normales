(function () {
  var toggle = document.querySelector('.rail-toggle');
  var rail = document.querySelector('.rail');
  var body = document.body;

  function closeMenu() {
    if (!rail) return;
    rail.classList.remove('is-open');
    body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && rail) {
    toggle.addEventListener('click', function () {
      var open = rail.classList.toggle('is-open');
      body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
    });

    rail.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (
        body.classList.contains('menu-open') &&
        !rail.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = [];

  navLinks.forEach(function (link) {
    var id = link.getAttribute('href');
    if (id && id.charAt(0) === '#') {
      var section = document.querySelector(id);
      if (section) sections.push({ link: link, section: section });
    }
  });

  if (sections.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          var match = sections.find(function (s) { return s.section === entry.target; });
          if (match) match.link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s.section); });
  }

  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var form = document.getElementById('contact-form');
  var ok = document.getElementById('form-ok');

  if (form) {
    var fields = form.querySelectorAll('#nombre, #email, #mensaje');

    fields.forEach(function (el) {
      el.addEventListener('input', function () {
        el.removeAttribute('aria-invalid');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      fields.forEach(function (el) {
        var empty = !el.value.trim();
        var badEmail = el.type === 'email' && el.value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);

        if (empty || badEmail) {
          el.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          el.removeAttribute('aria-invalid');
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
