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
    console.error("Fetch Restaurants Error:", error);

    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = String((error as { message: unknown }).message);
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
