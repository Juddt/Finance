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
  index,
}: {
  label: string;
  value: string;
  liveKind?: "studied" | "mastered";
  index: number;
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
    <div className="relative border border-rule bg-paper-raised px-5 py-4">
      <span className="absolute top-0 left-0 h-[3px] w-8 bg-accent" aria-hidden="true" />
      <div className="font-mono text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{display}</div>
      <div className="mt-1 font-mono text-[11px] font-medium tracking-[0.12em] text-ink-muted uppercase">{label}</div>
      <span className="absolute right-4 bottom-3 font-mono text-[10px] text-ink-faint">{String(index).padStart(2, "0")}</span>
    </div>
  );
}
