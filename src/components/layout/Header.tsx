"use client";

import { useState } from "react";
import Clock from "./header/Clock";
import Search from "./header/Search";
import { FilterIcon } from "@assets";
import Filter from "./header/Filter";

const Header = () => {
  const [isOpenPanel, setIsOpenPanel] = useState(false);

  const togglePanelHandler = () => {
    setIsOpenPanel((prev) => !prev);
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-20 w-full p-4 pointer-events-none grid sm:grid-cols-[max-content_1fr]">
        <div className="flex flex-col p-4 transition-all duration-500 bg-white border  border-black pointer-events-auto w-full sm:w-[400px]">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold font-paperozi">국회밥안</h1>
            <button
              onClick={togglePanelHandler}
              className={`flex items-center p-2 border border-gray-300 hover:bg-gray-50`}
            >
              <FilterIcon />
            </button>
          </div>

          <Search />

          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isOpenPanel
                ? "grid-rows-[1fr] opacity-100 mt-2"
                : "grid-rows-[0fr] opacity-0 mt-0 invisible"
            }`}
          >
            <Filter />
          </div>
        </div>
      </header>

      <aside className="fixed top-0 right-0 z-10 hidden p-4 m-4 rounded select-none bg-white/80 backdrop-blur-sm h-fit sm:block">
        <Clock />
      </aside>
    </>
  );
};

export default Header;
