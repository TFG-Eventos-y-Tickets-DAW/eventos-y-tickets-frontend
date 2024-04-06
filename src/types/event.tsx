export default interface event {
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
    type: "FREE" | "PAID";
}
