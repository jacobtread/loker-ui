export function formatDate(value?: Date) {
    if (!value) return "-";

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(value);
}
