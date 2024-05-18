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
        <UserContext.Provider value={userInfo}>
            <Navbar />
            <Outlet />
            <Footer />
        </UserContext.Provider>
    );
}
export default App;
