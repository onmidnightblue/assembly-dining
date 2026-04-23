import { ContentItem } from "@types";

interface Props {
  contents: ContentItem[][];
}

const ViewComponent = ({ contents }: Props) => {
  return (
    <>
      {contents.map((content, rowindex) => (
        <div key={rowindex} className="flex text-gray-600">
          {content.map((item, colIndex) => {
            const { data, label, key, css } = item || {};
            return (
              <div
                key={`edit-${key}-${colIndex}`}
                className={`w-fit ${colIndex < content.length - 1 && S_DOT} 
         ${css} ${data ? "text-black" : "text-gray-400"}`}
              >
                {data || label}
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
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-1/2 after:-right-2 after:-translate-y-1/2 after:rounded-full after:bg-gray-400";

export default ViewComponent;
