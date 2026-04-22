"use client";

import { ClockIcon } from "@assets";
import { useCurrentTime } from "@hooks";

const Clock = () => {
  const { year, month, date, hh, mm, ss } = useCurrentTime();
  const isRenderTime = year && month && date && hh && mm && ss;
  const timeClassName = "tabular-nums animate-slide-up inline-block";

  return isRenderTime ? (
    <div className="font-medium">
      <p className="text-lg animate-slide-up">
        {year}. {month}. {date}
      </p>
      <p className="text-right text-md">
        <span key={`hour-${hh}`} className={timeClassName}>
          {hh}
        </span>
        :
        <span key={`min-${mm}`} className={timeClassName}>
          {mm}
        </span>
        :
        <span key={`sec-${ss}`} className={timeClassName}>
          {ss}
        </span>
      </p>
    </div>
  ) : (
    <div className="flex items-center justify-center rounded h-13 w-30">
      <ClockIcon />
    </div>
  );
};

export default Clock;
