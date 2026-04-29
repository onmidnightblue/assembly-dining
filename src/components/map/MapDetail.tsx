import ViewComponent from "@admin/restaurantListItem/ViewComponent";
import { STATUS_LABELS } from "@constants";
import { RestaurantListItemType, RestaurantType } from "@types";
import { getOperatingHoursText } from "@utils";

interface Props {
  selectedRestaurant: RestaurantType;
  onClose: () => void;
}

const MapDetail = ({ selectedRestaurant, onClose }: Props) => {
  const {
    name,
    status_number,
    has_room,
    category,
    phone,
    land_address,
    keyword,
    operating_hours,
  } = selectedRestaurant || {};

  const getHighlightColor = (isError: boolean) =>
    isError ? "text-error" : "text-foreground";

  const handleOpenNaverMap = (name: string) => {
    const query = encodeURIComponent(`여의도 ${name}`);
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  const OperatingArray = operating_hours
    ? getOperatingHoursText(operating_hours).split(" / ")
    : [];

  return (
    <div className="w-[calc(100%-2rem)] absolute bottom-4 left-1/2 -translate-x-1/2 z-100 bg-white rounded-4xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-8 animate-slide-up">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-2xl font-extrabold leading-tight">
          {name}
          <span
            className="text-sm text-green-700 cursor-pointer font-normal ml-2"
            onClick={() => handleOpenNaverMap(name)}
          >
            NAVER
          </span>
        </h2>
        <div
          onClick={onClose}
          className="p-2 rounded-full text-foreground-muted"
        >
          닫기
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {keyword && (
          <div
            className={`${
              keyword ? "text-foreground" : "text-placeholder"
            } flex flex-wrap gap-1`}
          >
            {keyword.split(" ").map((word, index) => (
              <span
                key={`map-detail-keyword-${index}`}
                className="text-sm bg-gray-100 px-1 rounded"
              >
                {word}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center mt-4">
          {status_number !== "01" && (
            <span className={`text-error ${S_DOT}`}>폐업</span>
          )}
          <span
            className={`${
              category ? "text-foreground" : "text-placeholder"
            } ${S_DOT}`}
          >
            {category || "카테고리"}
          </span>
          <span
            className={`${
              phone ? "text-foreground" : "text-placeholder"
            } ${S_DOT}`}
          >
            {phone || "전화번호"}
          </span>
          <span className={getHighlightColor(has_room !== "true")}>
            {has_room === "true" ? "룸보유" : "룸없음"}
          </span>
        </div>
        <div className={land_address ? "text-foreground" : "text-placeholder"}>
          {land_address || "주소"}
        </div>
        <div
          className={
            OperatingArray.length ? "text-foreground" : "text-placeholder"
          }
        >
          {OperatingArray.length
            ? OperatingArray.map((item, index) => {
                const [date, time, ...rest] = item.split(" ");
                return (
                  <div
                    key={`map-detail-operation-${index}`}
                    className="flex gap-2"
                  >
                    <div className="min-w-10">{date}</div>
                    <div>{time}</div>
                    <div>{rest}</div>
                  </div>
                );
              })
            : "운영시간"}
        </div>
      </div>
    </div>
  );
};

// css
const S_DOT =
  "relative mr-4 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-[10px] after:-right-2 after:rounded-full after:bg-gray-400";

export default MapDetail;
