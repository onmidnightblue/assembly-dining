import { NextResponse } from "next/server";
import { supabaseServer } from "@lib";
import { SupabaseUpdateType } from "@types";

export async function GET() {
  try {
    const supabase = supabaseServer();
    if (!supabase)
      throw new Error("Failed to create the server client instance.");
    const { data, error } = await supabase
      .from("restaurants")
      .select(`*, operating_hours(*), comments(*)`)
      .order("land_address", { ascending: true })
      .order("day_of_week", {
        referencedTable: "operating_hours",
        ascending: true,
      })
      .order("created_at", {
        referencedTable: "comments",
        ascending: false,
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: data?.length ?? 0,
      restaurants: data ?? [],
    });
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, type, ...updateData } = body;

    const supabase = supabaseServer();
    if (!supabase)
      throw new Error("Failed to create the server client instance.");

    const tableMap: Record<SupabaseUpdateType, string> = {
      OPERATING_HOURS: "operating_hours",
      COMMENTS: "comments",
      RESTAURANTS: "restaurants",
    };
    const targetTable = tableMap[(type as SupabaseUpdateType) || "RESTAURANTS"];

    if (type === "OPERATING_HOURS") {
      const timeFields = [
        "open_time",
        "close_time",
        "break_start",
        "break_end",
        "last_order",
      ];
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      for (const key of timeFields) {
        const value = updateData[key];
        if (value && typeof value === "string" && !timeRegex.test(value)) {
          return NextResponse.json(
            {
              success: false,
              error: `Invalid Key: ${key}`,
              fieldKey: key,
            },
            { status: 400 }
          );
        }
      }

      if (!updateData.restaurant_id && !id) {
        return NextResponse.json(
          {
            success: false,
            error: "'restaurant_id' is missing.",
            fieldKey: "restaurant_id",
          },
          { status: 400 }
        );
      }
    }

    const upsertPayload = { ...updateData };
    if (id) upsertPayload.id = id;

    const { error } = await supabase.from(targetTable).upsert(upsertPayload, {
      onConflict: "id",
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") as SupabaseUpdateType | null;

    if (!id || !type)
      return NextResponse.json(
        { success: false, error: "ID and Type required" },
        { status: 400 }
      );

    const supabase = supabaseServer();
    if (!supabase)
      throw new Error("Failed to create the server client instance.");

    const tableMap: Partial<Record<SupabaseUpdateType, string>> = {
      COMMENTS: "comments",
      OPERATING_HOURS: "operating_hours",
    };
    const targetTable = tableMap[type];
    if (!targetTable) throw new Error("Invalid delete type");

    const { error } = await supabase.from(targetTable).delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
