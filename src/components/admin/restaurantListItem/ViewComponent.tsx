import { RestaurantListItemType } from "@types";

interface Props {
  contents: RestaurantListItemType[][];
}

const ViewComponent = ({ contents }: Props) => {
  return (
    <>
      {contents.map((content, rowindex) => (
        <div key={rowindex} className="flex">
          {content.map((item, colIndex) => {
            const { data, label, key, css, selectedOptions } = item || {};
            const textColor = css
              ? css
              : data
              ? "text-foreground"
              : "text-placeholder";

            const displayValue = (() => {
              if (selectedOptions && data !== undefined) {
                const option = selectedOptions.find(
                  ([val]) => String(val) === String(data)
                );
                return option ? option[1] : data;
              }
              return data || label;
            })();

            return (
              <div
                key={`edit-${key}-${colIndex}`}
                className={`w-fit ${
                  colIndex < content.length - 1 && S_DOT
                } ${textColor} break-keep`}
              >
                {displayValue}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

// css
const S_DOT =
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-[10px] after:-right-2 after:rounded-full after:bg-gray-400";

export default ViewComponent;
