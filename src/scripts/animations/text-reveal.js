/*
 * Reveal de texto por líneas con SplitText + ScrollTrigger.
 * CSS: styles/animations/text-reveal.css   Uso: <h2 data-text-reveal>
 */
import { gsap, ScrollTrigger, SplitText } from "../utils/gsap.js";
import { prefersReducedMotion } from "../utils/media.js";

const instances = [];

export default {
  name: "text-reveal",
  selector: "[data-text-reveal]",

  init(elements) {
    if (prefersReducedMotion()) return;

    elements.forEach((el) => {
      const split = new SplitText(el, {
        type: "lines",
        linesClass: "text-reveal__line",
        autoSplit: true,
        mask: "lines",
      });

      const tween = gsap.from(split.lines, {
        yPercent: 110,
        duration: 1,
        stagger: 0.08,
        ease: "outExpo",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      instances.push({ split, tween });
    });
  },

  destroy() {
    instances.forEach(({ split, tween }) => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    });
    instances.length = 0;
  },
};
