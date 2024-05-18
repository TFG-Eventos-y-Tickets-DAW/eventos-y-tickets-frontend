import Logo from "../Components/Utils/Logo";

export default function Footer() {
    return (
        <footer className="flex flex-col items-center justify-center gap-4 font-spectral text-white text-md bg-secondary-black-lighter px-4 py-6">
            <div className="flex justify-center gap-10">
                <div>
                    <p className="text-accent-blue">HOME</p>
                    <ul className="list-disc pl-6">
                        <li>Events</li>
                        <li>Popular Events</li>
                        <li>New Events</li>
                    </ul>
                </div>
                <div>
                    <p className="text-accent-blue">ACCOUNT</p>
                    <ul className="list-disc pl-6">
                        <li>Sign In/Register</li>
                        <li>Create Event</li>
                        <li>My Tickets</li>
                        <li>My Events</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center text-xs gap-2">
                <Logo />
                <p>Copyright © 2024 Event&Greet</p>
            </div>

            <ul className="flex text-[9.5px] items-center justify-center text-accent-blue underline gap-1.5">
                <li className="flex items-center justify-center">
                    <a href="#">Legal Stuff</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="#">Privacy Policy</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="#">Security</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="#">Website Accesibility</a>
                </li>
                <li className="flex items-center justify-center">
                    <a href="#">Manage Cookies</a>
                </li>
            </ul>
        </footer>
    );
}
