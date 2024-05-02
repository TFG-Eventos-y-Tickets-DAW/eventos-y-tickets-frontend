import { useState } from "react";
import Button from "../../Utils/Button";
import creditCardIcon from "../../assets/credit-card.png";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    IOrderSessionData,
    IPayment,
    IPaymentMethodCreditCard,
} from "../../types/orders";
import { payOrder } from "../../HelperFunctions/apis";
import toValidDateFormat from "../../HelperFunctions/toValidDateFormat";
import PaymentSuccessful from "./PaymentSuccessful";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ICreditCardPayment {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOrderSessionData: React.Dispatch<
        React.SetStateAction<
            IOrderSessionData | Record<string, never> | undefined
        >
    >;
    orderSessionData: IOrderSessionData | Record<string, never>;
}

export default function CreditCardPaymentModal({
    setIsModalOpen,
    setOrderSessionData,
    orderSessionData,
}: ICreditCardPayment) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [payment, setPayment] = useState<IPayment>();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IPaymentMethodCreditCard>();

    const onSubmit: SubmitHandler<IPaymentMethodCreditCard> = async (data) => {
        const formattedData: IPaymentMethodCreditCard = {
            ...data,
            expiry: toValidDateFormat(data.expiry),
        };

        setIsLoading(true);
        setPayment((payment) => {
            return { ...(payment as IPayment), isPending: true };
        });
        const processPaymentResponse = await payOrder(
            orderSessionData as IOrderSessionData,
            "CREDIT",
            formattedData
        );

        if (processPaymentResponse.error_type) {
            setIsLoading(false);
            setPayment((payment) => {
                return {
                    ...(payment as IPayment),
                    unsuccessfulMessage:
                        "Payment failed, please review credit card details or try again later.",
                    isPending: false,
                };
            });

            return;
        }

        setPayment((payment) => {
            return {
                ...(payment as IPayment),
                isPending: false,
                isSuccessful: true,
            };
        });

        setIsLoading(false);
    };

    function onCancelOrder() {
        setIsModalOpen(false);
        setOrderSessionData({});
    }

    function paymentSuccessfulReset() {
        setIsModalOpen(false);
        setOrderSessionData({});
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white flex flex-col items-center justify-center w-72 border border-black rounded-lg gap-5 font-spectral"
        >
            <h1 className="w-full font-karla font-bold bg-black text-white text-center p-3 rounded-t-lg">
                Buy Tickets
            </h1>
            {isLoading && payment?.isPending && (
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin text-2xl py-4"
                />
            )}
            {!isLoading && !payment?.isPending && (
                <>
                    {payment?.isSuccessful && (
                        <PaymentSuccessful
                            paymentSuccessfulReset={paymentSuccessfulReset}
                            orderSessionData={orderSessionData}
                        />
                    )}
                    {!payment?.isSuccessful && payment?.unsuccessfulMessage && (
                        <div className="text-center font-bold text-failure-red underline mt-2">
                            {payment?.unsuccessfulMessage}
                        </div>
                    )}
                </>
            )}
            {!payment?.isSuccessful && (
                <img
                    src={creditCardIcon}
                    alt="credit-card-image"
                    className="max-w-36"
                />
            )}
            {!isLoading && !payment?.isSuccessful && (
                <>
                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                        <div>
                            <input
                                type="text"
                                placeholder="Card Holder Name..."
                                className="border-[0.5px] border-black rounded-sm p-1 w-52"
                                {...register("cardholderName", {
                                    required: true,
                                })}
                            />
                            {errors.cardholderName && (
                                <p className="font-karla text-sm text-red-links font-bold">
                                    This field is required.
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Card Number..."
                                className="border-[0.5px] border-black rounded-sm p-1 w-52"
                                {...register("cardNumber", {
                                    required: true,
                                    // validate: {
                                    //     isVisa: (value) =>
                                    //         /^(?:4[0-9]{12}(?:[0-9]{3})?)$/.test(
                                    //             value
                                    //         ),
                                    //     isMasterCard: (value) =>
                                    //         /^(?:5[1-5][0-9]{14})$/.test(value),
                                    //     messages: (value) =>
                                    //         !value && [
                                    //             "Invalid credit card format.",
                                    //             "Invalid credit card format.",
                                    //         ],
                                    // },
                                })}
                            />
                            {errors.cardNumber && (
                                // errors.cardNumber.type !== "isVisa" &&
                                // errors.cardNumber.type !== "isMasterCard" &&

                                <p className="font-karla text-sm text-red-links font-bold">
                                    This field is required.
                                </p>
                            )}
                        </div>
                        {/* {errors.cardNumber &&
                            (errors.cardNumber.type === "isMasterCard" ||
                                errors.cardNumber.type === "isVisa") && (
                                <p className="font-karla text-sm text-red-links font-bold">
                                    Invalid credit card format.
                                </p>
                            )} */}
                    </div>

                    <div className="flex justify-center items-center gap-4">
                        <div className="relative">
                            <p className="absolute text-[13px] bottom-[31px] left-0.5">
                                Expiration Date
                            </p>
                            <input
                                type="text"
                                placeholder="MM/YYYY"
                                className="border-[0.5px] border-black rounded-sm p-1 w-24"
                                {...register("expiry", {
                                    required: true,
                                    pattern: {
                                        value: /^([01][1-9]\/20[2-9][1-9])$/,
                                        message: "Invalid expiration date.",
                                    },
                                    maxLength: 7,
                                })}
                            />
                            {errors.expiry && (
                                <p className="font-karla text-[10px] text-red-links font-bold absolute w-28">
                                    {errors.expiry.message ||
                                        "This field is required."}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="CVV/CVC"
                                className="border-[0.5px] border-black rounded-sm p-1 w-24"
                                {...register("cvv", {
                                    required: true,
                                    pattern: {
                                        value: /^([0-9][0-9][0-9])$/,
                                        message: "Invalid cvv.",
                                    },
                                    maxLength: 3,
                                })}
                            />
                            {errors.cvv && (
                                <p className="font-karla text-[10px] text-red-links font-bold absolute w-28">
                                    {errors.cvv.message ||
                                        "This field is required."}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            text="Cancel"
                            className="text-white bg-black p-2 rounded-md mb-6"
                            onClick={onCancelOrder}
                        />
                        <Button
                            text={"Pay $" + orderSessionData.total}
                            className="text-white bg-black p-2 rounded-md mb-6"
                            type="submit"
                        />
                    </div>
                </>
            )}
        </form>
    );
}
