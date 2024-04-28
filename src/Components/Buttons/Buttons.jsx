import React from 'react';

const ActionButton = ({ onClick, text, color, size = 'md', additionalClasses = '', ...props }) => {
    const sizeClasses = {
        cm: 'p-1 text-[12px]',
        sm: 'p-1 text-sm',
        md: 'p-2 text-base',
        lg: 'p-3 text-lg',
        xl: 'p-3 text-2xl',
    };

    return (
        <button
            className={`bg-${color}-300 rounded ${sizeClasses[size]} ${additionalClasses} rounded-sm border-0 capitalize font-medium outline-0`}
            onClick={onClick}
            {...props}
        >
            {text}
        </button>
    );
};

const DetailsButton = ({ onClick, size = 'cm', additionalClasses = 'm-0 p-0 bg-transparent underline' }) => (
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
    <ActionButton onClick={onClick} text="Login" color="blue" size={size} additionalClasses={additionalClasses} />
);
const LogOutButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Login" color="blue" size={size} additionalClasses={additionalClasses} />
);

const SaveButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Save" color="green" size={size} additionalClasses={additionalClasses} />
);

export { YesButton, NoButton, EditButton, DeleteButton, LogInButton, LogOutButton, SaveButton, DetailsButton };
