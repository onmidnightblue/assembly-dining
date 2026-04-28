import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useSyncRestaurants = () => {
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get("/api/restaurants/sync");
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onError: (error: Error) => {
      console.error("Error:", error.message);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      console.log(result);
    },
  });

  return {
    sync: syncMutation.mutate,
    isLoading: syncMutation.isPending,
    isError: syncMutation.isError,
  };
};
