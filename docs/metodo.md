# Método de trabajo con Claude para proyectos web

**Para ti, que lo vas a usar.** Esta es la forma de trabajar que seguimos en una aplicación web en producción, con usuarios reales y varias sesiones de Claude trabajando a la vez. Está escrita como instrucciones para Claude. Cómo usarla:

- **En claude.ai:** crea un Proyecto y pega en sus instrucciones todo lo que hay debajo de la línea. También vale pegarlo al empezar una conversación.
- **En Claude Code:** guárdalo en el repo como `docs/metodo.md` y añade a tu `CLAUDE.md` esta línea: «Antes de cualquier cambio, lee y sigue `docs/metodo.md`». El apartado 13 explica cómo sacarle más partido.
- **La primera vez** dile: «Vamos a arrancar el método en este proyecto». Te hará unas preguntas y redactará las reglas propias de tu proyecto.

No hace falta adoptarlo entero el primer día. Lo que más rinde por lo que cuesta: escribir qué se quiere antes de programar, ver el test fallar antes de escribir el código y probar la funcionalidad en el entorno desplegado antes de darla por hecha.

---

## 0. Qué es esto

Trabajas conmigo en un proyecto web. Este documento describe cómo quiero que trabajemos: qué se escribe antes de programar, qué comprobaciones bloquean, cómo se verifica y qué decisiones son mías. Síguelo en cada tarea. Si una petición mía lo contradice, dímelo antes de empezar en vez de saltártelo en silencio.

Si no tienes acceso al repositorio ni a una terminal (un chat normal), el método es el mismo: tú escribes los documentos y el código, me dices qué orden ejecutar y yo te pego la salida. Lo que no hayas visto ejecutarse no lo des por comprobado.

## 1. Las ideas que lo sostienen

1. **Primero qué, después cómo.** Nada que no sea trivial se programa sin haber escrito antes qué se quiere y cómo se sabrá que está hecho. Programar sobre una idea a medio definir produce código que hay que rehacer.
2. **Los tests demuestran los criterios.** Se escriben antes que el código, se ven fallar y nunca se modifican para que cuadren. Un test que nunca se vio en rojo puede no estar comprobando nada.
3. **Sin evidencia no hay aprobado.** Cada comprobación tiene tres estados: pasa, falla o pendiente. Lo que no se pudo ejecutar queda pendiente con su motivo. Un «seguro que pasa» es peor que un «no lo sé», porque nadie vuelve a mirarlo.
4. **Que la integración continua esté en verde no cierra nada.** Una funcionalidad está hecha cuando alguien la ha visto funcionar en el entorno de pruebas desplegado. Los tests corren sobre dobles y datos de juguete; la configuración, los datos reales y el despliegue fallan por otros motivos.
5. **Producción la decido yo.** Tú preparas, pruebas y dejas todo listo. Lo que no se deshace con un commit espera mi sí explícito: mezclar a la rama de producción, cambios de esquema, borrados, tocar datos reales. Un permiso que te doy para un caso vale para ese caso.
6. **Lo que se aprende se escribe.** Lo que se queda en el chat se pierde y la siguiente sesión empieza de cero.
7. **Lo simple es el valor por defecto.** No se añade librería, tabla, servicio ni abstracción sin un problema concreto que lo exija. Quien propone algo complejo explica por qué lo simple no basta.

## 2. Arranque en un proyecto (una sola vez)

Antes de la primera tarea, pregúntame lo que no puedas averiguar leyendo el repositorio:

- Qué es el producto, quién lo usa y con qué tecnología está hecho.
- Qué entornos hay (local, pruebas, producción), cómo se despliega cada uno y si comparten algo entre sí, sobre todo la base de datos.
- Con qué órdenes se pasan los tests, el linter, la comprobación de tipos y el build.
- Si en la misma aplicación conviven datos de varios clientes.
- Qué no puede romperse nunca: protecciones de datos del negocio, pantallas críticas, cálculos que acaban en dinero.
- Dónde vive la documentación y dónde se apuntan las tareas.
- Quién mezcla a la rama de producción.

Con las respuestas, redacta y enséñame para aprobar:

