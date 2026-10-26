/*
 * Registro y ciclo de vida de módulos. NO TOCAR sin justificar.
 *
 * Contrato de módulo:
 *   {
 *     name: "accordion",            // único
 *     selector: "[data-accordion]", // opcional. Si no hay match en el DOM, no se llama a init()
 *     persistent: false,            // true → init una vez, nunca destroy (menú, scroll, viewport)
 *     init(elements, ctx) {},       // elements: NodeList del selector (o [] si no hay selector)
 *     destroy() {},                 // obligatorio si persistent=false. Mata ST, timelines, listeners.
 *   }
 *
 * Flujo:
 *   boot()          → initOnce() + initPage()
 *   navegación Swup → destroyPage() antes de salir, initPage() al entrar
 */
import { qsa } from "../utils/dom.js";

const modules = [];
const active = new Set();
let booted = false;

export function register(...mods) {
  for (const mod of mods) {
    if (!mod || !mod.name) {
      console.warn("[lifecycle] módulo sin name ignorado", mod);
      continue;
    }
    if (modules.some((m) => m.name === mod.name)) {
      console.warn(`[lifecycle] módulo duplicado: ${mod.name}`);
      continue;
    }
    modules.push(mod);
  }
}

function run(mod, ctx) {
  const elements = mod.selector ? qsa(mod.selector) : [];
  if (mod.selector && elements.length === 0) return;

  try {
    mod.init?.(elements, ctx);
    active.add(mod);
  } catch (err) {
    console.error(`[lifecycle] error en init de "${mod.name}"`, err);
  }
}

export function initOnce(ctx = {}) {
  modules.filter((m) => m.persistent).forEach((m) => run(m, ctx));
}

export function initPage(ctx = {}) {
  const page = document.querySelector("[data-page]")?.dataset.page ?? null;
  const context = { page, ...ctx };

  modules
    .filter((m) => !m.persistent)
    .filter((m) => !m.page || m.page === page)
    .forEach((m) => run(m, context));

  document.dispatchEvent(new CustomEvent("page:init", { detail: context }));
}

export function destroyPage() {
  document.dispatchEvent(new CustomEvent("page:destroy"));

  [...active]
    .filter((m) => !m.persistent)
    .reverse()
    .forEach((m) => {
      try {
        m.destroy?.();
      } catch (err) {
        console.error(`[lifecycle] error en destroy de "${m.name}"`, err);
      }
      active.delete(m);
    });
}

/** Re-inicializa módulos de página tras inyectar HTML por AJAX (filtros, paginación). */
export function refresh(root = document) {
  destroyPage();
  initPage({ root });
}

export async function boot({ swup = false } = {}) {
  if (booted) return;
  booted = true;

  const start = async () => {
    initOnce();
    initPage();
    document.documentElement.classList.add("is-ready");

    if (swup) {
      const { initSwup } = await import("./swup.js");
      initSwup({ initPage, destroyPage });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
