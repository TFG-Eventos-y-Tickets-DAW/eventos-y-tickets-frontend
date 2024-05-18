export default function getEventFee(amountSold: number) {
    if (amountSold <= 100) return Math.round(amountSold * 0.05);

    if (amountSold <= 500) return Math.round(amountSold * 0.1);

    if (amountSold <= 1000) return Math.round(amountSold * 0.15);

    return Math.round(amountSold * 0.2);
}
