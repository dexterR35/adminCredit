import React from 'react';
import IconR from '../utils/_Icon';
import { getButtonClasses } from '../../constants/colors';

const CustomButton = ({ onClick, text = "default", buttonType = "default", type = "button", additionalClasses = '', disabled = false}) => {

    const baseClasses = 'flex flex-row gap-2 items-center capitalize rounded-lg border outline-0 px-4 py-2 font-medium transition-all duration-200';
    
    // Button styles using centralized color constants
    const buttonStyles = {
        submit: getButtonClasses('submit'),
        default: getButtonClasses('default'),
        delete: getButtonClasses('delete'),
        modal: getButtonClasses('modal'),
        logOut: getButtonClasses('logOut'),
        logIn: getButtonClasses('logIn'),
        success: getButtonClasses('success'),
        error: getButtonClasses('error'),
        edit: getButtonClasses('edit'),
        info: getButtonClasses('info'),
        disabled: getButtonClasses('disabled'),
    };

    const iconKeys = {
        edit: 'IoCreate',
        modal: 'IoCreate',
        logOut: 'IoLogout',
        logIn: 'IoCreate',
        submit:'IoLogout',
        info:'IoLogout',
        disabled:'IoCreate',
    };

    const buttonClasses = disabled ? buttonStyles.disabled : buttonStyles[buttonType] || 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600';
    const iconKey = iconKeys[buttonType];

    return (
        <button
            className={`${baseClasses} ${buttonClasses} ${additionalClasses}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
        {iconKey && iconKey !== '' && <IconR icon={iconKey} />}
            <span>{text}</span>
        </button>
    );
};

export { CustomButton }; 
