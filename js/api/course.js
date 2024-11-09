import { API_HOST, APIResponse, POST_FIELDS } from "./util.js";

export async function getCourseCRNS() {
    const res = await fetch(API_HOST + "/course/all", {
        credentials: "include"
    });

    return new APIResponse(res.status, res.status === 200 ? await res.json() : null);
}

export async function getCourse(crn) {
    const res = await fetch(API_HOST + "/course/get", {
        ...POST_FIELDS,
        body: JSON.stringify({
            crn: crn
        })
    });

    return new APIResponse(res.status, res.status === 200 ? await res.json() : null);
}

export async function getCourseQueriableFields() {
    const res = await fetch(API_HOST + "/course/query/list", {
        credentials: "include"
    });

    return new APIResponse(res.status, res.status === 200 ? await res.json() : null);
}

export async function queryCourses(queryKey, queryValue) {
    const res = await fetch(API_HOST + "/course/query", {
        ...POST_FIELDS,
        body: JSON.stringify({
            key: queryKey,
            value: queryValue
        })
    });

    return new APIResponse(res.status, res.status === 200 ? await res.json() : null);
}