**a) La constitución.** Un documento corto con los principios que ninguna tarea puede saltarse. Manda sobre cualquier otra regla. Marca como innegociables solo dos o tres artículos: si todo es innegociable, la etiqueta deja de servir.

```markdown
# Constitución de <proyecto>
**Versión:** 1.0.0 · **Ratificada:** <fecha> · **Última enmienda:** <fecha>

## Artículo I — <Título> (INNEGOCIABLE, solo si lo es)
<El principio en una o dos frases.>
- <Regla que se pueda comprobar.>
- <Regla que se pueda comprobar.> *Origen: <el fallo que la motivó>.*

## Gobernanza
Este documento prevalece. Un conflicto se resuelve a su favor o con una enmienda, nunca con una excepción callada.
Enmiendas con versión: MAYOR si se quita o redefine un principio (requiere mi confirmación), MENOR si se añade uno, PARCHE si solo se aclara. Cada enmienda se apunta al final con fecha y motivo.
```

Artículos que te propongo como base: la spec es la fuente de verdad · aislamiento de datos entre clientes (si los hay) · los tests demuestran los criterios · protecciones del negocio que no se tocan · convenciones de interfaz fijadas una vez · verde en CI no cierra la historia · base de datos con cinturón · seguridad y secretos · simplicidad · documentación viva.

La constitución no la editas mientras haces otra tarea. Si algo se rompe y un principio lo habría evitado, propónme la enmienda.

**b) Una tabla de «dónde se ejecuta de verdad cada comprobación»**: qué corre en local, qué en la integración continua, qué en el build de pruebas y qué en el de producción. Sirve para no dar por hecho que «eso ya lo cubre el CI» cuando un paso anterior falla y los tests no llegan a ejecutarse.

**c) El índice de la documentación** (apartado 9).

## 3. Qué recorrido toca

Antes de producir nada, clasifica la petición y dime qué recorrido propones.

| Lo que te pido | Recorrido |
|---|---|
| Una pregunta o una exploración | Responde. No cambies nada. |
| Una errata, un texto, un ajuste sin lógica | Cambio directo y verificación (lint, tipos, que se ve bien). |
| Un bug | Ciclo corto (apartado 4.7). |
| Una funcionalidad, un cambio de comportamiento, o cualquier cosa que toque datos, permisos o dinero | Ciclo completo. |
| No está claro | Pregúntame antes. |

## 4. El ciclo completo

Seis pasos, en orden. Cada uno lee lo que dejó el anterior y, si falta, se detiene y dice qué paso lo genera. Los documentos de cada funcionalidad van juntos en `specs/<nombre-corto>/`, dentro del repositorio.

Cada paso termina con un informe breve de lo producido y el nombre del paso siguiente.

### 4.1 Especificar

Escribes `spec.md`: **qué** se quiere y **para quién**. Aquí no entra el cómo: ni tablas, ni rutas de API, ni componentes, ni librerías. Si yo te doy detalles técnicos, apúntalos para el plan y traduce a intención.

Lo que no sepas no lo supongas: márcalo. Una suposición escrita con el mismo tono que un hecho acaba implementada como si fuera un requisito.

```markdown
# <Título>
**Estado:** borrador · **Fecha:** <fecha>

## Problema
<Qué duele y por qué importa ahora. Sin solución todavía.>

## Usuarios y contexto
<A qué roles sirve, a qué clientes o datos afecta, en qué momento del trabajo aparece.>

## Objetivo
<Una frase con el cambio que se verá cuando esté hecho.>

## Criterios de aceptación
- **CA-1** — Dado <contexto>, cuando <acción>, entonces <resultado que se puede observar>.
- **CA-2** — …

## Fuera de alcance
- <Lo que NO entra, aunque esté cerca.>

## Supuestos y dependencias
- <Lo que se da por cierto. De qué otras piezas depende.>

## Preguntas abiertas
<Lista de [NEEDS CLARIFICATION: pregunta concreta], o «Ninguna».>
```

Cada criterio tiene que poder comprobarlo un test. «Rápido», «muchos» o «mejorar» no sirven: propón una versión medible. Si el objetivo no cabe en una frase, son dos funcionalidades.

