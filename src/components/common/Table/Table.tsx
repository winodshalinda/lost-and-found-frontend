import {ButtonHTMLAttributes, ReactNode, TableHTMLAttributes} from 'react';

interface TableButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const TableButton = ({children, className, ...props}: TableButtonProps) => {
    return (
        <button
            className={`px-2 py-1 text-xs rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
    className?: string;
    children?: ReactNode;
}

const Table = ({children, className, ...props}: TableProps) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="shadow border border-gray-200 sm:rounded-lg overflow-x-auto">
                <table className={`${className} w-full divide-y divide-gray-200 table-fixed`} {...props}>
                    {children}
                </table>
            </div>
        </div>
    );
};

const THead = ({children}: { children?: ReactNode }) => {
    return (
        <thead className={'bg-gray-50 border-b border-gray-200'}>
        {children}
        </thead>
    )
}

const TBody = ({children}: { children?: ReactNode }) => {
    return (
        <tbody className={'bg-white divide-y divide-gray-200 text-sm'}>
        {children}
        </tbody>
    )
}

const Th = ({children, className}: { children?: ReactNode; className?: string }) => {
    return (
        <th scope="col"
            className={`${className} px-3 py-3 grow-2 text-left text-sm font-normal text-gray-600 tracking-tight`}>
            {children}
        </th>
    )
}

const Td = ({children, className}: { children?: ReactNode; className?: string }) => {
    return (
        <td className={`${className} px-3 py-4 text-gray-500`}>
            {children}
        </td>
    )
}

export {Table, THead, TBody, Th, Td, TableButton};