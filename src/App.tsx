import Footer from "./Static/Footer";
import Navbar from "./Static/Navbar";
import "./index.css";

import { Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}
export default App;
