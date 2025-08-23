import React from "react";

export type TankGaugeProps = {
  percent: number;
  heightMm?: number;
  capacityL?: number;
};

export function TankGauge({ percent, heightMm, capacityL }: TankGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  
  // For the popup, show the same value as heightMm under the "Cap: ..." label
  const capValue = typeof heightMm === "number" ? heightMm : Number(heightMm);

  return (
    <div className="w-full">
      <div
        role="img"
        aria-label={`Tank fill ${clamped}%${typeof capValue === "number" ? `, capacity ${capValue.toFixed(2)} liters` : ""}`}
        className="relative mx-auto h-40 md:h-56 w-full max-w-4xl"
      >
        {/* Simplified support structure/skid base */}
        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-sm">
          {/* Clean support beams */}
          <div className="absolute left-[15%] top-0 w-2 h-full bg-gray-600 rounded-sm"></div>
          <div className="absolute right-[15%] top-0 w-2 h-full bg-gray-600 rounded-sm"></div>
        </div>

        {/* Simplified tank saddles/supports */}
        <div className="absolute bottom-4 left-[15%] w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-400 rounded-sm"></div>
        <div className="absolute bottom-4 right-[15%] w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-sm"></div>

        {/* Main cylindrical tank body - cleaned up */}
        <div className="absolute bottom-6 left-0 w-full h-32 md:h-40 overflow-hidden bg-gradient-to-b from-gray-300 via-gray-200 to-gray-400 rounded-full shadow-2xl">
          {/* Tank end caps (elliptical) */}
          <div className="absolute left-0 top-0 w-6 h-full bg-gradient-to-r from-gray-400 to-gray-300 rounded-l-full"></div>
          <div className="absolute right-0 top-0 w-6 h-full bg-gradient-to-r from-gray-300 to-gray-500 rounded-r-full"></div>
          
          {/* Green liquid fill */}
          <div
            className="absolute bottom-0 left-0 w-full transition-[height] duration-500 ease-out bg-green-500"
            style={{ height: `${clamped}%` }}
            aria-hidden
          />
          
          {/* Simplified tank fittings on top */}
          <div className="absolute top-0 left-[25%] w-2 h-4 bg-gray-600 -translate-y-3 rounded-sm">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-700 rounded-full"></div>
          </div>
          <div className="absolute top-0 left-[40%] w-2 h-4 bg-gray-600 -translate-y-3 rounded-sm">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-700 rounded-full"></div>
          </div>
          <div className="absolute top-0 left-[60%] w-2 h-4 bg-gray-600 -translate-y-3 rounded-sm">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-700 rounded-full"></div>
          </div>
          <div className="absolute top-0 left-[75%] w-2 h-4 bg-gray-600 -translate-y-3 rounded-sm">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-700 rounded-full"></div>
          </div>

          {/* Cylindrical body highlight - kept for realistic appearance */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full" 
               style={{clipPath: 'ellipse(80% 20% at 50% 10%)'}} />
        </div>
        
        {/* Simple readout */}
        <div className="pointer-events-none absolute right-3 top-2 text-xs md:text-sm text-gray-700 bg-white/90 p-2 rounded border border-gray-300 shadow-md">
          <div className="font-bold text-gray-800">{clamped}%</div>
          {typeof capValue === "number" && !isNaN(capValue) && (
            <div className="text-gray-600 text-xs mt-1">
              Cap: {capValue.toFixed(2)} L
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
