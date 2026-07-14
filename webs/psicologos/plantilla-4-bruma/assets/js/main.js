(function () {
  'use strict';

  var body = document.body;
  body.classList.remove('sin-js');

  var nav = document.getElementById('nav');
  var menuBtn = document.querySelector('.bruma-nav__menu');
  var menu = document.getElementById('menu-panel');
  var velo = document.querySelector('.velo');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqDesktop = window.matchMedia('(min-width: 769px)');
  var reduceMotion = mqReduce.matches;
  var BP = 769;

  var tonos = [
    { nombre: 'nublado', texto: 'Llegar sin claridad también es llegar. No necesitas saber cómo nombrarlo para empezar.' },
    { nombre: 'tenso', texto: 'La tensión suele avisar antes que las palabras. Podemos escucharla sin pelear con ella.' },
    { nombre: 'cansado', texto: 'El agotamiento no es flojera. A veces es la señal de llevar demasiado tiempo fuerte.' },
    { nombre: 'perdido', texto: 'Sentirse perdido no significa que no haya salida. Significa que el mapa que tenías ya no sirve.' },
    { nombre: 'enfadado', texto: 'La rabia suele proteger algo más frágil. Tiene sentido mirarla con cuidado.' },
    { nombre: 'esperanza', texto: 'Venir con esperanza también es válido. No hace falta estar mal para pedir acompañamiento.' }
  ];

  var ecos = [
    'No estás exagerando. Mucha gente llega diciendo exactamente eso.',
    'La vergüenza suele ser la última puerta antes de pedir ayuda. Aquí no se juzga.',
    'Cuando dejáis de oíros, a veces hace falta un tercer espacio para volver a entenderos.'
  ];

  function rafThrottle(fn) {
    var ticking = false;
    var lastArgs = null;
    return function () {
      lastArgs = arguments;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        fn.apply(null, lastArgs);
        ticking = false;
      });
    };
  }

  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('sombra', window.scrollY > 16);
    }, { passive: true });
  }

  function cerrarMenu() {
    if (!menu) return;
    menu.hidden = true;
    body.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
    }
  }

  function abrirMenu() {
    if (!menu) return;
    menu.hidden = false;
    body.classList.add('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Cerrar menú');
    }
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.hidden ? abrirMenu() : cerrarMenu();
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });
    menu.addEventListener('click', function (e) { if (e.target === menu) cerrarMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });
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
      dest.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      cerrarMenu();
    });
  });

  if (velo && !reduceMotion && mqDesktop.matches) {
    var manchas = velo.querySelectorAll('.velo__mancha');
    window.addEventListener('mousemove', rafThrottle(function (e) {
      if (!mqDesktop.matches) return;
      var x = (e.clientX / window.innerWidth - 0.5) * 20;
      var y = (e.clientY / window.innerHeight - 0.5) * 20;
      manchas.forEach(function (m, i) {
        var f = (i + 1) * 0.5;
        m.style.setProperty('--parallax-x', (x * f) + 'px');
        m.style.setProperty('--parallax-y', (y * f) + 'px');
      });
    }), { passive: true });
  }

  var titulo = document.querySelector('[data-texto-tilt]');
  if (titulo && !reduceMotion && mqDesktop.matches) {
    titulo.addEventListener('mousemove', rafThrottle(function (e) {
      var r = titulo.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      titulo.style.transform = 'rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 4) + 'deg)';
    }));
    titulo.addEventListener('mouseleave', function () { titulo.style.transform = ''; });
  }

  document.querySelectorAll('[data-magnet]').forEach(function (btn) {
    if (reduceMotion) return;
    btn.addEventListener('mousemove', rafThrottle(function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2;
      var y = e.clientY - r.top - r.height / 2;
      btn.style.setProperty('--mag-x', (x * 0.18) + 'px');
      btn.style.setProperty('--mag-y', (y * 0.18) + 'px');
    }));
    btn.addEventListener('mouseleave', function () {
      btn.style.setProperty('--mag-x', '0px');
      btn.style.setProperty('--mag-y', '0px');
    });
  });

  var slider = document.getElementById('tono-slider');
  var tonoAhora = document.getElementById('tono-ahora');
  var tonoResp = document.getElementById('tono-respuesta');
  var marcas = document.querySelectorAll('.tono__marca');

  function actualizarTono(val) {
    var i = parseInt(val, 10);
    var t = tonos[i];
    if (!t) return;
    if (tonoAhora) tonoAhora.textContent = t.nombre;
    if (slider) {
      slider.setAttribute('aria-valuenow', val);
      slider.setAttribute('aria-valuetext', t.nombre + '. ' + t.texto);
    }
    marcas.forEach(function (m, j) { m.classList.toggle('activa', j === i); });
    if (tonoResp) {
      tonoResp.style.opacity = '0';
      window.setTimeout(function () {
        tonoResp.textContent = t.texto;
        tonoResp.style.opacity = '1';
      }, reduceMotion ? 0 : 160);
    }
  }

  if (slider) {
    slider.addEventListener('input', function () { actualizarTono(slider.value); });
    actualizarTono(slider.value);
  }

  marcas.forEach(function (m) {
    var val = m.getAttribute('data-tono');
    if (val === null || !slider) return;
    m.addEventListener('click', function () {
      slider.value = val;
      actualizarTono(val);
    });
  });

  var ecoResp = document.getElementById('eco-respuesta');
  document.querySelectorAll('.eco').forEach(function (eco) {
    eco.addEventListener('mousemove', rafThrottle(function (e) {
      var r = eco.getBoundingClientRect();
      eco.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      eco.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    }));
    eco.addEventListener('click', function () {
      var i = parseInt(eco.getAttribute('data-eco'), 10);
      var yaActiva = eco.classList.contains('activa');
      document.querySelectorAll('.eco').forEach(function (el) { el.classList.remove('activa'); });
      if (yaActiva) {
        if (ecoResp) ecoResp.hidden = true;
        return;
      }
      eco.classList.add('activa');
      if (ecoResp && ecos[i] !== undefined) {
        ecoResp.textContent = ecos[i];
        ecoResp.hidden = false;
      }
    });
  });

  var farosDatos = [
    { etq: '01', nombre: 'Ansiedad', texto: 'Preocupación persistente, insomnio, tensión. Trabajamos qué lo enciende y cómo recuperar margen sin pedirte calma a la fuerza.' },
    { etq: '02', nombre: 'Pareja', texto: 'Un espacio para entender qué pasa entre vosotros, no para señalar culpables.' },
    { etq: '03', nombre: 'Duelo', texto: 'Rupturas, despedidas, etapas que se cierran. El dolor no lleva manual de uso.' },
    { etq: '04', nombre: 'Límites', texto: 'Dejar de complacer, entender patrones que se repiten, construir criterio propio.' },
    { etq: '05', nombre: 'Online', texto: 'Videollamada segura. Misma confidencialidad que en consulta.' }
  ];

  var farosWrap = document.getElementById('faros');
  var faroPanel = document.getElementById('faro-panel');
  var faroEtq = document.getElementById('faro-panel-etq');
  var faroTitulo = document.getElementById('faro-panel-titulo');
  var faroTexto = document.getElementById('faro-panel-texto');
  var faroTabs = document.querySelectorAll('.faro[data-faro]');
  var faroActivo = null;

  function seleccionarFaro(i, toggle) {
    var d = farosDatos[i];
    if (!d) return;

    if (toggle && faroActivo === i) {
      faroTabs.forEach(function (t) {
        t.classList.remove('activo');
        t.setAttribute('aria-selected', 'false');
      });
      if (faroPanel) faroPanel.hidden = true;
      if (farosWrap) farosWrap.classList.remove('activo');
      faroActivo = null;
      return;
    }

    faroTabs.forEach(function (t, j) {
      var on = j === i;
      t.classList.toggle('activo', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    if (faroPanel) {
      faroPanel.hidden = false;
      faroPanel.setAttribute('aria-labelledby', 'faro-tab-' + i);
      faroPanel.style.animation = 'none';
      void faroPanel.offsetHeight;
      faroPanel.style.animation = '';
    }
    if (farosWrap) farosWrap.classList.add('activo');
    if (faroEtq) faroEtq.textContent = d.etq;
    if (faroTitulo) faroTitulo.textContent = d.nombre;
    if (faroTexto) {
      if (!reduceMotion) {
        faroTexto.style.opacity = '0';
        window.setTimeout(function () {
          faroTexto.textContent = d.texto;
          faroTexto.style.opacity = '1';
        }, 120);
      } else {
        faroTexto.textContent = d.texto;
      }
    }
    faroActivo = i;
  }

  faroTabs.forEach(function (tab) {
    var idx = parseInt(tab.getAttribute('data-faro'), 10);
    tab.addEventListener('click', function () { seleccionarFaro(idx, true); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var next = e.key === 'ArrowRight'
        ? Math.min(idx + 1, faroTabs.length - 1)
        : Math.max(idx - 1, 0);
      faroTabs[next].focus();
      seleccionarFaro(next, false);
    });
  });

  var hiloNodos = document.querySelectorAll('.hilo__nodo');
  var seccionIds = ['tono', 'temas', 'noa', 'llegar'];
  var seccionVis = {};

  function actualizarHilo() {
    var mejor = null;
    var mejorRatio = 0;
    seccionIds.forEach(function (id) {
      var ratio = seccionVis[id] || 0;
      if (ratio > mejorRatio) {
        mejorRatio = ratio;
        mejor = id;
      }
    });
    if (!mejor && window.scrollY < 120) mejor = 'tono';
    hiloNodos.forEach(function (n) {
      n.classList.toggle('activo', n.getAttribute('data-seccion') === mejor);
    });
  }

  if (hiloNodos.length && 'IntersectionObserver' in window) {
    var hiloObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        seccionVis[entry.target.id] = entry.intersectionRatio;
      });
      actualizarHilo();
    }, { threshold: [0, 0.15, 0.35, 0.55, 0.75] });
    seccionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        seccionVis[id] = 0;
        hiloObs.observe(el);
      }
    });
    window.addEventListener('scroll', actualizarHilo, { passive: true });
  }

  var animables = document.querySelectorAll('.tono, .ecos, .temas, .orbita-precio, .noa__textos, .llegar__cuerpo');

  function mostrarAnimables() {
    animables.forEach(function (el) {
      el.classList.add('visible');
      if (el.classList.contains('noa__textos')) {
        el.querySelectorAll('.noa__linea').forEach(function (l) { l.classList.add('visible'); });
      }
    });
  }

  function revelarAnimable(el) {
    el.classList.add('visible');
    if (el.classList.contains('noa__textos')) {
      el.querySelectorAll('.noa__linea').forEach(function (l, i) {
        if (reduceMotion) {
          l.classList.add('visible');
        } else {
          window.setTimeout(function () { l.classList.add('visible'); }, i * 160);
        }
      });
    }
  }

  function estaEnVista(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.04;
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revelarAnimable(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    animables.forEach(function (el) {
      el.classList.add('sube');
      if (estaEnVista(el)) {
        revelarAnimable(el);
      } else {
        obs.observe(el);
      }
    });
  } else {
    animables.forEach(function (el) { el.classList.add('sube'); });
    mostrarAnimables();
  }

  var form = document.getElementById('form');
  var ok = document.getElementById('ok');
  var btnEnviar = document.getElementById('btn-enviar');

  if (form) {
    var campos = [
      document.getElementById('nombre'),
      document.getElementById('email'),
      document.getElementById('mensaje')
    ];

    campos.forEach(function (c) {
      if (!c) return;
      c.addEventListener('input', function () { c.removeAttribute('aria-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btnEnviar && btnEnviar.disabled) return;

      var valido = true;
      var primero = null;

      campos.forEach(function (c) {
        if (!c) return;
        if (!c.value.trim()) {
          c.setAttribute('aria-invalid', 'true');
          valido = false;
          if (!primero) primero = c;
        } else if (c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value)) {
          c.setAttribute('aria-invalid', 'true');
          valido = false;
          if (!primero) primero = c;
        }
      });

      if (!valido) {
        if (primero) primero.focus();
        return;
      }

      if (btnEnviar) btnEnviar.disabled = true;
      form.reset();
      if (ok) {
        ok.hidden = false;
        window.setTimeout(function () {
          ok.hidden = true;
          if (btnEnviar) btnEnviar.disabled = false;
        }, 5000);
      } else if (btnEnviar) {
        btnEnviar.disabled = false;
      }
    });
  }
})();
