import Button from "../Utils/Button";
import { IOrderSessionData } from "../../types/orders";

interface IPaymentSuccessful {
    orderSessionData: IOrderSessionData | Record<string, never>;
    paymentSuccessfulReset: () => void;
}

export default function PaymentSuccessful({
    paymentSuccessfulReset,
    orderSessionData,
}: IPaymentSuccessful) {
    return (
        <>
            <div className="p-4">
                Payment of {orderSessionData.total}$ was successful! You will
                recieve the tickets bought via email shortly.
            </div>
            <div className="flex gap-2">
                <Button
                    text="Close"
                    className="text-white bg-black px-4 py-2 rounded-md mb-6"
                    onClick={paymentSuccessfulReset}
                />
            </div>
        </>
    );
}
