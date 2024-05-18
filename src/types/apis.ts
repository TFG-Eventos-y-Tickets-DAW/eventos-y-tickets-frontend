import { event } from "./event";
import { IOrderDetails } from "./orders";

export interface LoginResponse {
    accessToken?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    userId?: number;
}

export interface ISignInResponse {
    userId?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface ErrorResponse {
    error_type?: string;
    error_detail?: string;
}

export interface IPayOrderResponseCard {
    orderId: number;
    quantity: number;
    ticketId: number;
    status: "COMPLETED";
    total: number;
}

export interface IPayOrderResponsePaypal {
    orderId: number;
    quantity: number;
    ticketId: number;
    status: "PAYER_ACTION_REQUIRED";
    total: number;
    paypalOrderId: string;
    redirectUrl: string;
}

export interface IPaypalOrderStatus {
    status:
        | "PAYER_ACTION_REQUIRED"
        | "APPROVED"
        | "COMPLETED"
        | "UNKNOWN"
        | "ABANDONED";
    message?: string;
}

export interface IPresignedPostData {
    url: string;
    fields: {
        "Content-Type": string;
        key: string;
        AWSAccessKeyId: string;
        "x-amz-security-token": string;
        policy: string;
        signature: string;
    };
}

export interface IUploadImageToServer {
    presignedPostData: IPresignedPostData;
    potentialEventImgSrc: string;
}

export interface ICreateUpdateEventData {
    title: string;
    address: string;
    imgSrc: FileList | string;
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
    status: boolean | string;
    country: string;
    currency: string;
    payoutInstrument?: {
        iban?: string;
        swiftbic?: string;
        paypalEmail?: string;
    };
    tickets: {
        quantity: number;
        price: number;
    };
    preValidate: boolean;
}

export interface IEventDetailsForUpdate {
    id: number;
    title: string;
    address: string;
    imgSrc: FileList | string;
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
    status: boolean | string;
    country: string;
    currency: string;
    payoutInstrument?: {
        iban: string;
        swiftbic: string;
        paypalEmail: string;
    };
    ticketsConfiguration: {
        quantity: number;
        price: number;
        type: "FREE" | "PAID";
    };
    createdAt: string;
    ownerId: number;
}

export interface IPreValidateResponse {
    preValidate: boolean;
    message: string;
}

export interface IOwnedEventsResponse {
    events: event[];
}

export interface IOrdersOfEventResponse {
    orders: IOrderDetails[];
}

export interface IRefundOrderResponse {
    orderId: number;
    status: "REFUNDED";
    total: number;
}
