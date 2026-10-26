// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Dominio final del proyecto: lo usan canonical, sitemap y og:url.
  site: "https://miguelangelpoyatos.com",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
  // Sin prefetch de Astro: el precargado lo hace Swup (src/scripts/core/swup.js).
  prefetch: false,
  // La barra de Astro tapa la parte inferior y choca con el botón del grid.
  devToolbar: { enabled: false },
  // Fuentes: Astro las descarga al compilar, las sirve desde el propio dominio y precarga.
  // cssVariable sustituye al token de settings/typography.css. Se pintan en Base.astro con <Font>.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Google Sans Flex",
      cssVariable: "--font-sans",
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Google Sans Code",
      cssVariable: "--font-mono",
      weights: ["400", "500"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
});
