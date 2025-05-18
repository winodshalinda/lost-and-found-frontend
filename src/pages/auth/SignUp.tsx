import {ChangeEvent,FormEvent, useState} from "react";
import {SignUpIF} from "../../types/SignUpIF";
import {SignUpReq} from "../../features/auth/Auth";
import {useAuth} from "../../features/auth/hooks/useAuth";
import {Link, useNavigate} from "react-router-dom";
import {Alert} from "../../components/Alert";
import {Button} from "../../components/button/Button";
import {TextField} from "../../components/textfield/TextField";
import {Logo} from "../../components/Logo";

export const SignUp = () => {

    const {login} = useAuth();
    const navigate = useNavigate();

    const [er, setEr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState<boolean>(false);

    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

    const [signUpData, setSignUpData] = useState<SignUpIF>(
        {
            id: "",
            name: "",
            email: "",
            role: undefined,
            createdAt: undefined,
            password: ""
        }
    );

    const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSignUpData({...signUpData, [e.target.name]: e.target.value});
        if (e.target.name === 're-password') {
            setPasswordConfirm(e.target.value);
            setPasswordsMatch(signUpData.password === e.target.value);
        } else {
            setSignUpData({...signUpData, [e.target.name]: e.target.value});
            if (e.target.name === 'password') {
                setPasswordsMatch(passwordConfirm === e.target.value);
            }
        }
    }

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!e.currentTarget.checkValidity()){
            setEr("Please fill out all fields");
            setOpenAlert(true);
            return;
        }
        if (passwordsMatch) {
            setIsLoading(true);
            const {data, error} = await SignUpReq(signUpData);

            if (data) {
                login(data);
                // Add a small delay to ensure the token is saved
                setTimeout(() => {
                    navigate("/items/all");
                }, 100);
            } else if (error) {
                setEr(error);
                setOpenAlert(true);
            }
            setIsLoading(false);
        } else {
            setEr("Passwords do not match");
            setOpenAlert(true);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-background-light rounded-lg shadow-md ">
                <div className="flex flex-col items-center backdrop-blur-sm">
                    <Logo className={"w-auto max-h-32 mb-4"}/>
                    <h1 className="text-3xl font-bold text-gray-800">Sign Up</h1>
                    <p className="mt-2 text-center text-gray-600">Sign up to access your account</p>
                    <form className={"flex flex-col items-center gap-4 mt-2"} onSubmit={handleOnSubmit} noValidate={true}>

                        <Alert message={er} visibility={openAlert} type={"error"} onClose={() => {
                            setOpenAlert(false)
                        }}/>

                        <div className="flex flex-col justify-center space-y-4">
                            <TextField
                                id="name"
                                name="name"
                                type="text"
                                required
                                pattern=".{6,}"
                                variant={'lg'}
                                invalidMessage={"Full name must be at least 6 characters long"}
                                placeholder="Full Name"
                                onChange={onFormChange}
                            />
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                required
                                variant={'lg'}
                                invalidMessage={"Invalid email address"}
                                placeholder="Email Address"
                                onChange={onFormChange}
                            />
                            <TextField
                                id="password"
                                name="password"
                                type="password"
                                required
                                pattern=".{8,}"
                                invalidMessage={"Password must be at least 8 characters long"}
                                variant={'lg'}
                                placeholder="Password"
                                onChange={onFormChange}
                            />
                            <TextField
                                id="re-password"
                                name="re-password"
                                type="password"
                                required
                                variant={'lg'}
                                placeholder="Re-Password"
                                onChange={onFormChange}
                            />
                        </div>

                        <Button typeof='submit' variant={'primary'}>
                            {isLoading ? (
                                <span>Signing Up...</span>
                            ) : "Sign Up"}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}