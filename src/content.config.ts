import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const casos = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/casos" }),
  schema: ({ image }) =>
    z.object({
      cliente: z.string(),
      sector: z.string(),
      anio: z.number(),
      orden: z.number(),
      papel: z.string(), // «Diseño y desarrollo», «Para la agencia Terceto», «Solo desarrollo»…
      problema: z.string(), // una frase
      imagen: image(),
      imagenAlt: z.string(),
      url: z.string().optional(),
    }),
});

export const collections = { casos };
