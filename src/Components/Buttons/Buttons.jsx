import React from 'react';

const ActionButton = ({ onClick, text, buttonType, type = 'button', additionalClasses = '', ...props }) => {

    let backgroundColor;

    switch (buttonType) {
        case 'submit':
            backgroundColor = 'bg-primary text-white font-bold text-md';
            break;
        case 'default':
            backgroundColor = 'bg-inherit'
            break
        case 'edit':
            backgroundColor = 'bg-yellow-700'
            break
        case 'save':
            backgroundColor = 'bg-indigo-400'
            break
        case 'delete':
            backgroundColor = 'bg-red-900'
            break
        case 'modal':
            backgroundColor = 'bg-primary'
            break
        default:
            backgroundColor = 'bg-blue-400';
            break;
    }

    return (
        <button
            className={`rounded ${backgroundColor} ${additionalClasses} capitalize rounded-md border-0 outline-0 p-2`}
            onClick={onClick}
            type={type}
            {...props}
        >
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
