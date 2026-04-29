import { useState } from "react";
import { useRestaurants } from "@hooks";
import { RestaurantType } from "@types";
import { SmallLoadingSpinner } from "@components/common";
import EditComponent from "./restaurantListItem/EditComponent";
import ViewComponent from "./restaurantListItem/ViewComponent";

interface Props {
  restaurant: RestaurantType;
}

const RestaurantListItem = ({ restaurant }: Props) => {
  const { id, name } = restaurant || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    saveToSupabase,
    saveOperatingHours,
    errorId,
    fieldKey,
    isLoading,
    errorMessage,
  } = useRestaurants(id);

  const handleOpenNaverMap = (name: string) => {
    const query = encodeURIComponent(`여의도 ${name}`);
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  return (
    <li className="relative py-2 border-b border-b-gray-200">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{name}</h3>
          <span
            className="text-xs text-green-700 cursor-pointer"
            onClick={() => handleOpenNaverMap(name)}
          >
            NAVER
          </span>
        </div>
        {isEditMode ? (
          <EditComponent
            restaurant={restaurant}
            errorId={errorId}
            fieldKey={fieldKey}
            errorMessage={errorMessage}
            saveToSupabase={saveToSupabase}
            saveOperatingHours={saveOperatingHours}
          />
        ) : (
          <ViewComponent restaurant={restaurant} />
        )}
        {isEditMode && (
          <div className="mt-4 text-xs text-blue-400">ID: {id}</div>
        )}
      </div>
      <div
        className={`absolute top-2 right-0 text-right px-1 text-sm transition duration-300 border border-white rounded cursor-pointer hover:border-black ${
          isEditMode ? "text-blue-400" : "text-foreground"
        } select-none`}
        onClick={() => setIsEditMode((prev) => !prev)}
      >
        {isEditMode ? (
          <>
            {isLoading && <SmallLoadingSpinner />}
            {!isLoading && "VIEW"}
          </>
        ) : (
          "EDIT"
        )}
      </div>
    </li>
  );
};

export default RestaurantListItem;
