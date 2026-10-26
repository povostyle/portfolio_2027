/*
 * Punto único de registro de GSAP. Importar gsap/ScrollTrigger SIEMPRE desde aquí,
 * nunca desde "gsap" directamente, para no registrar plugins dos veces.
 * Los eases custom son el espejo de styles/settings/motion.css.
 */
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);

CustomEase.create("out", "0.625, 0.05, 0, 1");
CustomEase.create("outExpo", "0.16, 1, 0.3, 1");
CustomEase.create("inOutExpo", "0.87, 0, 0.13, 1");

gsap.defaults({ ease: "out", duration: 0.8 });

export { gsap, ScrollTrigger, CustomEase, SplitText };
