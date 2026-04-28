import axios from "axios";
import { NextResponse } from "next/server";
import { supabaseServer } from "@lib";
import { GovApiResponse, RestaurantType } from "@types";

const BATCH_SIZE = 1000;
const MAX_ITERATIONS = 100;
const GOV_API_BASE_URL = `http://openapi.seoul.go.kr:8088/${process.env.GOV_API_KEY}/json/LOCALDATA_072404_YD`;

const syncHandler = async (targetStatus: "01" | "03") => {
  const supabase = supabaseServer();
  if (!supabase) throw new Error("Supabase client instance creation failed.");

  let allProcessed: Partial<RestaurantType>[] = [];
  let totalScanned = 0;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const startIndex = i * BATCH_SIZE + 1;
    const endIndex = (i + 1) * BATCH_SIZE;

    const { data } = await axios.get<GovApiResponse>(
      `${GOV_API_BASE_URL}/${startIndex}/${endIndex}`
    );
    const result = data?.LOCALDATA_072404_YD;

    if (result?.RESULT?.CODE !== "INFO-000" || !result?.row) break;

    const rows: RestaurantType[] = result.row;
    totalScanned = endIndex;

    const filtered = rows
      .filter((item) => {
        const isTargetStatus = item.TRDSTATEGBN === targetStatus;
        const isYeouido = item.SITEWHLADDR?.includes("여의도동");
        if (!isTargetStatus || !isYeouido) return false;

        const buildingMatch = item.SITEWHLADDR.match(/여의도동\s(\d+)/);
        if (buildingMatch) {
          const buildingNum = parseInt(buildingMatch[1], 10);
          return buildingNum >= 1 && buildingNum <= 19;
        }
        return false;
      })
      .map((item) => ({
        id: item.MGTNO,
        name: item.BPLCNM?.trim(),
        category: item.UPTAENM,
        phone: item.SITETEL?.trim(),
        road_address: item.RDNWHLADDR?.trim(),
        land_address: item.SITEWHLADDR?.trim(),
        status_number: item.TRDSTATEGBN,
        x: item.X?.trim(),
        y: item.Y?.trim(),
      }));

    if (filtered.length > 0) {
      allProcessed = [...allProcessed, ...filtered];
    }
  }

  if (allProcessed.length === 0) return { totalScanned, updateCount: 0 };
  const uniqueProcessed = Array.from(
    new Map(allProcessed.map((item) => [item.id, item])).values()
  );

  const { data: updateData, error } = await supabase
    .from("restaurants")
    .upsert(uniqueProcessed, {
      onConflict: "id",
      ignoreDuplicates: targetStatus === "01",
    })
    .select("id");

  if (error) throw error;
  return {
    totalScanned,
    updateCount: updateData?.length || 0,
    data: uniqueProcessed,
  };
};

export async function GET() {
  try {
    const result01 = await syncHandler("01");
    const result03 = await syncHandler("03");

    return NextResponse.json({
      success: true,
      operating: result01,
      closed: result03,
    });
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
