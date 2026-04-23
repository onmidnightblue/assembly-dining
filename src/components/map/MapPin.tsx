"use client";

import { PinIcon } from "@assets";
import { RestaurantType } from "@types";

interface MapPinProps {
  restaurant: RestaurantType;
  onClick: () => void;
}

const MapPin = ({ onClick, restaurant }: MapPinProps) => {
  const { map_x, map_y } = restaurant || {};

  return (
    <div
      className="absolute transition-all duration-300 cursor-pointer"
      style={{
        left: `${map_x}%`,
        top: `${map_y}%`,
        transform: `translate(-50%, -50%)`,
      }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center group">
        <div className="transition duration-300 hover:scale-120">
          <PinIcon />
        </div>
      </div>
    </div>
  );
};

export default MapPin;
