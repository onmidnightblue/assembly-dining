"use client";

import { PinIcon } from "@/src/assets/svgs";
import { RestaurantType } from "@types";

interface MapPinProps {
  restaurant: RestaurantType;
  currentScale: number;
}

const MapPin = ({ restaurant, currentScale }: MapPinProps) => {
  const { map_x, map_y, name } = restaurant || {};

  return (
    <div
      className="absolute transition-all duration-300 pointer-events-auto"
      style={{
        left: `${map_x}%`,
        top: `${map_y}%`,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <div className="flex flex-col items-center group">
        <div className="hover:scale-120 transition duration-300">
          <PinIcon />
        </div>
      </div>
    </div>
  );
};

export default MapPin;
