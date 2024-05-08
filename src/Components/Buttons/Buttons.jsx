import React from 'react';
import IconR from '../utils/_Icon'
const ActionButton = ({ onClick, text, buttonType, type = 'button', additionalClasses = '', ...props }) => {

    let backgroundColor, iconKey;

    switch (buttonType) {
        case 'submit':
            backgroundColor = 'text-sm bg-transparent border-2 border-gray-200 bg-primary text-dark';
            iconKey = 'IoLogout';
            break;
        case 'default':
            backgroundColor = 'bg-inherit'
            break
        case 'edit':
            backgroundColor = 'border-[1px] border-gray-400'
            iconKey = 'IconPrint';
            break
        case 'save':
            backgroundColor = 'bg-indigo-400'
            break
        case 'delete':
            backgroundColor = 'border-[1px] bg-transparent border border-gray-400'
            iconKey = 'hightPriority';
            break
        case 'modal':
            backgroundColor = 'bg-primary text-white font-semibold text-sm'
            iconKey = 'IoCreate';
            break
        default:
            backgroundColor = 'bg-blue-400 text-white';
            break;
    }

    return (
        <button
            className={`rounded ${backgroundColor} ${additionalClasses} flex flex-row gap-2 items-center capitalize rounded-md border-0 outline-0 p-2`}
            onClick={onClick}
            type={type}
            {...props}
        >
            {iconKey && <IconR icon={iconKey} size={18} />}
            {text}
        </button>
    );
};


const CustomButton = ({ onClick, text = "default", buttonType = "default", type = "button", additionalClasses = '' }) => (
    <ActionButton
        onClick={onClick}
        text={text}
        buttonType={buttonType}
        additionalClasses={additionalClasses}
        type={type}


    />
);

export { CustomButton };
