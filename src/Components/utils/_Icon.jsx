import React from 'react';
import PropTypes from 'prop-types';
import { FcHome, FcOk, FcFinePrint, FcMediumPriority, FcReading, FcOvertime, FcPlanner, FcAbout, FcBearish, FcBusinessContact, FcHighPriority, FcBusinessman, FcCollaboration, FcDebt, FcAreaChart, FcCallback, FcAlarmClock, FcAssistant, FcAdvertising } from "react-icons/fc";

import { IoCreateOutline, IoLogOutOutline } from "react-icons/io5";
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
    FcReading: FcReading,
    IoLogout: IoLogOutOutline,
    IoCreate: IoCreateOutline,
    IconEdit: FcMediumPriority,
    IconPrint: FcFinePrint,
};

const IconR = ({ icon, size = 20 }) => {
    const IconComponent = iconMap[icon];
    if (!IconComponent) {
        return <p>Icon not found</p>; 
    }
    return <IconComponent size={size} />;
};

IconR.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number
};
export default IconR;