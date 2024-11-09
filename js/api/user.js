import { API_HOST, APIResponse, POST_FIELDS } from "./util.js";

export async function createAccount(username, password) {
    const response = await fetch(API_HOST + "/user/create", {
        ...POST_FIELDS,
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    return new APIResponse(response.status, response.status === 200 ? await response.json() : null);
}

export async function login(username, password) {
    const response = await fetch(API_HOST + "/user/login", {
        ...POST_FIELDS,
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    return new APIResponse(response.status, null);
}

export async function logout() {
    const response = await fetch(API_HOST + "/user/logout", {
        credentials: "include"
    });

    return new APIResponse(response.status, null);
}

export async function getUsers() {
    const response = await fetch(API_HOST + "/user/get", {
        credentials: "include"
    });

    return new APIResponse(response.status, response.status === 200 ? await response.json() : null);
}

export async function getUser(username) {
    const response = await fetch(API_HOST + "/user/get", {
        ...POST_FIELDS,
        body: JSON.stringify({
            username: username
        })
    });

    return new APIResponse(response.status, response.status === 200 ? await response.json() : null);
}

export async function deleteUser() {
    const response = await fetch(API_HOST + "/user/delete", {
        method: "DELETE",
        credentials: "include"
    });

    return new APIResponse(response.status, null);
}

export async function addCourses(...crns) {
    const response = await fetch(API_HOST + "/user/addclass", {
        ...POST_FIELDS,
        body: JSON.stringify(crns)
    });

    return new APIResponse(response.status, null);
}

export async function removeCourses(...crns) {
    const response = await fetch(API_HOST + "/user/removeclass", {
        ...POST_FIELDS,
        body: JSON.stringify(crns)
    });

    return new APIResponse(response.status, null);
}

export async function getMe() {
    const response = await fetch(API_HOST + "/user/me", {
        credentials: "include"
    });

    return new APIResponse(response.status, response.status === 200 ? await response.json() : null);
}