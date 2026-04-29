import { OperatingHourType, RestaurantType, SupabaseValue } from "@types";
import EditOperatingHour from "./EditOperatingHour";
import EditBasicInfo from "./EditBasicInfo";

interface Props {
  restaurant: RestaurantType;
  errorMessage: string | null;
  errorId: string | number | null | undefined;
  fieldKey?: string | null;
  saveToSupabase: (updateData: Record<string, SupabaseValue>) => void;
  saveOperatingHours: (payload: {
    id: string | number;
    dayOfWeek: number;
    data: Partial<OperatingHourType>;
  }) => void;
}

const EditComponent = ({
  restaurant,
  errorId,
  fieldKey,
  errorMessage,
  saveToSupabase,
  saveOperatingHours,
}: Props) => {
  const handlePaste = async (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData("text");
    const xMatch = pasteData.match(/[xX]\s*[::]?\s*([0-9.]+)/);
    const yMatch = pasteData.match(/[yY]\s*[::]?\s*([0-9.]+)/);
    if (xMatch && yMatch) {
      e.preventDefault();
      saveToSupabase({
        map_x: xMatch[1],
        map_y: yMatch[1],
      });
    }
  };

  return (
    <div onPaste={handlePaste} className="flex flex-col gap-2">
      <EditBasicInfo
        restaurant={restaurant}
        errorId={errorId}
        errorMessage={errorMessage}
        saveToSupabase={saveToSupabase}
      />
      <EditOperatingHour
        restaurant={restaurant}
        errorId={errorId}
        fieldKey={fieldKey}
        errorMessage={errorMessage}
        saveOperatingHours={saveOperatingHours}
      />
    </div>
  );
};

export default EditComponent;
