import { DAY_LABELS } from "@constants";
import { OperatingHourType } from "@types";

export const getOperatingHoursText = (hours: OperatingHourType[]) => {
  if (!hours || hours.length === 0) return "";

  const dayMap = new Map<number, string>();
  hours.forEach((oh) => {
    let text = "휴무";
    if (!oh.is_off && oh.open_time) {
      const open = oh.open_time.substring(0, 5);
      const close = oh.close_time?.substring(0, 5) || "";
      const lastOrder = oh.last_order?.substring(0, 5);
      text = `${open}~${close}${lastOrder ? ` (주문마감 ${lastOrder})` : ""}`;
    }
    dayMap.set(oh.day_of_week, text);
  });

  const allTimes = Array.from(dayMap.values());
  if (allTimes.length === 7 && allTimes.every((t) => t === allTimes[0])) {
    return `매일 ${allTimes[0]}`;
  }

  const result: string[] = [];
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];

  let i = 0;
  while (i < dayOrder.length) {
    const startDay = dayOrder[i];
    const currentTime = dayMap.get(startDay);

    if (currentTime === undefined) {
      i++;
      continue;
    }

    const group: number[] = [startDay];
    let j = i + 1;

    while (j < dayOrder.length) {
      const nextDay = dayOrder[j];
      const nextTime = dayMap.get(nextDay);
      if (nextTime !== currentTime) break;
      if (dayOrder[j - 1] === 5 && nextDay === 6) break;
      group.push(nextDay);
      j++;
    }

    const dayText = formatDayText(group);
    result.push(`${dayText} ${currentTime}`);
    i = j;
  }

  return result.join(" / ");
};

const formatDayText = (days: number[]) => {
  const getLabel = (dbDay: number) => {
    const labelIdx = dbDay === 0 ? 6 : dbDay - 1;
    return DAY_LABELS[labelIdx];
  };
  if (days.includes(6) && days.includes(0)) return "주말";
  if (days.length === 5 && [1, 2, 3, 4, 5].every((d) => days.includes(d)))
    return "평일";
  if (days.length === 1) return getLabel(days[0]);
  if (days.length === 2) return days.map(getLabel).join("");
  return `${getLabel(days[0])}~${getLabel(days[days.length - 1])}`;
};
