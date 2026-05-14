import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { v4 } from "uuid";
import debounce from "lodash.debounce";
import { OperatingHourType, RestaurantType } from "@types";

export const useOperatingHoursMutations = (
  restaurantId: string | null | undefined
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      dayOfWeek,
      data,
    }: {
      id: string | number;
      dayOfWeek: number;
      data: Partial<OperatingHourType>;
    }) => {
      const isNew = typeof id === "number";
      const { data: response } = await axios.patch("/api/restaurants", {
        ...data,
        id: isNew ? v4() : id,
        type: "OPERATING_HOURS",
        restaurant_id: restaurantId,
        day_of_week: dayOfWeek,
      });
      return response;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["restaurants"] });
      const previous = queryClient.getQueryData<RestaurantType[]>([
        "restaurants",
      ]);
      queryClient.setQueryData<RestaurantType[]>(["restaurants"], (old) => {
        if (!old) return [];
        return old.map((rest) => {
          if (rest.id !== restaurantId) return rest;
          const isExisting = rest.operating_hours.some(
            (oh) => oh.day_of_week === variables.dayOfWeek
          );
          let updatedHours;
          if (isExisting) {
            updatedHours = rest.operating_hours.map((oh) =>
              oh.day_of_week === variables.dayOfWeek
                ? { ...oh, ...variables.data }
                : oh
            );
          } else {
            const newHour = {
              id: variables.id,
              day_of_week: variables.dayOfWeek,
              is_off: false,
              ...variables.data,
            } as OperatingHourType;
            updatedHours = [...rest.operating_hours, newHour];
          }
          return { ...rest, operating_hours: updatedHours };
        });
      });
      return { previous };
    },
    onSuccess: (updatedHour) => {
      queryClient.setQueryData<RestaurantType[]>(["restaurants"], (old) => {
        if (!old) return [];
        return old.map((rest) => {
          if (rest.id !== restaurantId) return rest;
          const updatedHours = rest.operating_hours.map((oh) =>
            oh.day_of_week === updatedHour.day_of_week ? updatedHour : oh
          );
          return { ...rest, operating_hours: updatedHours };
        });
      });
    },
    onError: (err, _, context) => {
      if (context?.previous)
        queryClient.setQueryData(["restaurants"], context.previous);
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  const saveOperatingHours = useMemo(
    () =>
      debounce(
        (payload: {
          id: number | string;
          dayOfWeek: number;
          data: Partial<OperatingHourType>;
        }) => {
          mutation.mutate(payload);
        },
        300
      ),
    [mutation]
  );

  return {
    saveOperatingHours,
    isUpdating: mutation.isPending,
    error: mutation.error,
    variables: mutation.variables,
  };
};
