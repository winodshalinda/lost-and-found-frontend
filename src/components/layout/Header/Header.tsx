import {ReactNode} from "react";

interface HeaderProps {
    children?: ReactNode;
}

export const Header = ({children}: HeaderProps) => {
    return (
        <header className="bg-background-light shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
                <div className="text-3xl font-bold tracking-tight text-gray-900">
                    {children}
                </div>
            </div>
        </header>
    )
}