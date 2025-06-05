import {ButtonProps} from "@headlessui/react";
import {useAuth} from "../../../features/auth/hooks/useAuth";

interface LogOutButtonProps extends ButtonProps {
    className?: string;
}

export const LogOutButton = ({className, ...rest}: LogOutButtonProps) => {
    const auth = useAuth();

    return (
        <div>
            <button
                className={`${className}`}
                {...rest}
                onClick={auth.logout}
            >
                Log Out
            </button>
        </div>
    )
}