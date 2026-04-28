import { SearchIcon } from "@assets";
import {
  COORD_LABELS,
  COORD_CYCLE,
  SORT_LABELS,
  SORT_CYCLE,
  STATUS_LABELS,
  STATUS_CYCLE,
  VISIBLE_LABELS,
  VISIBLE_CYCLE,
} from "@constants";
import { useRestaurantStore } from "@store";

const Filter = ({}) => {
  const {
    sortOrder,
    coordOrder,
    statusOrder,
    visibleOrder,
    setFilter,
    cycleFilter,
  } = useRestaurantStore();

  const toggles = [
    {
      label: STATUS_LABELS[statusOrder],
      key: "statusOrder",
      cycle: STATUS_CYCLE,
    },
    {
      label: VISIBLE_LABELS[visibleOrder],
      key: "visibleOrder",
      cycle: VISIBLE_CYCLE,
    },
    { label: COORD_LABELS[coordOrder], key: "coordOrder", cycle: COORD_CYCLE },
    { label: SORT_LABELS[sortOrder], key: "sortOrder", cycle: SORT_CYCLE },
  ] as const;

  return (
    <div className="grid grid-cols-[1fr_repeat(4,80px)] items-center gap-4 px-4 pt-4">
      <div className="relative">
        <label
          htmlFor="admin-search-input"
          className="absolute -translate-y-1/2 top-1/2 left-2"
        >
          <SearchIcon />
        </label>
        <input
          type="text"
          id="admin-search-input"
          className="w-full h-full p-2 pl-10 transition duration-300 border border-gray-300 focus:outline-none focus:ring-1 focus:border-transparent hover:border-black"
          placeholder="검색어를 입력하세요."
          onChange={(e) => setFilter("searchTerm", e.target.value)}
        />
      </div>
      {toggles.map((toggle, index) => {
        const { label, key, cycle } = toggle || {};
        return (
          <div
            key={index}
            className="text-center transition duration-300 cursor-pointer select-none text-foreground hover:text-blue-400 "
            onClick={() => cycleFilter(key, cycle)}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default Filter;
