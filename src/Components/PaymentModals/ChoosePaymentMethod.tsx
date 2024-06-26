import paypalIcon from "../../assets/paypal.png";
import creditCardIcon from "../../assets/credit-card.png";
import Button from "../Utils/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { ICreateOrderData, IOrderSessionData } from "../../types/orders";
import { createOrderSession, payOrder } from "../../HelperFunctions/apis";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ErrorResponse, IPayOrderResponseCard } from "../../types/apis";

interface IChoosePaymentMethod {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedPaymentMethod: string | undefined;
    setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
    setOrderSessionData: React.Dispatch<
        React.SetStateAction<
            IOrderSessionData | Record<string, never> | undefined
        >
    >;
    createOrderData: ICreateOrderData | undefined;
    isFreeEvent: boolean;
}

interface IformInput {
    name: string;
    email: string;
}

export default function ChoosePaymentMethod({
    setIsModalOpen,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    createOrderData,
    setOrderSessionData,
    isFreeEvent,
}: IChoosePaymentMethod) {
    const [isLoading, SetIsLoading] = useState<boolean>(false);
    const [paymentResponse, setPaymentResponse] = useState<(IPayOrderResponseCard & ErrorResponse | null)>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IformInput>();

    const onSubmit: SubmitHandler<IformInput> = async (data) => {
        SetIsLoading(true);
        const createOrderPayload: ICreateOrderData = {
            ...(createOrderData as ICreateOrderData),
            attendee: data,
        };

        const orderSessionData = await createOrderSession(createOrderPayload);

        if (isFreeEvent) {
            // We want to "pay" the order directly
            const processPaymentResponse = await payOrder(orderSessionData, "FREE");
            setPaymentResponse(processPaymentResponse as (IPayOrderResponseCard & ErrorResponse));
            SetIsLoading(false);
            return;
        }

        setOrderSessionData(orderSessionData);
    };

    const renderChoosePaymentMethodSelect = () => (
        <>
            <select
                name="paymentMethod"
                id="selectedPaymentMethod"
                className="text-white bg-black rounded-md p-1 border-r-4 border-black"
                value={selectedPaymentMethod}
                onChange={(e) =>
                    setSelectedPaymentMethod(e.target.value)
                }
            >
                <option value="paypal">Paypal</option>
                <option value="creditCard">Credit Card</option>
            </select>
            {selectedPaymentMethod === "paypal" ? (
                <img
                    src={paypalIcon}
                    alt="paypal icon"
                    className="max-w-24 max-h-20 lg:max-w-32 lg:max-h-28 md:max-w-32 md:max-h-28"
                />
            ) : (
                <img
                    src={creditCardIcon}
                    alt="credit card icon"
                    className="max-w-20 max-h-20 lg:max-w-32 lg:max-h-28 md:max-w-32 md:max-h-28"
                />
            )}
        </>
    )

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white flex flex-col items-center justify-center w-72 border border-black rounded-lg gap-6 lg:text-2xl lg:w-96 lg:gap-9 md:text-2xl md:w-96 md:gap-9"
        >
            <h1 className="w-full font-karla font-bold bg-black text-white text-center p-3 rounded-t-lg">
                Buy Tickets
            </h1>
            {isLoading && (
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin text-2xl py-4"
                />
            )}
            {!isLoading && paymentResponse !== null && paymentResponse?.status === "COMPLETED" &&
                <>
                    <div className="p-4">
                        Order was successful! You will
                        recieve the tickets reserved via email shortly.
                    </div>
                    <div className="flex gap-2">
                        <Button
                            text="Close"
                            className="text-white bg-black px-4 py-2 rounded-md mb-6"
                            onClick={closeModal}
                        />
                    </div>
                </>
            }
            {!isLoading && paymentResponse !== null && paymentResponse?.status !== "COMPLETED" &&
                <>
                    <div className="p-4">
                        Something went wrong, please try again later.
                    </div>
                    <div className="flex gap-2">
                        <Button
                            text="Close"
                            className="text-white bg-black px-4 py-2 rounded-md mb-6"
                            onClick={closeModal}
                        />
                    </div>
                </>
            }
            {!isLoading && paymentResponse === null && (
                <>
                    <div className="px-8 flex flex-col gap-4 font-spectral">
                        <div>
                            <input
                                type="text"
                                placeholder="First Name..."
                                className="border-[0.5px] border-black rounded-sm p-1"
                                {...register("name", {
                                    required: true,
                                })}
                            />
                            {errors.name && (
                                <p className="font-karla text-sm text-red-links font-bold">
                                    This field is required.
                                </p>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email..."
                                className="border-[0.5px] border-black rounded-sm p-1"
                                {...register("email", {
                                    required: true,
                                    pattern: {
                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address.",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="font-karla text-sm text-red-links font-bold">
                                    {errors.email.message ||
                                        "This field is required."}
                                </p>
                            )}
                            <p className="absolute text-[10px] lg:text-sm md:text-sm">
                                <span className="text-failure-red font-bold">
                                    *
                                </span>
                                Your tickets will be send to this address.
                            </p>
                        </div>
                    </div>
                    {!isFreeEvent && <h1 className="font-karla font-bold">
                        Choose payment method:
                    </h1>}
                    <div className="flex flex-col justify-center items-center gap-2">
                        {!isFreeEvent && renderChoosePaymentMethodSelect()}
                        <div className="flex gap-2 lg:gap-6 md:gap-6">
                            <Button
                                text="Cancel"
                                className="text-white bg-black p-2 rounded-md mb-6"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <Button
                                text={!isFreeEvent ? "Continue" : "Confirm"}
                                className="text-white bg-black p-2 rounded-md mb-6"
                                type="submit"
                            />
                        </div>
                    </div>
                </>
            )}
        </form>
    );
}
