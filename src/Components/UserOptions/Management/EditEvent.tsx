import { useEffect, useState } from "react";
import placeholderImage from "../../../assets/placeholder.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Utils/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    getAllEventDetailsById,
    updateEvent,
    uploadEventImageToServer,
} from "../../../HelperFunctions/apis";
import {
    ErrorResponse,
    ICreateUpdateEventData,
    IEventDetailsForUpdate,
} from "../../../types/apis";
import createEventDateFormat from "../../../HelperFunctions/createEventDateFormat";

interface IFormInput {
    title: string;
    address: string;
    imgSrc: FileList;
    description: string;
    startsAt: string; // YYYY-MM-DD HH:MM:SS
    endsAt: string;
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
    status: boolean;
    country: string;
    currency: string;
    payoutInstrument?: {
        iban: string;
        swiftbic: string;
        paypalEmail: string;
    };
    tickets: {
        quantity: number;
        price: number;
    };
    preValidate: boolean;
}

const eventCategories = [
    "MUSIC",
    "FOOD & DRINK",
    "FASHION",
    "TECHNOLOGY",
    "CONFERENCE",
    "PARTY",
    "FILM",
    "KIDS & FAMILY",
    "OTHER",
];

export default function EditEvent() {
    const [preUpdateEventData, setPreUpdateEventData] =
        useState<IEventDetailsForUpdate>();
    const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [eventImage, setEventImage] = useState<string>(placeholderImage);
    const [typeOfEvent, setTypeOfEvent] = useState<string>();
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<string>("defaultValue");

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors }, 
    } = useForm<IFormInput>();

    const file = watch("imgSrc");
    const navigate = useNavigate();

    const { eventId } = useParams();

    useEffect(() => {
        async function getEventData() {
            const eventData: IEventDetailsForUpdate & ErrorResponse =
                await getAllEventDetailsById(eventId);

            setEventImage(eventData.imgSrc as string);

            setPreUpdateEventData(eventData);
            setTypeOfEvent(eventData.ticketsConfiguration.type.toLowerCase());

            if (eventData.ticketsConfiguration.type === "PAID") {
                setSelectedPaymentMethod(() =>
                    eventData.payoutInstrument?.paypalEmail !== ""
                        ? "paypal"
                        : "bank"
                );
                setValue("payoutInstrument", eventData.payoutInstrument);
                setValue("tickets.price", eventData.ticketsConfiguration.price);
            }

            const startsAt = `${eventData?.startsAt.substring(
                0,
                2
            )}/${eventData?.startsAt.substring(
                3,
                5
            )}/${eventData?.startsAt.substring(6, 10)}`;

            const endsAt = `${eventData?.endsAt.substring(
                0,
                2
            )}/${eventData?.endsAt.substring(
                3,
                5
            )}/${eventData?.endsAt.substring(6, 10)}`;

            setValue("category", eventData.category);
            setValue("startsAt", startsAt);
            setValue("endsAt", endsAt);
            setValue(
                "tickets.quantity",
                eventData.ticketsConfiguration.quantity
            ); 
            setValue("status", !(eventData.status === "DRAFT"));
        }

        getEventData();
    }, [eventId, setValue]);

    useEffect(() => {
        reset({
            payoutInstrument: {},
        });
    }, [selectedPaymentMethod, reset]);

    useEffect(() => {
        if (file && file[0]) {
            const newUrl = URL.createObjectURL(file[0]);

            if (newUrl !== eventImage) {
                setEventImage(newUrl);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, setEventImage]);

    useEffect(() => {
        if (preUpdateEventData) {
            setValue("country", preUpdateEventData.country)
            setValue("currency", preUpdateEventData.currency)
        }
    }, [preUpdateEventData, setValue])

    function buildUpdateEventPayload(data: IFormInput) {
        const isFree = typeOfEvent === "free";
        const isPaypal = selectedPaymentMethod === "paypal";

        const formatedData: ICreateUpdateEventData = isFree
            ? {
                  ...data,
                  imgSrc: "",
                  startsAt: createEventDateFormat(data.startsAt),
                  endsAt: createEventDateFormat(data.endsAt),
                  tickets: {
                      quantity: Number(data.tickets.quantity),
                      price: Number(data.tickets.price) || 0,
                  },
                  status: data.status ? "PUBLISHED" : "DRAFT",
                  preValidate: true,
              }
            : {
                  ...data,
                  imgSrc: "",
                  startsAt: createEventDateFormat(data.startsAt),
                  endsAt: createEventDateFormat(data.endsAt),
                  tickets: {
                      quantity: Number(data.tickets.quantity),
                      price: Number(data.tickets.price) || 0,
                  },
                  status: data.status ? "PUBLISHED" : "DRAFT",
                  preValidate: true,
                  payoutInstrument: isPaypal
                      ? { paypalEmail: data.payoutInstrument?.paypalEmail }
                      : {
                            iban: data.payoutInstrument?.iban,
                            swiftbic: data.payoutInstrument?.swiftbic,
                        },
              };

        return formatedData;
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setIsEditingEvent(true);
        const preValidatedData: ICreateUpdateEventData =
            buildUpdateEventPayload(data);

        const preValidateResponse = await updateEvent(
            preValidatedData,
            eventId as string
        );

        if (!preValidateResponse.preValidate) {
            setErrorMessage(
                "An error occurred when creating the event, please try again later."
            );
            setIsEditingEvent(false);
            return;
        }

        const isNewImg = eventImage !== preUpdateEventData?.imgSrc;

        const imgRef = isNewImg
            ? await uploadEventImageToServer(data.imgSrc)
            : "";

        const updateEventData: ICreateUpdateEventData = isNewImg
            ? {
                  ...preValidatedData,
                  imgSrc: imgRef as string,
                  preValidate: false,
              }
            : {
                  ...preValidatedData,
                  preValidate: false,
              };

        const updateEventResponse = await updateEvent(
            updateEventData,
            eventId as string
        );

        if (updateEventResponse.error_detail) {
            setErrorMessage(
                "An error occurred when creating the event, please try again later."
            );
            setIsEditingEvent(false);
            return;
        }

        navigate("/user/events");
    };

    return (
        <>
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="font-spectral flex flex-col justify-center items-center mt-6 px-4 gap-4"
        >
            <div>
                <h1 className="font-karla font-bold text-3xl text-center">
                    Edit Event
                </h1>
                <h2 className="text-center">
                    Update the fields you would like to change.
                </h2>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Write the Title here!"
                    className="outline  p-1 rounded-sm"
                    {...register("title", {
                        required: true,
                    })}
                    defaultValue={preUpdateEventData?.title}
                />
            </div>
            {errors.title && (
                <span className="font-karla text-sm text-red-links font-bold">
                    "Title is required."
                </span>
            )}
            <div className="flex flex-col justify-center items-center gap-3">
                <img
                    src={eventImage}
                    alt="event-image"
                    className="max-w-60 rounded-md outline outline-1 outline-black object-cover aspect-square"
                />
                <label
                    htmlFor="image-cover-input"
                    className="text-white bg-black p-2 rounded-md"
                >
                    Upload Cover Image
                    <input
                        type="file"
                        id="image-cover-input"
                        className="hidden"
                        {...register("imgSrc")}
                    />
                </label>
                {errors.imgSrc && (
                    <span className="font-karla text-sm text-red-links font-bold">
                        "A cover image is required"
                    </span>
                )}
            </div>
            <div>
                <textarea
                    cols={35}
                    rows={5}
                    className="outline  p-2 rounded-sm"
                    placeholder="Write a description here!"
                    {...register("description", {
                        required: true,
                    })}
                    defaultValue={preUpdateEventData?.description}
                />
            </div>
            {errors.description && (
                <span className="font-karla text-sm text-red-links font-bold">
                    "Description is required"
                </span>
            )}
            <div>
                <input
                    type="text"
                    placeholder="Write the address here!"
                    className="outline  p-1 rounded-sm w-72"
                    {...register("address", {
                        required: true,
                    })}
                    defaultValue={preUpdateEventData?.address}
                />
            </div>
            {errors.address && (
                <span className="font-karla text-sm text-red-links font-bold">
                    "Address is required."
                </span>
            )}
            <div className="pt-6 flex items-center justify-evenly gap-4 max-w-72">
                <label htmlFor="start-date" className="relative">
                    <span className="absolute bottom-8 text-lg">Starts:</span>
                    <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        id="start-date"
                        className="outline p-1 rounded-sm w-full"
                        {...register("startsAt", {
                            required: true,
                            pattern:
                                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                        })}
                        defaultValue={`${preUpdateEventData?.startsAt.substring(
                            0,
                            2
                        )}/${preUpdateEventData?.startsAt.substring(
                            3,
                            5
                        )}/${preUpdateEventData?.startsAt.substring(6, 10)}`}
                    />
                </label>

                <label htmlFor="end-date" className="relative">
                    <span className="absolute bottom-8 text-lg">Ends:</span>
                    <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        id="end-date"
                        className="outline p-1 rounded-sm w-full"
                        {...register("endsAt", {
                            required: true,
                            pattern:
                                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                        })}
                    />
                </label>
            </div>
            {errors.startsAt && (
                <span className="font-karla text-sm text-red-links font-bold">
                    {errors.startsAt.type === "pattern" && (
                        <p className="text-center">
                            Invalid start date format. Please use DD/MM/YYYY.
                        </p>
                    )}
                    {!(errors.startsAt.type === "pattern") &&
                        "A start date is required"}
                </span>
            )}
            {errors.endsAt && (
                <span className="font-karla text-sm text-red-links font-bold">
                    {errors.endsAt.type === "pattern" && (
                        <p className="text-center">
                            Invalid end date format. Please use DD/MM/YYYY.
                        </p>
                    )}
                    {!(errors.endsAt.type === "pattern") &&
                        "An end date is required"}
                </span>
            )}
            <div className="pt-6 flex items-center justify-evenly gap-4 max-w-72">
                <label htmlFor="country" className="relative">
                    <span className="absolute bottom-8 text-lg">Country:</span>
                    <select
                        id="country"
                        className="outline outline-black p-1 rounded-sm w-full border-r-2 border-black bg-black text-white"
                        {...register("country", {
                            required: true,
                        })}
                        disabled
                    >
                        <option value="selectDefault">Select country</option>
                        <option value="US">US</option>
                    </select>
                    {errors.country && (
                        <span className="font-karla text-sm text-red-links font-bold">
                            "This field is required"
                        </span>
                    )}
                </label>
                <label htmlFor="currency" className="relative">
                    <span className="absolute bottom-8 text-lg">Currency:</span>
                    <select
                        id="currency"
                        className="outline outline-black p-1 rounded-sm w-full border-r-2 border-black bg-black text-white"
                        {...register("currency", {
                            required: true,
                        })}
                        disabled
                    >
                        <option value="selectDefault">Select currency</option>
                        <option value="USD">USD</option>
                    </select>
                    {errors.currency && (
                        <span className="font-karla text-sm text-red-links font-bold">
                            "This field is required"
                        </span>
                    )}
                </label>
            </div>
            <div className="py-2">
                <h1 className="text-lg">What is the category of the event?</h1>
                <select
                    id="eventCategory"
                    className="outline outline-black p-1 rounded-sm w-full border-r-2 border-black bg-black text-white"
                    {...register("category", {
                        required: true,
                    })}
                >
                    <option value="selectDefault" disabled>
                        Select a category
                    </option>
                    {eventCategories.map((category) => {
                        return (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        );
                    })}
                </select>
                {errors.category && (
                    <span className="font-karla text-sm text-red-links font-bold">
                        "This field is required"
                    </span>
                )}
            </div>
            <div>
                <h2 className="text-lg font-semibold font-karla">
                    What type of event it will be?
                </h2>
                <div className="flex justify-evenly">
                    <label htmlFor="free-event">
                        <input
                            type="radio"
                            name="typeOfEvent"
                            id="free-event"
                            value={"free"}
                            checked={typeOfEvent === "free"}
                            className="align-middle mr-1"
                            onChange={(e) => {
                                setTypeOfEvent(e.target.value);
                                setSelectedPaymentMethod("defaultOption");
                            }}
                        />
                        <span
                            className={
                                typeOfEvent === "free"
                                    ? "align-middle text-lg font-semibold"
                                    : "align-middle text-lg"
                            }
                        >
                            Free
                        </span>
                    </label>
                    <label htmlFor="paid-event">
                        <input
                            type="radio"
                            name="typeOfEvent"
                            id="paid-event"
                            value={"paid"}
                            checked={typeOfEvent === "paid"}
                            className="align-middle mr-1"
                            onChange={(e) => {
                                setTypeOfEvent(e.target.value);
                                setSelectedPaymentMethod("defaultOption");
                            }}
                        />
                        <span
                            className={
                                typeOfEvent === "paid"
                                    ? "align-middle text-lg font-semibold"
                                    : "align-middle text-lg"
                            }
                        >
                            Paid
                        </span>
                    </label>
                </div>
            </div>
            {typeOfEvent === "paid" && (
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-center">
                        After the event ends, you will be paid on the selected
                        payment method:
                    </h1>
                    <select
                        name="paymentMethod"
                        id="payment-method"
                        className="outline outline-black p-1 rounded-sm border-r-2 border-black bg-black text-white"
                        value={selectedPaymentMethod}
                        onChange={(e) =>
                            setSelectedPaymentMethod(e.target.value)
                        }
                    >
                        <option value="defaultValue">
                            Select payment method
                        </option>
                        <option value="bank">Direct Bank Deposit</option>
                        <option value="paypal">Paypal</option>
                    </select>
                    <div className="flex flex-col items-center justify-center gap-4">
                        {selectedPaymentMethod === "bank" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="IBAN"
                                    className="outline  p-1 rounded-sm"
                                    {...register("payoutInstrument.iban", {
                                        required: true,
                                    })}
                                />
                                {errors.payoutInstrument?.iban && (
                                    <span className="font-karla text-sm text-red-links font-bold">
                                        "This field is required"
                                    </span>
                                )}
                                <input
                                    type="text"
                                    placeholder="SWIFT/BIC"
                                    className="outline  p-1 rounded-sm"
                                    {...register("payoutInstrument.swiftbic", {
                                        required: true,
                                    })}
                                />
                                {errors.payoutInstrument?.swiftbic && (
                                    <span className="font-karla text-sm text-red-links font-bold">
                                        "This field is required"
                                    </span>
                                )}
                            </>
                        )}
                        {selectedPaymentMethod === "paypal" && (
                            <>
                                <input
                                    type="email"
                                    placeholder="Paypal Email"
                                    className="outline  p-1 rounded-sm"
                                    {...register(
                                        "payoutInstrument.paypalEmail",
                                        {
                                            required: true,
                                        }
                                    )}
                                />
                                {errors.payoutInstrument?.paypalEmail && (
                                    <span className="font-karla text-sm text-red-links font-bold">
                                        "This field is required"
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center">
                <h1 className="text-center">
                    Select the amount of available tickets{" "}
                    {typeOfEvent === "paid" && "and price of each"} for the
                    event:
                </h1>
                <div className="pt-8 flex items-center justify-evenly gap-4 max-w-44">
                    <label htmlFor="numOfTickets" className="relative">
                        <span className="absolute bottom-8 text-lg">
                            Tickets:
                        </span>
                        <input
                            type="number"
                            placeholder="000"
                            id="numOfTickets"
                            className={
                                typeOfEvent === "paid"
                                    ? "outline p-1 rounded-sm w-full"
                                    : "outline p-1 rounded-sm max-w-20"
                            }
                            {...register("tickets.quantity", {
                                required: true,
                            })}
                        />
                    </label>
                    {typeOfEvent === "paid" && (
                        <label htmlFor="pricePerticket" className="relative">
                            <span className="absolute bottom-8 text-lg">
                                Price:
                            </span>
                            <input
                                type="number"
                                placeholder="00.00$"
                                id="pricePerticket"
                                className="outline p-1 rounded-sm w-full"
                                {...register("tickets.price", {
                                    required: true,
                                })}
                            />
                        </label>
                    )}
                </div>
            </div>
            {errors.tickets?.quantity && (
                <span className="font-karla text-sm text-red-links font-bold">
                    "Please specify the amount of tickets available."
                </span>
            )}
            {errors.tickets?.price && typeOfEvent === "paid" && (
                <span className="font-karla text-sm text-red-links font-bold">
                    "It is required to provide a price per ticket."
                </span>
            )}
            {!(
                preUpdateEventData?.status === "PUBLISHED" ||
                preUpdateEventData?.status === "FINALIZED"
            ) && (
                <>
                    <h1 className="font-spectral text-center pt-4">
                        The event is not public, toggle the following button if
                        you would like to publish it.
                    </h1>
                    <div className="flex">
                        <input
                            type="checkbox"
                            id="choose-me"
                            className="peer hidden"
                            {...register("status")}
                        />
                        <label
                            htmlFor="choose-me"
                            className="select-none cursor-pointer rounded-lg border-2 border-black
                    py-3 px-6 font-bold text-black transition-colors duration-200 ease-in-out peer-checked:bg-black peer-checked:text-white peer-checked:border-black"
                        >
                            {" "}
                            Publish Event{" "}
                        </label>
                    </div>
                </>
            )}
            {errorMessage !== "" && <div>{errorMessage}</div>}
            <div className="flex gap-2 items-center justify-center pt-6 pb-10">
                <Link
                    to={"/user/events"}
                    className="flex items-center justify-center text-white bg-black gap-1 p-2 rounded-md"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <Button text="Go back"></Button>
                </Link>
                <Button
                    disabled={preUpdateEventData?.status === "FINALIZED"}
                    type="submit"
                    text="Update"
                    className="text-white bg-black p-2 rounded-md"
                    isLoading={isEditingEvent}
                    isLoadingText="Updating..."
                ></Button>
            </div>
        </form>
        </>
    );
}
