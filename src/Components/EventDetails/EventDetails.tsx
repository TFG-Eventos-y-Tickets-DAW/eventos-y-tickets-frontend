import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eventDetails } from "../../types/event";
import { getEventById } from "../../HelperFunctions/apis";
import getMonth from "../../HelperFunctions/GetMonth";
import Button from "../../Utils/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ReactModal from "react-modal";
import ChoosePaymentMethod from "../PaymentModals/ChoosePaymentMethod";
import { ICreateOrderData, IOrderSessionData } from "../../types/orders";
import CreditCardPaymentModal from "../PaymentModals/CreditCardPaymentModal";
import CardDetailsSkeleton from "../../Utils/CardDetailsSkeleton";
import PaypalPaymentMethod from "../PaymentModals/PaypalPaymentMethod";

export default function EventDetails() {
    const [event, setEvent] = useState<eventDetails>();
    const [amountOfTicketsToBuy, setAmountOfTicketsToBuy] = useState<number>(1);
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<string>("paypal");
    const [createOrderData, setCreateOrderData] = useState<ICreateOrderData>();
    const [orderSessionData, setOrderSessionData] = useState<
        IOrderSessionData | Record<string, never>
    >();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { eventId } = useParams();

    useEffect(() => {
        const getEventData = async () => {
            const eventData = await getEventById(eventId);

            setEvent(eventData);
            setTimeout(() => setIsLoading(false), 1000);
        };

        getEventData();
    }, [eventId]);

    const ticketsAvailable: number | undefined =
        event && event.tickets.quantityAvailable > 5
            ? 5
            : event?.tickets.quantityAvailable;

    function startOrderSession() {
        setCreateOrderData({
            eventId: event ? event.id : -1,
            quantity: amountOfTicketsToBuy,
            ticketId: event ? event.tickets.id : -1,
            attendee: {
                name: "",
                email: "",
            },
        });

        setIsModalOpen(!isModalOpen);
    }

    return (
        <div className="font-spectral mt-4 flex flex-col items-center justify-center gap-4">
            {!localStorage.getItem("jwt") && !isLoading && (
                <p className="font-karla text-sm border-t-2 border-b-2 border-red-links text-center w-full">
                    Reminder: you need to{" "}
                    <Link
                        to={"/signin"}
                        className="underline text-red-links hover:no-underline hover:font-bold"
                    >
                        sign in
                    </Link>{" "}
                    to view bought tickets.
                </p>
            )}
            {isLoading && <CardDetailsSkeleton />}
            {!isLoading && (
                <>
                    <div className="flex flex-col justify-center items-center shadow-lg m-4 p-4 gap-4 rounded-lg">
                        <h1 className="font-karla font-bold text-4xl text-center">
                            {event?.title}
                        </h1>
                        <img
                            src={event?.imgSrc}
                            alt="Cover image of event"
                            className="rounded-lg drop-shadow-md"
                        />
                        <h2>
                            {event &&
                                `${getMonth(
                                    event.startsAt.substring(3, 5)
                                )} ${event.startsAt.substring(
                                    0,
                                    2
                                )} - ${getMonth(
                                    event.endsAt.substring(3, 5)
                                )} ${event.endsAt.substring(0, 2)}`}
                        </h2>
                        <p>{event?.description}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col items-center justify-center">
                            <p
                                className={
                                    event &&
                                    event?.tickets.quantityAvailable >
                                        event?.tickets.quantity / 2
                                        ? "text-success-green"
                                        : "text-red-links"
                                }
                            >
                                {event?.tickets.quantityAvailable} tickets left!
                            </p>
                            <Button
                                text="Buy Ticket!"
                                className="text-white bg-black p-2 rounded-md"
                                onClick={startOrderSession}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-1">
                            <select
                                name="ticketsToBuy"
                                id="amountOfTickets"
                                className="text-white bg-black rounded-md p-1 border-r-4 border-black"
                                onChange={(e) => {
                                    setAmountOfTicketsToBuy(
                                        parseInt(e.target.value)
                                    );
                                }}
                                value={amountOfTicketsToBuy}
                            >
                                {Array.from({
                                    length: ticketsAvailable as number,
                                }).map((_e, i) => (
                                    <option key={i} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <p className="text-green-500 bg-black rounded-md py-1 px-2">
                                {event &&
                                    event?.tickets.price *
                                        (amountOfTicketsToBuy as number)}
                                $
                            </p>
                        </div>
                    </div>
                    <Link
                        to={"/"}
                        className="flex items-center justify-center text-white bg-black gap-1 p-2 rounded-md"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <Button text="Go back"></Button>
                    </Link>
                </>
            )}
            <ReactModal
                isOpen={isModalOpen}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                {!orderSessionData?.orderSessionId && (
                    <ChoosePaymentMethod
                        setIsModalOpen={setIsModalOpen}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                        selectedPaymentMethod={selectedPaymentMethod}
                        createOrderData={createOrderData}
                        setOrderSessionData={setOrderSessionData}
                    />
                )}
                {orderSessionData?.orderSessionId &&
                    selectedPaymentMethod == "creditCard" && (
                        <CreditCardPaymentModal
                            setIsModalOpen={setIsModalOpen}
                            setOrderSessionData={setOrderSessionData}
                            orderSessionData={orderSessionData}
                        />
                    )}
                {orderSessionData?.orderSessionId &&
                    selectedPaymentMethod == "paypal" && (
                        <PaypalPaymentMethod
                            setIsModalOpen={setIsModalOpen}
                            setOrderSessionData={setOrderSessionData}
                            orderSessionData={orderSessionData}
                        />
                    )}
            </ReactModal>
        </div>
    );
}
