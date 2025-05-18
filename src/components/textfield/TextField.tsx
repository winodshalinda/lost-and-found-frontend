import React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'lg' | 'sm';
    invalidMessage?: string;
}

export const TextField = ({id, name, className = "", invalidMessage, variant = "sm", ...props}: TextFieldProps) => {
    switch (variant) {
        case 'lg':
            return (
                <div className={'flex flex-col'}>
                    <input
                        id={id}
                        name={name}
                        className={`peer is-invalid w-72 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 ${className}`}
                        {...props}
                    />
                    {invalidMessage && <p className={`hidden peer-placeholder-shown:hidden peer-invalid:block peer-placeholder-shown:peer-invalid:hidden text-red-500 text-xs italic`}>{invalidMessage}</p>}
                </div>
            );
        case 'sm':
            return (
                <input
                    className={"w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"}
                    {...props}
                />
            );
    }
};