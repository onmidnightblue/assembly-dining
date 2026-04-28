import { create } from "zustand";
import {
  COORD_CYCLE,
  SORT_CYCLE,
  STATUS_CYCLE,
  VISIBLE_CYCLE,
} from "@constants";
import {
  CoordFilterType,
  RestaurantType,
  SortFilterType,
  StatusFilterType,
  TimeType,
  VisibleFilterType,
} from "@types";

export interface RestaurantStoreState {
  restaurants: RestaurantType[];
  categories: string[];
  selectedCategories: string[];
  searchTerm: string;
  sortOrder: SortFilterType;
  coordOrder: CoordFilterType;
  statusOrder: StatusFilterType;
  visibleOrder: VisibleFilterType;
  targetTimeFilter: TimeType | null;
  visibleCount: number;
}

interface RestaurantStoreActions {
  setFilter: <K extends keyof RestaurantStoreState>(
    key: K,
    value: RestaurantStoreState[K]
  ) => void;
  cycleFilter: <K extends keyof RestaurantStoreState>(
    key: K,
    cycle: RestaurantStoreState[K][]
  ) => void;
  resetFilters: () => void;
  loadMore: () => void;
  toggleCategory: (category: string) => void;
  setTargetTimeFilter: (filter: TimeType | null) => void;
}

export const useRestaurantStore = create<
  RestaurantStoreState & RestaurantStoreActions
>((set) => ({
  // states
  restaurants: [],
  categories: [],
  selectedCategories: [],
  searchTerm: "",
  sortOrder: SORT_CYCLE[0],
  coordOrder: COORD_CYCLE[0],
  statusOrder: STATUS_CYCLE[0],
  visibleOrder: VISIBLE_CYCLE[0],
  targetTimeFilter: null,
  visibleCount: 20,

  // actions
  setFilter: (key, value) =>
    set(() => {
      const newState: Partial<RestaurantStoreState> = {
        [key]: value,
        visibleCount: 20,
      };
      if (key === "restaurants" && Array.isArray(value)) {
        const restaurants = value as RestaurantType[];
        const uniqueCategories = Array.from(
          new Set(restaurants.map((r) => r.category).filter(Boolean))
        ).sort();
        newState.categories = uniqueCategories;
      }
      return newState;
    }),
  cycleFilter: <K extends keyof RestaurantStoreState>(
    key: K,
    cycle: RestaurantStoreState[K][]
  ) =>
    set((state) => {
      const currentIndex = cycle.indexOf(state[key]);
      const nextIndex = (currentIndex + 1) % cycle.length;
      return {
        [key]: cycle[nextIndex],
        visibleCount: 20,
      } as Partial<RestaurantStoreState & RestaurantStoreActions>;
    }),
  loadMore: () => set((state) => ({ visibleCount: state.visibleCount + 20 })),
  resetFilters: () =>
    set({
      selectedCategories: [],
      searchTerm: "",
      sortOrder: SORT_CYCLE[0],
      coordOrder: COORD_CYCLE[0],
      visibleCount: 20,
    }),
  toggleCategory: (category) =>
    set((state) => {
      const isSelected = state.selectedCategories.includes(category);
      const nextCategories = isSelected
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category];

      return { selectedCategories: nextCategories, visibleCount: 20 };
    }),
  setTargetTimeFilter: (filter) =>
    set({ targetTimeFilter: filter, visibleCount: 20 }),
}));
