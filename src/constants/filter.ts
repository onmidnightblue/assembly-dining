export const SORT_LABELS: Record<string, string> = {
  address_asc: "주소 ↑",
  address_desc: "주소 ↓",
  name_asc: "이름 ↑",
  name_desc: "이름 ↓",
  category_asc: "카테고리 ↑",
  category_desc: "카테고리 ↓",
  coord_asc: "좌표 ↑",
  coord_desc: "좌표 ↓",
};

export const OPERATING_LABELS: Record<string, string> = {
  all: "전체시간",
  with_operating: "시간설정",
  no_operating: "시간미설정",
};

export const STATUS_LABELS: Record<string, string> = {
  "01": "운영",
  "03": "폐업",
  all: "전체상태",
};

export const VISIBLE_LABELS: Record<string, string> = {
  TRUE: "표시함",
  FALSE: "표시안함",
  all: "전체표시",
};

export const STATUS_CYCLE = Object.keys(
  STATUS_LABELS
) as (keyof typeof STATUS_LABELS)[];
export const OPERATING_CYCLE = Object.keys(
  OPERATING_LABELS
) as (keyof typeof OPERATING_LABELS)[];
export const VISIBLE_CYCLE = Object.keys(
  VISIBLE_LABELS
) as (keyof typeof VISIBLE_LABELS)[];
export const SORT_CYCLE = Object.keys(
  SORT_LABELS
) as (keyof typeof SORT_LABELS)[];

export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
