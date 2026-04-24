import ViewComponent from "@admin/restaurantListItem/ViewComponent";
import { STATUS_LABELS } from "@constants";
import { ContentItem, RestaurantType } from "@types";

interface Props {
  selectedRestaurant: RestaurantType;
  onClose: () => void;
}

const MapDetail = ({ selectedRestaurant, onClose }: Props) => {
  const { name, category, phone, land_address, status_number } =
    selectedRestaurant || {};

  const contents: ContentItem[][] = [
    [
      { data: category, label: "카테고리" },
      { data: phone, label: "전화번호" },
    ],
    [
      {
        label: "상태",
        data: STATUS_LABELS[status_number],
        css: status_number === "01" ? "" : "text-error",
      },
      { data: land_address, label: "주소" },
    ],
  ];

  const handleOpenNaverMap = (name: string) => {
    const query = encodeURIComponent(`여의도동 ${name}`);
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  return (
    <div className="w-[calc(100%-2rem)] absolute bottom-4 left-1/2 -translate-x-1/2 z-100 bg-white rounded-4xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-8 animate-slide-up">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-2xl font-extrabold leading-tight">{name}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-foreground-muted "
        >
          닫기
        </button>
      </div>
      <ViewComponent contents={contents} />
      <div
        className="text-green-700 cursor-pointer"
        onClick={() => handleOpenNaverMap(name)}
      >
        네이버지도
      </div>
    </div>
  );
};

export default MapDetail;
