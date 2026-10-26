/*
 * Menú móvil. CSS: styles/components/menu.css
 * Hooks: [data-menu-toggle], [data-menu] con [data-menu-list]
 */
import { qs, on, indexChildren } from "../utils/dom.js";

export default {
  name: "menu",
  selector: "[data-menu-toggle]",
  persistent: true,

  init([toggle]) {
    const html = document.documentElement;
    const list = qs("[data-menu-list]");
    if (list) indexChildren(list);

    const set = (open) => {
      html.classList.toggle("is-menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    on(toggle, "click", () => set(!html.classList.contains("is-menu-open")));
    on(document, "keydown", (e) => e.key === "Escape" && set(false));
    document.addEventListener("page:init", () => set(false));
  },
};
