import { NextResponse } from "next/server";
import { supabase } from "@lib";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .order("land_address", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: data.length,
      restaurants: data,
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
    console.log("body", body);
    const { id, column, value } = body;

    if (!id || !column) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(`[PATCH] start: id=${id}, col=${column}, val=${value}`);

    const { data, error } = await supabase
      .from("restaurants")
      .update({ [column]: value })
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ [ERROR]:", error);
      return NextResponse.json(
        { success: false, error: error.message, hint: error.hint },
        { status: 400 } // RLS나 제약조건 위반은 400번대
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
