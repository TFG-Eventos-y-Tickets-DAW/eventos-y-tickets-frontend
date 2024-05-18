import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Components/LandingPage/Home.tsx";
import Login from "./Components/Auth/Login/Login.tsx";
import UserMenu from "./Components/UserOptions/UserMenu.tsx";
import SignIn from "./Components/Auth/SignUp/SignUp.tsx";
import EventDetails from "./Components/EventDetails/EventDetails.tsx";
import PaypalCaptureOrder from "./Components/PaymentModals/PaypalCaptureOrder.tsx";
import UserTickets from "./Components/UserOptions/UserTickets.tsx";
import CreateEvent from "./Components/UserOptions/Management/CreateEvent.tsx";
import UserEvents from "./Components/UserOptions/UserEvents.tsx";
import EditEvent from "./Components/UserOptions/Management/EditEvent.tsx";
import { ViewEventStats } from "./Components/UserOptions/Management/ViewEventStats.tsx";

const router = createBrowserRouter([
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/eventdetails/:eventId",
                element: <EventDetails />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signin",
                element: <SignIn />,
            },
            {
                path: "/user/menu",
                element: <UserMenu />,
            },
            {
                path: "/user/tickets",
                element: <UserTickets />,
            },
            {
                path: "/user/events",
                element: <UserEvents />,
            },
            {
                path: "/user/event/create",
                element: <CreateEvent />,
            },
            {
                path: "/user/events/edit/:eventId",
                element: <EditEvent />,
            },
            {
                path: "/user/events/stats/:eventId",
                element: <ViewEventStats />,
            },
        ],
    },
    {
        path: "/paypal/capture",
        element: <PaypalCaptureOrder />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
