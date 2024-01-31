import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + 2); // Set the target date 2 months from now

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      // Timer expired
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h3 className="font-bold text-lg">In Progress...</h3>
      <p className="text-gray-800">
        {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes}{" "}
        minutes, {timeLeft.seconds} seconds
      </p>
    </div>
  );
};

export default CountdownTimer;
