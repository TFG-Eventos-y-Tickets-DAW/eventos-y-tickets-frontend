export function getMonth(mm: string) {
    switch (mm) {
        case "01":
            return "Jan.";
        case "02":
            return "Feb";
        case "03":
            return "March";
        case "04":
            return "April";
        case "05":
            return "May";
        case "06":
            return "June";
        case "07":
            return "July";
        case "08":
            return "Aug.";
        case "09":
            return "Sept.";
        case "10":
            return "Oct.";
        case "11":
            return "Nov.";
        case "12":
            return "Dec.";
        default:
            return "You should never see this message.";
    }
}
