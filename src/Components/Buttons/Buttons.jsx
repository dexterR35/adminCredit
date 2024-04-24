import React from 'react';

// Updated ActionButton with size and custom Tailwind CSS class support
const ActionButton = ({ onClick, text, color, size = 'md', additionalClasses = '', ...props }) => {
    const sizeClasses = {
        sm: 'p-1 text-sm',
        md: 'p-2 text-base',
        lg: 'p-3 text-lg',
        xl: 'p-3 text-2xl',
    };

    return (
        <button
            className={`bg-${color}-300 rounded ${sizeClasses[size]} ${additionalClasses}`}
            onClick={onClick}
            {...props}
        >
            {text}
        </button>
    );
};

// Yes/No Buttons with different sizes and classes
const YesButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="Yes" color="green" size={size} additionalClasses={additionalClasses} />
);

const NoButton = ({ onClick, size = 'md', additionalClasses = '' }) => (
    <ActionButton onClick={onClick} text="No" color="red" size={size} additionalClasses={additionalClasses} />
);

// Other Buttons with size and additional classes
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

export { YesButton, NoButton, EditButton, DeleteButton, LogInButton, LogOutButton, SaveButton };
