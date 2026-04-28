import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OperatingHourType, SupabaseUpdateType } from "@types";
import axios, { AxiosError } from "axios";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo } from "react";
import { v4 } from "uuid";

type SupabaseValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[];

interface ApiErrorResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const useRestaurantMutations = (
  id?: string,
  initialHours: OperatingHourType[] = []
) => {
  const queryClient = useQueryClient();

  const invalidate = useMemo(
    () =>
      debounce(
        () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
        1000
      ),
    [queryClient]
  );

  const mutation = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      data: Record<string, SupabaseValue>;
      type: SupabaseUpdateType;
    }) => {
      const { data } = await axios.patch("/api/restaurants", {
        id: vars.id,
        type: vars.type,
        ...vars.data,
      });
      return data;
    },
    onSettled: invalidate,
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const detail = error.response?.data?.error || error.message;
      console.error("❌ [DB Update Failed]:", detail);
    },
  });

  const getHourPayload = useCallback(
    (payload: { id: string | number; data: Partial<OperatingHourType> }) => {
      const day =
        typeof payload.data.day_of_week === "number"
          ? payload.data.day_of_week
          : typeof payload.id === "number"
          ? payload.id
          : 0;
      const existing = initialHours.find(
        (oh) => Number(oh.day_of_week) === Number(day)
      );
      return {
        finalId:
          existing?.id || (typeof payload.id === "string" ? payload.id : v4()),
        data: {
          ...payload.data,
          restaurant_id: id,
          day_of_week: day,
        } as Record<string, SupabaseValue>,
      };
    },
    [id, initialHours]
  );

  const saveOperatingHours = useMemo(
    () =>
      debounce((payload) => {
        const { finalId, data } = getHourPayload(payload);
        mutation.mutate({ id: finalId, data, type: "OPERATING_HOURS" });
      }, 300),
    [getHourPayload, mutation]
  );

  const saveOperatingHoursDirect = useCallback(
    (payload: { id: string | number; data: Partial<OperatingHourType> }) => {
      const { finalId, data } = getHourPayload(payload);
      mutation.mutate({ id: finalId, data, type: "OPERATING_HOURS" });
    },
    [getHourPayload, mutation]
  );

  const saveToSupabase = useMemo(
    () =>
      debounce((data: Record<string, SupabaseValue>) => {
        if (id) mutation.mutate({ id, data, type: "RESTAURANTS" });
      }, 100),
    [id, mutation]
  );

  useEffect(() => {
    return () => {
      saveToSupabase.cancel();
      saveOperatingHours.cancel();
    };
  }, [saveToSupabase, saveOperatingHours]);

  return {
    saveToSupabase,
    saveOperatingHours,
    saveOperatingHoursDirect,
    activeId: mutation.isPending ? mutation.variables?.id : null,
    errorId: mutation.isError ? mutation.variables?.id : null,
    errorMessage: mutation.error as AxiosError<ApiErrorResponse> | null,
    isUpdating: mutation.isPending,
  };
};
