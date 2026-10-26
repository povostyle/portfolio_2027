# Miguel Ángel Poyatos — convenciones

Base Astro de Miguel Ángel Poyatos. Lee esto entero antes de tocar nada.
`src/styles/`, `src/scripts/` y `src/guide/` NO viven en esta carcasa: son `core/` del monorepo
`bluecarpet-starters` y se copian aquí al montar el proyecto. Un cambio que quieras conservar para
futuros proyectos se hace en `core/`, nunca solo aquí.

## Antes de cualquier cambio

Lee y sigue `docs/metodo.md`. Clasifica la petición y di qué recorrido propones antes de tocar nada.

## Stack

- Astro 7, salida estática. Node 22.23.4 o superior (`.nvmrc`: 24). TypeScript estricto en `.astro` y `.ts`.
- CSS nativo: custom properties, `@layer`, nesting. Sin Tailwind ni CSS de componente en `<style>`.
- JS: un único entry (`src/scripts/main.js`) cargado desde `Base.astro`. GSAP (ScrollTrigger, SplitText), Lenis, Swup.
- Transiciones de página con Swup (no `<ClientRouter />`), igual que en WordPress.

## Mapa del repo

```
src/
  layouts/Base.astro     <html>, <head>, #swup, <main data-page>, carga de main.js. Overlay del grid en dev.
  layouts/Page.astro     Base + Header + Menu + Footer. Las páginas usan este.
  components/
    layout/              Header, Menu, Footer
    blocks/              secciones: Hero, PageHeader, Accordion
    ui/                  átomos: Button, Icon, Image (astro:assets: srcset, WebP, recorte, fundido al cargar)
    seo/                 Head
  pages/                 rutas. SOLO composición de blocks. index, 404, guia
  data/                  site.ts, nav.ts — datos compartidos (≡ inc/data en WP)
  lib/                   helpers de servidor (≡ inc/helpers en WP)
  assets/images/         imágenes que Astro optimiza (importarlas: import foto from "@assets/images/x.jpg")
  styles/  scripts/  guide/   ← NÚCLEO (core/ del monorepo)
public/                  se sirve tal cual: favicon, robots.txt, icons/sprite.svg
```

| Concepto | Aquí | En WordPress |
|---|---|---|
| Layout global | `layouts/Base.astro` | `header.php` + `footer.php` |
| Sección | `components/blocks/Hero.astro` | `components/blocks/hero.php` |
| Átomo | `components/ui/Button.astro` | `components/ui/button.php` |
| Página | `pages/nosotros.astro` | `templates/page-about.php` |
| Datos | `data/site.ts` | `inc/data/site-data.php` |

## Reglas duras

1. **Un componente = tres archivos con el mismo nombre**: `components/blocks/Hero.astro`, `styles/components/hero.css`, `scripts/components/hero.js` (si tiene comportamiento). El `.astro` en PascalCase; CSS y JS en kebab-case.
2. **Sin `<style>` en los `.astro`**. El CSS vive en `src/styles/` para que sirva igual en WordPress. Única excepción: variables locales (`style="--hero-bg: …"`).
3. **El JS selecciona por `data-*`, nunca por clase.** Clases = estilo; data-attributes = comportamiento.
4. **Nada de `<script>` por componente.** El comportamiento vive en `src/scripts/`: componentes como custom element `<bc-nombre>` (base `scripts/core/element.js`, importado en `main.js`); animaciones por atributo y piezas globales en el registro. Tabla de cuándo usar cada uno en el `CLAUDE.md` del monorepo.
5. **Colocación con clases del grid** (`start-3 end-11`, `span-6`, `md-span-4`, `.subgrid`). Ver la cabecera de `styles/layout/grid.css` y la página `/guia`.
6. **Medidas en `rem`**, nunca en `px` (salvo bordes de 1px): por encima de 1440px la página escala.
7. **Enlaces de navegación con `data-nav-link`**: así Swup actualiza la página actual al navegar.
8. `data-page` de `<main>` lo pone cada página en `<Page page="…">`. CSS de `styles/pages/` y JS de `scripts/pages/` se activan por él.

## Imágenes, fuentes e imports

- **Imágenes**: siempre con `<Image>` de `@components/ui/Image.astro`, nunca `<img>` a pelo. Las propias, en
  `src/assets/images/` e importadas; las de `public/` no se optimizan. `width` + `height` recortan a esa proporción.
  `sizes` dice qué ancho ocupa en el grid (`"(min-width: 64em) 50vw, 100vw"` para 6 de 12 columnas).
- **Fuentes**: en `astro.config.mjs` → `fonts` (Google Fonts o archivos locales). Astro las descarga,
  las sirve desde el propio dominio y precarga. `cssVariable` = el token (`--font-sans`, `--font-mono`) y en
  `Base.astro` una línea `<Font cssVariable="…" preload />` por cada una.
- **Imports con alias**: `@components/…`, `@layouts/…`, `@data/…`, `@lib/…`, `@assets/…`, `@styles/…`, `@scripts/…`.
- **Mensajes de consola**: los de depuración, dentro de `if (import.meta.env.DEV) { console.log(…) }`, que en
  producción desaparecen solos. `console.warn` y `console.error` se dejan siempre.

## Cómo añadir una página

```astro
---
import Page from "../layouts/Page.astro";
import PageHeader from "../components/blocks/PageHeader.astro";
---
<Page page="nosotros" title="Nosotros" description="…">
  <PageHeader eyebrow="Estudio" title="Nosotros" />
  <section class="section"><div class="container"><div class="grid">…</div></div></section>
</Page>
```

## Comandos

- `npm run dev` → http://localhost:4321 (con el botón del grid y la tecla G)
- `npm run build` → comprueba tipos (`astro check`) y genera `dist/`
- `npm run preview` → sirve `dist/` como en producción (sin overlay)

## Antes de dar algo por terminado

- `npm run build` sin errores ni avisos de tipos.
- Probado navegando con Swup (ir y volver), en móvil y con «reducir movimiento».
- Ningún selector de JS por clase. Ningún ScrollTrigger sin `destroy()`.
