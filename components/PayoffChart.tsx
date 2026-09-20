import type { ChartSpec } from "@/lib/question-types";

/**
 * Petit graphique de profit net à l'échéance, généré en SVG à partir des
 * paramètres de la question (pas une image décorative — voir doc section 3).
 */
export function PayoffChart({ chart, label }: { chart: ChartSpec; label: string }) {
  if (chart.type === "payoff_call" || chart.type === "payoff_put") {
    return <OptionPayoffChart chart={chart} label={label} isCall={chart.type === "payoff_call"} />;
  }
  return null;
}

function OptionPayoffChart({ chart, label, isCall }: { chart: ChartSpec; label: string; isCall: boolean }) {
  const strike = chart.params.strike;
  const premium = chart.params.premium;
  const width = 480;
  const height = 220;
  const padding = 36;

  const sMin = Math.max(0, strike - premium * 6);
  const sMax = strike + premium * 6;
  const breakEven = isCall ? strike + premium : strike - premium;

  const maxProfit = isCall ? sMax - strike - premium : strike - premium;
  const minProfit = -premium;
  const profitRange = Math.max(Math.abs(maxProfit), Math.abs(minProfit), 1) * 1.15;

  const xScale = (s: number) => padding + ((s - sMin) / (sMax - sMin)) * (width - 2 * padding);
  const yScale = (p: number) => height / 2 - (p / profitRange) * (height / 2 - padding / 2);

  const points: [number, number][] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const s = sMin + (i / steps) * (sMax - sMin);
    const payoff = isCall ? Math.max(s - strike, 0) : Math.max(strike - s, 0);
    const profit = payoff - premium;
    points.push([xScale(s), yScale(profit)]);
  }
  const pathD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const zeroY = yScale(0);
  const strikeX = xScale(strike);
  const breakEvenX = xScale(breakEven);

  return (
    <figure className="my-4 rounded-2xl bg-paper-sunken p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={label}>
        <line x1={padding} y1={zeroY} x2={width - padding} y2={zeroY} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
        <line x1={strikeX} y1={padding / 2} x2={strikeX} y2={height - padding / 2} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="4 3" />
        <line
          x1={breakEvenX}
          y1={padding / 2}
          x2={breakEvenX}
          y2={height - padding / 2}
          stroke="var(--color-gain)"
          strokeOpacity={0.6}
          strokeDasharray="4 3"
        />
        <path d={pathD} fill="none" stroke="var(--color-ink)" strokeWidth={2.5} />
        <text x={strikeX} y={height - 6} fontSize={11} fontFamily="var(--font-mono)" textAnchor="middle" fill="currentColor" opacity={0.6}>
          K
        </text>
        <text x={breakEvenX} y={14} fontSize={11} fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-gain)">
          K+p
        </text>
      </svg>
      <figcaption className="mt-2 text-center font-mono text-[11px] text-ink-faint">{label}</figcaption>
    </figure>
  );
}
