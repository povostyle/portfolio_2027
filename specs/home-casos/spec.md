# Home y casos de estudio
**Estado:** APROBADA por Miguel Ángel el 26-10-2026 · **Fecha:** 2026-10-26 · **Rama:** `feature/home-casos`

## Problema
La web actual (miguelangelpoyatos.com) es una lista de 20 proyectos con una bio genérica («Creative Developer / Web Designer», «apasionado», «polivalente»). No dice qué tipo de web hago ni para quién, y obliga al visitante a deducirlo abriendo enlaces a webs de clientes. Quien decide contratar no tiene tiempo para eso.

## Usuarios y contexto
- **Principal:** quien encarga la web en una empresa o institución de ciencia, salud, investigación o industria (parques tecnológicos, universidad, biotech, industria de la provincia). Llega por recomendación o buscándome, y decide en pocos segundos si sigue leyendo.
- **Secundario:** agencias que subcontratan desarrollo y responsables de selección. Buscan saber qué hice yo exactamente en cada proyecto.

## Objetivo
Que cualquiera entienda en 10 segundos qué tipo de web hago y para quién, y que cinco casos lo demuestren con un equilibrio entre encaje en el sector y calidad visual.

## Contenido

**Home, en este orden:** posicionamiento → 5 casos → qué hago exactamente → piezas de gusto → índice del resto de proyectos → contacto.

**Los 5 casos, en este orden:**
| # | Caso | Sector | Mi papel |
|---|---|---|---|
| 1 | PTS Granada — Parque Tecnológico de la Salud | Salud / investigación | Web original: para la agencia Terceto (hoy cerrada), diseño y desarrollo a mi cargo. Rediseño 2026: cliente directo, en curso (`pts.miguelangelpoyatos.com`, no se enlaza hasta que esté migrado) |
| 2 | Balticasa | Industria (fabricación) | Propio — diseño y desarrollo |
| 3 | Achi Kushnir | Salud (MedTech) | Propio — diseño y desarrollo |
| 4 | Proyecto Miras — UGR Psicología | Investigación | Propio — diseño y desarrollo |
| 5 | Gridfy | Tecnología / digitalización | Propio — solo desarrollo |

**Piezas de gusto:** Fátima Lianes y Soma Arquitectos (ambas publicadas).

**Contacto:** página propia en `/contacto/` con email y teléfono.

**Índice:** el resto de los 20 proyectos de la web actual.

## Criterios de aceptación
- **CA-1** — Dado un visitante en móvil (375 px de ancho) o escritorio (1440 px), cuando carga la home, entonces la frase de posicionamiento y un único botón a contacto se ven sin hacer scroll; a 1440 px se ve además, al menos en parte, la primera captura de caso.
- **CA-2** — Dada la home, cuando se recorre, entonces aparecen exactamente 5 casos, cada uno con cliente, sector, mi papel y el problema en una frase de 120 caracteres o menos, y un enlace a su página.
- **CA-3** — Dado un caso, cuando se abre su página (`/casos/<nombre>/`), entonces tiene cuatro apartados en este orden: Problema · Decisiones · Qué construí · Qué pasó después.
- **CA-4** — Dado un caso al que le falta un dato obligatorio (cliente, sector, papel, problema, año), cuando se ejecuta el build, entonces falla con un mensaje que nombra el caso y el dato. *Se comprueba quitando un dato a propósito y viendo el build en rojo antes de dar por buenos los demás.*
- **CA-5** — Dado un proyecto de agencia, cuando se muestra (caso o índice), entonces dice que es de agencia y qué hice yo exactamente. Ningún texto atribuye trabajo de agencia como propio.
- **CA-6** — Dado el apartado «Qué pasó después», entonces contiene solo hechos comprobables (cifras, qué cambió para el cliente, si siguió trabajando conmigo). Si no los hay, el apartado es breve y lo dice; no se rellena con frases genéricas. *Revisión manual: Miguel Ángel lo confirma caso por caso.*
- **CA-7** — Dada la home, entonces las piezas de gusto aparecen después de los casos, en un bloque distinto y más breve, con una línea cada una.
- **CA-8** — Dado el índice, entonces lista como texto (sin enlaces a webs de clientes) cada proyecto que no está en casos ni en piezas: nombre, sector, papel y, si se conoce, año. El total de casos + piezas + índice es 20.
- **CA-9** — Dada cualquier página, entonces no aparecen «Creative Developer», «Web Designer», «apasionado», «polivalente» ni audio automático. *Se comprueba buscando esas palabras en el resultado del build.*
- **CA-10** — Dada la home y las páginas de caso, cuando se sigue cualquier enlace interno, entonces ninguno da 404 (hoy `/contacto/` y `/privacidad/` lo dan).
- **CA-11** — Dado un visitante con «reducir movimiento» o sin JavaScript, entonces todo el contenido es visible y legible; en móvil no hay scroll horizontal.
- **CA-12** — Todo lo anterior se ha visto funcionar en la preview de Vercel de esta rama, navegando con Swup (ir y volver), en móvil y con «reducir movimiento», y queda escrito qué se probó.

