(function () {
  var indice = document.querySelector('.indice');
  var panel = document.getElementById('panel');
  var velo = document.getElementById('velo');
  var abrir = document.querySelector('.abrir-menu');
  var body = document.body;
  var BP = 768;
  var secciones = document.querySelectorAll('main section[id]');

  function esMovil() {
    return window.matchMedia('(max-width: ' + BP + 'px)').matches;
  }

  function cerrarMenu() {
    if (!panel) return;
    panel.classList.remove('activo');
    panel.hidden = true;
    body.classList.remove('menu-open');
    if (abrir) {
      abrir.setAttribute('aria-expanded', 'false');
      abrir.setAttribute('aria-label', 'Abrir menú');
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
    body.classList.add('menu-open');
    if (abrir) {
      abrir.setAttribute('aria-expanded', 'true');
      abrir.setAttribute('aria-label', 'Cerrar menú');
    }
    if (velo) {
      velo.hidden = false;
      velo.classList.add('activo');
    }
  }

  if (abrir && panel) {
    abrir.addEventListener('click', function () {
      panel.classList.contains('activo') ? cerrarMenu() : abrirMenu();
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

  if (indice && secciones.length) {
    var enlaces = indice.querySelectorAll('a');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        enlaces.forEach(function (a) {
          a.classList.toggle('activo', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    secciones.forEach(function (sec) { obs.observe(sec); });
  }

  var tabsSrv = document.querySelectorAll('.tratamientos__tab');
  var panelsSrv = document.querySelectorAll('.tratamientos__panel');

  function activarServicio(id) {
    var tabActivo = null;
    tabsSrv.forEach(function (tab) {
      var on = tab.getAttribute('data-srv') === id;
      tab.classList.toggle('activo', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (on) tabActivo = tab;
    });
    panelsSrv.forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle('activo', on);
      p.hidden = !on;
    });
    if (tabActivo && esMovil()) {
      tabActivo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  if (tabsSrv.length && panelsSrv.length) {
    tabsSrv.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        activarServicio(tab.getAttribute('data-srv'));
      });

      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft') return;
        var next = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabsSrv.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabsSrv.length) % tabsSrv.length;
        e.preventDefault();
        tabsSrv[next].focus();
        activarServicio(tabsSrv[next].getAttribute('data-srv'));
      });
    });
  }

  var form = document.getElementById('form-cita');
  var ok = document.getElementById('enviado');

  if (form) {
    var nombre = document.getElementById('f-nombre');
    var tel = document.getElementById('f-tel');
    var servicio = document.getElementById('f-servicio');

    [nombre, tel, servicio].forEach(function (campo) {
      campo.addEventListener('input', function () { campo.removeAttribute('aria-invalid'); });
      campo.addEventListener('change', function () { campo.removeAttribute('aria-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valido = true;

      [nombre, tel, servicio].forEach(function (campo) {
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
