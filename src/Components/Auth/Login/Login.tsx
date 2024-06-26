import { Link, useNavigate } from "react-router-dom";
import Button from "../../Utils/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { login } from "../../../HelperFunctions/apis";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/Context";

interface formInput {
    email: string;
    password: string;
}

export default function Login() {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formInput>();

    const navigate = useNavigate();
    const user = useContext(UserContext);

    const onSubmit: SubmitHandler<formInput> = async (data) => {
        setIsSigningIn(true);
        const response = await login(data);

        if (response.error_type) {
            setErrorMessage(response.error_detail);
            setIsSigningIn(false);
            return;
        }

        //Save JWT on local storage.
        localStorage.setItem("jwt", response.accessToken as string);
        //Save user info on context.
        user.setIsLoggedIn && user.setIsLoggedIn(true);
        user.setCurrentUser &&
            user.setCurrentUser({
                userId: response.userId,
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email,
            });

        navigate("/user/menu");
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="font-spectral flex flex-col gap-4 justify-center shadow-2xl my-10 mx-6 px-6 py-8 md:max-w-80 md:m-auto md:my-8 lg:max-w-96 lg:m-auto lg:my-16 lg:text-xl"
        >
            <div className="font-karla font-bold ">
                <h1 className="text-5xl ">Sign In</h1>
                <h2 className="text-lg font-semibold">
                    Looking to attend or create?
                </h2>
            </div>
            <div className="flex flex-col gap-4">
                <input
                    className="p-2 outline-none text-md border-[1px] border-slate-700 rounded-md"
                    type="text"
                    {...register("email", {
                        required: true,
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email address",
                        },
                    })}
                    placeholder="Email..."
                />
                {errors.email && (
                    <span className="font-karla text-sm text-red-links font-bold">
                        {errors.email.message || "This field is required"}
                    </span>
                )}
                <input
                    className=" p-2 outline-none text-md border-[1px] border-slate-700 rounded-md"
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password..."
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
            <Link
                to={"#"}
                className="text-blue-links underline hover:font-bold hover:no-underline"
            >
                Forgot Password?
            </Link>
            <div className="flex flex-col gap-4">
                <Button
                    className="font-spectral w-full bg-accent-blue text-black font-semibold rounded-md shadow-black drop-shadow-lg py-2 px-2"
                    text="Sign In"
                    type={"submit"}
                    isLoading={isSigningIn}
                    isLoadingText="Signing in..."
                />
                <p className="text-center text-sm">
                    New to Event&Greet?{" "}
                    <Link
                        to={"#"}
                        className="text-blue-links underline hover:font-bold hover:no-underline"
                    >
                        Create an account.
                    </Link>
                </p>
            </div>
        </form>
    );
}
