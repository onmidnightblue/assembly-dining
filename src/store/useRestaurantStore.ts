// src/store/useRestaurantStore.ts
import { create } from "zustand";
import { RestaurantType } from "@types";
import {
  COORD_LABELS,
  SORT_LABELS,
  STATUS_LABELS,
  VISIBLE_LABELS,
} from "@constants";

export type StatusOrder = keyof typeof STATUS_LABELS;
export type VisibleOrder = keyof typeof VISIBLE_LABELS;
export type CoordOrder = keyof typeof COORD_LABELS;
export type SortOrder = keyof typeof SORT_LABELS;
export const STATUS_CYCLE: StatusOrder[] = ["all", "01", "02"];
export const VISIBLE_CYCLE: VisibleOrder[] = ["all", "true", "false"];
export const SORT_CYCLE: SortOrder[] = [
  "address_asc",
  "address_desc",
  "name_asc",
  "name_desc",
  "category_asc",
  "category_desc",
  "coord_asc",
  "coord_desc",
];
export const COORD_CYCLE: CoordOrder[] = ["all", "with_coord", "no_coord"];

interface RestaurantStore {
  restaurants: RestaurantType[];
  filteredRestaurants: RestaurantType[];
  categories: string[];
  selectedCategories: string[];
  searchTerm: string;
  sortOrder: SortOrder;
  coordOrder: CoordOrder;
  statusOrder: StatusOrder;
  visibleOrder: VisibleOrder;
  visibleCount: number;
  setSortOrder: (order?: SortOrder) => void;
  setCoordOrder: (order?: CoordOrder) => void;
  setStatusOrder: (order?: StatusOrder) => void;
  setVisibleOrder: (order?: VisibleOrder) => void;
  setRestaurants: (data: RestaurantType[]) => void;
  toggleCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  loadMore: () => void;
  resetFilters: () => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => {
  const cycleOrder = <
    T extends keyof RestaurantStore,
    V extends RestaurantStore[T]
  >(
    key: T,
    cycle: V[],
    explicitOrder?: V
  ) => {
    set((state) => {
      const isExplicitValid =
        explicitOrder !== undefined && cycle.includes(explicitOrder);
      const nextOrder = isExplicitValid
        ? explicitOrder
        : cycle[(cycle.indexOf(state[key] as V) + 1) % cycle.length];
      const newState = { ...state, [key]: nextOrder };
      return {
        [key]: nextOrder,
        filteredRestaurants: applyFilters(newState, {}),
      };
    });
  };

  return {
    restaurants: [],
    filteredRestaurants: [],
    categories: [],
    selectedCategories: [],
    searchTerm: "",
    visibleCount: 20,

    statusOrder: STATUS_CYCLE[0],
    visibleOrder: VISIBLE_CYCLE[0],
    coordOrder: COORD_CYCLE[0],
    sortOrder: SORT_CYCLE[0],

    setRestaurants: (data) => {
      set((state) => {
        const uniqueCategories = Array.from(
          new Set(
            data.map((restaurant) => restaurant.category || "").filter(Boolean)
          )
        ).sort();
        return {
          restaurants: data,
          filteredRestaurants: applyFilters(
            { ...state, restaurants: data },
            {}
          ),
          categories: uniqueCategories,
        };
      });
    },

    toggleCategory: (category) =>
      set((state) => {
        const next = state.selectedCategories.includes(category)
          ? state.selectedCategories.filter((c) => c !== category)
          : [...state.selectedCategories, category];
        return {
          selectedCategories: next,
          visibleCount: 20,
          filteredRestaurants: applyFilters(state, {
            selectedCategories: next,
          }),
        };
      }),

    setSearchTerm: (term) =>
      set((state) => ({
        searchTerm: term,
        visibleCount: 20,
        filteredRestaurants: applyFilters(state, { searchTerm: term }),
      })),

    setSortOrder: (order) => cycleOrder("sortOrder", SORT_CYCLE, order),
    setCoordOrder: (order) => cycleOrder("coordOrder", COORD_CYCLE, order),
    setStatusOrder: (order) => cycleOrder("statusOrder", STATUS_CYCLE, order),
    setVisibleOrder: (order) =>
      cycleOrder("visibleOrder", VISIBLE_CYCLE, order),

    loadMore: () => set((state) => ({ visibleCount: state.visibleCount + 20 })),

    resetFilters: () =>
      set((state) => ({
        selectedCategories: [],
        searchTerm: "",
        sortOrder: SORT_CYCLE[0],
        visibleCount: 20,
        coordOrder: COORD_CYCLE[0],
        filteredRestaurants: state.restaurants.sort((a, b) =>
          a.land_address.localeCompare(b.land_address, "ko")
        ),
      })),
  };
});

// helper
const applyFilters = (
  state: RestaurantStore,
  updates: Partial<RestaurantStore>
) => {
  const {
    restaurants,
    coordOrder,
    selectedCategories,
    searchTerm,
    sortOrder,
    statusOrder,
    visibleOrder,
  } = {
    ...state,
    ...updates,
  };

  const result = restaurants.filter((restaurant) => {
    const conditions = [
      selectedCategories.length === 0 ||
        selectedCategories.includes(restaurant.category || ""),
      !searchTerm ||
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.category?.includes(searchTerm),
      coordOrder === "all"
        ? true
        : coordOrder === "with_coord"
        ? !!restaurant.map_x && !!restaurant.map_y
        : !restaurant.map_x || !restaurant.map_y,
      statusOrder === "all" || restaurant.status_number === statusOrder,
      visibleOrder === "all" || String(restaurant.is_visible) === visibleOrder,
    ];
    return conditions.every(Boolean);
  });

  const sortFunctions: Record<
    SortOrder,
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
  return result.sort((a, b) => {
    const comparison = sortFunctions[sortOrder]?.(a, b) ?? 0;
    return comparison === 0 ? a.id.localeCompare(b.id) : comparison;
  });
};
