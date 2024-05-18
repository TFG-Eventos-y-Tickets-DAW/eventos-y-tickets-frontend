import { useState } from "react";
import Button from "../Utils/Button";
import { IOrderSessionData } from "../../types/orders";
import { ErrorResponse, IPayOrderResponsePaypal } from "../../types/apis";
import {
    abandonPaypalOrder,
    catchPaypalOrder,
    getPaypalOrderStatus,
    payOrder,
} from "../../HelperFunctions/apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface IPaypalPaymentMethod {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOrderSessionData: React.Dispatch<
        React.SetStateAction<
            IOrderSessionData | Record<string, never> | undefined
        >
    >;
    orderSessionData: IOrderSessionData | Record<string, never>;
}

const waitMilliseconds: (milliseconds: number) => Promise<void> = (
    milliseconds: number
) => {
    return new Promise((res) => {
        setTimeout(res, milliseconds);
    });
};

export default function PaypalPaymentMethod({
    setIsModalOpen,
    setOrderSessionData,
    orderSessionData,
}: IPaypalPaymentMethod) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPaymentDone, setIsPaymentDone] = useState<boolean>(false);
    const [paypalOrderId, setPaypalOrderId] = useState<number>(-1);

    async function onCancelOrder() {
        await abandonPaypalOrder(
            orderSessionData as IOrderSessionData,
            paypalOrderId as number
        );
        setIsModalOpen(false);
        setOrderSessionData({});
    }

    async function processPaypalPayment() {
        setIsLoading(true);

        let paypalOrderStatus: string = "";

        const paypalPaymentResponse = (await payOrder(
            orderSessionData as IOrderSessionData,
            "PAYPAL"
        )) as IPayOrderResponsePaypal & ErrorResponse;

        setPaypalOrderId(paypalPaymentResponse.orderId);

        window.open(
            paypalPaymentResponse.redirectUrl,
            "_blank",
            "location=yes,height=570,width=520,scrollbars=yes,status=yes"
        );

        while (paypalOrderStatus !== "COMPLETED") {
            console.log("Waiting for user payment...");
            await waitMilliseconds(1000);

            const status = (
                await getPaypalOrderStatus(
                    paypalPaymentResponse.paypalOrderId,
                    paypalPaymentResponse.orderId
                )
            ).status;

            if (status === "ABANDONED") {
                break;
            }

            if (status === "APPROVED") {
                console.log("Payment has been approved.");
                paypalOrderStatus = "APPROVED";
                if (
                    (
                        await catchPaypalOrder(
                            paypalPaymentResponse.paypalOrderId
                        )
                    ).status === "COMPLETED"
                ) {
                    console.log("Payment has been completed.");
                    paypalOrderStatus = "COMPLETED";
                }
            }
        }

        setIsPaymentDone(true);
        setIsLoading(false);
    }

    return (
        <>
            <div className="bg-white flex flex-col items-center justify-center w-72 border border-black rounded-lg gap-6 font-spectral">
                <h1 className="w-full font-karla font-bold bg-black text-white text-center p-3 rounded-t-lg">
                    Buy Tickets
                </h1>
                {!isLoading && !isPaymentDone && (
                    <div className="flex flex-col items-center justify-center gap-6 px-4 py-2">
                        <div>
                            A new window will open to process the paypal
                            payment, click on the button to begin.
                        </div>
                        <div className="flex gap-4">
                            <Button
                                text="Cancel"
                                className="text-white bg-black p-2 rounded-md mb-6"
                                onClick={onCancelOrder}
                            />
                            <Button
                                text={"Pay $" + orderSessionData.total}
                                className="text-white bg-black p-2 rounded-md mb-6"
                                onClick={processPaypalPayment}
                            />
                        </div>
                    </div>
                )}
                {isLoading && (
                    <div className="flex flex-col justify-center items-center py-4 gap-2 text-lg">
                        <h1>Waiting for payment...</h1>
                        <FontAwesomeIcon
                            icon={faSpinner}
                            className="animate-spin text-2xl py-4"
                        />
                        <Button
                            text="Cancel"
                            className="text-white bg-black p-2 rounded-md mb-6"
                            onClick={onCancelOrder}
                            disabled={paypalOrderId === -1}
                        />
                    </div>
                )}
                {!isLoading && isPaymentDone && (
                    <div className="flex flex-col items-center justify-center gap-6 px-4 py-2">
                        <div className="p-1">
                            Payment of {orderSessionData.total}$ was successful!
                            You will recieve the tickets bought via email
                            shortly.
                        </div>
                        <div className="flex gap-2">
                            <Button
                                text="Close"
                                className="text-white bg-black px-4 py-2 rounded-md mb-6"
                                onClick={onCancelOrder}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
