/*
 * Escribe --vh y --scrollbar-width en :root. Persistente.
 * Usa 100dvh cuando esté disponible; --vh queda como fallback para calc().
 */
import { debounce } from "../utils/dom.js";

function update() {
  const root = document.documentElement;
  root.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  root.style.setProperty(
    "--scrollbar-width",
    `${window.innerWidth - root.clientWidth}px`,
  );
}

export default {
  name: "viewport",
  persistent: true,

  init() {
    update();
    window.addEventListener("resize", debounce(update, 150));
    window.addEventListener("orientationchange", update);
  },
};
