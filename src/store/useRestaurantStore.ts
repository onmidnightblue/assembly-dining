// src/store/useRestaurantStore.ts
import { create } from "zustand";
import { RestaurantType } from "@types";
import { SORT_LABELS } from "@constants";

export type SortOrder = keyof typeof SORT_LABELS;
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

interface RestaurantStore {
  restaurants: RestaurantType[];
  filteredRestaurants: RestaurantType[];

  // filter options
  categories: string[];
  selectedCategories: string[];
  searchTerm: string;
  sortOrder: SortOrder;
  visibleCount: number;

  // set
  setRestaurants: (data: RestaurantType[]) => void;
  toggleCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setSortOrder: (order?: SortOrder) => void;
  loadMore: () => void;
  resetFilters: () => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: [],
  filteredRestaurants: [],
  categories: [],
  selectedCategories: [],
  searchTerm: "",
  sortOrder: SORT_CYCLE[0],
  visibleCount: 20,

  setRestaurants: (data) => {
    set((state) => {
      const uniqueCategories = Array.from(
        new Set(
          data.map((restaurant) => restaurant.category || "").filter(Boolean)
        )
      ).sort();
      return {
        restaurants: data,
        filteredRestaurants: applyFilters({ ...state, restaurants: data }, {}),
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
        filteredRestaurants: applyFilters(state, { selectedCategories: next }),
      };
    }),

  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      visibleCount: 20,
      filteredRestaurants: applyFilters(state, { searchTerm: term }),
    })),

  setSortOrder: (order) =>
    set((state) => {
      const isExplicitOrder =
        typeof order === "string" && SORT_CYCLE.includes(order as SortOrder);
      let nextOrder: SortOrder;
      if (isExplicitOrder) {
        nextOrder = order as SortOrder;
      } else {
        const currentIndex = SORT_CYCLE.indexOf(state.sortOrder);
        const nextIndex = (Math.max(0, currentIndex) + 1) % SORT_CYCLE.length;
        nextOrder = SORT_CYCLE[nextIndex];
      }
      const newFiltered = applyFilters({ ...state, sortOrder: nextOrder }, {});
      return {
        sortOrder: nextOrder,
        filteredRestaurants: newFiltered,
      };
    }),

  loadMore: () => set((state) => ({ visibleCount: state.visibleCount + 20 })),

  resetFilters: () =>
    set((state) => ({
      selectedCategories: [],
      searchTerm: "",
      sortOrder: SORT_CYCLE[0],
      visibleCount: 20,
      filteredRestaurants: state.restaurants.sort((a, b) =>
        a.land_address.localeCompare(b.land_address, "ko")
      ),
    })),
}));

// helper
const applyFilters = (
  state: RestaurantStore,
  updates: Partial<RestaurantStore>
) => {
  const { restaurants, selectedCategories, searchTerm, sortOrder } = {
    ...state,
    ...updates,
  };

  const result = restaurants.filter((r) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(r.category || "");
    const searchMatch =
      !searchTerm ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.category && r.category.includes(searchTerm));

    return categoryMatch && searchMatch;
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
