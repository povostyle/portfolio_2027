# Home y casos de estudio
Rama `feature/home-casos` · 26-10-2026 · Sustituye a spec/plan/tasks: una sola página, legible.

## Qué se hace
La home de miguelangelpoyatos.com y cinco casos de estudio. Objetivo: que cualquiera entienda en 10 segundos qué tipo de web hago y para quién, y que los casos lo demuestren.

## Contenido
- **Frase:** «Diseño y desarrollo webs para empresas de ciencia, salud e industria». Reserva: «Sitios que transmiten solvencia sin parecer plantillas». Un botón: Contacto.
- **5 casos, en este orden:** PTS Granada (para la agencia Terceto, ya cerrada; rediseño 2026 como cliente directo) · Balticasa · Achi Kushnir · Proyecto Miras (UGR) · Gridfy (solo desarrollo).
- **2 piezas de gusto:** Fátima Lianes · Soma Arquitectos. Una línea y enlace, sin página.
- **Índice:** los otros 13 proyectos, en texto, sin enlaces. Nombre, sector, papel y año si se sabe.
- **Qué hago:** 3-4 líneas. Sin bio «apasionado / polivalente». Sin «Creative Developer».
- **Contacto:** página `/contacto/` con email y teléfono. También `/privacidad/`.
- Textos en «papel»: libres (propio / para la agencia X / solo desarrollo). Sin más reglas.

## Cómo se ve (composición de segerman.dev, identidad propia)
- **Home, primera pantalla:** izquierda la frase + reserva + botón; centro las 5 capturas grandes apiladas con cliente · sector · papel; derecha los 5 nombres fijos al hacer scroll. Móvil: todo apilado.
- **Debajo:** qué hago · piezas de gusto (dos baldosas en fila) · índice · contacto.
- **Caso:** título, captura grande, Año · Papel · Visitar, cuatro apartados (Problema · Decisiones · Qué construí · Qué pasó después) a 6-8 columnas con 2-3 capturas entre medias, «Siguiente caso».
- Intro: el loader del núcleo. Sin porcentaje, sin 3D, sin audio. Un loader «impactante» se valora después de publicar.
- Animaciones: solo las del núcleo (`data-reveal`, `data-text-reveal`). Nada nuevo en este bloque.

## Cómo se construye
- Los 5 casos son Markdown: `src/content/casos/<slug>/index.md` + `cover.jpg` al lado. Esquema en `src/content.config.ts`: si falta un dato, el build falla y dice cuál.
- Los 20 proyectos (casos + piezas + índice) en `src/data/proyectos.ts`, un array tipado.
- Componentes nuevos, cada uno con su `.astro` y su `.css` del mismo nombre: `Casos`, `Card`, `QueHago`, `Piezas`, `Indice`, `Prose`. Páginas: `index`, `casos/[slug]`, `contacto`, `privacidad`.
- Cero librerías nuevas, cero JS nuevo.
- Más adelante, para aprender: el mismo esquema leyendo de WordPress headless. No en este bloque.

## Pasos
1. [ ] `src/content.config.ts` con el esquema. Build limpio.
2. [ ] Primer caso: Balticasa. Quitar un campo a propósito y ver el build fallar; devolverlo.
3. [ ] Página de caso `casos/[slug].astro` + `Prose` + `prose.css`. Verla en local.
4. [ ] Los otros 4 casos (textos y capturas).
5. [ ] `proyectos.ts`, `Card` + `Casos`: primera pantalla de la home.
6. [ ] `Hero` ajustado, `QueHago`, `Piezas`, `Indice`, `nav.ts`, `contacto`, `privacidad`.
7. [ ] `npm run build` limpio, push, y revisar en la preview de Vercel: móvil, Swup ida y vuelta, «reducir movimiento», que ningún enlace dé 404.
8. [ ] PR a `main`. La fusión la decides tú.

Después de cada paso: commit. Push al terminar el paso.

## Terminado cuando
Está visto en la preview de Vercel y no aparece nada de lo que decidimos quitar. «Qué pasó después» solo lleva hechos; si no los hay, es corto y lo dice.

## Pendiente de datos
Años de los proyectos. Datos reales para «Qué pasó después» (se piden después de redactar).
