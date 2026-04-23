import { useEffect, useRef } from "react";
import { RestaurantType } from "@types";
import { useRestaurantStore } from "@store";
import { useRestaurants } from "@hooks";
import RestaurantListItem from "./RestaurantListItem";

const RestaurantList = ({}) => {
  const { isLoading, isError } = useRestaurants();
  const {
    filteredRestaurants: restaurants,
    visibleCount,
    loadMore,
  } = useRestaurantStore((state) => state);
  const observerTarget = useRef(null);
  const displayItems = restaurants.slice(0, visibleCount);
  const hasMore = restaurants.length > visibleCount;

  // infinite scroll
  useEffect(() => {
    if (isLoading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore, isLoading]);

  if (isLoading) {
    return (
      <ul className="p-4">
        {[...Array(10)].map((_, i) => (
          <li
            key={i}
            className="flex justify-between p-2 border-b animate-pulse border-b-gray-200"
          >
            <div className="space-y-2">
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
              <div className="w-40 h-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-60"></div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Someting Wrong!</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <ul className="p-4">
          {displayItems?.map((restaurant: RestaurantType, index) => {
            const { id } = restaurant || {};
            return (
              <RestaurantListItem
                key={`admin-restaurant-${id}-${index}`}
                restaurant={restaurant}
              />
            );
          })}
        </ul>
        {hasMore && (
          <div
            ref={observerTarget}
            className="relative flex items-center justify-center w-full py-10 overflow-hidden rounded-full animate-pulse"
          >
            <div className="w-12 h-12 mb-4 border-4 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantList;
