import { useId } from "react";

/**
 * The church's cross, redrawn as a vector so it can take any colour and be
 * animated. `color` is the cross; `inner` is the thin line drawn inside it
 * (use the background colour of wherever the mark sits).
 */
const OUTLINE =
  "270,0 360,0 398,40 345,82 345,195 470,195 512,152 595,235 512,318 470,270 345,270 345,700 282,700 282,270 158,270 115,318 30,235 115,152 158,195 282,195 282,82 232,40";

function Rays() {
  return (
    <g strokeLinecap="round" strokeWidth="9">
      <line x1="262" y1="186" x2="150" y2="124" />
      <line x1="266" y1="184" x2="178" y2="94" />
      <line x1="270" y1="182" x2="206" y2="72" />
    </g>
  );
}

export function CrossMark({
  className = "",
  color = "currentColor",
  inner = "#ffffff",
  animated = false,
}: {
  className?: string;
  color?: string;
  inner?: string;
  animated?: boolean;
}) {
  const clipId = useId();
  return (
    <svg
      viewBox="0 0 625 640"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <polygon points={OUTLINE} />
        </clipPath>
      </defs>
      <polygon points={OUTLINE} fill={color} />
      <g clipPath={`url(#${clipId})`}>
        <polygon points={OUTLINE} fill="none" stroke={inner} strokeWidth="20" strokeLinejoin="miter" />
        <polygon points={OUTLINE} fill="none" stroke={color} strokeWidth="7" strokeLinejoin="miter" />
      </g>
      <g stroke={color} className={animated ? "cross-rays" : undefined}>
        <Rays />
        <g transform="translate(625 0) scale(-1 1)">
          <Rays />
        </g>
        <g transform="translate(0 470) scale(1 -1)">
          <Rays />
        </g>
        <g transform="translate(625 470) scale(-1 -1)">
          <Rays />
        </g>
      </g>
    </svg>
  );
}
