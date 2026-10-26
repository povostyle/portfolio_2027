/*
 * Header: oculta al bajar, muestra al subir, .is-scrolled pasado el hero.
 * CSS: styles/layout/header.css   Hook: [data-header]
 */
import { ScrollTrigger } from "../utils/gsap.js";

let trigger = null;

export default {
  name: "header",
  selector: "[data-header]",
  persistent: true,

  init([header]) {
    trigger = ScrollTrigger.create({
      start: "top -80",
      end: "max",
      onUpdate: (self) => {
        header.classList.toggle("is-scrolled", self.scroll() > 80);
        header.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 200);
      },
    });
  },
};
