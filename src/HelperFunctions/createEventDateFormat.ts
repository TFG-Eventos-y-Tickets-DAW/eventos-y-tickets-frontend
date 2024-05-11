export default function createEventDateFormat(date: string) {
    const [day, month, year] = date.split("/");

    return `${year}-${month}-${day} 00:00:00`;
}
