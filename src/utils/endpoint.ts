export function getLokerEndpoint() {
    if (import.meta.env.DEV) {
        // In dev the endpoint is derived from the env variables
        return import.meta.env.VITE_LOKER_ENDPOINT;
    }

    // In release the web
    const url = window.location;
    return `${url.protocol}:${url.hostname}${url.port.length > 0 ? ":" + url.port : ""}`;
}
