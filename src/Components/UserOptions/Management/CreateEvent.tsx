import { useState } from "react";
import placeholderImage from "../../../assets/placeholder.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../Utils/Button";

export default function CreateEvent() {
    const [eventImage, setEventImage] = useState<string>(placeholderImage);
    const [typeOfEvent, setTypeOfEvent] = useState<string>();
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<string>();

    return (
        <div className="font-spectral flex flex-col justify-center items-center mt-6 px-4 gap-4">
            <div>
                <h1 className="font-karla font-bold text-3xl text-center">
                    Create an Event!
                </h1>
                <h2 className="text-center">
                    Fill the following fields with the required information.
                </h2>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Write the Title here!"
                    className="outline  p-1 rounded-sm"
                />
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
                <img
                    src={eventImage}
                    alt="event-image"
                    className="max-w-60 rounded-md outline outline-1 outline-black"
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
                    />
                </label>
            </div>
            <div>
                <textarea
                    cols={35}
                    rows={5}
                    className="outline  p-2 rounded-sm"
                    placeholder="Write a description here!"
                />
            </div>
            <div className="pt-4 flex items-center justify-evenly gap-4 max-w-72">
                <label htmlFor="start-date" className="relative">
                    <span className="absolute bottom-8 text-lg">Starts:</span>
                    <input
                        type="text"
                        placeholder="DD/MM/YYY"
                        id="start-date"
                        className="outline p-1 rounded-sm w-full"
                    />
                </label>
                <label htmlFor="end-date" className="relative">
                    <span className="absolute bottom-8 text-lg">Ends:</span>
                    <input
                        type="text"
                        placeholder="DD/MM/YYY"
                        id="end-date"
                        className="outline p-1 rounded-sm w-full"
                    />
                </label>
            </div>
            <div className="pt-6 flex items-center justify-evenly gap-4 max-w-72">
                <label htmlFor="country" className="relative">
                    <span className="absolute bottom-8 text-lg">Country:</span>
                    <select
                        name="country-selected"
                        id="country"
                        className="outline outline-black p-1 rounded-sm w-full border-r-2 border-black bg-black text-white"
                    >
                        <option value="selectDefault" selected disabled>
                            Select country
                        </option>
                        <option value="usa">USA</option>
                    </select>
                </label>
                <label htmlFor="end-date" className="relative">
                    <span className="absolute bottom-8 text-lg">Currency:</span>
                    <select
                        name="country-selected"
                        id="country"
                        className="outline outline-black p-1 rounded-sm w-full border-r-2 border-black bg-black text-white"
                    >
                        <option value="selectDefault" selected disabled>
                            Select currency
                        </option>
                        <option value="dollar">Dollar</option>
                    </select>
                </label>
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
                        <option value="defaultOption" selected disabled>
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
                                    placeholder="Account Holder Name"
                                    className="outline  p-1 rounded-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="IBAN"
                                    className="outline  p-1 rounded-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="SWIFT/BIC"
                                    className="outline  p-1 rounded-sm"
                                />
                            </>
                        )}
                        {selectedPaymentMethod === "paypal" && (
                            <input
                                type="email"
                                placeholder="Paypal Email"
                                className="outline  p-1 rounded-sm"
                            />
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
                            />
                        </label>
                    )}
                </div>
            </div>
            <div className="flex gap-2 items-center justify-center pt-6 pb-10">
                <Link
                    to={"/user/menu"}
                    className="flex items-center justify-center text-white bg-black gap-1 p-2 rounded-md"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <Button text="Go back"></Button>
                </Link>
                <Button
                    text="Create"
                    className="text-white bg-black p-2 rounded-md"
                ></Button>
                <Button
                    text="Create and Publish"
                    className="text-white bg-black p-2 rounded-md"
                ></Button>
            </div>
        </div>
    );
}
