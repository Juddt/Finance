/**
 * Petites illustrations financières (base graphique commune : trait fin,
 * currentColor, viewBox 48×48) distinguant chaque module sur les cartes du
 * catalogue — voir demande "visuel financier propre par module".
 */
const ICONS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  fondamentaux: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 20h32M10 20v16M16 20v16M24 20v16M32 20v16M38 20v16M7 40h34" strokeLinecap="round" />
      <path d="M24 6 8 16h32z" strokeLinejoin="round" />
    </svg>
  ),
  "taux-credit": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M6 38h36" strokeLinecap="round" />
      <path d="M6 36c6 0 8-20 14-20s6 14 12 14 8-18 10-18" strokeLinecap="round" />
      <circle cx="20" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="32" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  derives: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M6 38h36M6 8v30" strokeLinecap="round" />
      <path d="M8 32 22 32 36 12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="32" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  "modeles-quantitatifs": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M6 14 24 8l18 6M6 14v20l18 6M6 14l18 6m0 0 18-6m-18 6v20m0-20L24 8m18 6v20l-18 6M24 20 6 14m18 6 18-6" strokeLinejoin="round" />
    </svg>
  ),
  "gestion-portefeuille": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M6 40h36M6 40V8" strokeLinecap="round" />
      <path d="M6 34c8-2 10-20 22-22 6-1 10 2 12 6" strokeLinecap="round" />
      <circle cx="16" cy="28" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="26" cy="18" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="36" cy="14" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  "risques-reglementation": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M24 6 40 12v10c0 12-7 18-16 20-9-2-16-8-16-20V12z" strokeLinejoin="round" />
      <path d="M24 18v10M24 32v.01" strokeLinecap="round" />
    </svg>
  ),
  "machine-learning": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M24 8v8M24 16 12 24M24 16l12 8M12 24v10M36 24v10M12 34l-4 4M12 34l4 4M36 34l-4 4M36 34l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="12" r="3" />
      <circle cx="12" cy="28" r="3" />
      <circle cx="36" cy="28" r="3" />
    </svg>
  ),
  "outils-carriere": ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path
        d="M30 10a8 8 0 0 0-10.9 9.1L8 30.2V38h7.8l11.1-11.1A8 8 0 0 0 36 16l-6 6-4-4 6-6z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const FALLBACK = (props: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={props.className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M6 38h36M10 38V18l14-10 14 10v20" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ModuleIcon({ categoryId, className }: { categoryId: string; className?: string }) {
  const Icon = ICONS[categoryId] ?? FALLBACK;
  return <Icon className={className} />;
}
