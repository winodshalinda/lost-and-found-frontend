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
                return "w-44 px-4 py-1 text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light rounded-md";
            case 'secondary':
                return "w-60 px-4 py-1 text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light rounded-md";
            default:
                return "";
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
