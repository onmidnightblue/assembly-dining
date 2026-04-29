import { InnerInput, Select } from "@components/common";
import { RestaurantType, SupabaseValue } from "@types";

interface Props {
  restaurant: RestaurantType;
  errorId: string | number | null | undefined;
  errorMessage: string | null;
  saveToSupabase: (data: Record<string, SupabaseValue>) => void;
}

const EditBasicInfo = ({
  restaurant,
  errorId,
  errorMessage,
  saveToSupabase,
}: Props) => {
  const STATUS_OPTIONS: [string, string][] = [
    ["01", "운영"],
    ["03", "폐업"],
  ];
  const VISIBLE_OPTIONS: [string, string][] = [
    ["true", "표시함"],
    ["false", "표시안함"],
  ];
  const ROOM_OPTIONS: [string, string][] = [
    ["true", "룸보유"],
    ["false", "룸없음"],
  ];

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <Select
            options={STATUS_OPTIONS}
            value={restaurant.status_number}
            onChange={(v) => saveToSupabase({ status_number: v })}
            error={errorId === "status_number" ? errorMessage : null}
          />
          <Select
            options={VISIBLE_OPTIONS}
            value={String(restaurant.is_visible)}
            onChange={(v) => saveToSupabase({ is_visible: v === "true" })}
            error={errorId === "is_visible" ? errorMessage : null}
          />
          <Select
            options={ROOM_OPTIONS}
            value={String(restaurant.has_room)}
            onChange={(v) => saveToSupabase({ has_room: v === "true" })}
            error={errorId === "has_room" ? errorMessage : null}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <InnerInput
            label="카테고리"
            value={restaurant.category || ""}
            onChange={(v) => saveToSupabase({ category: v })}
            error={errorId === "category" ? errorMessage : null}
          />
          <InnerInput
            label="전화번호"
            value={restaurant.phone || ""}
            onChange={(v) => saveToSupabase({ phone: v })}
            error={errorId === "phone" ? errorMessage : null}
          />
        </div>
        <InnerInput
          label="주소"
          value={restaurant.land_address || ""}
          onChange={(v) => saveToSupabase({ land_address: v })}
          error={errorId === "land_address" ? errorMessage : null}
        />
        <InnerInput
          label="키워드"
          value={restaurant.keyword || ""}
          onChange={(v) => saveToSupabase({ keyword: v })}
          error={errorId === "keyword" ? errorMessage : null}
        />
        <div className="grid grid-cols-2 gap-2">
          <InnerInput
            label="X좌표"
            value={String(restaurant.map_x || "")}
            onChange={(v) => saveToSupabase({ map_x: v })}
            error={errorId === "map_x" ? errorMessage : null}
          />
          <InnerInput
            label="Y좌표"
            value={String(restaurant.map_y || "")}
            onChange={(v) => saveToSupabase({ map_y: v })}
            error={errorId === "map_y" ? errorMessage : null}
          />
        </div>
      </div>
    </div>
  );
};

export default EditBasicInfo;
