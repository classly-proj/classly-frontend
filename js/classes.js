import { getMe, addCourses, removeCourses } from "./api/user.js";
import { getCourseCRNS } from "./api/course.js";

const body = document.querySelector("body");
const dialog = document.getElementById("dialog");

async function onPageLoad() {
    const user = await getMe();

    if (!user.ok) {
        alert("NOT LOGGED IN");
        return;
    }

    addCourses("12527");
    console.log(user.data.classes);

    if (user.data.classes) {
        let classes = user.data.classes;
        for (let i = 0; i < classes.length; i++) {
            console.log(classes[i]);
        }
    } else {
        addCourses("50128");
    }
}

function openDialog() {
    dialog.classList.remove("hidden");
}

function closeDialog() {
    dialog.classList.add("hidden");
}

async function removeClass() {
    const res = await fetch("/user/removeclass", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: JSON.stringify([crn]),
    });

    if (res.status !== 200) {
        return {
            ok: false,
            status: res.status,
        };
    }

    return {
        ok: true,
    };
}

/**
 * Handle get user, including there classes
 */
async function getUser() {
    const res = await fetch("/user/get", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: JSON.stringify({
            username: prompt("Enter username"),
        }),
    });

    if (res.status !== 200) {
        return {
            ok: false,
            status: res.status,
        };
    }

    return {
        ok: true,
        user: await res.json(),
    };
}

// Assign function values
window.onload = onPageLoad;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
