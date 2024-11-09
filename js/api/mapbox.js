import { API_HOST, APIResponse, POST_FIELDS } from "./util.js";

export async function loadDirections(startX, startY, endX, endY) {
    const response = await fetch(API_HOST + "/mapbox/directions", {
        ...POST_FIELDS,
        body: JSON.stringify({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY
        })
    });

    return new APIResponse(response.status, response.status === 200 ? await response.json() : null);
}