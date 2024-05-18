import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IOrderDetails } from "../../../types/orders";
import {
    getAllEventDetailsById,
    getAllOrdersOfEvent,
    refundOrder,
} from "../../../HelperFunctions/apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBank,
    faCircleDot,
    faMoneyBillTransfer,
    faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { IEventDetailsForUpdate } from "../../../types/apis";
import getEventFee from "../../../HelperFunctions/getEventFee";
import { IEventStats } from "../../../types/event";
import Button from "../../../Utils/Button";

export function ViewEventStats() {
    const [event, setEvent] = useState<IEventDetailsForUpdate>();
    const [ordersOfEvent, setOrdersOfEvent] = useState<IOrderDetails[]>();
    const [ordersFilter, setOrdersFilter] = useState<"COMPLETED" | "REFUNDED">(
        "COMPLETED"
    );
    const [eventStats, setEventStats] = useState<IEventStats>();
    const [selectedOrder, setSelectedOrder] = useState<
        IOrderDetails | Record<string, never>
    >();
    const { eventId } = useParams();

    useEffect(() => {
        async function getOrdersData() {
            const eventData = await getAllEventDetailsById(eventId);
            const ordersData = await getAllOrdersOfEvent(
                eventId as string,
                ordersFilter
            );

            if (ordersData.error_detail) {
                return;
            }

            const isEventStatsEmpty = JSON.stringify(eventStats) ? false : true;

            if (ordersFilter === "COMPLETED" && isEventStatsEmpty) {
                const payout: number = ordersData.orders?.reduce(
                    (total, order) => total + order.total,
                    0
                ) as number;

                const eventStats: IEventStats = {
                    ticketsSold: ordersData?.orders.length,
                    eventStatus: eventData?.status as string,
                    fee: getEventFee(payout),
                    payout: payout,
                };

                setEventStats(eventStats);
            }

            setEvent(eventData);
            setOrdersOfEvent(ordersData.orders);
        }

        getOrdersData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, ordersFilter]);

    async function refundSelectedOrder() {
        const orderId: number = selectedOrder?.id as number;
        const refundedOrderResponse = await refundOrder(orderId);

        if (refundedOrderResponse.error_detail) {
            console.log(
                "It was not possible to refund order, try again later."
            );
            return;
        }

        console.log(
            `Order with id ${refundedOrderResponse.orderId} was correctly refunded.`
        );
    }

    return (
        <div className="font-spectral mt-8 flex flex-col justify-center gap-2 mb-8">
            <h1 className="text-center text-4xl font-karla font-bold">
                Event Stats
            </h1>
            <div className="grid grid-cols-2 p-4 gap-2 bg-slate-50 rounded-md m-4 drop-shadow-xl outline outline-1">
                <div className="flex flex-col items-center justify-center border-2 border-black rounded-md p-2 shadow-lg text-lg bg-white">
                    <span className="flex items-center justify-center gap-1 ">
                        <FontAwesomeIcon icon={faTicket} />
                        Tickets Sold
                    </span>
                    {eventStats?.ticketsSold}
                </div>
                <div className="flex flex-col items-center justify-center border-2 border-black rounded-md p-2 shadow-lg text-lg bg-white">
                    <span className="flex items-center justify-center gap-1 succ faile">
                        <FontAwesomeIcon
                            icon={faCircleDot}
                            color={
                                event?.status === "PUBLISHED"
                                    ? "rgb(54, 179, 126)"
                                    : "rgb(255, 86, 48)"
                            }
                        />
                        Event Status
                    </span>
                    {eventStats?.eventStatus}
                </div>
                <div className="flex flex-col items-center justify-center border-2 border-black rounded-md p-2 shadow-lg text-lg bg-white">
                    <span className="flex items-center justify-center gap-1">
                        <FontAwesomeIcon icon={faBank} />
                        Payout
                    </span>
                    {eventStats?.payout}
                </div>
                <div className="flex flex-col items-center justify-center border-2 border-black rounded-md p-2 shadow-lg text-lg bg-white">
                    <span className="flex items-center justify-center gap-1">
                        <FontAwesomeIcon icon={faMoneyBillTransfer} />
                        Fee
                    </span>
                    {eventStats?.fee}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center p-2 gap-4">
                <h1 className="text-center text-3xl font-karla font-bold">
                    Orders
                </h1>
                <h2 className="flex gap-2 items-center justify-center">
                    <span
                        className={
                            ordersFilter === "COMPLETED"
                                ? "bg-black text-white p-1 rounded-md outline outline-1 outline-black"
                                : "p-1 rounded-md outline outline-1 outline-black"
                        }
                        onClick={() =>
                            ordersFilter === "COMPLETED"
                                ? true
                                : setOrdersFilter("COMPLETED")
                        }
                    >
                        Completed
                    </span>
                    <span
                        className={
                            ordersFilter === "REFUNDED"
                                ? "bg-black text-white p-1 rounded-md outline outline-1 outline-black"
                                : "p-1 rounded-md outline outline-1 outline-black"
                        }
                        onClick={() =>
                            ordersFilter === "REFUNDED"
                                ? true
                                : setOrdersFilter("REFUNDED")
                        }
                    >
                        Refunded
                    </span>
                </h2>
                {ordersOfEvent?.length === 0 && (
                    <div>The are no orders to show.</div>
                )}
                {ordersOfEvent && ordersOfEvent?.length > 0 && (
                    <>
                        <table>
                            <thead className="bg-black text-white outline outline-1 outline-black">
                                <tr className="border border-black text-center ">
                                    <th className="p-1.5">Order Id</th>
                                    <th className="p-1.5">Buyer</th>
                                    <th className="p-1.5">Total</th>
                                    <th className="p-1.5">Payment Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersOfEvent?.map((order) => {
                                    return (
                                        <tr
                                            key={order.id}
                                            className={
                                                selectedOrder?.id === order.id
                                                    ? "text-center bg-accent-blue"
                                                    : "text-center"
                                            }
                                            onClick={() =>
                                                selectedOrder?.id === order.id
                                                    ? setSelectedOrder({})
                                                    : setSelectedOrder(order)
                                            }
                                        >
                                            <td className="p-1 outline outline-black outline-1">
                                                {order.id}
                                            </td>
                                            <td className="p-1 outline outline-black outline-1">
                                                {order.firstName}
                                            </td>
                                            <td className="p-1 outline outline-black outline-1">
                                                {order.total}
                                            </td>
                                            <td className="p-1 outline outline-black outline-1">
                                                {order.paymentMethod}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Button
                            disabled={selectedOrder?.id ? false : true}
                            text="Refund Order"
                            className="bg-black text-white rounded-md p-2 drop-shadow-xl"
                            onClick={refundSelectedOrder}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
