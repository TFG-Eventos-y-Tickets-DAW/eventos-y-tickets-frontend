import { Link } from "react-router-dom";
import Button from "../../../Utils/Button";

export default function Login() {
    return (
        <div className="font-spectral flex flex-col gap-4 justify-center shadow-2xl mt-10 mx-6 px-6 py-8">
            <div className="font-karla font-bold ">
                <h1 className="text-5xl ">Sign In</h1>
                <h2 className="text-lg font-semibold">
                    Looking to attend or create?
                </h2>
            </div>
            <form action="" className="flex flex-col gap-4">
                <input
                    className=" p-2 outline-none text-md border-[1px] border-slate-700 rounded-md"
                    type="text"
                    value={""}
                    placeholder="Email..."
                />
                <input
                    className=" p-2 outline-none text-md border-[1px] border-slate-700 rounded-md"
                    type="text"
                    value={""}
                    placeholder="Password..."
                />
            </form>
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
        </div>
    );
}
