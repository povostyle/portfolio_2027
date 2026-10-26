/* Media queries y capacidades. Espejo de styles/settings/breakpoints.css */
const BP = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

export const matchBp = (bp) => window.matchMedia(`(min-width: ${BP[bp]}px)`).matches;
export const isMobile = () => !matchBp("md");
export const isDesktop = () => matchBp("lg");
export const isTouch = () => window.matchMedia("(hover: none) and (pointer: coarse)").matches;
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
