import { SearchIcon } from "@assets";
import { SORT_LABELS_KR } from "@constants";
import { useRestaurantStore } from "@store";

const Filter = ({}) => {
  const { sortOrder, setSortOrder, setSearchTerm } = useRestaurantStore();

  return (
    <div className="grid grid-cols-[3fr_100px] items-center gap-4 px-4 pt-4">
      <div className="relative">
        <label
          htmlFor="admin-search-input"
          className="absolute -translate-y-1/2 top-1/2 left-2 h-f"
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
      <div
        className="text-center transition duration-300 cursor-pointer hover:text-blue-400"
        onClick={() => setSortOrder()}
      >
        {SORT_LABELS_KR[sortOrder]}
      </div>
    </div>
  );
};

export default Filter;
