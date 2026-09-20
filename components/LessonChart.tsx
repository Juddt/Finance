import type { LessonChart as LessonChartSpec } from "@/lib/lesson-types";

const PALETTE = ["var(--color-accent)", "var(--color-success)", "var(--color-danger)", "var(--color-info)", "var(--color-text-dim)"];
const REF_COLOR = "var(--color-danger)";
const TREND_COLOR = "var(--color-info)";
const POINT_COLOR = "var(--color-accent)";

/**
 * Petit graphique illustratif de cours (courbe, barres ou nuage de points),
 * rendu en SVG pur — pas de librairie externe, cohérent avec PayoffChart.
 */
export function LessonChart({ chart, locale, caption }: { chart: LessonChartSpec; locale: "fr" | "en"; caption?: string }) {
  if (chart.kind === "line") return <LineChart chart={chart} locale={locale} caption={caption} />;
  if (chart.kind === "bar") return <BarChart chart={chart} locale={locale} caption={caption} />;
  return <ScatterChart chart={chart} locale={locale} caption={caption} />;
}

const WIDTH = 520;
const HEIGHT = 260;
const PADDING_LEFT = 48;
const PADDING_BOTTOM = 36;
const PADDING_TOP = 16;
const PADDING_RIGHT = 16;

function LineChart({ chart, locale, caption }: { chart: Extract<LessonChartSpec, { kind: "line" }>; locale: "fr" | "en"; caption?: string }) {
  const allPoints = chart.series.flatMap((s) => s.points);
  const xs = allPoints.map((p) => p.x);
  const ys = allPoints.map((p) => p.y);
  const refXs = (chart.refLines ?? []).map((r) => r.x).filter((x): x is number => x !== undefined);
  const refYs = (chart.refLines ?? []).map((r) => r.y).filter((y): y is number => y !== undefined);
  const xMin = Math.min(...xs, ...refXs);
  const xMax = Math.max(...xs, ...refXs);
  const yMin = Math.min(0, ...ys, ...refYs);
  const yMax = Math.max(...ys, ...refYs);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  const xScale = (x: number) => PADDING_LEFT + ((x - xMin) / xSpan) * (WIDTH - PADDING_LEFT - PADDING_RIGHT);
  const yScale = (y: number) => HEIGHT - PADDING_BOTTOM - ((y - yMin) / ySpan) * (HEIGHT - PADDING_TOP - PADDING_BOTTOM);

  return (
    <ChartFrame caption={caption}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={caption}>
        <AxisLines xScale={xScale} yScale={yScale} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
        {(chart.refLines ?? []).map((refLine, i) => (
          <RefLine key={i} refLine={refLine} xScale={xScale} yScale={yScale} locale={locale} />
        ))}
        {chart.series.map((s, i) => {
          const d = s.points.map((p, j) => `${j === 0 ? "M" : "L"}${xScale(p.x).toFixed(1)},${yScale(p.y).toFixed(1)}`).join(" ");
          return <path key={i} d={d} fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth={2.5} />;
        })}
        <text x={(WIDTH - PADDING_LEFT - PADDING_RIGHT) / 2 + PADDING_LEFT} y={HEIGHT - 4} fontSize={11} fontFamily="var(--font-mono)" textAnchor="middle" fill="currentColor" opacity={0.6}>
          {chart.xLabel[locale]}
        </text>
        <text x={12} y={PADDING_TOP + 8} fontSize={11} fontFamily="var(--font-mono)" textAnchor="start" fill="currentColor" opacity={0.6}>
          {chart.yLabel[locale]}
        </text>
      </svg>
      {chart.series.length > 1 && <Legend items={chart.series.map((s, i) => ({ label: s.label[locale], color: PALETTE[i % PALETTE.length] }))} />}
    </ChartFrame>
  );
}

function BarChart({ chart, locale, caption }: { chart: Extract<LessonChartSpec, { kind: "bar" }>; locale: "fr" | "en"; caption?: string }) {
  const values = chart.bars.map((b) => b.value);
  const yMin = Math.min(0, ...values);
  const yMax = Math.max(0, ...values);
  const ySpan = yMax - yMin || 1;
  const yScale = (y: number) => HEIGHT - PADDING_BOTTOM - ((y - yMin) / ySpan) * (HEIGHT - PADDING_TOP - PADDING_BOTTOM);
  const zeroY = yScale(0);
  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const barSlot = plotWidth / chart.bars.length;
  const barWidth = Math.min(56, barSlot * 0.6);

  return (
    <ChartFrame caption={caption}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={caption}>
        <line x1={PADDING_LEFT} y1={zeroY} x2={WIDTH - PADDING_RIGHT} y2={zeroY} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
        {chart.bars.map((b, i) => {
          const cx = PADDING_LEFT + barSlot * i + barSlot / 2;
          const barY = Math.min(zeroY, yScale(b.value));
          const barHeight = Math.abs(zeroY - yScale(b.value));
          return (
            <g key={i}>
              <rect x={cx - barWidth / 2} y={barY} width={barWidth} height={Math.max(barHeight, 1)} fill={PALETTE[i % PALETTE.length]} rx={6} />
              <text x={cx} y={HEIGHT - PADDING_BOTTOM + 16} fontSize={10} fontFamily="var(--font-mono)" textAnchor="middle" fill="currentColor" opacity={0.7}>
                {b.label[locale]}
              </text>
              <text x={cx} y={b.value >= 0 ? barY - 4 : barY + barHeight + 12} fontSize={10} fontFamily="var(--font-mono)" textAnchor="middle" fill="currentColor" opacity={0.85}>
                {formatNumber(b.value)}
              </text>
            </g>
          );
        })}
        <text x={12} y={PADDING_TOP + 8} fontSize={11} fontFamily="var(--font-mono)" textAnchor="start" fill="currentColor" opacity={0.6}>
          {chart.yLabel[locale]}
        </text>
      </svg>
    </ChartFrame>
  );
}

