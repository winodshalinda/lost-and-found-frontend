import React, {ReactNode} from "react";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    variant?: 'primary' | 'secondary';
    children: ReactNode;
}

export const Button = ({
    variant,
    className = '', 
    children, 
    ...rest
}: ButtonProps) => {
    const getButtonStyles = () => {
        switch (variant) {
            case 'primary':
                return "w-full px-4 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
            case 'secondary':
                return "w-full px-4 py-1 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400";
            default:
                return "w-full px-4 py-1 border-2 border-black rounded-md hover:bg-gray-300";
        }
    };

    return (
        <button
            className={`${getButtonStyles()} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}