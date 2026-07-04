function mapUnknownError(value: unknown) {
    if (value instanceof Error) {
        return value;
    } else if (typeof value === "string") {
        return new Error(value);
    } else {
        const error = new Error("Unknown error occurred");
        error.cause = value;
        return error;
    }
}
