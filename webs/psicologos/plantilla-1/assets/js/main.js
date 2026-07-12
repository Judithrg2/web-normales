(function () {
  'use strict';

  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (toggle && menu) {
    function closeMenu() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = form.querySelector('#nombre');
      const email = form.querySelector('#email');
      const mensaje = form.querySelector('#mensaje');

      let valid = true;

      [nombre, email, mensaje].forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#c47a7a';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#c47a7a';
        valid = false;
      }

      if (!valid) return;

      form.reset();
      if (successMsg) {
        successMsg.hidden = false;
        setTimeout(function () {
          successMsg.hidden = true;
        }, 5000);
      }
    });
  }

  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 2px 12px rgba(61, 58, 54, 0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }
})();
