import { SearchIcon } from "@assets";
import {
  COORD_LABELS,
  SORT_LABELS,
  STATUS_LABELS,
  VISIBLE_LABELS,
} from "@constants";
import { useRestaurantStore } from "@store";

const Filter = ({}) => {
  const {
    sortOrder,
    setSortOrder,
    setSearchTerm,
    coordOrder,
    setCoordOrder,
    statusOrder,
    setStatusOrder,
    visibleOrder,
    setVisibleOrder,
  } = useRestaurantStore();

  const toggles = [
    { label: STATUS_LABELS[statusOrder], action: setStatusOrder },
    { label: VISIBLE_LABELS[visibleOrder], action: setVisibleOrder },
    { label: COORD_LABELS[coordOrder], action: setCoordOrder },
    { label: SORT_LABELS[sortOrder], action: setSortOrder },
  ];

  return (
    <div className="grid grid-cols-[1fr_repeat(4,100px)] items-center gap-4 px-4 pt-4">
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {toggles.map((toggle, index) => {
        const { label, action } = toggle || {};
        return (
          <div
            key={index}
            className="text-center transition duration-300 cursor-pointer select-none text-foreground hover:text-blue-400 "
            onClick={() => action()}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default Filter;
