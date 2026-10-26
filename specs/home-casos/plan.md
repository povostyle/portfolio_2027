# Plan — Home y casos de estudio
**Spec:** `spec.md` (aprobada 26-10-2026) · **Rama:** `feature/home-casos`

## Resumen de la decisión
Los cinco casos viven como Markdown en una colección de contenido de Astro con esquema (Zod): si falta un dato, el build falla (CA-4). Los 20 proyectos (casos, piezas e índice) se declaran en un único fichero de datos tipado, y una función de servidor comprueba al construir que suman 20 y que cada caso tiene su Markdown (CA-8). La home es composición de blocks nuevos sobre el núcleo que ya existe; no entra ninguna librería. Las comprobaciones de texto prohibido (CA-9) y enlaces rotos (CA-10) las hace un script sobre `dist/` que forma parte de `npm run build`. Entrega utilizable: home + 5 páginas de caso + contacto + privacidad, vistas en la preview de Vercel.

## Repaso de la constitución
No hay constitución todavía (el método no se ha arrancado en este proyecto). Se aplica «Qué no se rompe» de `CLAUDE.md` y del monorepo:

| Regla | ¿Aplica? | Cómo se cumple |
|---|---|---|
| Sin librería nueva sin problema concreto | Sí | Cero dependencias nuevas. Markdown, Zod y el loader `glob` vienen con Astro 7 |
| Un componente = tres ficheros con el mismo nombre | Sí | Tabla «Piezas» abajo |
| Sin `<style>` ni `<script>` en `.astro` | Sí | CSS en `src/styles/`, sin JS nuevo en este bloque |
| JS por `data-*`, nunca por clase | Sí | No hay JS nuevo; las animaciones son `data-reveal` / `data-text-reveal` del núcleo |
| Grid por clases, medidas en `rem` | Sí | Solo clases del grid existentes |
| Lo reutilizable va al núcleo (`core/` del starter) y se avisa | Sí | `prose.css` (tipografía de Markdown) y `card.css` nacen aquí y se proponen para `core/` al cerrar (ver Riesgos) |
| Lima nunca como texto sobre claro | Sí | Sin colores nuevos |
| Nada visto en Vercel ⇒ no está hecho | Sí | T-13 |

## Decisiones por capa

### Datos y migración
No hay base de datos. Contenido en el repositorio:

- `src/content.config.ts` — colección `casos` con `glob({ pattern: "**/*.md", base: "./src/content/casos" })` y esquema:
  - `cliente` (string), `sector` (enum: salud · investigacion · industria · tecnologia), `anio` (number 2015–2027), `orden` (number 1–5)
  - `papel` (enum: propio-diseno-desarrollo · propio-desarrollo · agencia), `agencia` (string, obligatorio si `papel === "agencia"`, se valida con `superRefine`)
  - `queHice` (string, obligatorio siempre: qué hice yo exactamente — CA-5)
  - `problema` (string, máx. 120 caracteres — CA-2)
  - `imagen` (`image()`), `imagenAlt` (string), `url` (url, opcional)
- Cuerpo de cada `.md`: los cuatro `## ` fijos (Problema · Decisiones · Qué construí · Qué pasó después). **Comprobación:** `src/lib/casos.ts` valida al construir que el cuerpo contiene exactamente esos cuatro encabezados en ese orden; si no, lanza error con el nombre del caso (CA-3).
- `src/data/proyectos.ts` — los 20 proyectos: `{ nombre, sector, anio?, papel, agencia?, queHice, tipo: "caso" | "pieza" | "indice", slug? }`. Tipado con TypeScript; `src/lib/casos.ts` comprueba al construir: total = 20, exactamente 5 `caso` con `slug` que existe en la colección, 2 `pieza` (CA-8).
- Comprobado en `node_modules/astro` (7.4.2): `defineCollection` y `z` se importan de `astro:content` (Zod v4), `glob` de `astro/loaders`, `render` de `astro:content`. No supuesto desde Astro 5.

### Backend
No aplica (salida estática).

### Frontend
| Pieza | `.astro` | CSS | JS |
|---|---|---|---|
| Hero (ya existe) — ajustar: un solo CTA, línea de reserva; ocupa la columna izquierda de la primera pantalla | `components/blocks/Hero.astro` | `styles/components/hero.css` | — |
| Lista de 5 casos: columna central (capturas apiladas) + índice sticky a la derecha; misma sección que el Hero (`.home-intro` en `pages/home.css`) | `components/blocks/Casos.astro` | `styles/components/casos.css` | — |
| Tarjeta de caso (átomo reutilizable) | `components/ui/Card.astro` | `styles/components/card.css` | — |
| «Qué hago exactamente» | `components/blocks/QueHago.astro` | `styles/components/que-hago.css` | — |
| Piezas de gusto | `components/blocks/Piezas.astro` | `styles/components/piezas.css` | — |
| Índice de proyectos | `components/blocks/Indice.astro` | `styles/components/indice.css` | — |
| Cuerpo Markdown del caso | `components/blocks/Prose.astro` | `styles/components/prose.css` | — |
| Páginas | `pages/index.astro`, `pages/casos/[slug].astro`, `pages/contacto.astro`, `pages/privacidad.astro` | `styles/pages/home.css`, `styles/pages/caso.css` | — |
| Navegación | `data/nav.ts`: Inicio · Casos (ancla `/#casos`) · Contacto; quitar Guía del menú público (se mantiene la ruta) | — | — |

