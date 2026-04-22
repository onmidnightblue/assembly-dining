import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { useRestaurantStore } from "@store";

export const useRestaurants = (id?: string) => {
  const queryClient = useQueryClient();
  const { setRestaurants } = useRestaurantStore((state) => state);

  // fetch
  const {
    data: restaurants,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await axios.get("/api/restaurants");
      if (!data.success)
        throw new Error(data.error || "Failed to load the data");
      setRestaurants(data.restaurants);
      return data.restaurants;
    },
    staleTime: 1000 * 60 * 30, // caching
  });

  // update
  const update = useMutation({
    mutationFn: async ({
      column,
      value,
    }: {
      column: string;
      value: string;
    }) => {
      if (!id) throw new Error("Not found restaurant ID");
      const { data } = await axios.patch("/api/restaurants", {
        id,
        column,
        value,
      });
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const debouncedSave = useMemo(
    () =>
      debounce((column: string, value: string) => {
        update.mutate({ column, value });
      }, 800),
    [update]
  );

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  return {
    restaurants,
    isLoading,
    isError: isError || update.isError,
    saveToSupabase: debouncedSave,
    updatingField: update.isPending ? update.variables?.column : null,
  };
};
