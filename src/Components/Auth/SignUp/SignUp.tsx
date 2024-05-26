import { useContext, useState } from "react";
import Button from "../../Utils/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/Context";
import { login, signUp } from "../../../HelperFunctions/apis";

interface IformInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default function SignIn() {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IformInput>();

    const navigate = useNavigate();
    const user = useContext(UserContext);

    const onSubmit: SubmitHandler<IformInput> = async (data) => {
        setIsSigningUp(true);
        const signUpResponse = await signUp(data);

        if (signUpResponse.error_type) {
            setErrorMessage(signUpResponse.error_detail);
            setIsSigningUp(false);
            return;
        }

        const loginResponse = await login({
            email: data.email,
            password: data.password,
        });

        if (loginResponse.error_type) {
            setErrorMessage(
                "Account was created but there was a problem when loggin in, please try again later."
            );
            setIsSigningUp(false);
            return;
        }

        localStorage.setItem("jwt", loginResponse.accessToken as string);
        user.setIsLoggedIn && user.setIsLoggedIn(true);
        user.setCurrentUser &&
            user.setCurrentUser({
                userId: loginResponse.userId,
                firstName: loginResponse.firstName,
                lastName: loginResponse.lastName,
                email: loginResponse.email,
            });

        navigate("/user/menu");
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="font-spectral flex flex-col gap-4 justify-center shadow-2xl my-10 mx-6 px-6 py-8 md:max-w-80 md:m-auto md:my-8 md:text-center lg:text-center lg:max-w-96 lg:m-auto lg:my-16 lg:text-xl"
        >
            <div className="font-karla">
                <h1 className="text-4xl font-bold">Getting Started</h1>
                <h2 className="text-[18px] text-center font-semibold">
                    Let us know your:
                </h2>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="First Name..."
                    className="w-full p-2 outline-none text-md border-[1px] border-slate-700 rounded-md"
                    {...register("firstName", {
                        required: true,
                    })}
                />
                {errors.firstName && (
                    <span className="font-karla text-sm text-red-links font-bold">
                        This field is required.
                    </span>
                )}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Last Name..."
                    className="w-full p-2 outline-none text-md border-[1px] border-slate-700 rounded-md"
                    {...register("lastName", {
                        required: true,
                    })}
                />
                {errors.lastName && (
                    <span className="font-karla text-sm text-red-links font-bold">
                        This field is required.
                    </span>
                )}
            </div>
            <div className="relative pt-1">
                <p className="absolute -top-3.5 text-sm">
                    <span className="text-red-600 font-extrabold">*</span>
                    This will be your username.
                </p>
                <input
                    type="text"
                    placeholder="Email..."
                    className="w-full p-2 outline-none text-md border-[1px] border-slate-700 rounded-md"
                    {...register("email", {
                        required: true,
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email address.",
                        },
                    })}
                />
                {errors.email && (
                    <span className="font-karla text-sm text-red-links font-bold">
                        {errors.email.message || "This field is required."}
                    </span>
                )}
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password..."
                    className="w-full p-2 outline-none text-md border-[1px] border-slate-700 rounded-md"
                    {...register("password", {
                        required: true,
                    })}
                />
                {errors.password && (
                    <span className="font-karla text-sm text-red-links font-bold">
                        This field is required.
                    </span>
                )}
            </div>
            {errorMessage && (
                <span className="font-karla text-sm text-red-links font-bold">
                    {errorMessage}
                </span>
            )}
            <Button
                className="font-spectral w-full bg-accent-blue text-black font-semibold rounded-md shadow-black drop-shadow-lg py-2 px-2"
                text="Create Account"
                type={"submit"}
                isLoading={isSigningUp}
                isLoadingText="Signing up..."
            />
            <p className="text-center">
                Have an account?{" "}
                <span className="text-blue-links underline hover:no-underline hover:font-bold">
                    Sign In
                </span>
            </p>
        </form>
    );
}
