import { useState } from "react";
import Footer from "./Components/Static/Footer";
import Navbar from "./Components/Static/Navbar";
import { UserContext } from "./context/Context";
import "./index.css";
import { Outlet } from "react-router-dom";
import { IUserInfo } from "./types/context";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

function App() {
    const [currentUser, setCurrentUser] = useState<IUserInfo>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();

    const userInfo = {
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        setIsLoggedIn: setIsLoggedIn,
        setCurrentUser: setCurrentUser,
    };

    return (
        <div className="max-w-6xl m-auto bg-white">
            <UserContext.Provider value={userInfo}>
                <Navbar />
                <Outlet />
                <Footer />
            </UserContext.Provider>
        </div>
    );
}
export default App;
