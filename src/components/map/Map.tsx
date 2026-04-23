"use client";

import { useMemo, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import Supercluster from "supercluster";
import { AssemblyMap, PinIcon } from "@assets";
import { useRestaurants } from "@hooks";
import { RestaurantType } from "@types";
import { useRestaurantStore } from "@store";
import MapPin from "./MapPin";
import { Toast } from "@components/common";
import MapDetail from "./MapDetail";

const Map = ({}) => {
  const { isLoading, isError } = useRestaurants();
  const { filteredRestaurants: restaurants } = useRestaurantStore(
    (state) => state
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const [scale, setScale] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantType | null>(null);

  const handleReset = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current?.resetTransform();
    }
  };

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const coordText = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(coordText);
      setToastMessage(coordText);
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const clusterData = useMemo(() => {
    if (!restaurants) return null;

    const index = new Supercluster({
      radius: 40,
      maxZoom: 16,
    });

    const filter = restaurants.filter((restaurant) => restaurant?.map_x);
    const points = filter.map((restaurant: RestaurantType) => ({
      type: "Feature" as const,
      properties: { cluster: false, restaurant },
      geometry: {
        type: "Point" as const,
        coordinates: [
          parseFloat(restaurant.map_x),
          parseFloat(restaurant.map_y),
        ],
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
      <div className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-full animate-pulse">
        <div className="w-12 h-12 mb-4 border-4 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
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
    <main className="relative flex items-center justify-center w-full h-full overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={3}
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
        <div className="absolute flex flex-col gap-2 bottom-10 right-10 z-100">
          <button
            onClick={handleReset}
            className="w-10 h-10 text-xs bg-white rounded"
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
            className={`relative flex items-center justify-center w-max active:cursor-grabbing`}
          >
            <AssemblyMap className="w-full h-auto" />
            {clusters.map((c) => {
              const [x, y] = c.geometry.coordinates;
              const { cluster, point_count } = c.properties;
              if (cluster) {
                return (
                  <div
                    key={`cluster-${c.id}`}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) scale(${1 / scale})`,
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <PinIcon />
                    <span className="absolute text-sm text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      {point_count}
                    </span>
                  </div>
                );
              }
              return (
                <MapPin
                  key={c.properties.restaurant.id}
                  restaurant={c.properties.restaurant}
                  onClick={() => setSelectedRestaurant(c.properties.restaurant)}
                />
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>
      {selectedRestaurant && (
        <MapDetail
          selectedRestaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </main>
  );
};

export default Map;
