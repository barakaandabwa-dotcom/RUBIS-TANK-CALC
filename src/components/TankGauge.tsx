import React from "react";

export type TankGaugeProps = {
  percent: number;
  heightMm?: number;
  capacityL?: number;
};

/**
 * TankGauge
 * Visual gauge symbolizing a tank filled with green liquid based on percentage.
 * Uses design tokens: primary (green), background, border.
 */
export function TankGauge({ percent, heightMm, capacityL }: TankGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));

  return (
    <div className="w-full">
      <div
        role="img"
        aria-label={`Tank fill ${clamped}%${
          typeof heightMm === "number" ? `, height ${heightMm.toFixed(2)} millimeters` : ""
        }${typeof capacityL === "number" ? `, capacity ${capacityL.toFixed(2)} liters` : ""}`}
        className="relative mx-auto h-40 md:h-56 w-full max-w-3xl"
      >
        {/* Tank body */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-border bg-background/70 shadow-inner">
          {/* Liquid */}
          <div
            className="absolute bottom-0 left-0 w-full transition-[height] duration-300 ease-out bg-gradient-to-t from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)]"
            style={{ height: `${clamped}%` }}
            aria-hidden
          />

          {/* Subtle shine */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,hsl(var(--background)/0.4),transparent_45%)]" />

          {/* Frame highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-black/5" />
        </div>

        {/* Readout (top-right) */}
        <div className="pointer-events-none absolute right-3 top-2 text-xs md:text-sm text-muted-foreground">
          <div className="font-semibold text-foreground">{clamped}%</div>
          {typeof heightMm === "number" && typeof capacityL === "number" && (
            <div>
              H: {heightMm.toFixed(2)} mm • C: {capacityL.toFixed(2)} L
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