Animaciones: solo `data-reveal` y `data-text-reveal` del núcleo. Nada nuevo en este bloque (fuera de alcance en la spec).
Imágenes: una por caso en `src/content/casos/<slug>/cover.jpg` (relativa al `.md`), servida con `<Image>` del núcleo.
Contacto: email y teléfono desde `data/site.ts` (hoy vacíos: rellenar).

### Tareas programadas
No aplica.

### Rendimiento
No aplica (estático, 8 páginas). Las imágenes pasan por `astro:assets`.

## Contrato
Sin cambios de contrato (no hay API). Rutas públicas nuevas: `/casos/<slug>/` ×5, `/contacto/`, `/privacidad/`.

## Criterio → pieza → test
No hay suite de tests. Cada «test» es una comprobación que falla el build o un paso manual con evidencia escrita en `tasks.md`.

| CA | Pieza técnica | Test |
|---|---|---|
| CA-1 | `Hero.astro`, `hero.css` | Manual: captura a 375 px y 1440 px en la preview, frase + botón visibles sin scroll |
| CA-2 | `Casos.astro`, `Card.astro`, esquema `problema.max(120)` | Build en rojo con un `problema` de 121 caracteres; manual: 5 tarjetas con los 4 datos |
| CA-3 | `src/lib/casos.ts::checkEncabezados` | Build en rojo quitando un `## ` a un caso; mensaje nombra el caso |
| CA-4 | `src/content.config.ts` | Build en rojo quitando `cliente` de un caso; mensaje nombra caso y campo |
| CA-5 | esquema (`queHice` obligatorio, `agencia` si `papel=agencia`), `Card.astro`, `Indice.astro` | Build en rojo con `papel: agencia` sin `agencia`; manual: PTS muestra «para la agencia Terceto» |
| CA-6 | Contenido de cada `.md` | Manual: Miguel Ángel confirma caso por caso; se anota en `tasks.md` |
| CA-7 | `Piezas.astro` | Manual: bloque después de casos, 2 piezas, una línea cada una |
| CA-8 | `src/lib/casos.ts::checkProyectos`, `Indice.astro` | Build en rojo con 19 proyectos o con un `caso` sin `.md`; manual: 13 líneas en el índice (20 − 5 − 2) |
| CA-9 | `scripts/check-dist.mjs` (en `npm run build`) | Script en rojo metiendo «Creative Developer» en una página; `grep -ri` adicional en `dist/` |
| CA-10 | `scripts/check-dist.mjs`, `contacto.astro`, `privacidad.astro` | Script en rojo con un `href="/no-existe/"`; `curl` a cada ruta de la preview → 200 |
| CA-11 | núcleo (`data-reveal` sin JS = visible), CSS sin anchos fijos | Manual: preview con JS desactivado y con «reducir movimiento»; móvil sin scroll horizontal |
| CA-12 | Preview de Vercel de la rama | Manual: tabla de evidencia en `tasks.md` (qué, dónde, qué se vio, commit) |

## Riesgos y decisiones a documentar
- **Riesgo: la colección rechaza imágenes relativas al `.md` con el loader `glob`.** Mitigación: probar con un caso antes de escribir los otros cuatro (T-04). Si falla, las imágenes van a `src/assets/images/casos/` y el esquema guarda la ruta como string.
- **Riesgo: contenido.** Los textos de 5 casos son el trabajo largo de este bloque y no lo hace el código. T-08 reserva ese tiempo y los borradores se escriben con los datos que ya hay; «Qué pasó después» queda corto hasta la tarea de datos (bloque posterior).
- **Decisión (de Miguel Ángel):** `prose.css` y `card.css` son generales. Propuesta: al cerrar el bloque, copiarlos a `core/styles/components/` del starter y anotarlo en `docs/estructura.md` del monorepo. Se hace en otra rama/otro repo, no aquí.
- **Decisión (de Miguel Ángel):** la ruta `/guia/` sigue publicada pero sale del menú. Alternativa: dejarla solo en dev. Propuesta: fuera del menú ahora; decidir si se retira al publicar el dominio.
- **Decisión tomada:** sin JS nuevo ni micro-animaciones por caso. Primero publicar.
- Documentar al cerrar: nota `docs/contenido.md` (cómo se añade un caso: ficheros, campos, los 4 encabezados, imagen).

## Análisis (4.4) — 26-10-2026
CRÍTICOS: ninguno (el único crítico, años sin dato, lo resolvió MA haciendo el año opcional en el índice)
AVISOS: ninguno
NOTAS: CA-6 y CA-7 manuales con evidencia; CA-11 lo cumple reveal.css (solo oculta bajo html.is-ready, comprobado)
Cobertura: criterios 12/12 · rutas con test 8/8 · preguntas abiertas 0
VEREDICTO: LISTO PARA IMPLEMENTAR