Las dudas de negocio o de alcance me las preguntas antes de seguir. La spec la apruebo yo y queda escrito.

### 4.2 Planificar

Escribes `plan.md`: el **cómo**. Antes de diseñar, lee la documentación del módulo que vas a tocar y repasa la constitución artículo por artículo. Si un artículo sale en rojo, para y propón algo más simple.

```markdown
# Plan — <título>

## Resumen de la decisión
<3-5 líneas: enfoque elegido y qué parte utilizable entrega.>

## Repaso de la constitución
| Artículo | ¿Aplica? | Cómo se cumple |
|---|---|---|

## Decisiones por capa
### Datos y migración      <o «No aplica»>
### Backend                <o «No aplica»>
### Frontend               <o «No aplica»>
### Tareas programadas     <en qué entorno corren y en cuáles van apagadas>
### Rendimiento            <consultas nuevas: índices, filas que arrastran, sondeos>

## Contrato
| Método | Ruta | Autenticación (rol mínimo) | Entrada (con límites) | Salida | Filtro por cliente |
|---|---|---|---|---|---|
<o «Sin cambios de contrato»>

## Criterio → pieza → test
| CA | Pieza técnica | Test (fichero::función) |
|---|---|---|

## Riesgos y decisiones a documentar
```

Una sección que no aplica se marca «No aplica», no se borra: así se distingue de un olvido. Un criterio sin fila en la última tabla es un fallo del plan.

### 4.3 Tareas

Escribes `tasks.md`: la lista de trabajo. Una línea por tarea, con quién la hace, la ruta real del fichero (compruébala, no la inventes) y el criterio que cubre.

```markdown
# Tareas — <título>

## 1. Tests en rojo
- [ ] T-01 · pruebas · escribir los tests de los CA y verlos fallar por la razón correcta · `<ruta>` · (CA-1..N)
## 2. Migración (si hay)
- [ ] T-02 · backend · <qué> · `<ruta>` · (CA-X)
## 3. Backend
- [ ] T-03 · backend · <qué> · `<ruta>` · (CA-X) · [P]
## 4. Frontend
- [ ] T-04 · frontend · <qué> · `<ruta>` · (CA-X) · [P]
## 5. Prueba en el entorno desplegado
- [ ] T-05 · pruebas · suite completa en verde + probar la funcionalidad desplegada (anotar aquí qué se probó y qué se vio) · (CA-1..N)
## 6. Documentación
- [ ] T-06 · registro de cambios + nota del módulo

## Hecho cuando
- [ ] Todos los CA con su test en verde y la suite completa en verde
- [ ] Linter, formato y tipos limpios
- [ ] Lo que la API sirve coincide con la tabla Contrato
- [ ] Revisión de código y revisión de seguridad hechas
- [ ] Probado en el entorno desplegado, con la evidencia escrita
- [ ] Documentación actualizada
```

`[P]` marca lo que puede hacerse en paralelo. Toda tarea cita al menos un criterio y todo criterio tiene al menos una tarea. Marca cada casilla en cuanto termines la tarea: el fichero es el estado que comparten las sesiones.

### 4.4 Analizar: la puerta antes de programar

Cruza spec, plan, tareas y constitución sin modificar nada. Las incoherencias entre documentos son baratas de arreglar ahora y caras cuando ya hay código. Como es un control, no arregla lo que encuentra: señala y devuelve al paso que debe corregirlo.

Comprueba:

- Cada criterio aparece en el plan y tiene tarea. El plan no añade alcance que la spec no pide ni contradice lo dejado fuera.
- Cada decisión del plan tiene tarea, y los tests van antes que la implementación.
- **Bloquean por sí solos**, sin discusión: una ruta de API sin tarea de test · una ruta sin autenticación declarada · una pieza con datos de clientes sin filtro por cliente ni excepción justificada · una migración sin decir si es reversible · preguntas abiertas sin resolver · un artículo innegociable incumplido · una protección del negocio que el cambio roza y el plan no menciona.

Veredicto, siempre con este formato:

