/*
 * Base para componentes como custom elements (<bc-accordion>, <bc-tabs>…).
 *
 * El navegador llama a mount() cuando el elemento entra en la página y a unmount()
 * cuando sale (también al navegar con Swup). Todo lo que se registre con estos
 * helpers se limpia solo al salir:
 *
 *   this.on(target, "click", fn)   → escucha que se quita sola
 *   this.cleanup(fn)               → cualquier otra limpieza
 *   this.motion(() => { … })       → tweens y ScrollTriggers de GSAP creados dentro se revierten solos
 *   this.$(sel) / this.$$(sel)     → querySelector / querySelectorAll (array) dentro del componente
 *
 * Uso:
 *   import { BcElement, define } from "../core/element.js";
 *   class BcTabs extends BcElement { mount() { … } }
 *   define("bc-tabs", BcTabs);
 *
 * Cuándo usar custom element y cuándo un módulo del registro (lifecycle.js): ver CLAUDE.md.
 */
import { gsap } from "../utils/gsap.js";

export class BcElement extends HTMLElement {
  connectedCallback() {
    this._cleanups = [];
    this._ctx = gsap.context(() => {}, this);
    try {
      this.mount?.();
    } catch (err) {
      console.error(`[${this.localName}] error en mount`, err);
    }
  }

  disconnectedCallback() {
    try {
      this.unmount?.();
    } catch (err) {
      console.error(`[${this.localName}] error en unmount`, err);
    }
    this._ctx?.revert();
    this._cleanups?.forEach((fn) => fn());
    this._cleanups = [];
  }

  on(target, type, fn, options) {
    target.addEventListener(type, fn, options);
    this._cleanups.push(() => target.removeEventListener(type, fn, options));
  }

  cleanup(fn) {
    this._cleanups.push(fn);
  }

  motion(fn) {
    return this._ctx.add(fn);
  }

  $(selector) {
    return this.querySelector(selector);
  }

  $$(selector) {
    return [...this.querySelectorAll(selector)];
  }

  /** Lee un token CSS (--dur-base, --ease-out…) tal como se aplica a este elemento. */
  token(name, fallback = "") {
    return getComputedStyle(this).getPropertyValue(name).trim() || fallback;
  }
}

/** Registra el elemento una sola vez (evita el error de doble registro con HMR). */
export function define(name, ElementClass) {
  if (!customElements.get(name)) customElements.define(name, ElementClass);
}