## Diseño decidido (26-10-2026, referencia: segerman.dev, solo la composición)
- **Home, primera pantalla:** izquierda, frase de posicionamiento + línea de reserva + botón a contacto; centro, las 5 capturas grandes apiladas con cliente · sector · papel debajo, cada una enlaza a su caso; derecha, lista con los 5 nombres fija al hacer scroll (`position: sticky`). En móvil las columnas se apilan: frase, botón, capturas.
- **Debajo:** qué hago · piezas de gusto (dos baldosas grandes en fila) · índice en texto · contacto.
- **Caso:** título, captura grande, Año · Papel (y agencia) · Visitar, los cuatro apartados a 6-8 columnas con 2-3 capturas entre medias, «Siguiente caso».
- **Intro:** solo el loader del núcleo (primera visita de la sesión, ~1 s). Sin porcentaje, sin escena 3D, sin audio.
- **NO se copia de la referencia:** loader con porcentaje, WebGL, el titular «Creative Developer», el párrafo único por proyecto, su identidad visual.
- **Aparcado a petición de Miguel Ángel:** un loader «impactante» se valora en un bloque posterior, sobre la web ya publicada, y solo si cabe en el límite de los 10 segundos.

## Fuera de alcance
- WordPress headless: el contenido vive en Markdown dentro del repo.
- Formulario de contacto: la página `/contacto/` lleva email y teléfono, sin formulario.
- Micro-animaciones nuevas o efectos propios de cada caso: en este bloque solo las animaciones que ya trae el núcleo. Se añaden en un bloque posterior, sobre una web ya publicada.
- Versión en inglés, blog, dominio y sustitución de la web actual.

## Supuestos y dependencias
- Los textos de cada caso los aporta Miguel Ángel; Claude puede redactar borradores a partir de sus notas, pero no inventa datos.
- Cada caso necesita al menos una captura o imagen propia de buena calidad. Sin imágenes, el caso no se publica.
- El repositorio es público: los borradores se ven. Nada de un cliente (cifras, capturas internas) entra sin que pueda hacerse público.
- La lista completa de proyectos sale de la web actual y del tipo de contenido «proyectos» del WordPress actual.

## Decisiones tomadas (26-10-2026)
- Piezas de gusto: Fátima Lianes + Soma. Orden de casos: el de la tabla. Contacto: página aparte.
- PTS: se nombra a Terceto como agencia; nunca se presenta como «propio» la web original. El rediseño 2026 es encargo real y se cuenta como segunda época.
- Los datos de «Qué pasó después» se recogen en una tarea posterior a la redacción (fuentes: Wayback, PageSpeed, facturación propia, correo al cliente).
- Git: commit local cuando algo funciona; `push` a la rama al terminar cada tarea (no al final del bloque). `main` solo por PR.

## Preguntas abiertas
- Miras: la pantalla azul vista desde la extensión de Chrome no se reproduce en incógnito (comprobado por Miguel Ángel). Cerrada.
- Años: pendientes de datos (Miguel Ángel, 26-10). Decisión suya para no bloquear: en los 5 casos el año es obligatorio (se rellena al escribir cada caso); en el índice es opcional y se muestra solo si existe. CA-8 queda enmendado en consecuencia. Cerrada como pregunta; abierta como dato.
