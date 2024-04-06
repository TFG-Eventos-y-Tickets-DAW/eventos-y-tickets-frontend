import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getMonth from "../../../helperFunctions/GetMonth";

interface event {
    id: number;
    ownerId: number;
    title: string;
    description: string;
    address: string;
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

export default function EventCard(props: event) {
    return (
        <div
            key={props.id}
            className="flex flex-col px-6 py-4 items-center justify-center border shadow-lg mx-4 rounded-md"
        >
            <div className="relative py-2">
                {props.type == "PAID" && (
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
                    src={props.imgSrc}
                    alt="Here is an event cover."
                    className="rounded-md object-cover border border-black aspect-square"
                />
                <p className="font-spectral text-sm absolute bottom-2.5 right-1.5">
                    {`${getMonth(
                        props.startsAt.substring(3, 5)
                    )} ${props.startsAt.substring(0, 2)} - ${getMonth(
                        props.endsAt.substring(3, 5)
                    )} ${props.endsAt.substring(0, 2)}`}
                </p>
            </div>
            <p className="font-spectral font-semibold text-xl">{props.title}</p>
        </div>
    );
}
