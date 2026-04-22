import { SearchIcon } from "@assets";

const Search = () => {
  return (
    <div className="relative h-10 mt-4">
      <label
        htmlFor="search-input"
        className="absolute -translate-y-1/2 top-1/2 left-2 h-f"
      >
        <SearchIcon className="size-5" />
      </label>
      <input
        type="text"
        id="search-input"
        className="w-full h-full p-2 pl-8 transition duration-300 border border-gray-300 focus:outline-none focus:ring-1 focus:border-transparent hover:border-black"
        placeholder="부대찌개"
      />
    </div>
  );
};

export default Search;
