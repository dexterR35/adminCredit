import React, { useState } from "react";
import { APP_DATE_LOCALE } from "../../utils/date";

const CurrentDateTimeComp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const currentDate = currentTime.toLocaleDateString(APP_DATE_LOCALE, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString(APP_DATE_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <p className="text-sm font-medium text-gray-700 tabular-nums">
      {currentDate} · {formattedTime}
    </p>
  );
};

export default CurrentDateTimeComp;
