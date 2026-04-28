import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRestaurantStore } from "@store";
import { RestaurantType } from "@types";
import { useRestaurantMutations } from "./useRestaurantMutations";
import { searchFilter } from "@utils";

export const useRestaurants = (id?: string) => {
  const store = useRestaurantStore();

  const {
    data: restaurants = [],
    error: fetchError,
    isLoading: isFetchLoading,
  } = useQuery<RestaurantType[]>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await axios.get("/api/restaurants");
      return data.restaurants;
    },
    staleTime: 1000 * 60 * 30,
  });

  const operatingHours = useMemo(() => {
    if (!id) return [];
    return restaurants.find((r) => r.id === id)?.operating_hours || [];
  }, [id, restaurants]);

  const filteredData = useMemo(
    () => searchFilter(restaurants, store),
    [restaurants, store]
  );

  const {
    errorMessage: mutationError,
    isUpdating,
    ...mutations
  } = useRestaurantMutations(id, operatingHours);

  const mergeErrorMessage = useMemo(() => {
    const err = fetchError || mutationError;
    if (!err) return null;
    return axios.isAxiosError(err)
      ? err.response?.data?.error || err.message
      : (err as Error).message;
  }, [fetchError, mutationError]);

  return {
    restaurants: filteredData,
    operatingHours,
    isLoading: isFetchLoading || isUpdating,
    errorMessage: mergeErrorMessage,
    isError: !!mergeErrorMessage,
    ...mutations,
  };
};