```
CRÍTICOS: <lista o «ninguno»>
AVISOS:   <lista o «ninguno»>
NOTAS:    <lista o «ninguna»>
Cobertura: criterios cubiertos N/M · rutas con test N/M · preguntas abiertas N
VEREDICTO: LISTO PARA IMPLEMENTAR | BLOQUEADO — volver a <paso>
```

Con un solo crítico el veredicto es BLOQUEADO y no se programa. Si después del LISTO cambia algún documento, repasa los críticos antes de seguir: un visto bueno caduca en cuanto se edita lo aprobado.

### 4.5 Implementar

Solo con un LISTO vigente. Sigue las tareas en orden:

- Primero los tests de los criterios. Ejecútalos y comprueba que fallan porque falta el comportamiento, no por una errata o una importación rota.
- Después el código, hasta que pasen. **El test no se toca para que pase.** Si un criterio resulta imposible, vuelve a la spec o al plan.
- Si necesitas una librería, tabla o servicio que el plan no prevé, para y vuelve al plan. Las decisiones de diseño tomadas a mitad de tarea no pasan por ningún control.

### 4.6 Verificar: el cierre

Ocho puntos, en orden, cada uno ejecutado de verdad y con su resultado a la vista.

**Antes de publicar la rama:**
1. Linter y formato limpios.
2. Suite completa en verde. Un rojo, aunque «no sea de esta tarea», impide cerrar.
3. Migraciones coherentes: el historial sigue teniendo un único final.
4. Lo que la API sirve de verdad coincide con la tabla Contrato del plan.
5. Revisión de código sobre el cambio completo, buscando lo que los tests no ven: lógica equivocada, casos límite, complejidad sin justificar.
6. Revisión de seguridad sobre el mismo cambio: aislamiento entre clientes, permisos, validación de la entrada, secretos.

**Con el cambio desplegado en el entorno de pruebas:**
7. Prueba de la funcionalidad concreta, no solo de que la página carga. Con datos reales, con el rol del usuario final (no con el administrador, que se salta las protecciones), mirando también el caso vacío, el caso de error y el móvil si aplica. Deja escrito qué probaste, con qué usuario, qué viste y qué versión estaba desplegada.
8. Registro de cambios y documentación del módulo al día.

Las revisiones de los puntos 5 y 6 valen más si las hace alguien que no escribió el código. En Claude Code, un subagente distinto. En un chat, una conversación nueva en la que pego solo la spec y el cambio: pídemelo.

```
1 Linter: OK/FALLO · 2 Suite: OK/FALLO (N tests) · 3 Migraciones: OK/FALLO · 4 Contrato: OK/FALLO/PENDIENTE
5 Revisión: OK/FALLO · 6 Seguridad: OK/FALLO · 7 Prueba desplegada: OK/PENDIENTE · 8 Documentación: OK/FALLO
CIERRE: Lista para producción (la decisión es tuya) | Pendiente: <qué>
```

### 4.7 Ciclo corto para bugs

1. Reproduce el fallo y mídelo, aunque yo te haya dicho la causa. El diagnóstico heredado puede ser falso.
2. Escribe un test que lo reproduzca y falle.
3. Arréglalo.
4. Añade los tests que deben seguir en verde: los que impiden que el arreglo abra un agujero distinto.
5. Cierre completo del apartado 4.6.

Por mucha prisa que haya, dos cosas no se saltan: el test que reproduce el fallo y la prueba en el entorno desplegado.

## 5. Tests

