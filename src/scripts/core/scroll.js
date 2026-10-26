/*
 * Scroll: Locomotive Scroll 5 (Lenis + detección en pantalla + parallax + progreso).
 * Persistente. Un solo bucle: Locomotive se mueve con gsap.ticker y avisa a ScrollTrigger.
 *
 * Atributos en el HTML (todos necesitan data-scroll):
 *   data-scroll-speed="0.2"              parallax (desactivado en táctil y con «reducir movimiento»)
 *   data-scroll-css-progress             escribe --progress (0 → 1) en el elemento: animar solo con CSS
 *   data-scroll-event-progress="nombre"  el progreso como evento en window: detail.progress
 *   data-scroll-call="nombre"            evento en window al entrar y salir: detail.way = "enter" | "leave"
 *   data-scroll-repeat                   vuelve a disparar cada vez que entra (por defecto, una vez)
 *   data-scroll-offset="10%,0"           adelanta o retrasa el punto de entrada y de salida
 *   data-scroll-position="start,end"     qué bordes cuentan: start | middle | end | fold
 *   data-scroll-class="is-inview"        clase al estar en pantalla (por defecto is-inview)
 *   data-scroll-to href="#id"            enlace que hace scroll suave a un ancla
 *
 * Desde JS: getScroll() → instancia de Locomotive · getLenis() → su Lenis.
 * En un custom element: this.on(window, "nombre", (e) => …) para escuchar call/progress.
 */
import LocomotiveScroll from "locomotive-scroll";
import { gsap, ScrollTrigger } from "../utils/gsap.js";
import { prefersReducedMotion } from "../utils/media.js";

let scroll = null;

export const getScroll = () => scroll;
export const getLenis = () => scroll?.lenisInstance ?? null;

/** Con «reducir movimiento» se quita el parallax antes de que Locomotive lo lea. */
export function stripMotion(root = document) {
  if (!prefersReducedMotion()) return;
  root.querySelectorAll("[data-scroll-speed]").forEach((el) => el.removeAttribute("data-scroll-speed"));
}

/** Para Swup: soltar los elementos de la página que sale y leer los de la que entra. */
export function swapScrollElements(container, phase) {
  if (!scroll) return;
  if (phase === "out") {
    scroll.removeScrollElements(container);
  } else {
    stripMotion(container);
    scroll.addScrollElements(container);
  }
}

export default {
  name: "scroll",
  persistent: true,

  init() {
    const reduced = prefersReducedMotion();
    stripMotion();

    scroll = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.1,
        smoothWheel: !reduced,
      },
      // Un solo bucle de animación para todo: Locomotive, Lenis y GSAP
      initCustomTicker: (render) => gsap.ticker.add(render),
      destroyCustomTicker: (render) => gsap.ticker.remove(render),
    });

    scroll.lenisInstance?.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    // Anclas internas con scroll suave (las que no usan data-scroll-to)
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]:not([href="#"]):not([data-scroll-to])');
      if (!link) return;
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      scroll.scrollTo(target, { offset: -80 });
    });
  },
};
