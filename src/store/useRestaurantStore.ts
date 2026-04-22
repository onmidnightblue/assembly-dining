// src/store/useRestaurantStore.ts
import { create } from "zustand";
import { RestaurantType, SortOrder } from "@types";

const SORT_CYCLE: SortOrder[] = [
  "name_asc",
  "name_desc",
  "category_asc",
  "category_desc",
  "latest",
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

  return [...result].sort((a, b) => {
    let comparison = 0;
    switch (sortOrder) {
      case "name_asc":
        comparison = a.name.localeCompare(b.name, "ko");
        break;
      case "name_desc":
        comparison = b.name.localeCompare(a.name, "ko");
      case "category_asc":
        comparison = (a.category || "").localeCompare(b.category || "", "ko");
      case "category_desc":
        comparison = (b.category || "").localeCompare(a.category || "", "ko");
      case "latest":
        comparison =
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime();
      default:
        return 0;
    }
    if (comparison === 0) {
      return a.id.localeCompare(b.id);
    }
    return comparison;
  });
};
