(function () {
  'use strict';

  var PLANTILLAS = [
    { sector: 'psicologos', grupo: 'psicologos', titulo: 'Elena Morales', desc: 'Terapia individual, pareja y online', href: 'webs/psicologos/plantilla-1/', color: '#8b9a7d', tags: [] },
    { sector: 'psicologos', grupo: 'psicologos', titulo: 'Irene Vázquez', desc: 'Diseño editorial con barra lateral', href: 'webs/psicologos/plantilla-2/', color: '#6b5b4f', tags: ['Editorial'] },
    { sector: 'psicologos', grupo: 'psicologos', titulo: 'Corriente', desc: 'Partículas, respiración y nodos vivos', href: 'webs/psicologos/plantilla-3/', color: '#3d7a8c', tags: ['Destacada', 'Interactiva'] },
    { sector: 'psicologos', grupo: 'psicologos', titulo: 'Bruma', desc: 'Noa Calderón · tono clínico con capas', href: 'webs/psicologos/plantilla-4-bruma/', color: '#b8784a', tags: ['Destacada', 'Interactiva'] },
    { sector: 'bodas', grupo: 'bodas', titulo: 'Alba y Marcos', desc: 'Web de boda · invitación, RSVP, álbum y regalos', href: 'webs/bodas/plantilla-1/', color: '#d4728c', tags: [] },
    { sector: 'yoga', grupo: 'salud', titulo: 'Mesa de luz', desc: 'Yoga y pilates · editorial, horario móvil', href: 'webs/yoga/plantilla-1/', color: '#7d9a82', tags: ['Editorial'] },
    { sector: 'abogados', grupo: 'otros', titulo: 'Martín & Costa', desc: 'Despacho corporativo', href: 'webs/abogados/plantilla-1/', color: '#2c3e50', tags: [] },
    { sector: 'bares', grupo: 'bares', titulo: 'La Esquina', desc: 'Bar de tapas · La Latina, Madrid', href: 'webs/bares/plantilla-1/', color: '#c45c3e', tags: [] },
    { sector: 'bares', grupo: 'bares', titulo: 'Velario', desc: 'Restaurante de autor · mesa giratoria', href: 'webs/bares/plantilla-2/', color: '#c9a227', tags: ['Destacada', 'Interactiva'] },
    { sector: 'bares', grupo: 'bares', titulo: 'Kilómetro 47', desc: 'Diner de carretera · 5 páginas, neón 24h', href: 'webs/bares/plantilla-3/', color: '#ffb347', tags: ['Nuevo', 'Multipágina'] },
    { sector: 'peluquería', grupo: 'belleza', titulo: 'La Silla', desc: 'Peluquería de barrio · Lavapiés', href: 'webs/peluqueria/plantilla-1/', color: '#a67c52', tags: ['Editorial'] },
    { sector: 'fisioterapeuta', grupo: 'salud', titulo: 'Mendoza Fisioterapia', desc: 'Consulta individual · Retiro, Madrid', href: 'webs/fisioterapeuta/plantilla-1/', color: '#5a8f7b', tags: [] },
    { sector: 'nutricionista', grupo: 'salud', titulo: 'Oria Nutrición', desc: 'Dietista-nutricionista · Triana, Sevilla', href: 'webs/nutricionista/plantilla-1/', color: '#e8a838', tags: [] },
    { sector: 'dentistas', grupo: 'salud', titulo: 'NovaDent', desc: 'Clínica dental · Salamanca, Madrid', href: 'webs/dentistas/plantilla-1/', color: '#4a90a4', tags: [] },
    { sector: 'veterinarios', grupo: 'salud', titulo: 'Huella Viva', desc: 'Clínica veterinaria · Chamberí', href: 'webs/veterinarios/plantilla-1/', color: '#6b9080', tags: [] },
    { sector: 'academias', grupo: 'otros', titulo: 'Academia Nova', desc: 'Academia de barrio · Chamberí', href: 'webs/academias/plantilla-1/', color: '#5c6bc0', tags: [] },
    { sector: 'estética', grupo: 'belleza', titulo: 'Lumière', desc: 'Cabina estética facial', href: 'webs/clinica-estetica/plantilla-1/', color: '#d4a5a5', tags: [] },
    { sector: 'fontaneria', grupo: 'otros', titulo: 'Caudal', desc: 'Fontanería de urgencia · Zaragoza, estética de parte de trabajo', href: 'webs/fontaneria/plantilla-1/', color: '#c4682a', tags: ['Nuevo'] }
  ];

  var grid = document.getElementById('grid');
  var contador = document.getElementById('contador');
  var vacio = document.getElementById('vacio');
  var buscar = document.getElementById('buscar');
  var filtroActivo = 'todos';
  var debounceTimer;

  var SECTORES = {
    psicologos: 'Psicólogos',
    bodas: 'Bodas',
    yoga: 'Yoga',
    abogados: 'Abogados',
    bares: 'Bares',
    'peluquería': 'Peluquería',
    fisioterapeuta: 'Fisioterapeuta',
    nutricionista: 'Nutricionista',
    dentistas: 'Dentistas',
    veterinarios: 'Veterinarios',
    academias: 'Academias',
    'estética': 'Estética',
    fontaneria: 'Fontanería'
  };

  function renderCard(p) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'card';
    a.href = p.href;
    a.style.setProperty('--card-accent', p.color);
    a.dataset.grupo = p.grupo;
    a.dataset.busqueda = (p.titulo + ' ' + p.desc + ' ' + p.sector + ' landing').toLowerCase();

    var sector = document.createElement('span');
    sector.className = 'card__sector';
    sector.textContent = SECTORES[p.sector] || p.sector;

    var titulo = document.createElement('strong');
    titulo.className = 'card__titulo';
    titulo.textContent = p.titulo;

    var desc = document.createElement('span');
    desc.className = 'card__desc';
    desc.textContent = p.desc;

    a.appendChild(sector);
    a.appendChild(titulo);
    a.appendChild(desc);

    var tags = document.createElement('div');
    tags.className = 'card__tags';

    var tipo = document.createElement('span');
    tipo.className = 'tag tag--tipo';
    tipo.textContent = 'Landing';
    tags.appendChild(tipo);

    p.tags.forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'tag' + (t === 'Destacada' ? ' tag--star' : '');
      span.textContent = t;
      tags.appendChild(span);
    });

    a.appendChild(tags);
    li.appendChild(a);
    return li;
  }

  PLANTILLAS.forEach(function (p) {
    grid.appendChild(renderCard(p));
  });

  function aplicarFiltros() {
    var q = (buscar.value || '').trim().toLowerCase();
    var visibles = 0;

    grid.querySelectorAll('li').forEach(function (li) {
      var card = li.querySelector('.card');
      if (!card) return;
      var okGrupo = filtroActivo === 'todos' || card.dataset.grupo === filtroActivo;
      var okBusq = !q || card.dataset.busqueda.indexOf(q) !== -1;
      var show = okGrupo && okBusq;
      li.classList.toggle('oculta', !show);
      if (show) visibles++;
    });

    contador.textContent = visibles + (visibles === 1 ? ' plantilla' : ' plantillas');
    vacio.hidden = visibles > 0;
  }

  document.querySelectorAll('.filtro').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filtro').forEach(function (b) {
        b.classList.remove('activo');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('activo');
      btn.setAttribute('aria-pressed', 'true');
      filtroActivo = btn.dataset.filtro;
      aplicarFiltros();
    });
  });

  buscar.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(aplicarFiltros, 120);
  });
})();
