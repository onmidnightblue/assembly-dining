import { RestaurantType } from "@types";
import { getOperatingHoursText } from "@utils";

interface Props {
  restaurant: RestaurantType;
}

const ViewComponent = ({ restaurant }: Props) => {
  const {
    status_number,
    is_visible,
    has_room,
    category,
    phone,
    land_address,
    keyword,
    map_x,
    map_y,
    operating_hours,
  } = restaurant;

  const getHighlightColor = (isError: boolean) =>
    isError ? "text-error" : "text-foreground";

  return (
    <div>
      <div className="flex items-center">
        <span
          className={`${getHighlightColor(status_number !== "01")} ${S_DOT}`}
        >
          {status_number === "01" ? "운영" : "폐업"}
        </span>
        <span
          className={`${getHighlightColor(is_visible !== "true")} ${S_DOT}`}
        >
          {is_visible === "true" ? "표시함" : "표시안함"}
        </span>
        <span className={getHighlightColor(has_room !== "true")}>
          {has_room === "true" ? "룸보유" : "룸없음"}
        </span>
      </div>
      <div className="flex items-center">
        <span
          className={`${
            category ? "text-foreground" : "text-placeholder"
          } ${S_DOT}`}
        >
          {category || "카테고리"}
        </span>
        <span className={phone ? "text-foreground" : "text-placeholder"}>
          {phone || "전화번호"}
        </span>
      </div>
      <div className={land_address ? "text-foreground" : "text-placeholder"}>
        {land_address || "주소"}
      </div>
      <div className={keyword ? "text-foreground" : "text-placeholder"}>
        {keyword || "키워드"}
      </div>
      <div className="flex items-center">
        <span
          className={`${S_DOT} ${
            map_x ? "text-foreground" : "text-placeholder"
          }`}
        >
          {map_x || "X좌표"}
        </span>
        <span className={`${map_y ? "text-foreground" : "text-placeholder"}`}>
          {map_y || "Y좌표"}
        </span>
      </div>
      <div
        className={`${
          operating_hours?.length ? "text-foreground" : "text-placeholder"
        }`}
      >
        {getOperatingHoursText(operating_hours) || "운영시간"}
      </div>
    </div>
  );
};

// css
const S_DOT =
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-[10px] after:-right-2 after:rounded-full after:bg-gray-400";

export default ViewComponent;
