import katex from "katex";

/** Rendu serveur de KaTeX (pas d'image décorative, pas de calcul côté client requis pour l'affichage). */
export function renderKatex(latex: string, displayMode = true): string {
  return katex.renderToString(latex, { throwOnError: false, displayMode, output: "html" });
}
