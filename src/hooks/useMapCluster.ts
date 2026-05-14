import { useMemo } from "react";
import Supercluster from "supercluster";
import { RestaurantType } from "@types";

type Props = {
  restaurants: RestaurantType[];
  scale: number;
};

const C = {
  RADIUS: 20,
  MAX_ZOOM: 20,
  SCALE_MULTIPLIER: 4.0,
} as const;

export const useMapCluster = ({ restaurants, scale }: Props) => {
  const clusterData = useMemo(() => {
    if (!restaurants) return null;

    const index = new Supercluster({
      radius: C.RADIUS,
      maxZoom: C.MAX_ZOOM,
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
    const zoom = Math.floor(scale * C.SCALE_MULTIPLIER);
    return clusterData.getClusters([0, 0, 100, 100], zoom);
  }, [clusterData, scale]);

  return clusters;
};
