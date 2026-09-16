"use client";

import { useEffect, useState } from "react";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/**
 * Affiche la valeur calculée côté serveur, puis — uniquement pour le build
 * GitHub Pages, où il n'y a pas de serveur pour tenir la progression — la
 * remplace après montage par la valeur lue en localStorage. Le moteur local
 * (lib/quiz-engine-client.ts, qui embarque aussi les solutions des
 * questions) n'est chargé que via import() dynamique et seulement si
 * isStaticExport est vrai : dans le build normal, ce code n'est jamais
 * exécuté ni téléchargé (voir README, "Déploiement GitHub Pages").
 */
export function LiveStatTile({
  label,
  value,
  liveKind,
}: {
  label: string;
  value: string;
  liveKind?: "studied" | "mastered";
}) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isStaticExport || !liveKind) return;
    import("@/lib/quiz-engine-client").then(({ getLocalGlobalStats }) => {
      const stats = getLocalGlobalStats();
      setDisplay(String(liveKind === "studied" ? stats.studiedConcepts : stats.masteredConcepts));
    });
  }, [liveKind]);

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
      <div className="text-2xl font-semibold tabular-nums">{display}</div>
      <div className="text-sm text-neutral-600 dark:text-neutral-300">{label}</div>
    </div>
  );
}
