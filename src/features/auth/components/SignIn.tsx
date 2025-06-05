import {ChangeEvent, FormEvent, useState} from "react";
import {SignInIF} from "../../../types/SignInIF";
import {SignInReq} from "../api/Auth";
import {useAuth} from "../hooks/useAuth";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "../../../components/common/Button";
import {Logo} from "../../../components/common/Logo";
import {TextField} from "../../../components/common/Input";
import {Alert} from "../../../components/common/Alert";

export const SignIn = () => {

    const {login, userRole} = useAuth();
    const navigate = useNavigate();

    const [er, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [signInData, setSignInData] = useState<SignInIF>({
        email: "",
        password: ""
    });

    const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSignInData({...signInData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) {
            setError("Please fill out all fields");
            return;
        }
        setIsLoading(true);
        const {data, error} = await SignInReq(signInData);
        if (error) {
            setError(error);
        } else if (data) {
            login(data);
            navigate("/items/all");
        }
        console.log(userRole);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-background-light rounded-lg shadow-md ">
                <div className="flex flex-col items-center backdrop-blur-sm">
                    <Logo className={"w-auto max-h-32 mb-6"}/>
                    <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
                    <p className="mt-2 text-center text-gray-600">Sign in to access your account</p>
                </div>

                <form className="flex flex-col items-center mt-8 space-y-6" onSubmit={handleSubmit} noValidate={true}>
                    <div className="flex flex-col space-y-4">
                        <div className={'flex flex-col items-center'}>
                            {er && (
                                <Alert message={er} visibility={true} type={"error"} onClose={() => setError(null)}/>
                            )}
                            <label htmlFor="email" className="block text-sm text-center font-medium text-gray-700">
                                Email Address
                            </label>
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                variant="lg"
                                placeholder="your@email.com"
                                onChange={onFormChange}
                            />

                            <label htmlFor="password"
                                   className="block text-sm mt-3 text-center font-medium text-gray-700">
                                Password
                            </label>
                            <TextField
                                id="password"
                                name="password"
                                type="password"
                                required
                                variant="lg"
                                placeholder="••••••••"
                                onChange={onFormChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            typeof="submit"
                            variant={'primary'}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span> Signing in...</span>
                            ) : "SignIn"}
                        </Button>
                    </div>
                </form>

                <div className="text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};