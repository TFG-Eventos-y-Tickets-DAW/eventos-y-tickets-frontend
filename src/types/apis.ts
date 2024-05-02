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
