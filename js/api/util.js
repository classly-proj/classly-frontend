export const API_HOST = {
    "127.0.0.1": "http://127.0.0.1:8000",
    "localhost": "http://localhost:8000",
    "hacknhbackend": "https://e2.server.eparker.dev:4455"
}[window.location.hostname] || "http://localhost:8000";

export const POST_FIELDS = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};

export class APIResponse {
    /**
     * An API response object
     * @param {number} status The HTTP status code
     * @param {any} data The response data
     */
    constructor(status, data) {
        this.status = status;
        this.data = data;
    }

    /**
     * Get the status name of the response
     * @returns {string} The status name
     */
    getStatusName() {
        return {
            200: "OK",
            201: "Created",
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            406: "Not Acceptable",
            415: "Unsupported Media Type",
            500: "Internal Server Error",
            501: "Not Implemented",
            502: "Bad Gateway",
            503: "Service Unavailable",
        }[this.status] || "Unknown Status";
    }


    /**
     * @type {boolean}
     */
    get ok() {
        return this.status === 200;
    }
}