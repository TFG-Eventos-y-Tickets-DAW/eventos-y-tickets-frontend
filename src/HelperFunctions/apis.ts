import {
    LoginResponse,
    ErrorResponse,
    ISignInResponse,
    IPayOrderResponseCard,
    IPayOrderResponsePaypal,
} from "../types/apis";
import { eventDetails } from "../types/event";
import {
    ICreateOrderData,
    IOrderSessionData,
    IPaymentMethodCreditCard,
} from "../types/orders";

export const serverUrl: string = "https://api.eventngreet.com/";

export async function fetchPublicEvents(
    itemsPerPage: number = 0,
    paginationToken: string = ""
) {
    const bodyParameters =
        itemsPerPage === 0
            ? {
                  filters: {
                      status: "PUBLISHED",
                  },
                  paginationToken: paginationToken,
              }
            : {
                  filters: {
                      status: "PUBLISHED",
                  },
                  itemsPerPage: itemsPerPage,
              };

    const events = await fetch(`${serverUrl}/api/v1/events`, {
        method: "POST",
        body: JSON.stringify(bodyParameters),
    }).then((response) => {
        return response.json();
    });

    return events;
}

export async function getEventById(id: string | undefined) {
    const event = await fetch(`${serverUrl}/api/v1/event/public/${id}`);
    const eventJson: eventDetails = await event.json();

    return eventJson;
}

export async function login(credentials: { email: string; password: string }) {
    const response = await fetch(`${serverUrl}/api/v1/user/signin`, {
        method: "POST",
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
        }),
    });

    const responseJson: LoginResponse & ErrorResponse = await response.json();

    return responseJson;
}

export async function signUp(newUserData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) {
    const response = await fetch(`${serverUrl}/api/v1/user/signup`, {
        method: "POST",
        body: JSON.stringify({
            firstName: newUserData.firstName,
            lastName: newUserData.lastName,
            email: newUserData.email,
            password: newUserData.password,
            isAnonymous: false,
        }),
    });

    const responseJson: ISignInResponse & ErrorResponse = await response.json();

    return responseJson;
}

export async function createOrderSession(createOrderData: ICreateOrderData) {
    const orderSessionId = await fetch(`${serverUrl}/api/v1/order/create`, {
        method: "POST",
        body: JSON.stringify(createOrderData),
    }).then((res) => res.json());

    return {
        orderSessionId: orderSessionId.orderId,
        total: orderSessionId.total,
        eventId: orderSessionId.eventId,
    };
}

export async function payOrder(
    orderSessionData: IOrderSessionData,
    paymentMethodDetails: IPaymentMethodCreditCard,
    paymentMethod: "CREDIT" | "PAYPAL"
) {
    const paymentMethodInformation =
        paymentMethod === "CREDIT" ? paymentMethodDetails : {};

    const bodyParameters = {
        eventId: orderSessionData.eventId,
        paymentMethod: paymentMethod,
        paymentMethodDetails: paymentMethodInformation,
    };

    const payOrderResponse:
        | (IPayOrderResponseCard & ErrorResponse)
        | (IPayOrderResponsePaypal & ErrorResponse) = await fetch(
        `${serverUrl}/api/v1/order/${orderSessionData.orderSessionId}/pay`,
        {
            method: "POST",
            body: JSON.stringify(bodyParameters),
        }
    ).then((res) => res.json());

    return payOrderResponse;
}
