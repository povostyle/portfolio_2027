/*
 * Lógica exclusiva de la home. Se activa solo si <main data-page="home">.
 * Si algo de aquí acaba en otra página, es un componente o una animación: moverlo.
 */
import { gsap } from "../utils/gsap.js";

let tl = null;

export default {
  name: "page-home",
  page: "home",

  init() {
    // Ejemplo: entrada del hero tras el loader
    const hero = document.querySelector(".hero");
    if (!hero) return;

    tl = gsap.timeline({ paused: true }).from(hero.querySelectorAll(".hero__title, .hero__lead, .hero__actions"), {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 1,
      ease: "outExpo",
    });

    const html = document.documentElement;
    if (html.classList.contains("is-loaded") || !document.querySelector("[data-loader]")) {
      tl.play();
    } else {
      const obs = new MutationObserver(() => {
        if (html.classList.contains("is-loaded")) {
          tl.play();
          obs.disconnect();
        }
      });
      obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    }
  },

  destroy() {
    tl?.kill();
    tl = null;
  },
};
