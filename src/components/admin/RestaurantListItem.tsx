import { useState } from "react";
import { useRestaurants } from "@hooks";
import { RestaurantListItemType, RestaurantType } from "@types";
import EditComponent from "./restaurantListItem/EditComponent";
import ViewComponent from "./restaurantListItem/ViewComponent";
import { getOperatingHoursText } from "@utils";
import { SmallLoadingSpinner } from "@components/common";

interface Props {
  restaurant: RestaurantType;
}

const RestaurantListItem = ({ restaurant }: Props) => {
  const {
    id,
    name,
    keyword,
    category,
    land_address,
    status_number,
    phone,
    map_x,
    map_y,
    is_visible,
    has_room,
  } = restaurant || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    saveToSupabase,
    saveOperatingHours,
    saveOperatingHoursDirect,
    operatingHours,
    errorId,
    isLoading,
    errorMessage,
  } = useRestaurants(id);

  const contents: RestaurantListItemType[][] = [
    [
      {
        label: "상태",
        data: status_number || "01",
        css: status_number === "01" ? "" : "text-error",
        key: "status_number",
        selectedOptions: [
          ["01", "운영"],
          ["03", "폐업"],
        ],
        width: 2,
      },
      {
        label: "표시",
        data: is_visible || "true",
        css: is_visible === "false" ? "text-error" : "",
        key: "is_visible",
        selectedOptions: [
          ["true", "표시함"],
          ["false", "표시안함"],
        ],
        width: 2,
      },
      {
        label: "룸",
        data: has_room || "true",
        css: has_room === "false" ? "text-error" : "",
        key: "has_room",
        selectedOptions: [
          ["true", "룸보유"],
          ["false", "룸없음"],
        ],
        width: 2,
      },
    ],
    [
      { data: category, label: "치킨", key: "category", width: 2 },
      { data: phone, label: "02-1234-1234", key: "phone", width: 8 },
    ],
    [
      {
        data: land_address,
        label: "서울특별시 영등포구 여의도동 1",
        key: "land_address",
        width: 10,
      },
    ],
    [
      {
        data: keyword,
        label: "된장찌개, 파스타",
        key: "keyword",
        width: 10,
      },
    ],
    [
      { data: map_x, label: "22.80", key: "map_x", width: 5 },
      { data: map_y, label: "25.58", key: "map_y", width: 5 },
    ],
    [
      {
        data: getOperatingHoursText(operatingHours),
        label: "운영시간",
        key: "operating_hours",
      },
    ],
  ];

  const handleOpenNaverMap = (name: string) => {
    const query = encodeURIComponent(`여의도 ${name}`);
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  return (
    <li className="relative py-2 border-b border-b-gray-200">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{name}</h3>
          <span
            className="text-xs text-green-700 cursor-pointer"
            onClick={() => handleOpenNaverMap(name)}
          >
            NAVER
          </span>
        </div>
        {isEditMode ? (
          <EditComponent
            contents={contents}
            operatingHours={operatingHours}
            errorId={errorId}
            errorMessage={errorMessage}
            saveToSupabase={saveToSupabase}
            saveOperatingHours={saveOperatingHours}
            saveOperatingHoursDirect={saveOperatingHoursDirect}
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
          isEditMode ? "text-blue-400" : "text-foreground"
        } select-none`}
        onClick={() => setIsEditMode((prev) => !prev)}
      >
        {isEditMode ? (
          <>
            {isLoading && <SmallLoadingSpinner />}
            {!isLoading && "VIEW"}
          </>
        ) : (
          "EDIT"
        )}
      </div>
    </li>
  );
};

export default RestaurantListItem;
