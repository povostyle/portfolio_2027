/*
 * Overlay del grid para maquetar. Solo en desarrollo. CSS: styles/utilities/debug.css
 *
 * Se activa si <html data-grid-overlay>. La carcasa decide cuándo ponerlo:
 *   WordPress → inc/setup/dev-tools.php (con WP_DEBUG o BC_GRID_OVERLAY)
 *   Astro     → Base.astro (import.meta.env.DEV)
 *
 * Uso:
 *   Botón flotante abajo a la izquierda, o teclado:
 *   G         → columnas sí / no
 *   Shift + G → filas (ritmo vertical de 8px) sí / no
 *
 * Dibuja .container + .grid con las mismas clases que la página: si el grid cambia
 * (columnas, gap, margen lateral), el overlay cambia con él sin tocar este archivo.
 * El estado se recuerda entre páginas y recargas (localStorage).
 */

const KEY = "bc-grid-overlay";
const MAX_COLS = 12;

let state = { cols: false, rows: false };
let els = {};

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) state = { cols: !!saved.cols, rows: !!saved.rows };
  } catch {
    /* sin almacenamiento: se arranca apagado */
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignorar */
  }
}

function build() {
  // Columnas: fijas a la ventana, mismo marco que la página.
  const cols = document.createElement("div");
  cols.className = "grid-overlay";
  cols.setAttribute("aria-hidden", "true");
  cols.innerHTML = `
    <div class="container grid-overlay__frame">
      <div class="grid grid--tight grid-overlay__grid">
        ${Array.from({ length: MAX_COLS }, (_, i) => `<span class="grid-overlay__col" data-n="${i + 1}"></span>`).join("")}
      </div>
    </div>`;

  // Filas: pegadas al documento (se desplazan con el contenido).
  const rows = document.createElement("div");
  rows.className = "grid-overlay-rows";
  rows.setAttribute("aria-hidden", "true");

  // Botón
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "grid-toggle";
  btn.innerHTML = `
    <span class="grid-toggle__opt" data-opt="cols">Grid</span>
    <span class="grid-toggle__opt" data-opt="rows">Filas</span>
    <span class="grid-toggle__info"></span>`;
  btn.title = "G: columnas · Shift+G: filas";

  document.body.append(cols, rows, btn);
  return { cols, rows, btn, info: btn.querySelector(".grid-toggle__info") };
}

function render() {
  const root = document.documentElement;
  root.classList.toggle("is-grid-cols", state.cols);
  root.classList.toggle("is-grid-rows", state.rows);
  els.btn.querySelectorAll("[data-opt]").forEach((o) => {
    o.classList.toggle("is-on", state[o.dataset.opt]);
  });
  updateInfo();
  if (state.rows) sizeRows();
}

function updateInfo() {
  const grid = els.cols.querySelector(".grid");
  const n = getComputedStyle(grid).getPropertyValue("--grid-cols").trim();
  els.info.textContent = `${n} col · ${window.innerWidth}px`;
}

function sizeRows() {
  els.rows.style.height = `${document.documentElement.scrollHeight}px`;
}

function toggle(which) {
  state[which] = !state[which];
  save();
  render();
}

function onKey(e) {
  const t = e.target;
  if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key.toLowerCase() !== "g") return;
  toggle(e.shiftKey ? "rows" : "cols");
}

function onClick(e) {
  const opt = e.target.closest("[data-opt]");
  toggle(opt ? opt.dataset.opt : "cols");
}

export default {
  name: "grid-overlay",
  selector: "html[data-grid-overlay]",
  persistent: true,

  init() {
    load();
    els = build();
    els.btn.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", () => {
      updateInfo();
      if (state.rows) sizeRows();
    });
    // El alto del documento cambia al navegar con Swup o al cargar imágenes.
    new ResizeObserver(() => state.rows && sizeRows()).observe(document.body);
    render();
  },
};
