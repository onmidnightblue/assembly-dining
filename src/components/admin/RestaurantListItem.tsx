import { RestaurantType } from "@types";
import { useModal } from "@hooks";
import ModifyModal from "./ModifyModal";

interface Props {
  restaurant: RestaurantType;
}

const RestaurantListItem = ({ restaurant }: Props) => {
  const { name, category, land_address, map_x, map_y } = restaurant || {};
  const { openModal, ModalPortal } = useModal();

  return (
    <>
      <ModifyModal restaurant={restaurant} ModalPortal={ModalPortal} />
      <li
        className="flex flex-col p-2 border-b cursor-pointer border-b-gray-200 hover:bg-gray-200"
        onClick={openModal}
      >
        <div className="font-bold">{name}</div>
        <div className="flex flex-wrap text-sm">
          <div className={COMMON_STYLE}>{category}</div>
          <div>{land_address}</div>
        </div>
        {map_x && map_y && (
          <div className="flex flex-wrap text-sm">
            <div className={COMMON_STYLE}>{map_x}</div>
            <div>{map_y}</div>
          </div>
        )}
      </li>
    </>
  );
};

// css
const COMMON_STYLE =
  "relative mr-3 after:content-[''] after:absolute after:w-0.5 after:h-0.5 after:top-1/2 after:-right-2 after:-translate-y-1/2 after:rounded-full after:bg-gray-400";

export default RestaurantListItem;
