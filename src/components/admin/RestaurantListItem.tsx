import { useState } from "react";
import { useRestaurants } from "@hooks";
import { ContentItem, RestaurantType } from "@types";
import EditComponent from "./restaurantListItem/EditComponent";
import ViewComponent from "./restaurantListItem/ViewComponent";

interface Props {
  restaurant: RestaurantType;
}

const RestaurantListItem = ({ restaurant }: Props) => {
  const {
    id,
    name,
    category,
    land_address,
    status_number,
    phone,
    map_x,
    map_y,
  } = restaurant || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const { saveToSupabase, errorField, updatingField, errorMessage } =
    useRestaurants(id);

  const contents: ContentItem[][] = [
    [
      { data: category, label: "카테고리", key: "category", width: 2 },
      { data: phone, label: "전화번호", key: "phone", width: 8 },
    ],
    [
      {
        label: "상태",
        data: status_number === "01" ? "영업중" : "폐업",
        css: status_number === "02" ? "text-red-600" : "",
        key: "status_number",
        selectedOptions: [
          ["01", "영업중"],
          ["02", "폐업"],
        ],
        width: 2,
      },
      { data: land_address, label: "주소", key: "land_address", width: 8 },
    ],
    [
      { data: map_x, label: "x좌표", key: "map_x", width: 5 },
      { data: map_y, label: "y좌표", key: "map_y", width: 5 },
    ],
  ];

  const handleOpenNaverMap = (name: string) => {
    const query = encodeURIComponent(name);
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  return (
    <li className="relative py-2 border-b border-b-gray-200">
      <div className="flex flex-col">
        <div
          className="font-bold cursor-pointer"
          onClick={() => handleOpenNaverMap(name)}
        >
          {name}
        </div>
        {isEditMode ? (
          <EditComponent
            contents={contents}
            updatingField={updatingField}
            errorField={errorField}
            errorMessage={errorMessage}
            saveToSupabase={saveToSupabase}
          />
        ) : (
          <ViewComponent contents={contents} />
        )}
        {isEditMode && (
          <div className="mt-4 text-xs text-blue-400">ID: {id}</div>
        )}
      </div>
      <div
        className={`absolute top-2 right-0 text-right px-1 text-sm transition duration-300 border border-white rounded cursor-pointer hover:border-black ${
          isEditMode ? "text-blue-400" : "text-black"
        } select-none`}
        onClick={() => setIsEditMode((prev) => !prev)}
      >
        {isEditMode ? "VIEW" : "EDIT"}
      </div>
    </li>
  );
};

export default RestaurantListItem;
