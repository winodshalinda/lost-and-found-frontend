import React, {useEffect, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {Role} from '../../types/SignUpIF';
import {useAuth} from "../auth";

interface RoleBasedRouteProps {
    allowedRoles: Role[];
}

export const RoleBasedRoute = ({allowedRoles}: RoleBasedRouteProps) => {
    const navigate = useNavigate();
    const auth = useAuth();
    const [isAllow, setIsAllow] = useState<boolean>(true);

    useEffect(() => {
        if (!auth?.isAuthenticated) {
            setIsAllow(false);
            navigate('/sign-in');
            return;
        }
        if (auth?.userRole && !allowedRoles.includes(auth.userRole)) {
            setIsAllow(false);
            navigate('/forbidden');
            return;
        }
    }, [navigate, auth, auth?.isAuthenticated, auth?.userRole, allowedRoles]);

    return isAllow ? (<Outlet/>) : null
};