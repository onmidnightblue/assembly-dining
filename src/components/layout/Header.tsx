"use client";

import { useState } from "react";
import Clock from "./header/Clock";
import Search from "./header/Search";
import { FilterIcon } from "@/src/assets/svgs";

const Header = () => {
  const [isOpenPanel, setIsOpenPanel] = useState(false);

  const togglePanelHandler = () => {
    setIsOpenPanel((prev) => !prev);
  };

  return (
    <>
      <header className="grid sm:grid-cols-[max-content_1fr] p-4 fixed top-0 left-0 w-full z-20 pointer-events-none">
        <div className="bg-white border p-4 pointer-events-auto transition-all duration-300 w-full sm:w-fit flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-4xl font-paperozi">국회밥안</h1>
            <div
              className="flex items-center border border-gray-300 p-1 hover:border-black transition duration-300 cursor-pointer"
              onClick={togglePanelHandler}
            >
              <FilterIcon />
            </div>
          </div>
          <Search />
        </div>
        <div className="overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out bg-white pointer-events-auto p-4 ${
              isOpenPanel
                ? "w-full opacity-100 translate-x-0"
                : "w-0 opacity-0 -translate-x-10 invisible sm:visible"
            }
          `}
          >
            <div className="whitespace-nowrap">panel</div>
          </div>
        </div>
      </header>
      <aside className="pointer-events-none p-4 m-4 bg-white z-10 h-fit hidden sm:block fixed right-0 top-0 select-none">
        <Clock />
      </aside>
    </>
  );
};

export default Header;
