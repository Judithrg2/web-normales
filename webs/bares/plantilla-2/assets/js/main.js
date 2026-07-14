(function () {
  'use strict';

  var body = document.body;
  body.classList.remove('sin-js');

  var header = document.getElementById('header');
  var menuBtn = document.querySelector('.vel-header__menu');
  var menu = document.getElementById('menu-panel');
  var escena = document.getElementById('mesa-escena');
  var disco = document.getElementById('mesa-disco');
  var mesaZona = document.getElementById('mesa');
  var panel = document.getElementById('mesa-panel');
  var panelFase = document.getElementById('panel-fase');
  var panelTitulo = document.getElementById('panel-titulo');
  var panelTexto = document.getElementById('panel-texto');
  var panelDetalle = document.getElementById('panel-detalle');
  var pista = document.getElementById('mesa-pista');
  var pistaTxt = pista ? pista.querySelector('.mesa-pista__txt') : null;
  var mesaWrap = document.getElementById('mesa-wrap');
  var pasosWrap = document.getElementById('mesa-pasos');
  var btnPrev = document.getElementById('mesa-prev');
  var btnNext = document.getElementById('mesa-next');
  var pasos = document.querySelectorAll('.paso[data-paso]');
  var slots = document.querySelectorAll('.mesa-slot[data-estacion]');

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = mqReduce.matches;
  var mqMobile = window.matchMedia('(max-width: 768px)');
  var BP = 769;

  var PASOS = 6;
  var GRADOS = 360 / PASOS;
  var UMBRAL_CERCA = 22;

  var estaciones = [
    {
      fase: '00 · Inicio',
      titulo: 'Antes del primer plato',
      texto: 'La mesa está puesta. Doce sillas, una vela, y el silencio justo antes de que entre el primer aroma. Aquí no hay carta fija: cada noche el chef decide según lo que llegó al mercado.',
      detalle: 'Menú degustación · 7 pasos · desde 145 €'
    },
    {
      fase: '01 · Apertura',
      titulo: 'El primer bocado',
      texto: 'Ostra templada con emulsión de pepino, aceite de eneldo y perlas de lima. Pan de masa madre con mantequilla ahumada. El cuerpo empieza a escuchar.',
      detalle: 'Amuse-bouche + aperitivo · ~25 min'
    },
    {
      fase: '02 · Mar',
      titulo: 'Lo que trae la marea',
      texto: 'Rodaballo salvaje a la brasa, piel crujiente, caldo de algas y tuétano ahumado. Pescado del día — nunca congelado, nunca repetido dos noches seguidas.',
      detalle: 'Pescado de lonja · maridaje blanco recomendado'
    },
    {
      fase: '03 · Tierra',
      titulo: 'Raíces y brasas',
      texto: 'Cordero lechal confitado 18 horas, setas de roble de Segovia y jugo de castañas. La parte más larga de la noche: fuego lento, sabor profundo.',
      detalle: 'Plato fuerte · cocción lenta'
    },
    {
      fase: '04 · Cierre',
      titulo: 'El final que no termina',
      texto: 'Soufflé de cacao caliente, sal marina de Añana, crema de pistacho y flor de azahar. Café de especialidad y petit fours de la casa.',
      detalle: 'Postre + café · selección del sommelier'
    },
    {
      fase: '05 · Reserva',
      titulo: 'Tu noche empieza aquí',
      texto: 'Doce plazas. Una sesión a las 21:00. Si esta mesa te habla, escríbenos. Respondemos en menos de 24 horas con disponibilidad y detalles del menú de esa fecha.',
      detalle: 'Señal 80 €/persona · cancelación 48 h'
    }
  ];

  var giro = 0;
  var estacionActiva = 0;
  var arrastrando = false;
  var inerciaActiva = false;
  var inicioAngPuntero = 0;
  var inicioGiro = 0;
  var ultimoAng = 0;
  var ultimoTiempo = 0;
  var velocidad = 0;
  var pointerId = null;
  var rafId = null;
  var encajeTimer = null;
  var centroCache = null;
  var swipeInicioX = 0;
  var swipeInicioY = 0;
  var navLinks = document.querySelectorAll('[data-nav]');

  function norm(n) {
    return ((n % PASOS) + PASOS) % PASOS;
  }

  function distanciaAngulo(a, b) {
    var d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  function deltaAngulo(desde, hasta) {
    var d = hasta - desde;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  function estacionDesdeGiro(ang) {
    return norm(Math.round(-ang / GRADOS));
  }

  function anguloEstacion(i) {
    return -i * GRADOS;
  }

  function centroEscena() {
    if (!escena) return { x: 0, y: 0 };
    if (!centroCache) {
      var r = escena.getBoundingClientRect();
      centroCache = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return centroCache;
  }

  function invalidarCentro() {
    centroCache = null;
  }

  function anguloPuntero(clientX, clientY) {
    var c = centroEscena();
    return Math.atan2(clientY - c.y, clientX - c.x) * 180 / Math.PI;
  }

  function vibrar(ms) {
    if (navigator.vibrate && mqMobile.matches) navigator.vibrate(ms || 8);
  }

  function feedbackEncaje() {
    if (!escena || reduceMotion) return;
    escena.classList.add('encaje');
    if (encajeTimer) clearTimeout(encajeTimer);
    encajeTimer = window.setTimeout(function () {
      escena.classList.remove('encaje');
    }, 380);
  }

  function scrollPasoVisible(i) {
    if (!pasosWrap || !mqMobile.matches) return;
    var btn = pasos[i];
    if (!btn) return;
    var left = btn.offsetLeft - pasosWrap.offsetWidth / 2 + btn.offsetWidth / 2;
    pasosWrap.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function resaltarSlots(estacion) {
    var alineado = distanciaAngulo(anguloEstacion(estacion), giro) < 4;
    if (escena) escena.classList.toggle('alineado', alineado);
    if (mesaWrap) mesaWrap.classList.toggle('alineado', alineado);

    slots.forEach(function (slot) {
      var n = parseInt(slot.getAttribute('data-estacion'), 10);
      var diff = distanciaAngulo(anguloEstacion(n), giro);
      slot.classList.toggle('activo', n === estacion);
      slot.classList.toggle('cerca', n !== estacion && diff < UMBRAL_CERCA);
    });
  }

  function aplicarGiro(ang, animar) {
    giro = ang;
    if (disco) disco.style.setProperty('--giro', giro + 'deg');
    escena.classList.toggle('inercia', !animar && inerciaActiva);
    if (animar) {
      escena.classList.remove('arrastrando', 'inercia');
      inerciaActiva = false;
    }
    resaltarSlots(estacionDesdeGiro(giro));
  }

  function setPista(texto) {
    if (pistaTxt) pistaTxt.textContent = texto;
    else if (pista) pista.textContent = texto;
  }

  function actualizarPanel(i, forzar) {
    i = norm(i);
    if (!forzar && i === estacionActiva && !arrastrando) return;
    estacionActiva = i;
    var d = estaciones[i];
    if (!d) return;

    pasos.forEach(function (p) {
      var n = parseInt(p.getAttribute('data-paso'), 10);
      var on = n === i;
      p.classList.toggle('activo', on);
      p.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    scrollPasoVisible(i);

    if (panel) {
      panel.classList.add('cambia');
      panel.setAttribute('aria-labelledby', 'paso-' + i);
      window.setTimeout(function () { panel.classList.remove('cambia'); }, 400);
    }

    if (panelFase) panelFase.textContent = d.fase;
    if (panelTitulo) panelTitulo.textContent = d.titulo;
    if (panelDetalle) panelDetalle.textContent = d.detalle;

    if (panelTexto) {
      panelTexto.textContent = d.texto;
      if (!reduceMotion) {
        panelTexto.style.opacity = '0';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { panelTexto.style.opacity = '1'; });
        });
      }
    }

    var alineado = distanciaAngulo(anguloEstacion(i), giro) < 4;
    setPista(alineado ? 'Alineado · ' + d.fase : 'Gira hasta alinear · ' + d.fase);

    document.querySelectorAll('.plato-card[data-slot]').forEach(function (card) {
      var slot = parseInt(card.getAttribute('data-slot'), 10);
      card.classList.toggle('activo', slot === i);
    });
  }

  function irEstacion(i, animar) {
    i = norm(i);
    aplicarGiro(anguloEstacion(i), animar !== false);
    actualizarPanel(i);
    if (animar !== false) {
      vibrar(10);
      feedbackEncaje();
    }
  }

  function snapEstacion() {
    var dest = estacionDesdeGiro(giro);
    irEstacion(dest, true);
  }

  function pararInercia() {
    inerciaActiva = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function loopInercia() {
    if (Math.abs(velocidad) < 0.15) {
      pararInercia();
      snapEstacion();
      return;
    }
    inerciaActiva = true;
    giro += velocidad;
    velocidad *= 0.91;
    aplicarGiro(giro, false);

    var est = estacionDesdeGiro(giro);
    if (est !== estacionActiva && distanciaAngulo(anguloEstacion(est), giro) < 7) {
      actualizarPanel(est);
      vibrar(5);
    }

    rafId = requestAnimationFrame(loopInercia);
  }

  if (header) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle('sombra', window.scrollY > 16);
        ticking = false;
      });
    }, { passive: true });
  }

  if (navLinks.length && 'IntersectionObserver' in window) {
    var secciones = [
      { id: 'inicio', el: document.getElementById('inicio') },
      { id: 'salon', el: document.getElementById('salon') },
      { id: 'temporada', el: document.getElementById('temporada') },
      { id: 'reservar', el: document.getElementById('reservar') }
    ].filter(function (s) { return s.el; });

    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('activo', a.getAttribute('data-nav') === id);
        });
      });
    }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });

    secciones.forEach(function (s) { navObs.observe(s.el); });
  }

  window.addEventListener('resize', invalidarCentro, { passive: true });
  window.addEventListener('scroll', invalidarCentro, { passive: true });

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

  pasos.forEach(function (btn) {
    var idx = parseInt(btn.getAttribute('data-paso'), 10);
    btn.addEventListener('click', function () {
      pararInercia();
      irEstacion(idx, true);
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      pararInercia();
      var next = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
      irEstacion(next, true);
      pasos[norm(next)].focus();
    });
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      pararInercia();
      irEstacion(estacionActiva - 1, true);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      pararInercia();
      irEstacion(estacionActiva + 1, true);
    });
  }

  document.querySelectorAll('.plato-card[data-slot]').forEach(function (card) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', function () {
      pararInercia();
      irEstacion(parseInt(card.getAttribute('data-slot'), 10), true);
      var mesaTop = document.getElementById('inicio');
      if (mesaTop) mesaTop.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    card.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      card.click();
    });
  });

  slots.forEach(function (slot) {
    slot.setAttribute('role', 'button');
    slot.setAttribute('tabindex', '0');
    slot.setAttribute('aria-label', 'Ir al paso ' + slot.getAttribute('data-estacion'));
    slot.addEventListener('click', function (e) {
      e.stopPropagation();
      pararInercia();
      irEstacion(parseInt(slot.getAttribute('data-estacion'), 10), true);
    });
    slot.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      slot.click();
    });
  });

  if (escena && disco) {
    escena.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.mesa-ctrl, .mesa-slot')) return;
      pararInercia();
      arrastrando = true;
      pointerId = e.pointerId;
      inicioAngPuntero = anguloPuntero(e.clientX, e.clientY);
      ultimoAng = inicioAngPuntero;
      ultimoTiempo = performance.now();
      inicioGiro = giro;
      velocidad = 0;
      swipeInicioX = e.clientX;
      swipeInicioY = e.clientY;
      if (disco) disco.style.willChange = 'transform';
      escena.classList.add('arrastrando', 'interactuando');
      if (mesaWrap) mesaWrap.classList.add('interactuando');
      setPista('Girando…');
      escena.setPointerCapture(e.pointerId);
    });

    escena.addEventListener('pointermove', function (e) {
      if (!arrastrando || e.pointerId !== pointerId) return;
      var ahora = performance.now();
      var ang = anguloPuntero(e.clientX, e.clientY);
      var dt = ahora - ultimoTiempo;
      if (dt > 0) {
        var dAng = deltaAngulo(ultimoAng, ang);
        velocidad = (dAng / dt) * 16;
      }
      ultimoAng = ang;
      ultimoTiempo = ahora;
      var total = deltaAngulo(inicioAngPuntero, ang);
      aplicarGiro(inicioGiro + total, false);

      var est = estacionDesdeGiro(giro);
      if (distanciaAngulo(anguloEstacion(est), giro) < 5 && est !== estacionActiva) {
        actualizarPanel(est);
        vibrar(5);
      }
    });

    function soltar(e) {
      if (!arrastrando || (e.pointerId !== undefined && e.pointerId !== pointerId)) return;

      var dx = (e.clientX || swipeInicioX) - swipeInicioX;
      var dy = (e.clientY || swipeInicioY) - swipeInicioY;

      arrastrando = false;
      pointerId = null;
      escena.classList.remove('arrastrando', 'interactuando');
      if (mesaWrap) mesaWrap.classList.remove('interactuando');
      if (disco) disco.style.willChange = '';

      if (mqMobile.matches && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4 && Math.abs(velocidad) < 0.5) {
        pararInercia();
        irEstacion(estacionActiva + (dx < 0 ? 1 : -1), true);
        return;
      }

      actualizarPanel(estacionDesdeGiro(giro), true);

      if (Math.abs(velocidad) > 0.8 && !reduceMotion) {
        loopInercia();
      } else {
        snapEstacion();
      }
    }

    escena.addEventListener('pointerup', soltar);
    escena.addEventListener('pointercancel', soltar);

    escena.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        pararInercia();
        irEstacion(estacionActiva + (e.key === 'ArrowRight' ? 1 : -1), true);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        pararInercia();
        irEstacion(0, true);
      }
    });
  }

  if (mesaZona) {
    mesaZona.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      pararInercia();
      irEstacion(estacionActiva + (e.deltaY > 0 ? 1 : -1), true);
    }, { passive: false });
  }

  mqReduce.addEventListener('change', function (e) { reduceMotion = e.matches; });

  irEstacion(0, false);
  setPista('Arrastra la mesa con el dedo o el ratón');

  var form = document.getElementById('form');
  var ok = document.getElementById('ok');
  var btnEnviar = document.getElementById('btn-enviar');

  if (form) {
    var campos = [
      document.getElementById('nombre'),
      document.getElementById('email'),
      document.getElementById('comensales'),
      document.getElementById('fecha')
    ];

    var fechaInput = document.getElementById('fecha');
    if (fechaInput) {
      var hoy = new Date();
      hoy.setDate(hoy.getDate() + 1);
      fechaInput.min = hoy.toISOString().split('T')[0];
    }

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
