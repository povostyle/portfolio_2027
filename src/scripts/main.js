/*
 * ÚNICO entry de JS. Aquí no va lógica: solo imports, registro y arranque.
 *
 * Dos formas de añadir comportamiento:
 *   - Componente con marcado propio → custom element (core/element.js). Basta con importarlo abajo.
 *   - Animación por atributo, pieza global o lógica de página → módulo del registro
 *     (core/lifecycle.js) y añadirlo a register().
 */
import "../styles/main.css";
import "./utils/gsap.js"; // registra plugins y eases una sola vez

import { register, boot } from "./core/lifecycle.js";

// Core (persistentes)
import viewport from "./core/viewport.js";
import scroll from "./core/scroll.js";
import loader from "./core/loader.js";
import gridOverlay from "./core/grid-overlay.js"; // solo con <html data-grid-overlay>

// Componentes globales (fuera de #swup, se inician una vez)
import menu from "./components/menu.js";
import header from "./components/header.js";

// Custom elements: se registran al importarlos; el navegador los inicia y limpia solos
import "./components/accordion.js"; // <bc-accordion>

// Animaciones genéricas
import reveal from "./animations/reveal.js";
import textReveal from "./animations/text-reveal.js";

// Páginas
import home from "./pages/home.js";

register(
  viewport,
  scroll,
  loader,
  gridOverlay,
  menu,
  header,
  reveal,
  textReveal,
  home,
);

boot({ swup: true });
