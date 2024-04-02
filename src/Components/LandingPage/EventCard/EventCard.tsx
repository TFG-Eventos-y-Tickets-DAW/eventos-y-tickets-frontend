import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getMonth from "../../../HelperFunctions/GetMonth";

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

export default function EventCard(event: events) {
    return (
        <div
            key={event.id}
            className="flex flex-col px-6 py-4 items-center justify-center border shadow-lg mx-4 rounded-md"
        >
            <div className="relative py-2">
                {event.type == "PAID" && (
                    <FontAwesomeIcon
                        icon={faMoneyBill}
                        style={{
                            color: "green",
                        }}
                        size="xl"
                        className="absolute top-3.5 left-2"
                    />
                )}
                <img
                    src={event.imgSrc}
                    alt="Here is an event cover."
                    className="rounded-md object-cover border border-black"
                />
                <p className="font-spectral text-sm absolute bottom-2.5 right-1.5">
                    {`${getMonth(
                        event.startsAt.substring(3, 5)
                    )} ${event.startsAt.substring(0, 2)} - ${getMonth(
                        event.endsAt.substring(3, 5)
                    )} ${event.endsAt.substring(0, 2)}`}
                </p>
            </div>
            <p className="font-spectral font-semibold text-xl">{event.title}</p>
        </div>
    );
}
