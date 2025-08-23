import React from 'react';

interface TankGaugeProps {
  percent: number;
  heightMm: number;
  capacityL?: number;
}

export function TankGauge({ percent, heightMm, capacityL }: TankGaugeProps) {
  const fillHeight = Math.max(0, Math.min(100, percent));
  
  return (
    <div className="flex items-center gap-4">
      {/* Visual Tank Gauge */}
      <div className="relative w-16 h-32 bg-gray-200 border-2 border-gray-400 rounded-lg overflow-hidden">
        {/* Tank Fill */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-300 ease-in-out"
          style={{ height: `${fillHeight}%` }}
        />
        {/* Tank Outline/Frame */}
        <div className="absolute inset-0 border-2 border-gray-600 rounded-lg pointer-events-none" />
        {/* Percentage Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {percent}%
          </span>
        </div>
      </div>
      
      {/* Capacity Display */}
      <div className="flex flex-col">
        <span className="text-sm font-medium">Current Volume</span>
        <span className="text-lg font-bold text-blue-600">
          {capacityL ? capacityL.toFixed(2) : "0.00"} L
        </span>
        <span className="text-xs text-muted-foreground">
          Fill Level: {percent}% • Height: {heightMm.toFixed(2)} mm
        </span>
      </div>
    </div>
  );
}

export default TankGauge;
