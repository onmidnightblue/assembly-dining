import { InnerInput } from "@components/common";
import { ContentItem } from "@types";

interface Props {
  contents: ContentItem[][];
  updatingField: string | null;
  errorField: string | null;
  errorMessage: string | null;
  saveToSupabase: (column: string, value: string) => void;
}

const EditComponent = ({
  contents,
  updatingField,
  errorField,
  errorMessage,
  saveToSupabase,
}: Props) =>
  contents.map((content, rowindex) => (
    <div key={rowindex} className="flex mb-1 text-gray-600">
      {content.map((item, colIndex) => {
        const { key, data, label, width, selectedOptions } = item || {};
        const isUpdating = updatingField === key;
        const isFailed = errorField === key;
        return (
          <div
            key={`edit-${key}-${colIndex}`}
            className={`${colIndex < content.length - 1 && S_DOT} 
       `}
            style={{ flex: width || 1 }}
          >
            {key === "status_number" ? (
              <select
                defaultValue={data === "영업중" ? "01" : "02"}
                className="w-full text-sm outline-none cursor-pointer"
                onChange={(e) => saveToSupabase(key, e.target.value)}
              >
                {selectedOptions?.map(([optionValue, optionLabel]) => (
                  <option
                    key={`edit-view-${key}-${optionValue}`}
                    value={optionValue}
                  >
                    {optionLabel}
                  </option>
                ))}
              </select>
            ) : (
              <InnerInput
                placeholder={label}
                defaultValue={data || ""}
                loading={isUpdating}
                error={isFailed ? errorMessage : ""}
                onChange={(e) => {
                  if (key) saveToSupabase(key, e.target.value);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  ));

// css
const S_DOT =
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-1/2 after:-right-2 after:-translate-y-1/2 after:rounded-full after:bg-gray-400";

export default EditComponent;
