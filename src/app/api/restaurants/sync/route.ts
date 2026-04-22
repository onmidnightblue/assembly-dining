import axios from "axios";
import { NextResponse } from "next/server";
import { supabase } from "@lib";
import { RestaurantType } from "@types";

export async function GET() {
  try {
    const BATCH_SIZE = 1000;
    let startIndex = 1;
    let endIndex = BATCH_SIZE;
    let restaurants: RestaurantType[] = [];

    for (let i = 0; i < 100; i++) {
      const GOV_API_URL = `http://openapi.seoul.go.kr:8088/${process.env.GOV_API_KEY}/json/LOCALDATA_072404_YD`;
      const url = `${GOV_API_URL}/${startIndex}/${endIndex}`;

      const response = await axios.get(url);
      if (!response) {
        console.log(`endpoint: ${startIndex}`);
        break;
      }
      const { LOCALDATA_072404_YD } = response.data || {};
      if (!LOCALDATA_072404_YD) {
        console.log(`endpoint: ${startIndex}`);
        break;
      }
      const { RESULT, row } = LOCALDATA_072404_YD || {};

      // INFO-000: 정상 처리되었습니다
      if (RESULT?.CODE !== "INFO-000") {
        console.log(`error-code: ${RESULT?.CODE}`);
        break;
      }

      if (!row || row.length === 0) break;

      const filteredData = row.filter((item: RestaurantType) => {
        const { DTLSTATEGBN: isOperating, SITEWHLADDR: address } = item || {};
        if (isOperating !== "01") return false;
        if (!address.includes("여의도동")) return false;

        const match = address.match(/여의도동\s(\d+)/);
        if (match) {
          const buildingNum = parseInt(match[1], 10);
          return buildingNum >= 1 && buildingNum <= 19;
        }
        return false;
      });

      const mappedBatch = filteredData.map((item: RestaurantType) => ({
        id: item.MGTNO,
        name: item.BPLCNM?.trim(),
        category: item.UPTAENM,
        phone: item.SITETEL?.trim(),
        road_address: item.RDNWHLADDR?.trim(),
        land_address: item.SITEWHLADDR?.trim(),
        status_number: item.TRDSTATEGBN,
        status_name: item.TRDSTATENM,
        x: item.X?.trim(),
        y: item.Y?.trim(),
      }));

      restaurants = [...restaurants, ...mappedBatch];

      startIndex += BATCH_SIZE;
      endIndex += BATCH_SIZE;
    }

    if (restaurants.length > 0) {
      console.log(`count: ${restaurants}`);
      const { error: dbError } = await supabase
        .from("restaurants")
        .upsert(restaurants, {
          onConflict: "id",
          ignoreDuplicates: true,
        });

      if (dbError) {
        console.error("Supabase error:", {
          message: dbError.message,
          details: dbError.details,
          hint: dbError.hint,
          code: dbError.code,
        });
        throw dbError;
      }
    }

    return NextResponse.json({
      success: true,
      total_scanned: endIndex,
      count: restaurants.length,
      restaurants,
    });
  } catch (error: unknown) {
    const message = (error as Error)?.message ?? "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
