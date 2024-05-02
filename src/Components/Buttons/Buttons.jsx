import React from 'react';

const ActionButton = ({ onClick, text, color, size = 'md', type = 'button', additionalClasses = '', ...props }) => {
    const sizeClasses = {
        cm: 'p-1 text-[12px] m-0 p-0 bg-transparent underline font-normal text-gray-800',
        sm: 'p-1 text-sm',
        md: 'p-2 text-md',
        lg: 'p-2 text-lg',
        xl: 'p-3 text-2xl',
    };
    const colorClasses = {
        primary: 'bg-primary',
        secondary: 'bg-secondary text-white',
        lowColor: 'bg-low-color',
        error: 'bg-error-color text-white',
        info: 'bg-info-color text-white',
        success: 'bg-succes-color text-white',
        green100: 'bg-green-100',
        green500: 'bg-green-500',
        gray200: 'bg-gray-200',
        gray700: 'bg-gray-700',
        indigo: 'bg-indigo-600 text-white'
    };
    const backgroundColor = colorClasses[color] || 'bg-indigo-400';
    return (
        <button
            type={type}
            className={`rounded ${backgroundColor} ${sizeClasses[size]} ${additionalClasses} rounded-md border-0 outline-0 font-semibold`}
            onClick={onClick}
            {...props}
        >
            {text}
        </button>
    );
};

const DetailsButton = ({ onClick, size = 'cm', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Details" color="green" size={size} additionalClasses={additionalClasses} type='button' />
);


const CustomButton = ({ onClick, text = "default", type = "button", size = 'md', additionalClasses = 'p-2' }) => (
    <ActionButton
        onClick={onClick}
        text={text}
        color="primary"
        size={size}
        additionalClasses={additionalClasses}
        type={type}
    />
);

export { DetailsButton, CustomButton };
