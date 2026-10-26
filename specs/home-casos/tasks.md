# Tareas — Home y casos de estudio
**Plan:** `plan.md` · **Rama:** `feature/home-casos` · Quien implementa: Miguel Ángel (MA); Claude da dirección, fragmentos y revisa.

Regla del bloque: commit local cuando una tarea funciona; `git push` al terminar cada tarea.

## 1. Tests en rojo (la base de contenido)
- [ ] T-01 · MA · crear `src/content.config.ts` con la colección `casos` y el esquema del plan · `src/content.config.ts` · (CA-2, CA-4, CA-5)
- [ ] T-02 · MA · crear UN caso de prueba completo (Balticasa) con imagen relativa y los 4 `## ` · `src/content/casos/balticasa/index.md`, `cover.jpg` · (CA-3, CA-4)
- [ ] T-03 · MA · ver el build en rojo por la razón correcta: quitar `cliente` → falla nombrando caso y campo; `problema` de 121 chars → falla; `papel: agencia` sin `agencia` → falla. Anotar aquí los 3 mensajes · (CA-2, CA-4, CA-5)
- [ ] T-04 · MA · comprobar que la imagen relativa al `.md` funciona con `glob`; si no, aplicar la mitigación del plan y anotarlo · (riesgo 1)
- [ ] T-05 · MA · `src/data/proyectos.ts` con los 20 proyectos y `src/lib/casos.ts` (`checkProyectos`, `checkEncabezados`); ver el build en rojo con 19 proyectos y con un `## ` de menos · `src/data/proyectos.ts`, `src/lib/casos.ts` · (CA-3, CA-8)
- [ ] T-06 · MA · `scripts/check-dist.mjs` (palabras prohibidas + enlaces internos rotos) enganchado a `npm run build`; verlo en rojo con «Creative Developer» en una página y con `href="/no-existe/"` · `scripts/check-dist.mjs`, `package.json` · (CA-9, CA-10)

## 2. Migración
No aplica.

## 3. Backend
No aplica.

## 4. Frontend
- [ ] T-07 · MA · página de caso `src/pages/casos/[slug].astro` con `PageHeader` + `Prose` + `prose.css` + `styles/pages/caso.css`; Balticasa visible en local · (CA-3, CA-5) · [P]
- [ ] T-08 · MA (textos) + Claude (borradores) · escribir los otros 4 casos: PTS, Achi Kushnir, Miras, Gridfy, con imagen cada uno · `src/content/casos/<slug>/index.md` · (CA-2, CA-5, CA-6) · [P]
- [ ] T-09 · MA · `Card.astro` + `card.css`, `Casos.astro` + `casos.css`; home con los 5 casos en orden · (CA-2, CA-5)
- [ ] T-10 · MA · `Hero.astro`: un solo CTA a `/contacto/`, línea de reserva; `QueHago.astro`, `Piezas.astro`, `Indice.astro` con sus CSS; `index.astro` compuesto; `nav.ts` · (CA-1, CA-7, CA-8)
- [ ] T-11 · MA · `pages/contacto.astro` y `pages/privacidad.astro`; rellenar `data/site.ts` (email, teléfono) · (CA-10)

## 5. Prueba en el entorno desplegado
- [ ] T-12 · MA · `npm run build` limpio (tipos, stylelint, check-dist) y `git push` · (todos)
- [ ] T-13 · MA · en la preview de Vercel de la rama: capturas a 375 y 1440 (CA-1); ir y volver con Swup entre home y 2 casos; móvil sin scroll horizontal; «reducir movimiento»; JS desactivado (CA-11); `curl` a las 8 rutas → 200 (CA-10). Anotar aquí qué se probó, URL y commit · (CA-1, CA-10, CA-11, CA-12)
- [ ] T-14 · MA · revisión de «Qué pasó después» caso por caso: solo hechos; anotar aquí el veredicto de cada uno · (CA-6)
- [ ] T-15 · Claude (subagente que no ha visto el código) · revisión de código del cambio completo según §7 del método · (cierre)

## 6. Documentación
- [ ] T-16 · Claude · `docs/contenido.md`: cómo se añade o edita un caso · (cierre)
- [ ] T-17 · MA · PR a `main` con qué entra, cómo se verificó, riesgos y cómo se deshace. La fusión la decide MA · (cierre)
- [ ] T-18 · MA · apuntar en el monorepo la propuesta de llevar `prose.css` y `card.css` a `core/` (otra rama, otro repo) · (riesgos del plan)

## Hecho cuando
- [ ] Los 3 builds en rojo de T-03, los 2 de T-05 y los 2 de T-06 se vieron y están anotados
- [ ] `npm run build` limpio: `astro check`, stylelint, `check-dist`
- [ ] Las 8 rutas responden 200 en la preview
- [ ] Revisión de código hecha (T-15) sin hallazgos bloqueantes
- [ ] Evidencia de T-13 y T-14 escrita en este fichero
- [ ] `docs/contenido.md` escrito
- [ ] PR abierto; la fusión a `main` la decide Miguel Ángel

## Evidencia
(se rellena al ejecutar T-03, T-05, T-06, T-13 y T-14)
