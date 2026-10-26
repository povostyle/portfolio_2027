/**
 * Menús (≡ bc_menu_items() en WordPress).
 * `current` se calcula en el componente comparando con la URL actual.
 */
export type NavItem = { title: string; url: string; external?: boolean };

export const primary: NavItem[] = [
  { title: "Inicio", url: "/" },
  { title: "Guía", url: "/guia/" },
];

export const footer: NavItem[] = [{ title: "Privacidad", url: "/privacidad/" }];
