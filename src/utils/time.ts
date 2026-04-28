import { DAY_LABELS } from "@constants";
import { OperatingHourType } from "@types";

export const getOperatingHoursText = (hours: OperatingHourType[]) => {
  if (!hours || hours.length === 0) return "";

  const groups: Record<string, number[]> = {};
  hours.forEach((oh) => {
    const timeKey =
      oh.is_off || !oh.open_time
        ? "휴무"
        : `${oh.open_time.substring(0, 5)} ~ ${oh.close_time?.substring(0, 5)}`;

    if (!groups[timeKey]) groups[timeKey] = [];
    groups[timeKey].push(oh.day_of_week);
  });

  const formattedGroups = Object.entries(groups).map(([time, days]) => {
    days.sort((a, b) => a - b);

    let dayText = "";
    if (days.length === 7) {
      dayText = "매일";
    } else if (days.length === 5 && days[0] === 1 && days[4] === 5) {
      dayText = "평일";
    } else if (days.length === 2 && days.includes(0) && days.includes(6)) {
      dayText = "주말";
    } else {
      dayText = formatDayRange(days, DAY_LABELS);
    }

    return { dayText, time, isOff: time === "휴무" };
  });

  return formattedGroups
    .sort((a) => (a.isOff ? 1 : -1))
    .map((g) => `${g.dayText} ${g.time}`)
    .join(" / ");
};

const formatDayRange = (days: number[], labels: string[]) => {
  const parts: string[] = [];
  let start = 0;

  for (let i = 0; i < days.length; i++) {
    if (i + 1 < days.length && days[i + 1] === days[i] + 1) {
      continue;
    }

    if (start === i) {
      parts.push(labels[days[start]]);
    } else {
      parts.push(`${labels[days[start]]}~${labels[days[i]]}`);
    }
    start = i + 1;
  }
  return parts.join(", ");
};
