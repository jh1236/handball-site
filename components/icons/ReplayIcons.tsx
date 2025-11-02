interface ReplayIconsParams {
  replays: number;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export function ReplayIcons({
  replays,
  width = 24,
  height = 24,
  color = 'white',
}: ReplayIconsParams) {
  const R = 8;
  const center = 12;
  const arcAngle = (2 * Math.PI) / replays;
  const arrowLength = 3;
  const arrowSpread = Math.PI / 3.6;
  if (replays === 0) {
    return <></>;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {Array.from({ length: replays }).map((_, i) => {
        const startAngle = i * arcAngle + 0.2;
        const endAngle = (i + 1) * arcAngle - 0.3;

        const xStart = center + Math.cos(startAngle) * R;
        const yStart = center + Math.sin(startAngle) * R;
        const xEnd = center + Math.cos(endAngle) * R;
        const yEnd = center + Math.sin(endAngle) * R;

        const tangent = endAngle + Math.PI / 2 - 0.16;

        const arrowTipX = xEnd;
        const arrowTipY = yEnd;
        const leftX = arrowTipX - Math.cos(tangent - arrowSpread) * arrowLength;
        const leftY = arrowTipY - Math.sin(tangent - arrowSpread) * arrowLength;
        const rightX = arrowTipX - Math.cos(tangent + arrowSpread) * arrowLength;
        const rightY = arrowTipY - Math.sin(tangent + arrowSpread) * arrowLength;

        return (
          <g key={i}>
            <path d={`M${xStart} ${yStart} A${R} ${R} 0 ${+(replays === 1)} 1 ${xEnd} ${yEnd}`} />
            <path d={`M${leftX} ${leftY} L${arrowTipX} ${arrowTipY} L${rightX} ${rightY}`} />
          </g>
        );
      })}
    </svg>
  );
}
