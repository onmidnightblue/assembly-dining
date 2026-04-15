"use client";

import { RestaurantData } from "@types";

interface MapPinProps {
  data: RestaurantData;
  currentScale: number;
}

const MapPin = ({ data, currentScale }: MapPinProps) => {
  const minScale = Math.max(0.8, 1 / currentScale);

  return (
    <div
      className="absolute transition-all duration-300 pointer-events-auto"
      style={{
        left: `${data.x}%`,
        top: `${data.y}%`,
        transform: `translate(-100%, -50%) scale(${minScale})`,
      }}
    >
      <div className="flex flex-col items-center group">
        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md group-hover:bg-blue-500" />
        <span className="mt-1 text-[8px] font-bold bg-white/80 px-1 rounded shadow-sm whitespace-nowrap">
          {data.bplcnm}
        </span>
      </div>
    </div>
  );
};

export default MapPin;
