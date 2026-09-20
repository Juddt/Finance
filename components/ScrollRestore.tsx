"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_PREFIX = "scroll:";

/**
 * Restitue la position de défilement au retour sur une page déjà visitée
 * (bouton retour du navigateur ou lien "Retour au catalogue") — voir demande
 * section 3. Monté une seule fois dans le layout (jamais démonté d'une
 * navigation à l'autre) et piloté par usePathname() plutôt que par un effet
 * "au montage" : App Router peut réutiliser un arbre de page en cache sur un
 * retour arrière, auquel cas un effet local à cette page ne se redéclenche
 * pas, alors que usePathname() se met à jour de façon fiable à chaque
 * changement d'URL.
 */
export function ScrollRestore() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  // Écoute globale, attachée une seule fois : enregistre le scroll courant
  // sous la clé du chemin actif au moment de l'événement.
  useEffect(() => {
    let frame = 0;
    function handleScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        sessionStorage.setItem(STORAGE_PREFIX + pathnameRef.current, String(window.scrollY));
        frame = 0;
      });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Restauration : se redéclenche à chaque changement de chemin, y compris
  // un retour vers une page déjà en cache côté routeur.
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_PREFIX + pathname);
    const y = saved ? Number(saved) : 0;
    if (!Number.isFinite(y) || y <= 0) return;

    let cancelled = false;
    let rafId = 0;
    const start = performance.now();
    const reassert = () => {
      if (cancelled) return;
      window.scrollTo(0, y);
      if (performance.now() - start < 700) {
        rafId = requestAnimationFrame(reassert);
      }
    };
    rafId = requestAnimationFrame(reassert);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}
