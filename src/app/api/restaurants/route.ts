import { NextResponse } from "next/server";
// import { supabase } from "@lib";
import { RestaurantData } from "@/src/types";
import axios from "axios";
import { supabase } from "@/src/lib";

export async function GET() {
  try {
    const KEY = process.env.GOV_API_KEY;
    const BATCH_SIZE = 1000;
    let startIndex = 1;
    let endIndex = BATCH_SIZE;
    let restaurants: RestaurantData[] = [];

    for (let i = 0; i < 5; i++) {
      const url = `http://openapi.seoul.go.kr:8088/${KEY}/json/LOCALDATA_072404_YD/${startIndex}/${endIndex}`;

      const response = await axios.get(url);
      const { LOCALDATA_072404_YD } = response.data || {};
      const { RESULT, row } = LOCALDATA_072404_YD || {};

      if (RESULT?.CODE !== "INFO-000")
        throw new Error(`error-code: ${RESULT?.CODE}`);

      if (!row || row.length === 0) break;

      const filteredData = row.filter((item: RestaurantData) => {
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

      ////////////////////////!!!!!!!!!!!!!!! 여기부터 할 것
      ///////////////////////!!!!!!!!!!!!! supabase key 값도 수정해야함
      const mappedBatch = filteredData.map((item: RestaurantData) => ({
        mgtno: item.MGTNO,
        bplcnm: item.BPLCNM?.trim(),
        rdnwhladdr: item.RDNWHLADDR?.trim(),
        sitewhladdr: item.SITEWHLADDR?.trim(),
        uptanm: item.UPTAENM,
        trdstategbn: item.TRDSTATEGBN,
        trdstatenm: item.TRDSTATENM,
        dtlstategbn: item.DTLSTATEGBN,
        dtlstatenm: item.DTLSTATENM,
        sitetel: item.SITETEL?.trim(),
        x: item.X?.trim(),
        y: item.Y?.trim(),
        original_x: item.X?.trim(),
        original_y: item.Y?.trim(),
        updated_at: new Date().toISOString(),
      }));

      restaurants = [...restaurants, ...mappedBatch];

      startIndex += BATCH_SIZE;
      endIndex += BATCH_SIZE;
    }

    if (restaurants.length > 0) {
      const { error: dbError } = await supabase
        .from("restaurants")
        .upsert(restaurants, {
          onConflict: "mgtno",
          ignoreDuplicates: true,
        });

      if (dbError) throw dbError;
    }

    return NextResponse.json({
      success: true,
      count: restaurants.length,
    });

    // const { data, error: dbError } = await supabase.from("restaurants").upsert(
    //   filteredData.map((item: any) => ({
    //     address: item.RDNWHALADDR,
    //     status: item.TRSTATE_NM,
    //     updated_at: new Date().toISOString(),
    //     mgtno:item.MGTNO,
    //     apvpermymd: "2017-01-19",
    //     trdstategbn: "01",
    //     sitetel: "",
    //     sitearea: "109.81",
    //     sitepostno: "150-871",
    //     sitewhladdr: "서울특별시 영등포구 여의도동 14-21 엘지여의도에클라트",
    //     rdnwhladdr:
    //       "서울특별시 영등포구 국회대로 780, 1층 112호 (여의도동, 엘지여의도에클라트)",
    //     rdnpostno: "07237",
    //     bplcnm:item.BPLCNM,
    //     lastmodts: "2023-03-31 11:23",
    //     uptaenm: "한식",
    //     x: "48.10",
    //     y: "53.00",
    //     original_x: "192785.998",
    //     original_y: "447523.1165",
    //   })),
    //   { onConflict: "api_id", ignoreDuplicates: true }
    // );

    // if (dbError) throw dbError;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
