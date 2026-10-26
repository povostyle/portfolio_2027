/*
 * Reveal genérico por scroll. CSS: styles/animations/reveal.css
 * Solo añade .is-revealed; la animación es CSS. Sin GSAP → barato y sin destroy pesado.
 */
import { indexChildren } from "../utils/dom.js";

let observer = null;

export default {
  name: "reveal",
  selector: "[data-reveal]",

  init(elements) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );

    elements.forEach((el) => {
      if (el.dataset.reveal === "stagger") indexChildren(el);
      observer.observe(el);
    });
  },

  destroy() {
    observer?.disconnect();
    observer = null;
  },
};
