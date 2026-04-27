import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { useRestaurantStore } from "@store";
import { supabaseBrowser } from "@lib";

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
    mutationFn: async (updateData: Record<string, string>) => {
      if (!id) throw new Error("Not found restaurant ID");
      const { data } = await axios.patch("/api/restaurants", {
        id,
        ...updateData,
      });
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  // debounde
  const debouncedSave = useMemo(
    () =>
      debounce((updateData: Record<string, string>) => {
        update.mutate(updateData);
      }, 100),
    [update]
  );
  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  //  subscribe
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [channelName] = useState(
    () => `restaurants-realtime-${Math.random().toString(36).substring(2, 9)}`
  );
  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "restaurants",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["restaurants"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase, channelName]);

  const activeField = update.variables
    ? Object.keys(update.variables)[0]
    : null;
  return {
    restaurants,
    isLoading: isLoading || update.isPending,
    isError: isError || update.isError,
    saveToSupabase: debouncedSave,
    updatingField: update.isPending ? activeField : null,
    errorField: update.isError ? activeField : null,
    errorMessage: update.isError ? update.error.message : null,
  };
};
