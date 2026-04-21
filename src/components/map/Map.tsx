"use client";

import { useMemo, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { AssemblyMap } from "@images";
import MapPin from "./MapPin";
import { useFetchRestaurants } from "@hooks";
import { RestaurantType } from "@/src/types";
import Supercluster from "supercluster";

const Map = ({}) => {
  const [scale, setScale] = useState(1);
  const { data: restaurants, isLoading, isError } = useFetchRestaurants();

  const containerRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

  const handleReset = () => {
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

  const clusterData = useMemo(() => {
    if (!restaurants) return null;

    const index = new Supercluster({
      radius: 40,
      maxZoom: 16,
    });

    const points = restaurants.map((restaurant: RestaurantType) => ({
      type: "Feature" as const,
      properties: { cluster: false, restaurant },
      geometry: {
        type: "Point" as const,
        coordinates: [restaurant.map_x, restaurant.map_y],
      },
    }));

    index.load(points);
    return index;
  }, [restaurants]);

  const clusters = useMemo(() => {
    if (!clusterData) return [];
    const zoom = Math.floor(scale * 3);
    return clusterData.getClusters([0, 0, 100, 100], zoom);
  }, [clusterData, scale]);

  if (isLoading) {
    return (
      <div className="w-full h-full animate-pulse relative flex items-center justify-center overflow-hidden rounded-lg">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Someting Wrong!</p>
      </div>
    );
  }

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
        <div className="absolute bottom-10 right-10 z-100 flex flex-col gap-2">
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
            {clusters.map((c) => {
              const [x, y] = c.geometry.coordinates;
              const { cluster, point_count } = c.properties;

              if (cluster) {
                return (
                  <div
                    key={`cluster-${c.id}`}
                    className="absolute bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) scale(${1 / scale})`,
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    {point_count}
                  </div>
                );
              }

              return (
                <MapPin
                  key={c.properties.restaurant.id}
                  restaurant={c.properties.restaurant}
                  currentScale={scale}
                />
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Map;
