import {NavBar} from "../../components/layout/Nav/NavBar";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {HTMLAttributes, useEffect} from "react";

interface HomeProps extends HTMLAttributes<HTMLDivElement> {
}

export const Home = (props: HomeProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/items/all')
        }
    }, [location.pathname, navigate]);

    return (
        <div className={'flex flex-col min-h-screen bg-white'} {...props}>
            <NavBar/>
            <main className="flex-1">
                <Outlet/>
            </main>
        </div>
    )
}
