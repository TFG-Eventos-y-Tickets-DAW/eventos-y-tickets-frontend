import {
    faCircleCheck,
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { ITicket } from "../../types/event";
import { getCurrentUserTickets } from "../../HelperFunctions/apis";
import { ErrorResponse } from "../../types/apis";
import getMonth from "../../HelperFunctions/GetMonth";
import Button from "../Utils/Button";

export default function UserTickets() {
    const [userTickets, setUserTickets] = useState<ITicket[]>();
    const [selectedTicket, setSelectedTicket] = useState<ITicket>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getUserTicketsData() {
            const userTicketsData: ITicket[] & ErrorResponse =
                await getCurrentUserTickets();

            if (userTicketsData.error_type) {
                setUserTickets([]);
                console.log(
                    "There was an error while trying to get user tickets, please try again later."
                );
                return;
            }

            setUserTickets(userTicketsData);
            setIsLoading(false);
        }

        getUserTicketsData();
    }, []);

    function downloadSelectedTicket() {
        const ticket = new Blob(
            [
                `Ticket(s) of order ${selectedTicket?.orderId} of event ${selectedTicket?.title}`,
            ],
            { type: "text/plain" }
        );

        const ticketUrl = window.URL.createObjectURL(ticket);
        const ticketLink = document.createElement("a");

        ticketLink.href = ticketUrl;
        ticketLink.setAttribute("download", `${selectedTicket?.title} Ticket`);

        document.body.appendChild(ticketLink);
        ticketLink.click();

        ticketLink.parentNode?.removeChild(ticketLink);
    }

    return (
        <div className="flex flex-col p-6 font-spectral gap-2 ">
            <h1 className="font-karla font-bold text-3xl drop-shadow-2xl">
                My Tickets
            </h1>
            <div className="flex gap-4">
                <div className="flex justify-center items-center bg-white px-2 gap-1 border-[1px] rounded-md border-black drop-shadow-2xl">
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="hover:text-accent-blue"
                    />
                    <input
                        type="text"
                        placeholder="Write here to search..."
                        className="font-spectral p-1 outline-none text-sm"
                    />
                </div>
                <select
                    name="selected-filter"
                    id="selected-filter"
                    className="text-white bg-black rounded-md px-1"
                >
                    <option value="all">All</option>
                    <option value="paid">Paid</option>
                    <option value="free">Free</option>
                    <option value="active">Active</option>
                    <option value="finalized">Finalized</option>
                </select>
            </div>
            <div className="flex flex-col gap-4 p-4 bg-black rounded-md shadow-lg mt-2 max-h-64 overflow-scroll">
                {isLoading && (
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin text-2xl py-4 text-white"
                    />
                )}
                {!isLoading &&
                    userTickets?.map((ticket) => (
                        <div
                            key={ticket.orderId}
                            className={
                                selectedTicket?.orderId === ticket.orderId
                                    ? "flex items-center drop-shadow-2xl bg-white px-4 py-2 gap-4 rounded-md  outline outline-4 outline-blue-links"
                                    : "flex items-center drop-shadow-2xl bg-white px-4 py-2 gap-4 rounded-md "
                            }
                            onClick={() => {
                                selectedTicket?.orderId === ticket.orderId
                                    ? setSelectedTicket(undefined)
                                    : setSelectedTicket(ticket);
                            }}
                        >
                            <img
                                src={ticket.imgSrc}
                                alt="event-image"
                                className="aspect-square max-w-20 object-cover border border-black rounded-md"
                            />
                            <div className="flex flex-col text-sm">
                                <h1 className="font-karla font-bold text-xl">
                                    {ticket.title.length > 13 &&
                                        `${ticket.title.substring(0, 13)}...`}
                                    {ticket.title.length <= 13 && ticket.title}
                                </h1>
                                <p>
                                    {`${getMonth(
                                        ticket.startsAt.substring(3, 5)
                                    )} ${ticket.startsAt.substring(
                                        0,
                                        2
                                    )} - ${getMonth(
                                        ticket.endsAt.substring(3, 5)
                                    )} ${ticket.endsAt.substring(0, 2)}`}
                                </p>
                                <p>Tickets: {ticket.quantity}</p>
                                <p>
                                    {!(ticket.status === "FINALIZED") && (
                                        <span className="text-success-green flex items-center gap-0.5">
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                size="sm"
                                                className="mb-[2px]"
                                            />{" "}
                                            Active
                                        </span>
                                    )}
                                    {ticket.status === "FINALIZED" && (
                                        <span className="text-failure-red flex items-center gap-0.5">
                                            <FontAwesomeIcon
                                                icon={faCircleXmark}
                                                size="sm"
                                                className="mb-[2px]"
                                            />{" "}
                                            Finalized
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
            <Button
                disabled={selectedTicket === undefined ? true : false}
                text="Download Ticket"
                className="text-white bg-black p-2 rounded-md mb-6 drop-shadow-lg"
                onClick={downloadSelectedTicket}
            />
        </div>
    );
}
