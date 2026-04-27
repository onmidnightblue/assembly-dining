import { InnerInput } from "@components/common";
import { ContentItem } from "@types";

interface Props {
  contents: ContentItem[][];
  errorField: string | null;
  errorMessage: string | null;
  saveToSupabase: (updateData: Record<string, string>) => void;
}

const EditComponent = ({
  contents,
  errorField,
  errorMessage,
  saveToSupabase,
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
    <div onPaste={handlePaste}>
      {contents.map((content, rowindex) => (
        <div key={rowindex} className="flex mb-1">
          {content.map((item, colIndex) => {
            const {
              key,
              data,
              label,
              width,
              selectedOptions = [],
            } = item || {};
            const isFailed = errorField === key;
            return (
              <div
                key={`edit-${key}-${colIndex}`}
                className={`${colIndex < content.length - 1 && S_DOT} 
       `}
                style={{ flex: width || 1 }}
              >
                {key === "status_number" || key === "is_visible" ? (
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
    </div>
  );
};

// css
const S_DOT =
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-1/2 after:-right-2 after:-translate-y-1/2 after:rounded-full after:bg-gray-400";

export default EditComponent;
