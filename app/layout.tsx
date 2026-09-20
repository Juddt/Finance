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
      <body style={{ background: "#f2ede0" }}>{children}</body>
    </html>
  );
}
