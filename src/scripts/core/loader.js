/*
 * Preloader de primera carga. Persistente (solo actúa una vez).
 * Markup: <div class="loader" data-loader> en header.php. Sin markup, no hace nada.
 * Pone html.is-loaded al terminar: las animaciones de entrada de la home dependen de ella.
 */
import { gsap } from "../utils/gsap.js";

export default {
  name: "loader",
  selector: "[data-loader]",
  persistent: true,

  init([el]) {
    const html = document.documentElement;
    const done = () => {
      html.classList.add("is-loaded");
      el.remove();
    };

    gsap
      .timeline({ onComplete: done, delay: 0.2 })
      .to(el, { yPercent: -100, duration: 0.8, ease: "expo.inOut" });
  },
};
