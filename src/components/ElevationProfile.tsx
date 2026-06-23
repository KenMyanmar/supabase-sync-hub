type Point = { d: number; e: number };

interface Props {
  points: readonly Point[];
}

const W = 600;
const H = 220;
const PAD_L = 38;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 26;

export function ElevationProfile({ points }: Props) {
  if (points.length < 2) return null;

  const ds = points.map((p) => p.d);
  const es = points.map((p) => p.e);
  const dMin = Math.min(...ds);
  const dMax = Math.max(...ds);
  const eMinRaw = Math.min(...es);
  const eMaxRaw = Math.max(...es);
  const ePad = Math.max(5, Math.round((eMaxRaw - eMinRaw) * 0.1));
  const eMin = Math.floor((eMinRaw - ePad) / 10) * 10;
  const eMax = Math.ceil((eMaxRaw + ePad) / 10) * 10;

  const x = (d: number) => PAD_L + ((d - dMin) / (dMax - dMin)) * (W - PAD_L - PAD_R);
  const y = (e: number) => PAD_T + (1 - (e - eMin) / (eMax - eMin)) * (H - PAD_T - PAD_B);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.d).toFixed(1)} ${y(p.e).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${x(dMax).toFixed(1)} ${(H - PAD_B).toFixed(1)} L ${x(dMin).toFixed(1)} ${(H - PAD_B).toFixed(1)} Z`;

  const yTicks = 4;
  const yLines = Array.from({ length: yTicks + 1 }, (_, i) => eMin + ((eMax - eMin) * i) / yTicks);

  const summit = points.reduce((acc, p) => (p.e > acc.e ? p : acc), points[0]);
  const start = points[0];

  return (
    <figure
      className="rounded-lg border border-border bg-card p-4"
      aria-label="Elevation profile"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="block h-auto w-full text-primary"
        role="img"
      >
        {/* grid */}
        {yLines.map((v) => (
          <g key={v}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y(v)}
              y2={y(v)}
              className="stroke-border"
              strokeWidth={1}
            />
            <text
              x={PAD_L - 6}
              y={y(v)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {Math.round(v)} m
            </text>
          </g>
        ))}

        {/* area + line */}
        <path d={areaPath} className="fill-primary/10" />
        <path
          d={linePath}
          fill="none"
          className="stroke-primary"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* x ticks: start / mid / end */}
        {[dMin, (dMin + dMax) / 2, dMax].map((d) => (
          <text
            key={d}
            x={x(d)}
            y={H - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {d.toFixed(d === Math.round(d) ? 0 : 2)} km
          </text>
        ))}

        {/* start marker */}
        <circle cx={x(start.d)} cy={y(start.e)} r={4} className="fill-muted-foreground" />
        <text
          x={x(start.d) + 6}
          y={y(start.e) - 6}
          className="fill-muted-foreground text-[10px]"
        >
          Start
        </text>

        {/* summit marker */}
        <circle cx={x(summit.d)} cy={y(summit.e)} r={4} className="fill-primary" />
        <text
          x={x(summit.d) - 6}
          y={y(summit.e) - 6}
          textAnchor="end"
          className="fill-primary text-[10px] font-medium"
        >
          Summit {Math.round(summit.e)} m
        </text>
      </svg>
    </figure>
  );
}
