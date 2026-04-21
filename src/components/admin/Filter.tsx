import { SearchIcon } from "@/src/assets/svgs";

const Filter = ({}) => {
  return (
    <div className="p-4 relative">
      <label
        htmlFor="admin-search-input"
        className="absolute top-1/2 -translate-y-1/2 left-6 h-f"
      >
        <SearchIcon />
      </label>
      <input
        type="text"
        id="admin-search-input"
        className="w-full h-full border border-gray-300 focus:outline-none focus:ring-1 focus:border-transparent hover:border-black transition duration-300 p-2 pl-10"
        placeholder="검색어를 입력하세요."
      />
    </div>
  );
};

export default Filter;
