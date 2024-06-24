import React from 'react';
import IconR from '../utils/_Icon';
import useTranslate from '../../services/useTranslate';

const CustomButton = ({ onClick, text = "default", buttonType = "default", type = "button", additionalClasses = '', disabled = false}) => {
    const { t } = useTranslate();

    const baseClasses = 'flex flex-row gap-2 items-center capitalize rounded-md border-0 outline-0 p-2';
    const buttonStyles = {
        submit: 'text-md text-dark bg-primary text-white mt-4',
        default: 'bg-inherit',
        delete: 'border-[1px] bg-transparent border border-gray-400',
        modal: 'bg-primary text-white font-semibold text-sm',
        logOut: 'border-[1px] bg-transparent border border-gray-400',
        logIn: 'border-[1px] bg-transparent border border-gray-400',
        success: 'bg-succes text-gray-50 font-bold',
        error: 'bg-error text-gray-50 font-bold',
        edit: 'border-[1px] border-gray-400',
        info: 'bg-blue-600 text-gray-50',
        disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
    };

    const iconKeys = {
        edit: 'IconPrint',
        delete: 'hightPriority',
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
