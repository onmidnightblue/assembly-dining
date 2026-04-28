import { InnerInput } from "@components/common";
import { DAY_LABELS } from "@constants";
import { RestaurantListItemType, OperatingHourType } from "@types";
import { useMemo } from "react";

interface Props {
  contents: RestaurantListItemType[][];
  operatingHours: OperatingHourType[];
  errorMessage: string | null;
  errorId: string | number | null;
  saveToSupabase: (updateData: Record<string, string>) => void;
  saveOperatingHours: (payload: {
    id: number;
    data: Partial<OperatingHourType>;
  }) => void;
  saveOperatingHoursDirect: (payload: {
    id: number;
    data: Partial<OperatingHourType>;
  }) => void;
}

const EditComponent = ({
  contents,
  operatingHours,
  errorId,
  errorMessage,
  saveToSupabase,
  saveOperatingHours,
  saveOperatingHoursDirect,
}: Props) => {
  const TIME_FIELDS = [
    { key: "open_time", label: "Open", placeholder: "11:00" },
    { key: "close_time", label: "Close", placeholder: "20:00" },
    { key: "last_order", label: "Last Order", placeholder: "19:30" },
    { key: "break_start", label: "Break Start", placeholder: "15:00" },
    { key: "break_end", label: "Break End", placeholder: "17:00" },
  ] as const;
  const timeValidator = (val: string) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);

  const displayHours = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, i) =>
        operatingHours.find((oh) => oh.day_of_week === i) ||
        ({ id: i, day_of_week: i, is_off: false } as OperatingHourType)
    );
  }, [operatingHours]);

  const toggleOff = (oh: OperatingHourType) => {
    saveOperatingHoursDirect({
      id: oh.id,
      data: {
        is_off: !oh.is_off,
        day_of_week: oh.day_of_week,
        open_time: null,
        close_time: null,
        break_start: null,
        break_end: null,
        last_order: null,
      },
    });
  };

  const handleCopyAbove = (index: number) => {
    if (index === 0) return;
    const prev = displayHours[index - 1];
    const curr = displayHours[index];
    saveOperatingHoursDirect({
      id: curr.id,
      data: {
        is_off: prev.is_off ?? false,
        day_of_week: curr.day_of_week,
        open_time: prev.open_time,
        close_time: prev.close_time,
        break_start: prev.break_start,
        break_end: prev.break_end,
        last_order: prev.last_order,
      },
    });
  };

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
      {contents.map((content, rowindex) => (
        <div key={rowindex} className="flex">
          {content.map((item, colIndex) => {
            const {
              key,
              data,
              label,
              width,
              selectedOptions = [],
            } = item || {};
            const isFailed = errorId === key;
            if (key === "operating_hours") return;
            return (
              <div
                key={`edit-${key}-${colIndex}`}
                className={`${colIndex < content.length - 1 && S_DOT} 
       `}
                style={{ flex: width || 1 }}
              >
                {key === "status_number" ||
                key === "is_visible" ||
                key === "has_room" ? (
                  <select
                    value={String(data ?? selectedOptions?.[0]?.[0])}
                    className="w-full text-sm bg-transparent outline-none cursor-pointer"
                    onChange={(e) => saveToSupabase({ [key]: e.target.value })}
                  >
                    {selectedOptions?.map(([optionValue, optionLabel]) => (
                      <option
                        key={`edit-view-${key}-${optionValue}`}
                        value={String(optionValue)}
                      >
                        {optionLabel}
                      </option>
                    ))}
                  </select>
                ) : (
                  <InnerInput
                    placeholder={label}
                    value={String(data || "")}
                    error={isFailed ? errorMessage : ""}
                    onChange={(value) => {
                      if (key) saveToSupabase({ [key]: value });
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className="grid gap-2">
        {displayHours
          .sort((a, b) => a.day_of_week - b.day_of_week)
          .map((oh, index) => (
            <div
              key={`operating-row-${oh.day_of_week}`}
              className="grid grid-cols-[20px_7fr_1fr] gap-2 items-end"
            >
              <div className={`text-sm ${getDayColor(oh.day_of_week)}`}>
                {DAY_LABELS[oh.day_of_week]}
              </div>
              {oh.is_off ? (
                <div className="w-full text-center text-error bg-red-50">
                  CLOSED
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(5,1fr)] items-end gap-2">
                  {TIME_FIELDS.map((field) => {
                    const isMatch = String(errorId) === String(oh.id);
                    return (
                      <div
                        key={`${oh.id}-${field.key}`}
                        className="flex flex-col"
                      >
                        <span className="text-[9px] text-gray-400 uppercase">
                          {field.label}
                        </span>
                        <InnerInput
                          type="text"
                          key={`input-${oh.id}-${field.key}`}
                          value={oh[field.key] || ""}
                          validate={timeValidator}
                          placeholder={field.placeholder}
                          error={isMatch ? errorMessage : ""}
                          onChange={(value) => {
                            saveOperatingHours({
                              id: oh.id,
                              data: {
                                [field.key]: value,
                                day_of_week: oh.day_of_week,
                              },
                            });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-2 items-center text-blue-400">
                <div
                  onClick={() => toggleOff(oh)}
                  className={`text-sm cursor-pointer 
                    ${oh.is_off ? "text-error" : ""}
                    `}
                >
                  {oh.is_off ? "ON" : "OFF"}
                </div>
                {index > 0 && !oh.is_off && !displayHours[index - 1].is_off && (
                  <div
                    onClick={() => handleCopyAbove(index)}
                    className="text-sm cursor-pointer"
                  >
                    SAME
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// css
const S_DOT =
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-1/2 after:-right-2 after:-translate-y-1/2 after:rounded-full after:bg-gray-400";
const getDayColor = (day: number) => {
  if (day === 5) return "text-blue-500";
  if (day === 6) return "text-red-500";
  return "text-gray-600";
};

export default EditComponent;
