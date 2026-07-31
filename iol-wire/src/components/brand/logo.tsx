import { cn } from "@/lib/utils";

/**
 * Vector recreation of the IOL Wire lockup: heavy IOL letterforms with the
 * signature red slash on the I, and spaced red WIRE wordmark beneath.
 */
export function IolMark({
  className,
  withWire = true,
  mono = false,
}: {
  className?: string;
  withWire?: boolean;
  mono?: boolean;
}) {
  const red = mono ? "currentColor" : "#E1131D";
  const white = mono ? "currentColor" : "#FFFFFF";
  return (
    <svg
      viewBox="0 0 400 360"
      className={cn("block", className)}
      role="img"
      aria-label="IOL Wire"
    >
      {/* I — red wedge + diagonally-cut white stem */}
      <polygon points="52,64 108,64 52,168" fill={red} />
      <polygon points="108,80 108,252 52,252 52,184" fill={white} />
      {/* O — tall stadium ring */}
      <rect
        x="152"
        y="86"
        width="92"
        height="144"
        rx="46"
        fill="none"
        stroke={white}
        strokeWidth="44"
      />
      {/* L */}
      <polygon
        points="292,64 340,64 340,208 396,208 396,252 292,252"
        fill={white}
      />
      {withWire && (
        <text
          x="200"
          y="330"
          textAnchor="middle"
          fill={red}
          style={{
            font: "600 54px var(--font-poppins), Poppins, sans-serif",
            letterSpacing: "0.42em",
          }}
        >
          WIRE
        </text>
      )}
    </svg>
  );
}
