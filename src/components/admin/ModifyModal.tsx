import { ReactNode, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { RestaurantType } from "@types";
import { Input } from "@components/common";
import { useRestaurants } from "@hooks";

interface Props {
  restaurant: RestaurantType;
  ModalPortal: React.ComponentType<{ title: string; children: ReactNode }>;
}

const ModifyModal = ({ restaurant, ModalPortal }: Props) => {
  const {
    id,
    name,
    category,
    phone,
    road_address,
    land_address,
    map_x,
    map_y,
    created_at,
  } = restaurant || {};
  const { updatingField, isError, saveToSupabase } = useRestaurants(id);

  const INPUT_FIELDS = [
    { input_id: "category", label: "구분", value: category },
    { input_id: "phone", label: "전화번호", value: phone },
    { input_id: "road_address", label: "도로명주소", value: road_address },
    { input_id: "land_address", label: "지번주소", value: land_address },
    { input_id: "map_x", label: "X", value: map_x },
    { input_id: "map_y", label: "Y", value: map_y },
  ];

  return (
    <ModalPortal title={name}>
      <form className="flex flex-col gap-4">
        {INPUT_FIELDS.map((field) => (
          <Input
            key={field.label}
            label={field.label}
            defaultValue={field.value}
            error=""
            loading={updatingField === field.input_id}
            placeholder=""
            onChange={(e) => saveToSupabase(field.input_id, e.target.value)}
          />
        ))}
      </form>
      <div className="mt-6 text-sm">
        <p>ID: {id}</p>
        <p>CRATED: {created_at}</p>
      </div>
    </ModalPortal>
  );
};

export default ModifyModal;
