import {
    faCircleCheck,
    faCircleXmark,
    faMagnifyingGlass,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { event } from "../../types/event";
import { getUserOwnedEvents } from "../../HelperFunctions/apis";
import { ErrorResponse } from "../../types/apis";
import getMonth from "../../HelperFunctions/GetMonth";
import Button from "../../Utils/Button";
import { useNavigate } from "react-router-dom";

export default function UserEvents() {
    const [userOwnedEvents, setUserOwnedEvents] = useState<event[]>();
    const [selectedEvent, setSelectedEvent] = useState<event>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function getUserOwnedEventsData() {
            const userOwnedEventsData: event[] & ErrorResponse =
                await getUserOwnedEvents();

            if (userOwnedEventsData.error_type) {
                setUserOwnedEvents([]);
                console.log(
                    "There was an error while trying to get user events, please try again later."
                );
                return;
            }

            setUserOwnedEvents(userOwnedEventsData);
            setIsLoading(false);
        }

        getUserOwnedEventsData();
    }, []);

    return (
        <div className="flex flex-col p-6 font-spectral gap-2 ">
            <h1 className="font-karla font-bold text-3xl drop-shadow-2xl">
                My Events
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
                    userOwnedEvents?.map((event) => (
                        <div
                            key={event.id}
                            className={
                                selectedEvent?.id === event.id
                                    ? "flex items-center drop-shadow-2xl bg-white px-4 py-2 gap-4 rounded-md  outline outline-4 outline-blue-links"
                                    : "flex items-center drop-shadow-2xl bg-white px-4 py-2 gap-4 rounded-md "
                            }
                            onClick={() => {
                                selectedEvent?.id === event.id
                                    ? setSelectedEvent(undefined)
                                    : setSelectedEvent(event);
                            }}
                        >
                            <img
                                src={event.imgSrc}
                                alt="event-image"
                                className="aspect-square max-w-20 object-cover border border-black rounded-md"
                            />
                            <div className="flex flex-col text-sm">
                                <h1 className="font-karla font-bold text-xl">
                                    {event.title.length > 13 &&
                                        `${event.title.substring(0, 13)}...`}
                                    {event.title.length <= 13 && event.title}
                                </h1>
                                <p>
                                    {`${getMonth(
                                        event.startsAt.substring(3, 5)
                                    )} ${event.startsAt.substring(
                                        0,
                                        2
                                    )} - ${getMonth(
                                        event.endsAt.substring(3, 5)
                                    )} ${event.endsAt.substring(0, 2)}`}
                                </p>
                                <p>{event.status}</p>
                                <p>
                                    {!(event.status === "FINALIZED") && (
                                        <span className="text-success-green flex items-center gap-0.5">
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                size="sm"
                                                className="mb-[2px]"
                                            />{" "}
                                            Active
                                        </span>
                                    )}
                                    {event.status === "FINALIZED" && (
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
                disabled={selectedEvent === undefined ? true : false}
                text="Edit or View Event"
                className="text-white bg-black p-2 rounded-md mb-6 drop-shadow-lg"
                onClick={() => navigate(`edit/${selectedEvent?.id}`)}
            />
        </div>
    );
}
