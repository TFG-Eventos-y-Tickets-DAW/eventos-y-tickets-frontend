export interface ICreateOrderData {
    eventId: number | undefined;
    quantity: number;
    ticketId: number;
    attendee: {
        name: string;
        email: string;
    };
}

export interface IOrderSessionData {
    orderSessionId: number;
    total: number;
    eventId: number;
}

export interface IPaymentMethodCreditCard {
    cardholderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
}

export interface IPayment {
    isPending: boolean;
    isSuccessful: boolean;
    unsuccessfulMessage: string;
}

export interface IOrderDetails {
    id: number;
    quantity: number;
    total: number;
    firstName: string;
    email: string;
    cardBrand?: string;
    cardLastDigits?: string;
    paypalPayerEmail?: string;
    createdAt: string;
    paymentMethod: string;
}
