export function isoToUSDate(iso: string): string {
    if (!iso) {
        return "";
    }
    const [year, month, day] = iso.split("-");
    return `${month}-${day}-${year}`;
}

export function stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}