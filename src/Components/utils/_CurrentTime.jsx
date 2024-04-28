import React from 'react';

const CurrentDateTimeComp = () => {
    const currentDateTime = new Date();

    const currentDate = currentDateTime.toLocaleDateString('ro-RO');
    const currentHours = currentDateTime.getHours();
    const currentMinutes = currentDateTime.getMinutes();

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