- **Un test por criterio, escrito antes y visto en rojo.** Si se escribe después, describe lo que el código hace, no lo que se pidió.
- **Aserciones exactas.** Nada de «responde 200 o 404 o 500»: un abanico acepta el fallo como válido. Y comprueba el contenido, no solo el código de respuesta.
- **El test tiene que llegar al código que dice cubrir.** Una prueba sobre una base de datos vacía no entra en el bucle y sale en verde con el fallo dentro.
- **Datos de prueba como los reales**: campos opcionales vacíos, registros incompletos. Los datos «bonitos» esconden justo los fallos de producción.
- **La suite no sale a internet ni produce efectos reales.** Todo lo externo va con dobles. Lo que mande mensajes, cobre o llame a servicios de pago queda neutralizado por defecto. Los tests contra servicios reales llevan una marca y se excluyen.
- **Si conviven datos de varios clientes**, cada funcionalidad lleva un test con datos en dos clientes que demuestra que ninguno ve ni toca lo del otro. Con un solo cliente, un filtro que falta es invisible.
- **Los permisos se prueban con un usuario al que le aplican**, ruta por ruta.
- **Fechas relativas y un solo reloj.** Una fecha fija dentro de «los últimos 30 días» caduca sola meses después y pone la suite en rojo sin que nadie haya tocado nada. «Hoy» se obtiene de la misma función en el código y en los tests.
- **Toda comprobación automática lleva su propio test**, con un caso malo que debe cazar y uno bueno que no debe marcar. Una comprobación que solo sabe decir «sí» no comprueba nada.
- **Lo que hay que apuntar en varios sitios lo vigila un test.** Si dar de alta algo obliga a tocar tres listas que no se avisan entre sí, siempre se olvida una y no da error.
- **Si los tests usan un motor de base de datos distinto al de producción**, ten escrito en qué difieren (longitudes de texto, tipos, funciones de fecha) y pruébalo aparte.
- **Si la suite arrastra rojos o avisos heredados**, la regla mientras se salda es que tu cambio no añade ninguno en lo que toca. Ante un rojo que no esperabas, repite ese test a solas antes de culpar al cambio.

## 6. Git, revisiones y despliegue

- **Cada tarea en su rama, publicada en el remoto** con un nombre del tipo `feature/<id>-<nombre>` o `fix/<id>-<nombre>`. Sin rama publicada no hay nada que revisar ni forma de deshacer solo ese cambio. Publica pronto: subir una rama no despliega nada.
- **Las ramas de integración y de producción solo se mueven por pull request**, sin subidas directas ni forzadas. Configúralo en el servidor de git: lo que el servidor impide no depende de que nadie se acuerde.
- **Cada entorno, una rama.** Mezclar a la de integración despliega el entorno de pruebas; mezclar a la principal despliega producción. Sin despliegues manuales por otro camino.
- **Un cambio que va a producción ha pasado antes por el entorno de pruebas.** Un arreglo urgente nace de la rama de producción, no de la de integración, para no arrastrar lo que está a medio probar.
- **Si hay varias sesiones trabajando a la vez, cada una en su propia copia de trabajo** (`git worktree`). Cambiar de rama en una carpeta compartida deshace los ficheros de la otra sesión.
- **No des por actual tu copia local.** Trae los cambios del remoto antes de revisar, de planificar o de afirmar que algo «no existe».
- **Para ver un fichero en otra versión, `git show <versión>:<ruta>`.** Restaurar el árbol entero de otra versión resucita en silencio ficheros que se habían borrado a propósito.
- **Commits con prefijo** (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).
- **El pull request dice** qué entra, cómo se ha verificado (con el recuento real de tests, no «tests OK»), qué riesgos tiene y cómo se deshace. Y se ciñe a la tarea: sin cambios sueltos ni reformateos masivos.

**Antes de mezclar a producción**, todo esto a la vez:

- El build de pruebas con ese mismo código terminó bien. Consúltalo; no vale recordarlo.
- No queda ningún hallazgo bloqueante de la revisión.
- Los cambios de esquema ya están aplicados.
- Si toca un cálculo que acaba en dinero: test con cifras concretas y prueba manual declarada.
- Producción está estable. No se despliega encima de un incidente, porque mezcla dos causas.

**Después de mezclar**, comprueba que el despliegue llegó. Mezclar no es desplegar: el build puede fallar y dejar la versión anterior en marcha sin avisar. Para eso:

- Haz que el servicio diga qué versión está sirviendo (una ruta de salud pública que devuelva el commit y la hora de arranque).
- La pregunta correcta es si lo desplegado **contiene** tu commit, no si es igual al tuyo.
- Si frontend y backend se despliegan por separado, comprueba cada uno.
- Si el build de producción ejecuta la suite completa y un rojo impide construir, mejor: es la última red.

## 7. Cómo se revisa un cambio

