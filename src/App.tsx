import { useState } from "react";
import Footer from "./Static/Footer";
import Navbar from "./Static/Navbar";
import { UserContext } from "./context/Context";
import "./index.css";

import { Outlet } from "react-router-dom";
import { IUserInfo } from "./types/context";

function App() {
    const [currentUser, setCurrentUser] = useState<IUserInfo>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();

    console.log(isLoggedIn);
    console.log(currentUser);

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
