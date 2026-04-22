import { useRestaurantStore } from "@store";

const Filter = ({}) => {
  const { categories, selectedCategories, toggleCategory } = useRestaurantStore(
    (state) => state
  );

  return (
    <div className="flex p-2 pt-0 mt-2 overflow-hidden">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600">구분</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategories.includes(category);
            return (
              <div
                key={`panel-${category}`}
                onClick={() => toggleCategory(category)}
                className={`px-2 bg-gray-100 rounded transition cursor-pointer
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
                `}
              >
                {category}
              </div>
            );
          })}
        </div>
      </div>

      {/* 룸 유무 */}
      {/* 지금 먹을 수 있는 곳 */}
    </div>
  );
};

export default Filter;
