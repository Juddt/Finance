import type { NextConfig } from "next";

/**
 * Build normal (npm run dev / npm run build) : app dynamique complète
 * (routes API, cookies, proxy) — cible Vercel/Node.
 *
 * Build GitHub Pages (npm run build:pages, GITHUB_PAGES=true) : export
 * statique. GitHub Pages ne sait servir que du HTML/CSS/JS, donc les routes
 * API, cookies() et proxy.ts sont retirés pendant ce build (voir
 * scripts/build-static.mjs) et le quiz tourne entièrement côté client (voir
 * README, section "Déploiement GitHub Pages" — limitation assumée : les
 * solutions sont alors présentes dans le bundle navigateur).
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Finance";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export",
        basePath,
        images: { unoptimized: true },
        // /fr -> /fr/index.html : compatible avec tout hébergeur statique
        // (GitHub Pages y compris) sans réécriture d'URL particulière.
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isGithubPages ? "1" : "0",
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? basePath : "",
  },
};

export default nextConfig;