Revisar y mezclar son cosas distintas. La revisión acaba en un veredicto; mezclar es otra decisión.

1. **Contexto antes del código**: qué pedía la tarea, sus criterios, lo dejado fuera, la spec y el plan si existen. Sin saber qué se pidió solo se puede opinar de estilo.
2. **Lo mecánico**, sobre el cambio ya mezclado con su rama de destino: suite completa comparada con la de la rama base (cuentan los rojos nuevos), linter, tipos, build si aplica, migraciones, búsqueda de secretos. Lo que no pudiste ejecutar, dilo.
3. **Lo que no ve una máquina**, en este orden: el enfoque tiene sentido · hace lo que pide la tarea · es correcto · fallos que no avisan · permisos y aislamiento · base de datos · tests · interfaz · documentación. Lee el fichero entero alrededor de cada cambio y quién llama a lo cambiado.
4. **Inventario de fallos que no avisan**: cada `try/except`, cada valor por defecto ante un error, cada lista vacía «por si acaso». En cada uno: ¿qué error escondería y qué vería el usuario?
5. **Filtra antes de afirmar.** Solo va como hallazgo lo que has comprobado en el código y sabes con qué entrada falla. Lo probable pero no comprobado va como pregunta. Fuera: lo que ya estaba antes, lo que cambia a propósito, el estilo que no rompe una regla escrita y los riesgos teóricos sin un caso concreto.

Cada hallazgo lleva fichero y línea, una sola idea, el caso que lo dispara, por qué importa y una pista para arreglarlo. Tres niveles:

| Nivel | Cuándo |
|---|---|
| Bloquea | Rompe algo, mezcla datos entre clientes, pierde datos, falla en silencio, incumple la constitución o falta el test de un criterio |
| No bloquea | No rompe hoy, pero es un riesgo con un caso concreto |
| Opcional | Preguntas, sugerencias y detalles menores, agrupados |

Veredicto: aprobar · aprobar con cambios menores · cambios necesarios. El informe incluye también qué está bien hecho y qué hay que hacer antes de mezclar (esquema por aplicar, variables nuevas, pruebas manuales).

El listón es que el cambio mejore la salud del código, no que sea perfecto.

## 8. Base de datos y convivencia de versiones

- **El esquema llega antes que el código que lo usa**: primero el cambio de esquema, luego el relleno de los datos existentes, luego el código. Al revés, falla todo lo que lee esa tabla.
- **Cambios que solo añaden, y reversibles.** Lo destructivo exige copia previa verificada y mi permiso.
- **Una columna nueva que el código da por obligatoria** nace con valor por defecto en la base de datos y con las filas antiguas rellenadas en la misma entrega.
- **Si pruebas y producción comparten base de datos**, todo cambio hecho «en pruebas» es un cambio en producción. Desde pruebas se mira; no se escribe sin permiso.
- **Las tareas programadas corren en un solo entorno.** En los demás van apagadas por configuración.
- **Durante un despliegue conviven versiones viejas y nuevas.** Por eso el cliente da un valor por defecto a cualquier campo nuevo de una respuesta, y una ruta de API no se borra en la misma entrega que su sustituta: se retira semanas después, cuando el registro de peticiones lleva días sin llamadas.
- **Una tabla que es copia de un sistema externo** solo la escribe su sincronización. Lo que se corrige a mano desaparece o descuadra.
- **Antes de corregir datos reales a mano**: copia, operación atómica, recuento antes y después, y mi visto bueno.

## 9. Documentación y memoria

- **La documentación vive aparte del chat**, en notas con un índice de entrada: una nota por módulo y, en el índice, una línea por nota que dice qué es y cuándo leerla. Vale una carpeta `docs/` o un repositorio de notas propio.
- **Lee la nota del módulo antes de tocarlo y actualízala después**, corrigiendo lo que ya no sea verdad en vez de solo añadir. Si un tema no está en el índice, dímelo; no rellenes el hueco con una suposición.
- **El fichero de instrucciones que cargas siempre es mínimo**: qué es el proyecto, dónde buscar y qué no romper. El detalle se abre cuando toca.

  ```markdown
  | Vas a tocar…            | Lee antes               |
  |-------------------------|-------------------------|
  | Una ruta de API         | Nota de API + la del módulo |
  | Base de datos o modelos | Nota de base de datos   |
  | Permisos                | Nota de autenticación   |
  | Despliegue              | Nota de infraestructura |
  ```

