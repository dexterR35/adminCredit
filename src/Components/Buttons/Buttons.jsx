import React from 'react';

const ActionButton = ({ onClick, text, color, size = 'md', additionalClasses = '', ...props }) => {
    const sizeClasses = {
        cm: 'p-1 text-[12px]',
        sm: 'p-1 text-sm',
        md: 'p-2 text-base',
        lg: 'p-2 text-lg',
        xl: 'p-3 text-2xl',
    };
    const colorClasses = {
        primary: 'bg-primary',
        secondary: 'bg-secondary text-white',
        lowColor: 'bg-low-color',
        error: 'bg-error-color',
        info: 'bg-info-color',
        success: 'bg-succes-color',
        green100: 'bg-green-100',
        green500: 'bg-green-500',
        gray200: 'bg-gray-200',
        gray700: 'bg-gray-700',
        indigo: 'bg-indigo-600 text-white'
    };
    const backgroundColor = colorClasses[color] || 'bg-indigo-400';
    return (
        <button
            className={`rounded ${backgroundColor} ${sizeClasses[size]} ${additionalClasses} rounded-md border-0 outline-0 font-semibold`}
            onClick={onClick}
            {...props}
        >
            {text}
        </button>
    );
};

const DetailsButton = ({ onClick, size = 'cm', additionalClasses = 'm-0 p-0 bg-transparent underline font-normal text-gray-800' }) => (
    <ActionButton onClick={onClick} text="Details" color="green" size={size} additionalClasses={additionalClasses} />
);
const YesButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Yes" color="green" size={size} additionalClasses={additionalClasses} />
);

const NoButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="No" color="red" size={size} additionalClasses={additionalClasses} />
);

const EditButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Edit" color="blue" size={size} additionalClasses={additionalClasses} />
);

const DeleteButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Delete" color="red" size={size} additionalClasses={additionalClasses} />
);

const LogInButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Login" color="indigo" size={size} additionalClasses={additionalClasses} />
);
const LogOutButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Login" color="blue" size={size} additionalClasses={additionalClasses} />
);

const SaveButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Save" color="green" size={size} additionalClasses={additionalClasses} />
);

export { YesButton, NoButton, EditButton, DeleteButton, LogInButton, LogOutButton, SaveButton, DetailsButton };
