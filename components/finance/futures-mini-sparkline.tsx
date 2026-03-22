type FuturesMiniSparklineProps = {
  values: number[];
  positive: boolean;
  gradientId: string;
};

export function FuturesMiniSparkline({ values, positive, gradientId }: FuturesMiniSparklineProps) {
  const stroke = positive ? "#22c55e" : "#ef4444";
  const fillId = `spark-fill-${gradientId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const w = 200;
  const h = 48;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const pts = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * w;
    const y = h - pad - ((value - min) / range) * (h - pad * 2);
    return { x, y };
  });

  const linePath = pts.reduce((accumulator, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${accumulator} L ${point.x} ${point.y}`;
  }, "");
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-12 w-full text-inherit"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${fillId})`} />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}
