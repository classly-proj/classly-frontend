import { API_HOST, APIResponse } from "./util.js";

export async function takingMyClasses() {
    const response = await fetch(API_HOST + "/community/takingmyclasses", {
        credentials: "include"
    });

    return new APIResponse(response.status, response.status === 200 ? await response.json() : null);
}