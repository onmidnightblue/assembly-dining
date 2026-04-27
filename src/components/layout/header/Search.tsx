import { useEffect, useState } from "react";
import { SearchIcon } from "@assets";
import { KEYWORD_SUGGESTIONS } from "@constants";
import { useRestaurantStore } from "@store";

const Search = () => {
  const { setSearchTerm } = useRestaurantStore();

  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestionIdx, setSuggestionIdx] = useState(0);

  useEffect(() => {
    if (isFocused || inputValue) return;

    const interval = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % KEYWORD_SUGGESTIONS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isFocused, inputValue]);

  return (
    <div className="relative h-10 mt-4">
      <label
        htmlFor="search-input"
        className="absolute -translate-y-1/2 top-1/2 left-2"
      >
        <SearchIcon className="size-5" />
      </label>
      {!inputValue && (
        <div
          className={`absolute left-9 top-0 h-full w-full pointer-events-none transition-all duration-300
     ${isFocused ? "opacity-0 -translate-y-2" : "opacity-100"}`}
        >
          <div
            key={suggestionIdx}
            className={`absolute inset-0 flex items-center text-gray-300 transition duration-300`}
          >
            {KEYWORD_SUGGESTIONS[suggestionIdx]}
          </div>
        </div>
      )}
      <input
        type="text"
        id="search-input"
        value={inputValue}
        className="w-full h-full p-2 pl-8 transition duration-300 border border-gray-300 outline-none hover:border-black"
        placeholder=""
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSearchTerm(e.target.value);
        }}
      />
    </div>
  );
};

export default Search;
