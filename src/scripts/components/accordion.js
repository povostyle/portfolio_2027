/*
 * <bc-accordion> — acordeón sobre <details> nativo. CSS: styles/components/accordion.css
 * Vista: components/blocks/accordion.php · components/blocks/Accordion.astro
 *
 *   <bc-accordion class="accordion" single>
 *     <details class="accordion__item" name="grupo">
 *       <summary class="accordion__trigger">Pregunta …</summary>
 *       <div class="accordion__content">Respuesta</div>
 *     </details>
 *   </bc-accordion>
 *
 * Sin JS funciona igual (abre y cierra, y con name="…" solo uno abierto), sin animación.
 * Con JS anima la altura con las duraciones y curvas de settings/motion.css.
 * Atributo single: solo un panel abierto a la vez.
 * Eventos: "accordion:open" y "accordion:close" (detail.item = el <details>).
 */
import { BcElement, define } from "../core/element.js";

const toMs = (value) => (value.endsWith("ms") ? parseFloat(value) : parseFloat(value) * 1000);

class BcAccordion extends BcElement {
  mount() {
    this.single = this.hasAttribute("single");
    this.items = this.$$(":scope > details");
    this.animations = new Map();

    // Con JS la exclusividad la gestionamos nosotros para poder animar el cierre.
    // El name nativo cerraría los otros paneles de golpe.
    this.items.forEach((item) => {
      if (item.name) {
        item.dataset.name = item.name;
        item.removeAttribute("name");
      }
      item.classList.toggle("is-open", item.open);
      this.on(item.querySelector(":scope > summary"), "click", (event) => {
        event.preventDefault();
        item.classList.contains("is-open") ? this.close(item) : this.open(item);
      });
    });

    this.cleanup(() => {
      this.animations.forEach((animation) => animation.cancel());
      this.items.forEach((item) => {
        if (item.dataset.name) item.name = item.dataset.name;
      });
    });
  }

  open(item) {
    if (this.single) {
      this.items.filter((other) => other !== item && other.classList.contains("is-open")).forEach((other) => this.close(other));
    }
    const from = item.getBoundingClientRect().height;
    this.animations.get(item)?.cancel();
    item.open = true;
    item.classList.add("is-open");
    const to = item.offsetHeight;
    this.animate(item, from, to);
    this.emit("accordion:open", item);
  }

  close(item) {
    const from = item.getBoundingClientRect().height;
    this.animations.get(item)?.cancel();
    item.classList.remove("is-open");
    const to = item.querySelector(":scope > summary").offsetHeight;
    this.animate(item, from, to, () => {
      item.open = false;
    });
    this.emit("accordion:close", item);
  }

  animate(item, from, to, onFinish) {
    item.style.overflow = "hidden";
    const animation = item.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: toMs(this.token("--dur-base", "0.4s")), easing: this.token("--ease-out", "ease") },
    );
    this.animations.set(item, animation);

    const reset = () => {
      item.style.overflow = "";
      this.animations.delete(item);
    };
    animation.onfinish = () => {
      onFinish?.();
      reset();
    };
    animation.oncancel = reset;
  }

  emit(type, item) {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, detail: { item } }));
  }
}

define("bc-accordion", BcAccordion);
