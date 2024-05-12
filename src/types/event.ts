export interface event {
    id: number;
    ownerId: number;
    title: string;
    description: string;
    address: string;
    imgSrc: string;
    startsAt: string;
    endsAt: string;
    country: string;
    currency: string;
    createdAt: string;
    price?: number;
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
    status: "DRAFT" | "PUBLISHED" | "FINALIZED";
    type?: "FREE" | "PAID";
}

export interface eventDetails {
    id: number;
    ownerId: number;
    title: string;
    description: string;
    address: string;
    imgSrc: string;
    startsAt: string;
    endsAt: string;
    country: string;
    currency: string;
    createdAt: string;
    price: number;
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
    status: "DRAFT" | "PUBLISHED" | "FINALIZED";
    tickets: {
        id: number;
        quantity: number;
        price: number;
        quantityAvailable: number;
        type: "FREE" | "PAID";
    };
}

export interface ITicket {
    orderId: number;
    eventId: number;
    price: number;
    quantity: number;
    title: string;
    description: string;
    imgSrc: string;
    startsAt: string;
    endsAt: string;
    status: "PUBLISHED" | "FINALIZED";
    type: "PAID" | "FREE";
}

export interface ITickets {
    tickets: ITicket[];
}
