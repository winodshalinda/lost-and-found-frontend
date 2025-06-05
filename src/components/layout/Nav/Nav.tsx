import {NavLink, NavLinkProps} from "react-router-dom";
import {ReactNode} from "react";

interface NavProps extends NavLinkProps {
    to: string;
    children: ReactNode;
    className?: string;
    activeClassName?: string;
}

export const Nav = ({to, children, className = "", activeClassName = "", ...props}: NavProps) => {
    return (
        <NavLink
            to={to}
            className={({isActive}) => `text-white hover:bg-primary px-3 py-2 rounded-md text-sm font-medium ${isActive ? `${activeClassName}` : ""}${className || ''}`}
            {...props}
        >
            {children}
        </NavLink>
    );
}
