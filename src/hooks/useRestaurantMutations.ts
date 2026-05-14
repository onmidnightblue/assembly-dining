import axios from "axios";
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
    onSuccess: (responseData, variables) => {
      queryClient.setQueryData<RestaurantType[]>(["restaurants"], (old) => {
        if (!old) return [];
        return old.map((rest) =>
          String(rest.id) === String(restaurantId)
            ? {
                ...rest,
                ...variables,
                ...responseData,
              }
            : rest
        );
      });
    },
  });

  const saveToSupabase = async (data: Record<string, SupabaseValue>) => {
    if (!restaurantId) return;
    return mutation.mutateAsync(data);
  };

  return {
    saveToSupabase,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
