import React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // You can add additional custom props here if needed
}

export const TextField = ({className = "", ...props}: TextFieldProps) => {
  return (
    <input
      className={`w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};