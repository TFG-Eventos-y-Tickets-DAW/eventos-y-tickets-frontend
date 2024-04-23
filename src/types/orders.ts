export interface ICreateOrderData {
    eventId: number | undefined;
    quantity: number;
    ticketId: number;
    attendee: {
        name: string;
        email: string;
    };
}
