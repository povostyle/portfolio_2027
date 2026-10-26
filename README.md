# Miguel Ángel Poyatos

Carcasa Astro 5 del monorepo `bluecarpet-starters`. Convenciones en [`CLAUDE.md`](./CLAUDE.md).

## Crear un proyecto

Desde el monorepo:

```bash
scripts/crear-proyecto.sh astro <slug> "<Nombre>" <carpeta-destino>
cd <carpeta-destino>/<slug>
npm install
npm run dev        # http://localhost:4321
```

Después: nombre y datos en `src/data/site.ts`, menú en `src/data/nav.ts`, dominio en `astro.config.mjs` (`site`), colores y tipografía en `src/styles/settings/`.

## Despliegue

Salida estática (`dist/`). En Vercel o Netlify: comando `npm run build`, carpeta `dist`.
