export default function toValidDateFormat(date: string) {
    const monthYear = date.split("/");

    return `${monthYear[1]}-${monthYear[0]}`;
}
