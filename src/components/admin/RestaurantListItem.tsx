import { RestaurantType } from "@/src/types";
import { useState } from "react";

interface Props {
  restaurant: RestaurantType;
}

const RestaurantListItem = ({ restaurant }: Props) => {
  const { name, category, land_address, map_x, map_y } = restaurant || {};
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      {isOpenModal && (
        <div className="fixed w-3xl h-8 top-1/2 left-1/2">modal</div>
      )}
      <li
        className="flex justify-between gap-2 items-end p-2 border-b border-b-gray-200 cursor-pointer hover:bg-gray-200"
        onClick={() => setIsOpenModal((prev) => !prev)}
      >
        <div>
          <div className="text-sm text-gray-400 border rounded-sm inline-block px-1 mb-1">
            {category}
          </div>
          <div className="font-bold">{name}</div>
          <div>{land_address}</div>
        </div>
        <div className="text-right">
          <div>{map_x}</div>
          <div>{map_y}</div>
        </div>
      </li>
    </>
  );
};

export default RestaurantListItem;