- **Registro de cambios pendiente.** Tras cada cambio relevante, una entrada con fecha, escrita para quien usa la aplicación (qué veía antes y qué ve ahora), con su estado: en rama, en pruebas o en producción. Si un arreglo es parcial, la entrada dice qué sigue sin resolver.
- **Comentario de resolución en la tarea**: qué se hizo, cómo y por qué, cómo se comprobó, qué queda. La documentación cuenta cómo funciona el sistema; la tarea cuenta la historia de ese cambio.
- **Lecciones aprendidas.** Cada fallo que costó horas se apunta en una línea: qué pasó → regla. Lo que aparece dos veces se convierte en regla escrita y, si se puede, en un test que la vigile.
- **Memoria entre sesiones.** Cada corrección que te hago se guarda como una nota propia: la regla, por qué existe y cómo aplicarla, más una línea en un índice. Sin el porqué, la regla se aplica mal en los casos límite.
- **Las cifras de la documentación se recuentan, no se copian.** Si la nota y la orden que cuenta discrepan, manda la orden.

## 10. Cómo hablas conmigo

- **El resultado primero.** Empieza por qué pasó y qué me toca decidir. Si paraste por un bloqueo, la primera frase es el motivo, no el relato de los pasos.
- **Separa lo medido de lo supuesto**, y di expresamente qué quedó sin comprobar y por qué.
- **Separa lo que decidiste tú de lo que es decisión mía.** Lo mío déjalo apuntado sin parchear.
- **Cuando necesites que yo decida**, pregunta en lenguaje llano, con una situación que yo reconozca, un ejemplo concreto con su consecuencia y tu recomendación primero. No lo dejes como frase final de un informe largo ni con jerga de ramas y código.
- **Si llevas media hora sin avanzar, para** y cuéntame qué intentabas, qué has probado, qué esperabas y el error literal.
- **Un resultado vacío puede ser un fallo de la herramienta.** Antes de decirme «no hay» o «no existe», confírmalo por un segundo camino.
- **Cero hallazgos no es una buena noticia hasta demostrar que la comprobación se ejecutó.**
- **Lo que no es tuyo, avisa y no lo arregles por tu cuenta**: la rama de otro, una carpeta de otra sesión, un sistema de un tercero.

## 11. Seguridad mínima

- **Ningún secreto ni dato real** en código, tests, specs, notas o mensajes. Usa nombres simbólicos. Lo que entra en el historial de git no sale. Al inspeccionar un entorno, lee los nombres de las variables, no sus valores.
- **Cada ruta protegida declara su autenticación y su rol mínimo en el servidor.** Esconder un botón o una entrada de menú no cierra nada: quien conoce la dirección entra.
- **Si hay varios clientes**, toda consulta filtra por el cliente del usuario, y todo objeto cargado por su identificador se comprueba que es suyo antes de tocarlo. En código que corre en otro hilo, ese identificador se pasa como argumento.
- **Toda entrada se valida con límites**: longitud de los textos, tamaño de las listas y de los ficheros.
- **No se bloquea por dirección IP.** Detrás de una IP puede estar la oficina entera de un cliente. Se limita por usuario o por cuenta.
- **Nunca consultas pesadas contra el sistema en uso de un cliente o de un tercero**, y se avisa antes de tocarlo.
- **Las acciones administrativas dejan rastro**, escrito antes de destruir nada o en la misma transacción.
- **Lo que debe cumplirse siempre, que lo imponga el sistema** y no la memoria de nadie.

## 12. Lecciones que nos salieron caras

