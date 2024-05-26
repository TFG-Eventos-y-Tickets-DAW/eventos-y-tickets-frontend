import { useContext } from "react";
import { UserContext } from "../../context/Context";
import Button from "../Utils/Button";
import { Link, useNavigate } from "react-router-dom";

export default function UserMenu() {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    function logout() {
        localStorage.clear();
        user.setCurrentUser && user.setCurrentUser(undefined);
        user.setIsLoggedIn && user.setIsLoggedIn(false);
        navigate("/");
    }

    return (
        <div className="flex flex-col items-center justify-center font-karla gap-1 my-10 px-2 lg:gap-3">
            <h1 className="font-bold text-4xl text-center">
                Welcome {user.currentUser?.firstName},
            </h1>
            <h2 className="text-xl">What are we doing today?</h2>
            <div className="shadow-2xl w-full p-4 max-w-72 font-spectral gap-4 flex flex-col md:p-8 lg:gap-6 md:gap-6">
                <Link to={"/user/tickets"}>
                    <Button
                        text="My Tickets"
                        className="text-white text-lg bg-black rounded-md w-full py-2 drop-shadow-2xl"
                    />
                </Link>
                <Link to={"/user/events"}>
                    <Button
                        text="Manage Event"
                        className="text-white text-lg bg-black rounded-md w-full py-2 drop-shadow-2xl"
                    />
                </Link>
                <Link to={"/user/event/create"}>
                    <Button
                        text="Create Event"
                        className="text-white text-lg bg-black rounded-md w-full py-2 drop-shadow-2xl"
                    />
                </Link>

                <Button
                    text="Log Out"
                    className="text-white text-lg bg-black rounded-md w-full py-2 drop-shadow-2xl"
                    onClick={logout}
                />
            </div>
        </div>
    );
}
