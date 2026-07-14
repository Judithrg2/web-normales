(function () {
  'use strict';

  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esMovil = window.matchMedia('(max-width: 768px)').matches;
  var esTactil = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  /* —— Cabecera al scroll —— */
  var scrollTick = false;
  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      document.body.classList.toggle('scrolled', window.scrollY > 24);
      scrollTick = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* —— WhatsApp —— */
  var WSP_NUMERO = '34961234567';

  function urlWsp(texto) {
    return 'https://wa.me/' + WSP_NUMERO + '?text=' + encodeURIComponent(texto);
  }

  /* —— Menú móvil —— */
  var menuBtn = document.querySelector('.menu-movil');
  var menuPanel = document.getElementById('menu-movil');

  if (menuBtn && menuPanel) {
    function cerrarMenu() {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuPanel.hidden = true;
      document.body.classList.remove('menu-open');
    }

    function abrirMenu() {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuPanel.hidden = false;
      document.body.classList.add('menu-open');
    }

    menuBtn.addEventListener('click', function () {
      if (menuPanel.hidden) abrirMenu();
      else cerrarMenu();
    });

    menuPanel.querySelectorAll('[data-cierra-menu]').forEach(function (a) {
      a.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menuPanel.hidden) cerrarMenu();
    });
  }

  /* —— Partículas —— */
  var canvas = document.getElementById('fondo-vivo');
  if (canvas && !reducido) {
    var ctx = canvas.getContext('2d', { alpha: true });
    var particulas = [];
    var raton = { x: -9999, y: -9999 };
    var activo = true;
    var rafParticulas = 0;
    var dibujarLineas = !esMovil;
    var cantidad = esMovil ? 22 : (window.innerWidth < 1100 ? 55 : 75);
    var resizeTimer = 0;

    function dpr() {
      return Math.min(window.devicePixelRatio || 1, esMovil ? 1 : 1.5);
    }

    function tamCanvas() {
      var ratio = dpr();
      var w = window.innerWidth;
      var h = window.innerHeight;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function crearParticulas() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      particulas = [];
      for (var i = 0; i < cantidad; i++) {
        particulas.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          brillo: Math.random()
        });
      }
    }

    function dibujar() {
      rafParticulas = 0;
      if (!activo) return;

      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particulas.length; i++) {
        var p = particulas[i];

        if (!esTactil) {
          var dx = raton.x - p.x;
          var dy = raton.y - p.y;
          var dist = dx * dx + dy * dy;
          if (dist < 14400 && dist > 0) {
            dist = Math.sqrt(dist);
            p.vx += (dx / dist) * 0.018;
            p.vy += (dy / dist) * 0.018;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        p.brillo += 0.02;
        var alpha = 0.22 + Math.sin(p.brillo) * 0.12;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(142, 202, 230, ' + alpha + ')';
        ctx.fill();
      }

      if (dibujarLineas) {
        for (var a = 0; a < particulas.length; a++) {
          for (var b = a + 1; b < particulas.length; b++) {
            var pa = particulas[a];
            var pb = particulas[b];
            var ddx = pa.x - pb.x;
            var ddy = pa.y - pb.y;
            var d2 = ddx * ddx + ddy * ddy;
            if (d2 < 10000) {
              var d = Math.sqrt(d2);
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.strokeStyle = 'rgba(42, 157, 143, ' + (0.1 * (1 - d / 100)) + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      rafParticulas = requestAnimationFrame(dibujar);
    }

    function iniciarParticulas() {
      if (!rafParticulas) rafParticulas = requestAnimationFrame(dibujar);
    }

    function pararParticulas() {
      if (rafParticulas) cancelAnimationFrame(rafParticulas);
      rafParticulas = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    tamCanvas();
    crearParticulas();
    iniciarParticulas();

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        esMovil = window.matchMedia('(max-width: 768px)').matches;
        dibujarLineas = !esMovil;
        cantidad = esMovil ? 22 : (window.innerWidth < 1100 ? 55 : 75);
        tamCanvas();
        crearParticulas();
      }, 150);
    });

    document.addEventListener('visibilitychange', function () {
      activo = !document.hidden;
      if (activo) iniciarParticulas();
      else pararParticulas();
    });

    if (!esTactil) {
      window.addEventListener('mousemove', function (e) {
        raton.x = e.clientX;
        raton.y = e.clientY;
      }, { passive: true });
    }
  }

  /* —— Respiración —— */
  var orb = document.getElementById('respira-orb');
  var textoOrb = document.getElementById('respira-texto');
  var faseEl = document.getElementById('respira-fase');
  var progreso = document.getElementById('respira-progreso');
  var respirando = false;

  var fases = [
    { nombre: 'inhalar', duracion: 4000, label: 'Inhala…', texto: '↑' },
    { nombre: 'sostener', duracion: 4000, label: 'Sostén…', texto: '◆' },
    { nombre: 'exhalar', duracion: 6000, label: 'Exhala…', texto: '↓' }
  ];

  function ejecutarFase(indice) {
    if (!respirando) return;
    var fase = fases[indice];
    orb.setAttribute('data-fase', fase.nombre);
    textoOrb.textContent = fase.texto;
    faseEl.textContent = fase.label;

    var inicio = Date.now();
    function tick() {
      if (!respirando) return;
      var t = (Date.now() - inicio) / fase.duracion;
      if (t >= 1) {
        ejecutarFase((indice + 1) % fases.length);
        return;
      }
      progreso.style.width = (t * 100) + '%';
      requestAnimationFrame(tick);
    }
    tick();
  }

  if (orb) {
    orb.addEventListener('click', function () {
      respirando = !respirando;
      orb.classList.toggle('activo', respirando);
      orb.setAttribute('aria-pressed', respirando ? 'true' : 'false');

      if (respirando) {
        orb.setAttribute('aria-label', 'Detener ejercicio de respiración');
        ejecutarFase(0);
      } else {
        orb.removeAttribute('data-fase');
        orb.setAttribute('aria-label', 'Iniciar ejercicio de respiración');
        textoOrb.textContent = 'Toca';
        faseEl.textContent = '4 s inhalar · 4 s sostener · 6 s exhalar';
        progreso.style.width = '0%';
      }
    });

    if ('IntersectionObserver' in window) {
      var respiraObs = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting && respirando) orb.click();
      }, { threshold: 0.1 });
      respiraObs.observe(orb);
    }
  }

  /* —— Mapa de nodos —— */
  var datosNodos = {
    ansiedad: {
      titulo: 'Ansiedad',
      tag: 'Cuerpo en alerta',
      texto: 'Cuando el cuerpo va por delante de la cabeza. Trabajamos qué la enciende y cómo recuperar margen sin pedirte calma a la fuerza.'
    },
    pareja: {
      titulo: 'Pareja',
      tag: 'Vínculo y conflicto',
      texto: 'Patrones que se repiten, silencios que pesan. Un espacio para hablar sin ganar ni perder.'
    },
    autoestima: {
      titulo: 'Autoestima',
      tag: 'La voz crítica',
      texto: 'Esa voz que minimiza lo que haces bien. La miramos con curiosidad, no con sermones.'
    },
    duelo: {
      titulo: 'Duelo',
      tag: 'Sin horario',
      texto: 'Pérdidas sin horario. No hay prisa por "superarlo". Acompañamos lo que duele.'
    },
    burnout: {
      titulo: 'Burnout',
      tag: 'Automático hasta fallar',
      texto: 'Funcionar en automático hasta que el cuerpo dice basta. Revisamos límites y ritmo.'
    }
  };

  var campo = document.getElementById('nodos-campo');
  var arena = document.getElementById('nodos-arena');
  var hilos = document.getElementById('nodos-hilos');
  var panel = document.getElementById('nodos-panel');
  var panelTitulo = document.getElementById('nodos-panel-titulo');
  var panelTag = document.getElementById('nodos-panel-tag');
  var panelTexto = document.getElementById('nodos-panel-texto');
  var pista = document.getElementById('nodos-pista');

  if (campo && arena && hilos && nodosListo()) {
    iniciarMapaNodos();
  }

  function nodosListo() {
    return panelTitulo && panelTexto;
  }

  function iniciarMapaNodos() {
    var nodos = Array.prototype.slice.call(arena.querySelectorAll('.nodo'));
    var nodoActivo = null;
    var arrastre = null;
    var umbral = 8;
    var hilosCache = [];
    var necesitaRedibujo = true;
    var rafHilos = 0;
    var visible = true;
    var reducidoNodos = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    nodos.forEach(function (nodo) {
      aplicarPosicion(nodo, leerEje(nodo, 'x'), leerEje(nodo, 'y'));
    });

    function leerEje(nodo, eje) {
      var v = parseFloat(nodo.dataset[eje]);
      if (!isNaN(v)) return v;
      var inline = nodo.getAttribute('style') || '';
      var m = inline.match(new RegExp('--' + eje + ':\\s*([\\d.]+)'));
      return m ? parseFloat(m[1]) : 50;
    }

    function aplicarPosicion(nodo, x, y) {
      x = Math.max(10, Math.min(90, x));
      y = Math.max(12, Math.min(72, y));
      nodo.dataset.x = String(Math.round(x * 10) / 10);
      nodo.dataset.y = String(Math.round(y * 10) / 10);
      nodo.style.setProperty('--x', nodo.dataset.x);
      nodo.style.setProperty('--y', nodo.dataset.y);
      nodo.style.transform = 'translate(-50%, -50%)';
    }

    function posPx(nodo) {
      var campoRect = campo.getBoundingClientRect();
      var punto = nodo.querySelector('.nodo__pulso') || nodo;
      var r = punto.getBoundingClientRect();
      return {
        x: r.left - campoRect.left + r.width * 0.5,
        y: r.top - campoRect.top + r.height * 0.5
      };
    }

    function distancia(a, b) {
      var dx = a.x - b.x;
      var dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function paresConexion() {
      var rect = campo.getBoundingClientRect();
      var maxDist = Math.min(rect.width, rect.height) * 0.55;
      var px = nodos.map(posPx);
      var mapa = {};

      function registrar(a, b, tipo) {
        var key = a < b ? a + '-' + b : b + '-' + a;
        if (!mapa[key] || tipo === 'activo') {
          mapa[key] = { i: Math.min(a, b), j: Math.max(a, b), tipo: tipo };
        }
      }

      for (var i = 0; i < nodos.length; i++) {
        var cercanos = [];
        for (var j = 0; j < nodos.length; j++) {
          if (i === j) continue;
          cercanos.push({ j: j, d: distancia(px[i], px[j]) });
        }
        cercanos.sort(function (a, b) { return a.d - b.d; });

        for (var c = 0; c < Math.min(2, cercanos.length); c++) {
          if (cercanos[c].d > maxDist) continue;
          registrar(i, cercanos[c].j, 'secundario');
        }
      }

      if (nodoActivo) {
        var idx = nodos.indexOf(nodoActivo);
        nodos.forEach(function (_n, j) {
          if (j !== idx) registrar(idx, j, 'activo');
        });
      }

      return Object.keys(mapa).map(function (key) {
        var p = mapa[key];
        return [nodos[p.i], nodos[p.j], p.tipo];
      });
    }

    function curvaPath(x1, y1, x2, y2) {
      var mx = (x1 + x2) / 2;
      var my = (y1 + y2) / 2;
      var dx = x2 - x1;
      var dy = y2 - y1;
      var cx = mx - dy * 0.15;
      var cy = my + dx * 0.15;
      return 'M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2;
    }

    function programarHilos() {
      necesitaRedibujo = true;
      if (!rafHilos) {
        rafHilos = requestAnimationFrame(dibujarHilos);
      }
    }

    function dibujarHilos() {
      rafHilos = 0;
      if (!necesitaRedibujo || !visible) return;
      necesitaRedibujo = false;

      var rect = campo.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      hilos.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);

      var pares = paresConexion();
      var svgNs = 'http://www.w3.org/2000/svg';

      while (hilosCache.length < pares.length) {
        var path = document.createElementNS(svgNs, 'path');
        hilos.appendChild(path);
        hilosCache.push(path);
      }

      while (hilosCache.length > pares.length) {
        var extra = hilosCache.pop();
        if (extra.parentNode) extra.parentNode.removeChild(extra);
      }

      pares.forEach(function (par, idx) {
        var p1 = posPx(par[0]);
        var p2 = posPx(par[1]);
        var path = hilosCache[idx];
        path.setAttribute('d', curvaPath(p1.x, p1.y, p2.x, p2.y));
        path.setAttribute('class', par[2]);
      });
    }

    function activarNodo(nodo) {
      nodoActivo = nodo;
      var id = nodo.getAttribute('data-nodo');
      var d = datosNodos[id];
      if (!d) return;

      nodos.forEach(function (n) {
        var on = n === nodo;
        n.classList.toggle('activo', on);
        n.classList.toggle('atenuado', !on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      panel.classList.add('activo');
      panelTitulo.textContent = d.titulo;
      if (panelTag) panelTag.textContent = d.tag || '';
      panelTexto.textContent = d.texto;
      if (pista) pista.style.opacity = '0';
      programarHilos();
    }

    function soltarConRepulsion(nodo) {
      var otros = nodos.filter(function (n) { return n !== nodo; });
      var x = parseFloat(nodo.dataset.x);
      var y = parseFloat(nodo.dataset.y);
      var rect = campo.getBoundingClientRect();

      otros.forEach(function (otro) {
        var ox = parseFloat(otro.dataset.x);
        var oy = parseFloat(otro.dataset.y);
        var dx = x - ox;
        var dy = y - oy;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        var min = rect.width < 500 ? 14 : 12;
        if (dist < min) {
          var f = (min - dist) / min;
          x += (dx / dist) * f * 4;
          y += (dy / dist) * f * 4;
        }
      });

      aplicarPosicion(nodo, x, y);
      programarHilos();
    }

    nodos.forEach(function (nodo) {
      nodo.addEventListener('click', function () {
        if (arrastre && arrastre.movio) return;
        activarNodo(nodo);
      });

      nodo.addEventListener('keydown', function (e) {
        var x = parseFloat(nodo.dataset.x);
        var y = parseFloat(nodo.dataset.y);
        var paso = e.shiftKey ? 4 : 2;
        if (e.key === 'ArrowLeft') { e.preventDefault(); aplicarPosicion(nodo, x - paso, y); programarHilos(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); aplicarPosicion(nodo, x + paso, y); programarHilos(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); aplicarPosicion(nodo, x, y - paso); programarHilos(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); aplicarPosicion(nodo, x, y + paso); programarHilos(); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activarNodo(nodo); }
      });
    });

    campo.addEventListener('pointerdown', function (e) {
      var nodo = e.target.closest('.nodo');
      if (!nodo || !arena.contains(nodo)) return;

      arrastre = {
        nodo: nodo,
        id: e.pointerId,
        movio: false,
        ox: e.clientX,
        oy: e.clientY
      };

      var rect = campo.getBoundingClientRect();
      var pos = posPx(nodo);
      arrastre.offsetX = e.clientX - rect.left - pos.x;
      arrastre.offsetY = e.clientY - rect.top - pos.y;

      nodo.classList.add('arrastrando');
      nodo.setPointerCapture(e.pointerId);
      activarNodo(nodo);
    });

    campo.addEventListener('pointermove', function (e) {
      if (!arrastre || arrastre.id !== e.pointerId) return;

      var dx = e.clientX - arrastre.ox;
      var dy = e.clientY - arrastre.oy;
      if (!arrastre.movio && (Math.abs(dx) > umbral || Math.abs(dy) > umbral)) {
        arrastre.movio = true;
      }
      if (!arrastre.movio) return;

      var rect = campo.getBoundingClientRect();
      var x = e.clientX - rect.left - arrastre.offsetX;
      var y = e.clientY - rect.top - arrastre.offsetY;
      aplicarPosicion(arrastre.nodo, (x / rect.width) * 100, (y / rect.height) * 100);
      programarHilos();
    });

    function finArrastre(e) {
      if (!arrastre || (e.pointerId !== undefined && arrastre.id !== e.pointerId)) return;
      arrastre.nodo.classList.remove('arrastrando');
      if (arrastre.movio) soltarConRepulsion(arrastre.nodo);
      arrastre = null;
    }

    campo.addEventListener('pointerup', finArrastre);
    campo.addEventListener('pointercancel', finArrastre);

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { programarHilos(); });
      ro.observe(campo);
    } else {
      window.addEventListener('resize', programarHilos);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) programarHilos();
      }, { threshold: 0.08 });
      io.observe(campo);
    }

    if (!reducidoNodos && !esMovil) {
      var t0 = performance.now();
      var frame = 0;

      function derivaSuave(now) {
        if (!visible || arrastre) {
          requestAnimationFrame(derivaSuave);
          return;
        }

        frame++;
        var t = (now - t0) / 1000;
        nodos.forEach(function (nodo, i) {
          if (nodo.classList.contains('arrastrando')) return;
          var ox = Math.sin(t * 0.45 + i * 1.3) * 2.5;
          var oy = Math.cos(t * 0.38 + i * 1.7) * 2.5;
          nodo.style.transform = 'translate(calc(-50% + ' + ox.toFixed(1) + 'px), calc(-50% + ' + oy.toFixed(1) + 'px))';
        });

        if (frame % 3 === 0) programarHilos();
        requestAnimationFrame(derivaSuave);
      }

      requestAnimationFrame(derivaSuave);
    }

    activarNodo(nodos[0]);
    programarHilos();
  }

  /* —— Carril proceso: rueda vertical → horizontal (solo desktop) —— */
  var carril = document.getElementById('proceso-carril');
  if (carril && !esTactil) {
    carril.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        carril.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  /* —— Dock activo —— */
  var dockItems = document.querySelectorAll('.dock__item');
  var secciones = [
    { id: 'inicio', el: document.getElementById('inicio') },
    { id: 'respira', el: document.getElementById('respira') },
    { id: 'nodos', el: document.getElementById('nodos') },
    { id: 'proceso', el: document.getElementById('proceso') },
    { id: 'ancla', el: document.getElementById('ancla') }
  ].filter(function (s) { return s.el; });

  if (dockItems.length && secciones.length && 'IntersectionObserver' in window) {
    var visibles = new Map();

    function actualizarDock() {
      var mejor = 'inicio';
      var mejorRatio = 0;
      visibles.forEach(function (ratio, id) {
        if (ratio > mejorRatio) {
          mejorRatio = ratio;
          mejor = id;
        }
      });
      dockItems.forEach(function (item) {
        var href = item.getAttribute('href').slice(1);
        var on = href === mejor || (mejor === 'marta' && href === 'ancla');
        item.classList.toggle('activo', on);
      });
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visibles.set(entry.target.id, entry.intersectionRatio);
      });
      actualizarDock();
    }, { threshold: [0, 0.15, 0.35, 0.55], rootMargin: '-12% 0px -38% 0px' });

    secciones.forEach(function (s) { obs.observe(s.el); });
    var marta = document.getElementById('marta');
    if (marta) obs.observe(marta);
  }

  /* —— Formulario → WhatsApp —— */
  var form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var nombre = form.nombre.value.trim();
      var email = form.email.value.trim();
      var mensaje = form.mensaje.value.trim();
      var texto = 'Hola Marta, soy ' + nombre + ' (' + email + ').\n\n' + mensaje;
      window.open(urlWsp(texto), '_blank', 'noopener,noreferrer');
    });
  }

  /* —— Olas SVG dash —— */
  document.querySelectorAll('.ancla__ola').forEach(function (path) {
    var len = path.getTotalLength ? path.getTotalLength() : 200;
    path.style.strokeDasharray = len + ' ' + len;
  });

})();