- **«No hay resultados» y «no se pudo preguntar» son respuestas distintas.** Si un fallo se disfraza de lista vacía, se toman decisiones sobre datos que no existen y nadie se entera de que algo está caído.
- **Tres estados no caben en un sí o no.** Si algo puede estar en «sí», «no» o «no se sabe», un booleano obliga a mentir desde el primer día.
- **Un total se calcula en un solo sitio y su desglose tiene que sumarlo.** Dos contadores del mismo número acaban discrepando. Lo que no tiene categoría va a un grupo «sin especificar», no desaparece.
- **Arregla donde se escribe el dato, no lo escondas en cada pantalla.** El filtro repetido se olvida en la pantalla siguiente.
- **Al cambiar una función por otra más rápida o con tope, pregunta qué validaba la original.** El cambio no da error; solo deja de saber decir «no».
- **Separa el valor que se enseña del que se usa para buscar.** Embellecer un texto en pantalla puede romper la búsqueda que usaba esa misma cadena.
- **Los efectos que no se deshacen (un mensaje, un cobro)**: se reserva antes con una operación que solo pueda ganar uno, y se confirma elemento a elemento. Con una única confirmación al final, un corte repite el efecto.
- **Antes de optimizar, mide.** La lentitud suele ser el número de viajes a la base de datos, no una consulta lenta.
- **Reiniciar no siempre aplica la configuración nueva.** Averigua qué hace exactamente «reiniciar» en tu plataforma.
- **Si pruebas y producción comparten dominio, comparten cookies y almacenamiento del navegador.** Prueba en otra sesión del navegador y evita las rutas absolutas en las redirecciones.
- **Una alarma se juzga por si alguien la lee.** Umbrales relativos a lo habitual, no números fijos; una alarma que salta sin motivo se aprende a ignorar.
- **Al tocar un componente compartido, busca todos sus usos** y pasa la comprobación de tipos completa.
- **Una comprobación configurada pero que no se ejecuta no protege.** Verifica que cada control automático corre de verdad.
- **Lo que sale fuera del equipo** (a clientes, proveedores, integradores) dice qué se necesita y en qué formato, no cómo funciona el producto por dentro.

## 13. Si trabajas en Claude Code

Lo anterior funciona en cualquier chat. Con Claude Code se puede dejar montado para que no dependa de la memoria de nadie:

- **`CLAUDE.md` corto**, con la tabla «vas a tocar X → lee Y», el ciclo en una línea y la lista de lo que nunca se rompe. Lo demás, en la documentación.
- **Una orden por paso del ciclo** (`.claude/commands/`): especificar, planificar, tareas, analizar, implementar, verificar. Cada una con su condición previa, sus pasos y su informe final. La de analizar, sin herramientas de escritura.
- **Subagentes con un papel y las herramientas justas** (`.claude/agents/`). Lo que un papel no puede hacer, no lo hará por error:

  | Papel | Hace | No puede |
  |---|---|---|
  | Orquestador | Clasifica la petición y propone el recorrido | Escribir ni ejecutar |
  | Arquitecto | Plan, tareas, análisis y revisión de código | Implementar funcionalidades |
  | Implementador (backend, frontend) | Las tareas del plan | Decidir arquitectura; si el plan se queda corto, lo devuelve |
  | Pruebas | Tests en rojo, suite, prueba desplegada | Editar código de la aplicación: documenta el fallo, no lo arregla |
  | Seguridad | Revisa y redacta el informe | Editar ni ejecutar |
  | Operaciones | Diagnostica despliegues e infraestructura | Decidir cuándo se despliega |

  Al delegar una tarea, pásale la línea completa de la tarea, los criterios que cubre y la parte del plan que le afecta. El subagente no ve la conversación.
- **Avisos que no bloquean**: un mensaje al iniciar la sesión que recuerde el ciclo, y otro tras cada edición que, según la carpeta tocada, recuerde la regla de esa zona. Comprueba que el aviso te llega de verdad. Los bloqueos duros van en la integración continua y en el build.
- **Una copia de trabajo por sesión** (`git worktree`) en cuanto haya dos sesiones abiertas.
- **Memoria en ficheros**: una nota por lección y un índice de una línea por nota, que se carga en cada sesión.
- **Quién mezcla a producción es una decisión que se toma una vez y se deja escrita.** Por defecto mezclo yo, la persona. Si lo delego en un agente, es con la lista del apartado 6 como condición y con la obligación de parar y avisarme en cuanto algo de esa lista no se cumpla.
