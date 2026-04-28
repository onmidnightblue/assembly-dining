import { RestaurantType } from "./restaurants";

export interface GovApiResponse {
  LOCALDATA_072404_YD?: {
    RESULT?: {
      CODE: string;
      MESSAGE: string;
    };
    list_total_count?: number;
    row?: RestaurantType[];
  };
}
