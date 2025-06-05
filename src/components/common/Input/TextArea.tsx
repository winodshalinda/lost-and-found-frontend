import {ChangeEvent, TextareaHTMLAttributes} from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea = ({className, onChange, ...props}: TextAreaProps) => {
    return (
        <div className={className}>
            <textarea
                className={'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 ' +
                    ' placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6'}
                {...props}
                onChange={onChange}
            />
        </div>
    )
}