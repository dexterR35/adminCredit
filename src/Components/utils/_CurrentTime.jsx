import React, { useState, useEffect } from 'react';

const CurrentDateTimeComp = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, []); // Empty dependency array to run effect only once on component mount

    const currentDate = currentTime.toLocaleDateString('ro-RO');
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    // Format hours to 24-hour format with leading zeros if necessary
    const formattedHours = currentHours < 10 ? '0' + currentHours : currentHours;

    // Represent midnight as "00" with "AM"
    const displayHours = currentHours === 0 ? '00' : formattedHours;

    // Determine if it's AM or PM
    const meridiem = currentHours < 12 ? 'AM' : 'PM';

    // Format minutes with leading zeros if necessary
    const formattedMinutes = currentMinutes < 10 ? '0' + currentMinutes : currentMinutes;

    return (
        <div className='flex flex-wrap gap-2 text-gray-600'>
            <span className="text-sm">Today Date: {currentDate}</span>/
            <span className="text-sm">Time: {displayHours}:{formattedMinutes} {meridiem}</span>/
            <span className="text-sm">Bucharest +25C</span>
        </div>
    );
};

export default CurrentDateTimeComp;
