import type { Metadata } from "next";

// Route racine "/" uniquement : sert de filet pour le build GitHub Pages
// (export statique, sans proxy.ts — voir app/page.tsx). Dans le build normal,
// proxy.ts redirige "/" vers "/fr" avant même d'atteindre cette page.
export const metadata: Metadata = {
  title: "Finance Academy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      {/* Couleur de repli tant que globals.css (chargé par app/[locale]/layout.tsx) n'est pas
          encore appliqué ; var(--bg) reprend ensuite le token réel dès que la feuille de
          style est chargée — sans ça ce fond resterait figé sur la valeur de repli (voir
          attributs fusionnés par le parseur HTML quand app/[locale]/layout.tsx redéclare
          aussi <html>/<body>). */}
      <body style={{ background: "var(--bg, #0b0d10)" }}>{children}</body>
    </html>
  );
}
