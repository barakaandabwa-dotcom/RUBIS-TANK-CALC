import React from "react";

export type TankGaugeProps = {
  percent: number;
  heightMm?: number;
  capacityL?: number;
};

/**
 * TankGauge
 * Visual gauge symbolizing a 3D bullet-style tank with metallic appearance.
 * Uses design tokens with custom styling for tank warfare aesthetics.
 */
export function TankGauge({ percent, heightMm, capacityL }: TankGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  
  return (
    <div className="w-full">
      <div
        role="img"
        aria-label={`Tank ammunition ${clamped}%${
          typeof heightMm === "number" ? `, height ${heightMm.toFixed(2)} millimeters` : ""
        }${typeof capacityL === "number" ? `, capacity ${capacityL.toFixed(2)} liters` : ""}`}
        className="relative mx-auto h-40 md:h-56 w-full max-w-3xl"
      >
        {/* Tank barrel/bullet shell container */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 shadow-2xl" 
             style={{
               clipPath: 'polygon(15% 0%, 85% 0%, 95% 15%, 95% 85%, 85% 100%, 15% 100%, 5% 85%, 5% 15%)',
               filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
             }}>
          
          {/* Metallic tank body with rivets */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-400 via-zinc-500 to-zinc-700">
            {/* Rivets pattern */}
            <div className="absolute inset-2 opacity-60">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-2 h-2 bg-zinc-600 rounded-full shadow-inner"
                     style={{ 
                       left: `${15 + (i % 3) * 35}%`, 
                       top: `${20 + Math.floor(i / 3) * 60}%` 
                     }} />
              ))}
            </div>
            
            {/* Ammunition/fuel level indicator */}
            <div
              className="absolute bottom-0 left-0 w-full transition-[height] duration-500 ease-out"
              style={{ 
                height: `${clamped}%`,
                background: clamped > 75 ? 
                  'linear-gradient(to top, #ef4444, #f87171)' : // Red for high ammo
                  clamped > 50 ? 
                  'linear-gradient(to top, #eab308, #facc15)' : // Yellow for medium
                  clamped > 25 ?
                  'linear-gradient(to top, #f97316, #fb923c)' : // Orange for low
                  'linear-gradient(to top, #dc2626, #ef4444)', // Dark red for critical
                opacity: 0.8
              }}
              aria-hidden
            />
            
            {/* Tank treads/tracks at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800">
              <div className="flex h-full">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-zinc-600 bg-gradient-to-b from-zinc-700 to-zinc-800" />
                ))}
              </div>
            </div>
            
            {/* Tank turret indicator */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gradient-to-r from-zinc-600 to-zinc-500 rounded-full shadow-md">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-zinc-800 rounded-full" />
            </div>
            
            {/* Metallic shine effect */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" 
                 style={{clipPath: 'polygon(0% 0%, 40% 0%, 20% 100%, 0% 100%)'}} />
            
            {/* Battle damage/wear effects */}
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute top-1/4 right-1/4 w-6 h-1 bg-zinc-800/60 rounded-full rotate-12" />
              <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-zinc-800/40 rounded-full" />
              <div className="absolute top-1/2 left-1/4 w-8 h-0.5 bg-zinc-900/50 rounded-full -rotate-6" />
            </div>
          </div>
          
          {/* Frame highlight with military styling */}
          <div className="pointer-events-none absolute inset-0 ring-2 ring-zinc-700/50" 
               style={{clipPath: 'polygon(15% 0%, 85% 0%, 95% 15%, 95% 85%, 85% 100%, 15% 100%, 5% 85%, 5% 15%)'}} />
        </div>
        
        {/* HUD-style readout */}
        <div className="pointer-events-none absolute right-3 top-2 text-xs md:text-sm font-mono text-zinc-200 bg-zinc-900/80 p-2 rounded border border-zinc-600">
          <div className="font-bold text-green-400 mb-1">TANK-01</div>
          <div className="text-yellow-400">AMMO: {clamped}%</div>
          {typeof heightMm === "number" && typeof capacityL === "number" && (
            <div className="text-zinc-300 text-xs mt-1">
              H: {heightMm.toFixed(1)}mm<br />
              CAP: {capacityL.toFixed(1)}L
            </div>
          )}
          {/* Status indicator */}
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-1 ${
              clamped > 75 ? 'bg-green-400' :
              clamped > 25 ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            <span className="text-xs text-zinc-400">
              {clamped > 75 ? 'READY' : clamped > 25 ? 'CAUTION' : 'CRITICAL'}
            </span>
          </div>
        </div>
        
        {/* Warning lights for low ammo */}
        {clamped < 25 && (
          <div className="absolute top-2 left-2 animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
          </div>
        )}
      </div>
    </div>
  );
}
