import React, { useState } from 'react';

const CurrentDateTimeComp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const currentDate = currentTime.toLocaleDateString('ro-RO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <p className="text-sm font-medium text-gray-700 tabular-nums">
      {currentDate} · {formattedTime}
    </p>
  );
};

export default CurrentDateTimeComp;
