import React from 'react';

const ActionButton = ({ onClick, text, buttonType, type = 'button', additionalClasses = '', ...props }) => {

    let backgroundColor;

    switch (buttonType) {
        case 'submit':
            backgroundColor = 'bg-red-500'; // Red background for 'submit'
            break;
        case 'login':
            backgroundColor = 'bg-blue-500'; // Blue background for 'login'
            break;
        case 'logout':
            backgroundColor = 'bg-red-700'
            break
        default:
            backgroundColor = 'bg-blue-400'; // Default background
            break;
    }

    return (
        <button
            className={`rounded bg-inherit ${backgroundColor} ${additionalClasses} rounded-md border-0 outline-0 font-normal`}
            onClick={onClick}
            type={type}
            {...props}
        >
            {text}
        </button>
    );
};


const CustomButton = ({ onClick, text = "default", buttonType = "default", type = "button", additionalClasses = 'p-2 text-md' }) => (
    <ActionButton
        onClick={onClick}
        text={text}
        buttonType={buttonType}
        additionalClasses={additionalClasses}
        type={type}
    />
);

export { CustomButton };
