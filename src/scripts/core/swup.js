/*
 * Swup: transiciones entre páginas. Solo se carga si boot({ swup: true }).
 * Los hooks enganchan al lifecycle: nada más se suscribe a Swup directamente.
 */
import Swup from "swup";
import SwupHeadPlugin from "@swup/head-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";
import SwupScrollPlugin from "@swup/scroll-plugin";
import SwupA11yPlugin from "@swup/a11y-plugin";
import { getLenis, swapScrollElements } from "./scroll.js";
import { ScrollTrigger } from "../utils/gsap.js";

export let swup = null;

const clean = (path) => path.replace(/\/+$/, "") || "/";

/**
 * Copia lang y los data-* del <html> de la página nueva al documento actual (idea de Locomotive).
 * Swup solo sustituye #swup: sin esto, el <html> conservaría el idioma y los data-* de la primera
 * página (p. ej. al cambiar de idioma con WPML). Solo añade o actualiza: no borra atributos que
 * pongan las librerías (lenis, data-scroll-orientation, data-grid-overlay).
 */
function syncHtmlAttributes(visit) {
  const next = visit?.to?.document?.documentElement;
  if (!next) return;
  const html = document.documentElement;
  if (next.lang && next.lang !== html.lang) html.lang = next.lang;
  for (const { name, value } of next.attributes) {
    if (name.startsWith("data-") && html.getAttribute(name) !== value) html.setAttribute(name, value);
  }
}

/** Marca con aria-current="page" los [data-nav-link] que apuntan a la URL actual. */
function updateCurrentLinks() {
  const here = clean(location.pathname);
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const target = clean(new URL(link.href, location.href).pathname);
    if (target === here) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

export function initSwup({ initPage, destroyPage }) {
  swup = new Swup({
    containers: ["#swup"],
    animationSelector: '[class*="transition-"]',
    linkSelector:
      'a[href]:not([data-no-swup]):not([target="_blank"]):not([download]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([href*="wp-admin"]):not([href*="wp-login"])',
    plugins: [
      new SwupHeadPlugin({ persistAssets: true, awaitAssets: true }),
      new SwupPreloadPlugin({ preloadHoveredLinks: true }),
      new SwupScrollPlugin({
        animateScroll: false,
        doScrollingRightAway: false,
      }),
      new SwupA11yPlugin(),
    ],
  });

  // Salida: cerrar menú, parar scroll suave, destruir módulos de página
  swup.hooks.on("visit:start", () => {
    document.documentElement.classList.remove("is-menu-open");
    getLenis()?.stop();
  });

  swup.hooks.before("content:replace", () => {
    swapScrollElements(document.querySelector("#swup"), "out");
    destroyPage();
  });

  // Entrada: scroll arriba, reiniciar módulos de página
  swup.hooks.on("content:replace", (visit) => {
    syncHtmlAttributes(visit);
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    swapScrollElements(document.querySelector("#swup"), "in");
    initPage();
    ScrollTrigger.refresh();
  });

  swup.hooks.on("visit:end", () => {
    getLenis()?.start();
  });

  // La cabecera y el menú no se sustituyen al navegar: actualizar la página actual a mano.
  swup.hooks.on("page:view", updateCurrentLinks);

  return swup;
}
