import { changeName, getMe, addCourses, removeCourses } from "./api/user.js";
import { getCourseCRNS } from "./api/course.js";

async function search() {
    const res = await fetch("/course/query/list");
    if (res.status !== 200) {
        return {
            ok: false,
            status: res.status,
        };
    }
    // Internal Key -> Display Name
    const queriableTypes = await res.json();
    const box = document.createElement("div");
    box.style.position = "absolute";
    box.style.top = "50%";
    box.style.left = "50%";
    box.style.transform = "translate(-50%, -50%)";
    box.style.backgroundColor = "grey";
    const select = document.createElement("select");
    select.style.width = "200px";
    select.style.height = "30px";
    select.style.fontSize = "20px";
    for (const [key, value] of Object.entries(queriableTypes)) {
        const option = document.createElement("option");
        option.value = key;
        option.innerText = value;
        select.appendChild(option);
    }
    box.appendChild(select);
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search";
    input.style.width = "200px";
    input.style.height = "30px";
    input.style.fontSize = "20px";
    box.appendChild(input);
    let lastChange = null;
    let searchKey = null;
    async function searchTick() {
        if (input.value === lastChange || input.value.length < 3) {
            setTimeout(searchTick, 100);
            return;
        }
        searchKey = select.value;
        lastChange = input.value;
        let searchValue = lastChange;
        if (searchKey === "subject-number") {
            // Grep a string any number of whitespace, and a number
            const match = lastChange.match(/([a-zA-Z]+)\s*(\d+)/);
            if (match) {
                searchValue = `${match[1].toUpperCase()}-${match[2]}`;
            } else {
                setTimeout(searchTick, 100);
                return;
            }
        }
        const response = await fetch("/course/query", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: JSON.stringify({ key: searchKey, value: searchValue }),
        });
        if (response.status !== 200) {
            return {
                ok: false,
                status: response.status,
            };
        }
        const courses = await response.json();
        window.latestCourses = courses;
        console.log(courses);
        setTimeout(searchTick, 100);
    }
    searchTick();
    document.body.appendChild(box);
}

const body = document.querySelector("body");
const dialog = document.getElementById("dialog");
const settings = document.getElementById("settings")

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
    search();
}

function closeDialog() {
    dialog.classList.add("hidden");
}

async function openSettings() {
    await updateSettings()
    settings.classList.remove("hidden");
}

function closeSettings() {
    settings.classList.add("hidden");
}

async function updateSettings() {
    try {
        const response = await getMe();  
        const data = response.data;      

        if (response.status === 200 && data) {
            const firstNameInput = document.getElementById('settings-firstName');
            if (firstNameInput) firstNameInput.value = data.first || 'Enter first name';

            const lastNameInput = document.getElementById('settings-lastName');
            if (lastNameInput) lastNameInput.value = data.last || 'Enter last name';
        } else {
            console.error('Failed: ', response.status);
        }
    } catch (error) {
        console.error('Error getting user data:', error);
    }
}

async function saveSettings() {
    const firstName = document.getElementById('settings-firstName').value;
    const lastName = document.getElementById('settings-lastName').value;

    const response = await changeName(firstName, lastName);

    if (response.status === 200) {
        alert('Name changed successfully!');
    } else {
        alert('Failed to change name. Status code: ' + response.status);
    }
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
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.updateSettings = updateSettings;
window.saveSettings = saveSettings;
window.search = search;
