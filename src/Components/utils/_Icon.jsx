import React from 'react';
import { FcHome, FcOk, FcReading, FcOvertime, FcPlanner, FcAbout, FcBearish, FcBusinessContact, FcHighPriority, FcBusinessman, FcCollaboration, FcDebt, FcAreaChart, FcCallback, FcAlarmClock, FcAssistant, FcAdvertising } from "react-icons/fc";

const iconMap = {
    FcHome: FcHome,
    businessContact: FcBusinessContact,
    collaboration: FcCollaboration,
    debt: FcDebt,
    cards: FcAreaChart,
    assistant: FcAssistant,
    alarmClock: FcAlarmClock,
    callBack: FcCallback,
    businessMan: FcBusinessman,
    hightPriority: FcHighPriority,
    FcOk: FcOk,
    FcAbout: FcAbout,
    FcBearish: FcBearish,
    FcCalendar: FcPlanner,
    FcOvertime: FcOvertime,
    FcReading: FcReading
};

const IconR = ({ icon, size }) => {
    const IconComponent = iconMap[icon];
    if (!IconComponent) {
        return <p>Icon not found</p>;  // Fallback if no icon matches
    }
    return <IconComponent size={size} />;
};

export default IconR;