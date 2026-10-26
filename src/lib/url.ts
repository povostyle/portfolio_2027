/** Helpers de servidor (≡ inc/helpers en WordPress). */

/** ¿La URL del menú corresponde a la página actual? Ignora la barra final. */
export function isCurrent(itemUrl: string, pathname: string): boolean {
  const clean = (s: string) => s.replace(/\/+$/, "") || "/";
  return clean(itemUrl) === clean(pathname);
}

/** Clases condicionales (≡ bc_classes). cls("a", { b: true, c: false }) → "a b" */
export function cls(...parts: Array<string | false | null | undefined | Record<string, boolean>>): string {
  return parts
    .flatMap((p) => (p && typeof p === "object" ? Object.entries(p).filter(([, v]) => v).map(([k]) => k) : [p]))
    .filter(Boolean)
    .join(" ");
}
