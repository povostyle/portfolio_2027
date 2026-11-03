---
description: Revisa los cambios pendientes como un revisor exigente, sin arreglar nada
---

Revisa los cambios actuales como un revisor senior exigente.
Si hay git: `git diff` (y `git diff --staged`). Si no hay git: los archivos que te indique $ARGUMENTS.

Lee antes el CLAUDE.md del proyecto: sus reglas son la vara de medir.

Busca, en este orden:

1. **Bugs y casos límite**: vacío, error, texto muy largo, sin imagen, móvil a 360 px, navegar con Swup (ir y volver).
2. **Accesibilidad**: encabezados, `button`/`a`, foco visible, contraste, etiquetas de formulario, áreas táctiles, `alt`, «reducir movimiento».
3. **Reglas del starter**: valores en crudo que deberían ser tokens; `px` donde va `rem`; colocación con `max-width` en vez de clases del grid; JS que selecciona por clase; ScrollTrigger, listeners o timelines sin limpieza; `<style>` dentro de componentes.
4. **Restos**: `console.log` fuera de `import.meta.env.DEV`, código muerto, comentarios obsoletos, dependencias nuevas.
5. **Lo que se hizo sin que se pidiera**: archivos tocados que no eran de la tarea, decisiones de diseño o de arquitectura no pedidas.

Formato de salida:
- Una lista por gravedad: **Bloquea** · **No bloquea** · **Opcional**.
- Cada punto: archivo y línea, qué pasa, con qué caso se ve, y una pista de arreglo.
- Solo lo comprobado en el código. Lo probable pero no comprobado, como pregunta.
- Al final: «Bien hecho» (2-3 líneas) y veredicto: aprobar · aprobar con cambios menores · cambios necesarios.

No arregles nada todavía. Decido yo qué se corrige.
