import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRestaurantStore } from "@/src/store/useRestaurantStore";

export const useFetchRestaurants = () => {
  const setRestaurants = useRestaurantStore((state) => state.setRestaurants);

  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await axios.get("/api/restaurants");

      if (!data.success) {
        throw new Error(
          data.error || "Failed to load the data from the server."
        );
      }

      setRestaurants(data.restaurants);
      return data.restaurants;
    },
  });
};
