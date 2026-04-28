import { RestaurantStoreState } from "@store";
import {
  OperatingHourType,
  RestaurantType,
  SortFilterType,
  TimeType,
} from "@types";

export const timeFilter = (
  schedule: OperatingHourType,
  targetTime: TimeType
): boolean => {
  const { day_of_week, open_time, close_time, break_start, break_end } =
    schedule || {};
  const { day, time } = targetTime || {};
  if (!day_of_week || !open_time || !close_time || day_of_week !== day)
    return false;

  const targetInt = parseInt(time.replace(":", ""));
  const open = parseInt(open_time.replace(/:/g, "").substring(0, 4));
  let close = parseInt(close_time.replace(/:/g, "").substring(0, 4));
  if (close <= open) close += 2400;

  const checkTime =
    targetInt < open && targetInt < 600 ? targetInt + 2400 : targetInt;
  const isOpen = checkTime >= open && checkTime < close;

  const breakStart = break_start
    ? parseInt(break_start.replace(/:/g, "").substring(0, 4))
    : null;
  const breakEnd = break_end
    ? parseInt(break_end.replace(/:/g, "").substring(0, 4))
    : null;
  const isBreak =
    breakStart && breakEnd
      ? checkTime >= breakStart && checkTime < breakEnd
      : false;

  return isOpen && !isBreak;
};

export const searchFilter = (
  restaurants: RestaurantType[],
  filters: Partial<RestaurantStoreState>
): RestaurantType[] => {
  const {
    selectedCategories = [],
    searchTerm = "",
    coordOrder = "all",
    statusOrder = "all",
    visibleOrder = "all",
    targetTimeFilter = null,
    sortOrder = "address_asc",
  } = filters || {};

  const filtered = restaurants.filter((restaurant) => {
    const conditions = [
      selectedCategories.length === 0 ||
        selectedCategories.includes(restaurant.category || ""),
      !searchTerm ||
        [restaurant.name, restaurant.keyword, restaurant.category].some((val) =>
          val?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      coordOrder === "all"
        ? true
        : coordOrder === "with_coord"
        ? !!restaurant.map_x && !!restaurant.map_y
        : !restaurant.map_x || !restaurant.map_y,
      statusOrder === "all" || restaurant.status_number === statusOrder,
      visibleOrder === "all" || String(restaurant.is_visible) === visibleOrder,
      targetTimeFilter
        ? restaurant.operating_hours?.some((oh) =>
            timeFilter(oh, targetTimeFilter)
          ) ?? false
        : true,
    ];

    return conditions.every(Boolean);
  });

  const sortFunctions: Record<
    SortFilterType,
    (a: RestaurantType, b: RestaurantType) => number
  > = {
    address_asc: (a, b) => a.land_address.localeCompare(b.land_address, "ko"),
    address_desc: (a, b) => b.land_address.localeCompare(a.land_address, "ko"),
    name_asc: (a, b) => a.name.localeCompare(b.name, "ko"),
    name_desc: (a, b) => b.name.localeCompare(a.name, "ko"),
    category_asc: (a, b) =>
      (a.category || "").localeCompare(b.category || "", "ko"),
    category_desc: (a, b) =>
      (b.category || "").localeCompare(a.category || "", "ko"),
    coord_asc: (a, b) => (Number(a.x) || 0) - (Number(b.x) || 0),
    coord_desc: (a, b) => (Number(b.x) || 0) - (Number(a.x) || 0),
  };

  return filtered.sort((a, b) => {
    const comparison = sortFunctions[sortOrder]?.(a, b) ?? 0;
    return comparison === 0 ? a.id.localeCompare(b.id) : comparison;
  });
};
