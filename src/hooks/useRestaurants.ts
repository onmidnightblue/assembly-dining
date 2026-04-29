import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRestaurantStore } from "@store";
import { RestaurantType } from "@types";
import { useRestaurantMutations } from "./useRestaurantMutations";
import { searchFilter } from "@utils";
import { useOperatingHoursMutations } from "./useOperatingHoursMutations ";

interface ApiErrorResponse {
  success: boolean;
  error?: string;
  message?: string;
  fieldKey?: string | null;
}

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

  const {
    saveToSupabase,
    isUpdating: isUpdatingRestaurant,
    error: errorRestaurant,
  } = useRestaurantMutations(id);

  const {
    saveOperatingHours,
    isUpdating: isUpdatingOH,
    error: errorOH,
    variables: variablesOH,
  } = useOperatingHoursMutations(id);

  const filteredData = useMemo(
    () => searchFilter(restaurants, store),
    [restaurants, store]
  );

  const errorInfo = useMemo(() => {
    const activeError = errorOH || errorRestaurant || fetchError;
    if (!activeError) return { message: null, fieldKey: null };
    const axiosError = activeError as AxiosError<ApiErrorResponse>;
    const resData = axiosError.response?.data;
    const message = resData?.error || resData?.message || axiosError.message;
    return {
      message: String(message),
      fieldKey: resData?.fieldKey || null,
    };
  }, [errorOH, errorRestaurant, fetchError]);

  return {
    restaurants: filteredData,
    isLoading: isFetchLoading || isUpdatingRestaurant || isUpdatingOH,
    errorMessage: errorInfo.message,
    isError: !!errorInfo.message,
    fieldKey: errorInfo.fieldKey,
    errorId: errorOH ? variablesOH?.id : null,
    saveToSupabase,
    saveOperatingHours,
  };
};
