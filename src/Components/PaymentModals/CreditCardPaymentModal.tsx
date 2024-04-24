import { useState } from "react";
import Button from "../../Utils/Button";
import creditCardIcon from "../../assets/credit-card.png";
import { SubmitHandler, useForm } from "react-hook-form";

interface IformInput {
    cardHolderName: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
}

interface IChoosePaymentMethod {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOrderSessionId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function CreditCardPaymentModal({
    setIsModalOpen,
    setOrderSessionId,
}: IChoosePaymentMethod) {
    const [isLoading, SetIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IformInput>();

    const onSubmit: SubmitHandler<IformInput> = async (data) => {
        // SetIsLoading(true);
        console.log(data);
    };

    function onCancelOrder() {
        setIsModalOpen(false);
        setOrderSessionId("");
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white flex flex-col items-center justify-center w-72 border border-black rounded-lg gap-6 font-spectral"
        >
            <h1 className="w-full font-karla font-bold bg-black text-white text-center p-3 rounded-t-lg">
                Buy Tickets
            </h1>
            {isLoading && <h1>Loading...</h1>}
            {!isLoading && (
                <>
                    <div className="flex flex-col items-center justify-center gap-4 w-full">
                        <img
                            src={creditCardIcon}
                            alt="credit-card-image"
                            className="max-w-36"
                        />
                        <div>
                            <input
                                type="text"
                                placeholder="Card Holder Name..."
                                className="border-[0.5px] border-black rounded-sm p-1 w-52"
                                {...register("cardHolderName", {
                                    required: true,
                                })}
                            />
                            {errors.cardHolderName && (
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
                                {...register("expirationDate", {
                                    required: true,
                                    pattern: {
                                        value: /^([01][1-9]\/20[2-9][1-9])$/,
                                        message: "Invalid expiration date.",
                                    },
                                    maxLength: 7,
                                })}
                            />
                            {errors.expirationDate && (
                                <p className="font-karla text-[10px] text-red-links font-bold absolute w-28">
                                    {errors.expirationDate.message ||
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
                                        value: /^([1-9][1-9][1-9])$/,
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
                            text="Continue"
                            className="text-white bg-black p-2 rounded-md mb-6"
                            type="submit"
                        />
                    </div>
                </>
            )}
        </form>
    );
}
