"use client";

import { useEffect, useState } from "react";

/**
 * Mode concentration : masque la navigation secondaire (sidebar, fil
 * d'Ariane, précédent/suivant — voir la classe .focus-mode-hide) via une
 * classe sur <html>, sans contexte React ni prop-drilling entre layout et
 * page (voir demande section 6).
 */
export function FocusModeToggle({ enterLabel, exitLabel }: { enterLabel: string; exitLabel: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("focus-mode");
    };
  }, []);

  function toggle() {
    const next = !active;
    setActive(next);
    document.documentElement.classList.toggle("focus-mode", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      className="interactive-lift rounded-full border border-line px-3 py-1.5 font-mono text-[11px] font-medium text-text-dim hover:border-accent/40"
    >
      {active ? exitLabel : enterLabel}
    </button>
  );
}
