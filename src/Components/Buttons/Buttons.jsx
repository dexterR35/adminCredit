import React from 'react';
import IconR from '../utils/_Icon';
import useTranslate from '../../services/useTranslate';

const CustomButton = ({ onClick, text = "default", buttonType = "default", type = "button", additionalClasses = '', disabled = false}) => {
    const { t } = useTranslate();

    const baseClasses = 'flex flex-row gap-2 items-center capitalize rounded-lg border-0 outline-0 px-4 py-2 font-medium';
    const buttonStyles = {
        submit: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md',
        default: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm',
        delete: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm',
        modal: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md text-sm',
        logOut: 'bg-white border border-gray-300 text-gray-700 shadow-sm',
        logIn: 'bg-white border border-gray-300 text-gray-700 shadow-sm',
        success: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm',
        error: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm',
        edit: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm',
        info: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm',
        disabled: 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none',
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

    const buttonClasses = disabled ? buttonStyles.disabled : buttonStyles[buttonType] || 'bg-primary text-white';
    const iconKey = iconKeys[buttonType];

    return (
        <button
            className={`${baseClasses} ${buttonClasses} ${additionalClasses}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
        {iconKey && iconKey !== '' && <IconR icon={iconKey} />}
            <span>{t(text)}</span>
        </button>
    );
};

export { CustomButton }; 
