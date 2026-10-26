/* Helpers de DOM. Funciones puras, sin estado. */
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export function on(el, type, handler, opts) {
  el.addEventListener(type, handler, opts);
  return () => el.removeEventListener(type, handler, opts);
}

export function delegate(root, type, selector, handler) {
  return on(root, type, (e) => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) handler(e, target);
  });
}

export function debounce(fn, wait = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/** Escribe --index en cada hijo para stagger por CSS. */
export function indexChildren(el) {
  [...el.children].forEach((child, i) => child.style.setProperty("--index", i));
}
