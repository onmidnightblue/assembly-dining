import { useFetchRestaurants } from "@/src/hooks";
import { RestaurantType } from "@/src/types";
import RestaurantListItem from "./RestaurantListItem";

const RestaurantList = ({}) => {
  const { data: restaurants, isLoading, isError } = useFetchRestaurants();

  if (isLoading) {
    return (
      <ul className="p-4">
        {[...Array(10)].map((_, i) => (
          <li
            key={i}
            className="animate-pulse flex justify-between p-2 border-b border-b-gray-200"
          >
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-300 rounded w-40"></div>
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
    <ul className="p-4">
      {restaurants?.map((restaurant: RestaurantType) => {
        const { id } = restaurant || {};
        return (
          <RestaurantListItem
            key={`admin-restaurant-${id}`}
            restaurant={restaurant}
          />
        );
      })}
    </ul>
  );
};

export default RestaurantList;
