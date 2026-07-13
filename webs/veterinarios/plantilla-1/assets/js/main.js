(function () {
  var dockBtn = document.querySelector('.dock__mas');
  var hoja = document.getElementById('hoja-menu');
  var velo = document.getElementById('velo');
  var body = document.body;
  var BP = 768;
  var dockLinks = document.querySelectorAll('.dock a[data-seccion]');
  var secciones = document.querySelectorAll('main section[id]');
  var burbujas = document.querySelector('.voces__burbujas');
  var indicador = document.querySelector('.voces__indicador');

  function esMovil() {
    return window.matchMedia('(max-width: ' + BP + 'px)').matches;
  }

  function offsetScroll() {
    var dock = document.querySelector('.dock');
    var franja = document.querySelector('.franja');
    var dockH = dock ? dock.getBoundingClientRect().height : 0;
    var franjaH = franja ? franja.getBoundingClientRect().height : 0;
    return dockH + franjaH + 16;
  }

  function irASeccion(dest) {
    if (!dest) return;
    var top = dest.getBoundingClientRect().top + window.scrollY - offsetScroll();
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function cerrarHoja() {
    if (!hoja) return;
    hoja.classList.remove('abierta');
    hoja.hidden = true;
    body.classList.remove('menu-open');
    if (dockBtn) {
      dockBtn.setAttribute('aria-expanded', 'false');
      dockBtn.setAttribute('aria-label', 'Abrir menú');
    }
    if (velo) {
      velo.classList.remove('activo');
      velo.hidden = true;
    }
  }

  function abrirHoja() {
    if (!hoja) return;
    hoja.classList.add('abierta');
    hoja.hidden = false;
    body.classList.add('menu-open');
    if (dockBtn) {
      dockBtn.setAttribute('aria-expanded', 'true');
      dockBtn.setAttribute('aria-label', 'Cerrar menú');
    }
    if (velo) {
      velo.hidden = false;
      velo.classList.add('activo');
    }
  }

  function enlazarNav(link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('data-seccion');
      var dest = id ? document.getElementById(id) : null;
      if (dest) {
        e.preventDefault();
        irASeccion(dest);
      }
      cerrarHoja();
    });
  }

  if (dockBtn && hoja) {
    dockBtn.addEventListener('click', function () {
      hoja.classList.contains('abierta') ? cerrarHoja() : abrirHoja();
    });
    if (velo) velo.addEventListener('click', cerrarHoja);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarHoja();
    });
    window.addEventListener('resize', function () {
      if (!esMovil()) cerrarHoja();
    });
  }

  document.querySelectorAll('.dock a[data-seccion], .hoja a[data-seccion]').forEach(enlazarNav);

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    if (a.getAttribute('data-seccion')) return;
    var href = a.getAttribute('href');
    if (!href || href === '#') return;
    var dest = document.querySelector(href);
    if (!dest || !dest.id) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      irASeccion(dest);
      cerrarHoja();
    });
  });

  if (secciones.length && dockLinks.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        dockLinks.forEach(function (a) {
          a.classList.toggle('activo', a.getAttribute('data-seccion') === id);
        });
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    secciones.forEach(function (s) { obs.observe(s); });
  }

  if (burbujas && indicador) {
    function revisarScroll() {
      var max = burbujas.scrollWidth - burbujas.clientWidth - 8;
      indicador.classList.toggle('oculto', burbujas.scrollLeft > 24 || max <= 0);
    }
    burbujas.addEventListener('scroll', revisarScroll, { passive: true });
    window.addEventListener('resize', revisarScroll);
    revisarScroll();
  }

  var form = document.getElementById('form-cita');
  var ok = document.getElementById('enviado');

  if (form) {
    var nombre = document.getElementById('f-nombre');
    var tel = document.getElementById('f-tel');
    var mascota = document.getElementById('f-mascota');

    [nombre, tel, mascota].forEach(function (c) {
      c.addEventListener('input', function () { c.removeAttribute('aria-invalid'); });
      c.addEventListener('change', function () { c.removeAttribute('aria-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valido = true;
      [nombre, tel, mascota].forEach(function (c) {
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
