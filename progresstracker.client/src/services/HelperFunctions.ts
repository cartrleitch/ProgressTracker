export function localDateString(timeZoneId: string, date = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZoneId,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
}