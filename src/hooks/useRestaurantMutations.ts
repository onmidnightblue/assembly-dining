import { useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RestaurantType, SupabaseValue } from "@types";

export const useRestaurantMutations = (restaurantId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Record<string, SupabaseValue>) => {
      const { data: response } = await axios.patch("/api/restaurants", {
        id: restaurantId,
        type: "RESTAURANTS",
        ...data,
      });
      return response;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["restaurants"] });
      const previous = queryClient.getQueryData(["restaurants"]);
      queryClient.setQueryData<RestaurantType[]>(["restaurants"], (old) => {
        if (!old) return [];
        return old.map((rest) =>
          rest.id === newData.id ? { ...rest, ...newData } : rest
        );
      });
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous)
        queryClient.setQueryData(["restaurants"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  const saveToSupabase = useMemo(
    () =>
      debounce((data: Record<string, SupabaseValue>) => {
        if (restaurantId) mutation.mutate(data);
      }, 100),
    [restaurantId, mutation]
  );

  return {
    saveToSupabase,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
