import { useState } from "react";
import { useRestaurants } from "@hooks";
import { RestaurantType, SupabaseValue } from "@types";
import { SmallLoadingSpinner } from "@components/common";
import EditComponent from "./restaurantListItem/EditComponent";
import ViewComponent from "./restaurantListItem/ViewComponent";

interface Props {
  restaurant: RestaurantType;
}

const RestaurantListItem = ({ restaurant }: Props) => {
  const { id } = restaurant || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, SupabaseValue>>({});
  const {
    saveToSupabase,
    saveOperatingHours,
    errorId,
    fieldKey,
    isLoading,
    errorMessage,
  } = useRestaurants(id);

  const updateFormData = (data: Record<string, SupabaseValue>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetFormData = () => {
    setFormData({});
  };

  const hasChanges = Object.keys(formData).length > 0;

  const handleSave = async () => {
    await saveToSupabase(formData);
    resetFormData();
    setIsEditMode(false);
  };

  return (
    <li className="relative py-2 border-b border-b-gray-200">
      <div className="flex flex-col">
        {isEditMode ? (
          <EditComponent
            restaurant={{
              ...restaurant,
              ...formData,
            }}
            errorId={errorId}
            fieldKey={fieldKey}
            errorMessage={errorMessage}
            updateFormData={updateFormData}
            saveOperatingHours={saveOperatingHours}
          />
        ) : (
          <ViewComponent restaurant={restaurant} />
        )}
        {isEditMode && (
          <div className="mt-4 text-xs text-blue-400">ID: {id}</div>
        )}
      </div>
      <div className={`absolute top-2 right-0 text-right px-1 text-sm`}>
        {isEditMode ? (
          <div className="flex gap-4">
            {isLoading && <SmallLoadingSpinner />}
            {!isLoading && (
              <>
                <button
                  className="text-error disabled:text-placeholder disabled:cursor-not-allowed"
                  onClick={resetFormData}
                  disabled={!hasChanges}
                >
                  RESTORE
                </button>
                <button
                  className="text-green-600 disabled:text-placeholder disabled:cursor-not-allowed"
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  SAVE
                </button>
                <button
                  className=" text-blue-400 cursor-pointer"
                  onClick={() => setIsEditMode(false)}
                >
                  CANCEL
                </button>
              </>
            )}
          </div>
        ) : (
          <button onClick={() => setIsEditMode(true)}>EDIT</button>
        )}
      </div>
    </li>
  );
};

export default RestaurantListItem;
