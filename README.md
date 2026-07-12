# Plantillas web por sector

Colección de webs estáticas (HTML, CSS y JS) listas para desplegar en **GitHub Pages**.

## Webs incluidas

| Sector | Plantilla | Ruta local |
|--------|-----------|------------|
| Psicólogos | Elena Morales | `webs/psicologos/plantilla-1/` |
| Psicólogos | Irene Vázquez | `webs/psicologos/plantilla-2/` |
| Abogados | Martín & Costa | `webs/abogados/plantilla-1/` |
| Bares | Bar de tapas | `webs/bares/plantilla-1/` |
| Academias | Academia Nova | `webs/academias/plantilla-1/` |

Abre `index.html` en la raíz del repositorio para ver el listado con enlaces.

## Cómo subir a GitHub y obtener el enlace público

### 1. Crear el repositorio en GitHub

1. Entra en [github.com/new](https://github.com/new)
Nombre del repositorio: **`web-normales`** (cuenta `Judithrg2`).
3. Deja el repositorio **público**
4. **No** marques “Add a README” (ya existe uno aquí)
5. Pulsa **Create repository**

### 2. Subir los archivos desde tu PC

Abre PowerShell en `D:\Webs` y ejecuta (cambia `TU_USUARIO` y `NOMBRE_REPO`):

```powershell
cd D:\Webs
git init
git add .
git commit -m "Publicar plantillas web para GitHub Pages"
git branch -M main
git remote add origin https://github.com/Judithrg2/web-normales.git
git push -u origin main
```

GitHub te pedirá iniciar sesión la primera vez.

### 3. Activar GitHub Pages

1. En GitHub, abre tu repositorio
2. Ve a **Settings** → **Pages**
3. En **Build and deployment** → **Source**, elige **Deploy from a branch**
4. Branch: **main**, carpeta: **/ (root)**
5. Guarda. En 1–2 minutos aparecerá la URL verde

### 4. Tus enlaces públicos

Si tu usuario es `Judithrg2` y el repo `web-normales`, las URLs serán:

| Web | URL |
|-----|-----|
| Índice | `https://judithrg2.github.io/web-normales/` |
| Psicóloga 1 | `https://judithrg2.github.io/web-normales/webs/psicologos/plantilla-1/` |
| Psicóloga 2 | `https://judithrg2.github.io/web-normales/webs/psicologos/plantilla-2/` |
| Abogados | `https://judithrg2.github.io/web-normales/webs/abogados/plantilla-1/` |
| Bar | `https://judithrg2.github.io/web-normales/webs/bares/plantilla-1/` |
| Academia | `https://judithrg2.github.io/web-normales/webs/academias/plantilla-1/` |

Sustituye solo si usas otro usuario o nombre de repositorio.

## Estructura del repositorio

```
index.html          → índice con enlaces a todas las webs
webs/
  psicologos/plantilla-1/   → index.html, styles.css, assets/js/main.js
  psicologos/plantilla-2/
  abogados/plantilla-1/     → + assets/img/ (imágenes locales)
  bares/plantilla-1/
  academias/plantilla-1/
```

## Notas

- Todas las webs usan rutas relativas (`styles.css`, `assets/...`) y funcionan en subcarpetas de GitHub Pages.
- Algunas imágenes cargan desde Unsplash o Google Maps; hace falta conexión a internet para verlas.
