"use client";

import { useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { AssemblyMap } from "@images";
import { RESTAURANTS } from "@constants";
import MapPin from "./MapPin";

const Map = ({}) => {
  const [scale, setScale] = useState(1);
  const restaurantList = RESTAURANTS;

  const containerRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

  const handleReset = () => {
    console.log("reset");
    if (transformComponentRef.current) {
      transformComponentRef.current?.resetTransform();
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`📍x: ${x.toFixed(2)}%, y: ${y.toFixed(2)}%`);
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={5}
        limitToBounds={false}
        smooth={true}
        wheel={{
          step: 0.001,
          wheelDisabled: false,
          touchPadDisabled: false,
        }}
        zoomAnimation={{ animationTime: 200 }}
        onTransform={(ref) => setScale(ref.state.scale)}
        ref={transformComponentRef}
      >
        {(utils) => (
          <>
            <div className="absolute bottom-10 right-10 z-[100] flex flex-col gap-2">
              <button
                onClick={() => utils.zoomIn()}
                className="w-10 h-10 bg-white rounded-full shadow-lg font-bold"
              >
                +
              </button>
              <button
                onClick={() => utils.zoomOut()}
                className="w-10 h-10 bg-white rounded-full shadow-lg font-bold"
              >
                -
              </button>
              <button
                onClick={handleReset}
                className="w-10 h-10 bg-white rounded-full shadow-lg text-xs"
              >
                Reset
              </button>
            </div>
            <TransformComponent
              wrapperClass="!w-full !h-full flex justify-center items-center"
              contentClass="!h-full"
            >
              <div
                ref={containerRef}
                onClick={handleMapClick}
                className="w-max flex justify-center items-center relative cursor-crosshair"
              >
                <AssemblyMap className="w-full h-auto" />
                {restaurantList.map((restaurant) => (
                  <MapPin
                    key={restaurant.mgtno}
                    data={restaurant}
                    currentScale={scale}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default Map;
