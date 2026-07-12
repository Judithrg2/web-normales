(function () {
  var menuBtn = document.querySelector('.barra__menu');
  var panel = document.getElementById('panel-menu');
  var velo = document.getElementById('velo');
  var body = document.body;
  var BP = 900;

  function esMovil() {
    return window.matchMedia('(max-width: ' + BP + 'px)').matches;
  }

  function cerrarMenu() {
    if (!panel) return;
    panel.classList.remove('activo');
    panel.hidden = true;
    body.classList.remove('menu-abierto');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    }
    if (velo) {
      velo.classList.remove('activo');
      velo.hidden = true;
    }
  }

  function abrirMenu() {
    if (!panel) return;
    panel.classList.add('activo');
    panel.hidden = false;
    body.classList.add('menu-abierto');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Cerrar menú');
    }
    if (velo) {
      velo.hidden = false;
      velo.classList.add('activo');
    }
  }

  if (menuBtn && panel) {
    menuBtn.addEventListener('click', function () {
      if (panel.classList.contains('activo')) cerrarMenu();
      else abrirMenu();
    });

    panel.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', cerrarMenu);
    });

    if (velo) velo.addEventListener('click', cerrarMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu();
    });

    window.addEventListener('resize', function () {
      if (!esMovil()) cerrarMenu();
    });
  }

  var form = document.getElementById('form-cita');
  var ok = document.getElementById('enviado');

  if (form) {
    var nombre = document.getElementById('f-nombre');
    var tel = document.getElementById('f-tel');
    var motivo = document.getElementById('f-motivo');

    [nombre, tel, motivo].forEach(function (campo) {
      campo.addEventListener('input', function () { campo.removeAttribute('aria-invalid'); });
      campo.addEventListener('change', function () { campo.removeAttribute('aria-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valido = true;

      [nombre, tel, motivo].forEach(function (campo) {
        if (!campo.value.trim()) {
          campo.setAttribute('aria-invalid', 'true');
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
