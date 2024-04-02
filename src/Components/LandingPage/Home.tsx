import { useEffect, useState } from "react";
import Hero from "./Hero/Hero";
import EventCard from "./EventCard/EventCard";

interface events {
    id: number;
    ownerId: number;
    title: string;
    description: string;
    imgSrc: string;
    startsAt: string;
    endsAt: string;
    country: string;
    currency: string;
    createdAt: string;
    price: number;
    category:
        | "MUSIC"
        | "FOOD & DRINK"
        | "FASHION"
        | "TECHNOLOGY"
        | "CONFERENCE"
        | "PARTY"
        | "FILM"
        | "KIDS & FAMILY"
        | "OTHER";
    status: "DRAFT" | "PUBLISHED" | "FINALIZED";
    type: "FREE" | "PAID";
}

export default function Home() {
    const [shownEvents, setShownEvents] = useState<events[]>();

    useEffect(() => {
        async function fetchPublicEvents() {
            const response = await fetch(
                "https://1he0dulvh9.execute-api.us-east-1.amazonaws.com/api/v1/events",
                {
                    method: "POST",
                    body: JSON.stringify({
                        filters: {
                            status: "PUBLISHED",
                        },
                    }),
                }
            );

            response.json().then((data) => setShownEvents(data.events));

            return true;
        }

        fetchPublicEvents();
    }, []);

    return (
        <>
            <Hero />
            <div className="flex flex-col justify-center px-5 py-10 gap-5">
                <h1 className="font-karla font-bold text-4xl drop-shadow-2xl text-center">
                    Events
                </h1>
                <ul className="font-karla font-semibold flex justify-evenly items-center gap-4">
                    <li className="text-lg border-2 border-black w-full text-center rounded-md text-white bg-black">
                        All
                    </li>
                    <li className="text-lg border-2 border-black w-full text-center rounded-md">
                        Popular
                    </li>
                    <li className="text-lg border-2 border-black w-full text-center rounded-md">
                        New
                    </li>
                </ul>
            </div>

            <div className="flex flex-col gap-10 py-6">
                {shownEvents &&
                    shownEvents.map((event) => <EventCard {...event} />)}
            </div>
        </>
    );
}
