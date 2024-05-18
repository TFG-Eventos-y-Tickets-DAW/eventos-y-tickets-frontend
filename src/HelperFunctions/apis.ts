import {
    LoginResponse,
    ErrorResponse,
    ISignInResponse,
    IPayOrderResponseCard,
    IPayOrderResponsePaypal,
    IPaypalOrderStatus,
    IUploadImageToServer,
    ICreateUpdateEventData,
    IPreValidateResponse,
    IOwnedEventsResponse,
    IEventDetailsForUpdate,
    IOrdersOfEventResponse,
    IRefundOrderResponse,
} from "../types/apis";
import { ITickets, eventDetails } from "../types/event";
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
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
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
    paymentMethod: "CREDIT" | "PAYPAL",
    paymentMethodDetails?: IPaymentMethodCreditCard
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

export async function getPaypalOrderStatus(
    paypalOrderId: string,
    orderId: number
) {
    const paypalOrderStatus: IPaypalOrderStatus & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/order/${orderId}/paypal/${paypalOrderId}`
    ).then((response) => response.json());

    return paypalOrderStatus;
}

export async function catchPaypalOrder(paypalOrderId: string) {
    const paypalOrderStatus: IPaypalOrderStatus & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/order/paypal/capture`,
        {
            method: "POST",
            body: JSON.stringify({ paypalOrderId: paypalOrderId }),
        }
    ).then((response) => response.json());

    return paypalOrderStatus;
}

export async function abandonPaypalOrder(
    orderSessionData: IOrderSessionData,
    orderId: number
) {
    const paypalOrderStatus: IPaypalOrderStatus & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/order/abandon`,
        {
            method: "POST",
            body: JSON.stringify({
                orderSessionId: orderSessionData.orderSessionId,
                eventId: orderSessionData.eventId,
                orderId: orderId,
            }),
        }
    ).then((response) => response.json());

    return paypalOrderStatus;
}

export async function getCurrentUserTickets() {
    const tickets: ITickets & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/tickets`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        }
    ).then((response) => response.json());

    return tickets.tickets;
}

export async function uploadEventImageToServer(img: FileList) {
    const bodyRequestData: IUploadImageToServer & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/event/get_presigned_url?extension=png`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        }
    ).then((response) => response.json());

    const postData = bodyRequestData.presignedPostData.fields;
    const formData = new FormData();

    formData.append("Content-Type", postData["Content-Type"]);
    formData.append("key", postData.key);
    formData.append("AWSAccessKeyId", postData.AWSAccessKeyId);
    formData.append("x-amz-security-token", postData["x-amz-security-token"]);
    formData.append("policy", postData.policy);
    formData.append("signature", postData.signature);
    formData.append("file", img[0]);

    const statusCode = await fetch(`${bodyRequestData.presignedPostData.url}`, {
        method: "POST",
        body: formData,
    }).then((response) => response.status);

    if (statusCode === 204) {
        return bodyRequestData.potentialEventImgSrc;
    }

    return {
        error_type: "Unsuccesful api call.",
        error_detail: "An error has occured",
    } as ErrorResponse;
}

export async function createEvent(newEventData: ICreateUpdateEventData) {
    const createEventResponse:
        | (ICreateUpdateEventData & ErrorResponse)
        | (IPreValidateResponse & ErrorResponse) = await fetch(
        `${serverUrl}/api/v1/event/create`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            method: "POST",
            body: JSON.stringify(newEventData),
        }
    ).then((response) => response.json());

    return createEventResponse;
}

export async function updateEvent(
    updatedEventData: ICreateUpdateEventData,
    id: string
) {
    const createEventResponse:
        | (ICreateUpdateEventData & ErrorResponse)
        | (IPreValidateResponse & ErrorResponse) = await fetch(
        `${serverUrl}/api/v1/event/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            method: "PUT",
            body: JSON.stringify(updatedEventData),
        }
    ).then((response) => response.json());

    return createEventResponse;
}

export async function getUserOwnedEvents() {
    const userEvents: IOwnedEventsResponse & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/event/my_events`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        }
    ).then((respone) => respone.json());

    return userEvents.events;
}

export async function getAllEventDetailsById(id: string | undefined) {
    const eventData: IEventDetailsForUpdate & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/event/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        }
    ).then((response) => response.json());

    return eventData;
}
export async function getAllOrdersOfEvent(eventId: string, filter: string) {
    const eventOrders: IOrdersOfEventResponse & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/orders/list/${eventId}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            method: "POST",
            body: JSON.stringify({
                filters: {
                    status: filter,
                },
            }),
        }
    ).then((response) => response.json());

    return eventOrders;
}

export async function refundOrder(orderId: number) {
    const refundedOrder: IRefundOrderResponse & ErrorResponse = await fetch(
        `${serverUrl}/api/v1/order/${orderId}/refund`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            method: "POST",
        }
    ).then((response) => response.json());

    return refundedOrder;
}