function ScatterChart({ chart, locale, caption }: { chart: Extract<LessonChartSpec, { kind: "scatter" }>; locale: "fr" | "en"; caption?: string }) {
  const xs = chart.points.map((p) => p.x);
  const ys = chart.points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(0, ...ys);
  const yMax = Math.max(...ys);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;
  const xScale = (x: number) => PADDING_LEFT + ((x - xMin) / xSpan) * (WIDTH - PADDING_LEFT - PADDING_RIGHT);
  const yScale = (y: number) => HEIGHT - PADDING_BOTTOM - ((y - yMin) / ySpan) * (HEIGHT - PADDING_TOP - PADDING_BOTTOM);

  let trendPath: string | null = null;
  if (chart.trendLine && chart.points.length > 1) {
    const n = chart.points.length;
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    const num = chart.points.reduce((acc, p) => acc + (p.x - meanX) * (p.y - meanY), 0);
    const den = chart.points.reduce((acc, p) => acc + (p.x - meanX) ** 2, 0) || 1;
    const slope = num / den;
    const intercept = meanY - slope * meanX;
    const yAtXMin = slope * xMin + intercept;
    const yAtXMax = slope * xMax + intercept;
    trendPath = `M${xScale(xMin).toFixed(1)},${yScale(yAtXMin).toFixed(1)} L${xScale(xMax).toFixed(1)},${yScale(yAtXMax).toFixed(1)}`;
  }

  return (
    <ChartFrame caption={caption}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={caption}>
        <AxisLines xScale={xScale} yScale={yScale} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
        {trendPath && <path d={trendPath} fill="none" stroke={TREND_COLOR} strokeWidth={2} strokeDasharray="5 4" />}
        {chart.points.map((p, i) => (
          <circle key={i} cx={xScale(p.x)} cy={yScale(p.y)} r={4} fill={POINT_COLOR} fillOpacity={0.85} />
        ))}
        <text x={(WIDTH - PADDING_LEFT - PADDING_RIGHT) / 2 + PADDING_LEFT} y={HEIGHT - 4} fontSize={11} fontFamily="var(--font-mono)" textAnchor="middle" fill="currentColor" opacity={0.6}>
          {chart.xLabel[locale]}
        </text>
        <text x={12} y={PADDING_TOP + 8} fontSize={11} fontFamily="var(--font-mono)" textAnchor="start" fill="currentColor" opacity={0.6}>
          {chart.yLabel[locale]}
        </text>
      </svg>
    </ChartFrame>
  );
}

function AxisLines({
  xScale,
  yScale,
  xMin,
  xMax,
  yMin,
  yMax,
}: {
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}) {
  const zeroInRange = yMin <= 0 && yMax >= 0;
  return (
    <>
      <line
        x1={PADDING_LEFT}
        y1={zeroInRange ? yScale(0) : HEIGHT - PADDING_BOTTOM}
        x2={WIDTH - PADDING_RIGHT}
        y2={zeroInRange ? yScale(0) : HEIGHT - PADDING_BOTTOM}
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeWidth={1}
      />
      <line x1={xScale(xMin)} y1={PADDING_TOP} x2={xScale(xMin)} y2={HEIGHT - PADDING_BOTTOM} stroke="currentColor" strokeOpacity={0.25} strokeWidth={1} />
    </>
  );
}

function RefLine({
  refLine,
  xScale,
  yScale,
  locale,
}: {
  refLine: { label: { fr: string; en: string }; x?: number; y?: number };
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  locale: "fr" | "en";
}) {
  if (refLine.x !== undefined) {
    const x = xScale(refLine.x);
    return (
      <>
        <line x1={x} y1={PADDING_TOP} x2={x} y2={HEIGHT - PADDING_BOTTOM} stroke={REF_COLOR} strokeOpacity={0.7} strokeDasharray="4 3" />
        <text x={x} y={PADDING_TOP + 10} fontSize={10} fontFamily="var(--font-mono)" textAnchor="middle" fill={REF_COLOR}>
          {refLine.label[locale]}
        </text>
      </>
    );
  }
  if (refLine.y !== undefined) {
    const y = yScale(refLine.y);
    return (
      <>
        <line x1={PADDING_LEFT} y1={y} x2={WIDTH - PADDING_RIGHT} y2={y} stroke={REF_COLOR} strokeOpacity={0.7} strokeDasharray="4 3" />
        <text x={WIDTH - PADDING_RIGHT} y={y - 4} fontSize={10} fontFamily="var(--font-mono)" textAnchor="end" fill={REF_COLOR}>
          {refLine.label[locale]}
        </text>
      </>
    );
  }
  return null;
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[10px] tracking-wide text-text-dim uppercase">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function ChartFrame({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <figure className="scroll-x-container my-2 rounded-xl border border-line bg-surface p-4 text-text">
      {children}
      {caption && <figcaption className="mt-2 text-center font-mono text-[11px] text-text-faint">{caption}</figcaption>}
    </figure>
  );
}

function formatNumber(n: number): string {
  return Math.abs(n) >= 1000 ? n.toLocaleString("en-US") : n.toString();
}
