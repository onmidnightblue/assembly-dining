// src/store/useRestaurantStore.ts
import { create } from "zustand";
import { RestaurantType } from "@types";

interface RestaurantStore {
  restaurants: RestaurantType[];
  filteredRestaurants: RestaurantType[];
  selectedCategory: string;
  setRestaurants: (data: RestaurantType[]) => void;
  setFilter: (category: string) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: [],
  filteredRestaurants: [],
  selectedCategory: "전체",

  setRestaurants: (data) =>
    set({
      restaurants: data,
      filteredRestaurants: data,
    }),

  setFilter: (category) =>
    set((state) => ({
      selectedCategory: category,
      filteredRestaurants:
        category === "전체"
          ? state.restaurants
          : state.restaurants.filter(
              (restaurant) => restaurant.category === category
            ),
    })),
}));
