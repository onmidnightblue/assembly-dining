import { supabaseBrowser } from "@lib";
import { useEffect } from "react";

export const useRestaurantRealTime = (id?: string, onUpdate?: () => void) => {
  useEffect(() => {
    if (!id || !onUpdate) return;
    const supabase = supabaseBrowser();

    const channel = supabase
      .channel(`realtime-db-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "restaurants" },
        onUpdate
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "operating_hours" },
        onUpdate
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        onUpdate
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, onUpdate]);
};
