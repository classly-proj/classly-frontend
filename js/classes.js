import { addCourses, changeName, getMe, removeCourses } from "./api/user.js";
import { getCurrCoords, findEntrance, loadRoute, removeRoute } from "./mapbox.js";
import {
    getCourse,
    getCourseQueriableFields,
    queryCourses,
} from "./api/course.js";
import { takingMyClasses } from "./api/community.js";

const dialog = document.getElementById("dialog");
const peopleDialog = document.getElementById("people");
var building = null;
var room = null;

async function onPageLoad() {
    const user = await getMe();

    if (!user.ok) {
        alert("Error! " + user.getStatusName());
        return;
    }

    search();
    updateClassList();
}

async function updateClassList() {
    const user = await getMe();

    let classes = user.data.courses;
    let classMenu = document.getElementById("class-menu");

    classMenu.innerHTML = "";

    if (!classes) {
        return;
    }

    for (let i = 0; i < classes.length; i++) {
        const response = await getCourse(classes[i]);

        if (!response.ok) {
            console.log("Failed to get course: " + response.status);
            continue;
        }

        const course = response.data;

        const span = document.createElement("span");

        {
            const button = document.createElement("button");
            button.innerText = `(${course.COURSE_DATA.SYVSCHD_SEQ_NUMB}) ${course.COURSE_DATA.SYVSCHD_SUBJ_CODE}${course.COURSE_DATA.SYVSCHD_CRSE_NUMB} ${course.COURSE_DATA.SYVSCHD_CRSE_LONG_TITLE}`;
            span.appendChild(button);
            
            if (course.COURSE_DATA.MEETINGS[0].BUILDING === "PCBE") {
                button.onclick = async () => {
                    building = course.COURSE_DATA.MEETINGS[0].BUILDING;
                    room = course.COURSE_DATA.MEETINGS[0].ROOM;
                    sessionStorage.setItem("building", building);
                    sessionStorage.setItem("room", room);
                    const goalCoords = await findEntrance(building);
                    console.log(goalCoords);
                    await loadRoute(getCurrCoords(), goalCoords);
                };
            } else {
                button.classList.add("disabled");
                button.disabled = true;
            }
        }
        {
            const button = document.createElement("button");
            button.innerHTML = `<img src="./img/icons/people.svg" alt="">`;
            button.onclick = async () => {
                const people = await takingMyClasses();
                const crn = course.TERM_CRN;

                // TODO: fix this shit
                for (let i = 0; i < people.data.length; i++) {
                    if (people.data[i].crn === crn) {
                        await openPeople(people.data[i]);
                        return;
                    }
                }

                openPeople(people.data[0].users);
            };
            span.appendChild(button);
        }
        {
            const button = document.createElement("button");
            button.innerHTML = `<img src="./img/icons/minus.svg" alt="">`;
            button.onclick = async () => {
                if ((await removeCourses(course.TERM_CRN)).ok) {
                    updateClassList();
                }
                stopNav()
            };
            span.appendChild(button);
        }

        classMenu.appendChild(span);
    }
}

function stopNav() {
    removeRoute()
    sessionStorage.removeItem("building")
    sessionStorage.removeItem("room")
}

function openDialog() {
    dialog.classList.remove("hidden");
}

function closeDialog() {
    dialog.classList.add("hidden");
}

function updateSearchResults(results) {
    const div = document.getElementById("search-results");

    div.innerHTML = "";

    results.forEach((course) => {
        const span = document.createElement("span");
        span.innerText = `(${course.COURSE_DATA.SYVSCHD_SEQ_NUMB}) ${course.COURSE_DATA.SYVSCHD_SUBJ_CODE}${course.COURSE_DATA.SYVSCHD_CRSE_NUMB} ${course.COURSE_DATA.SYVSCHD_CRSE_LONG_TITLE}`;
        span.onclick = async () => {
            const res = await addCourses(course.TERM_CRN);

            if (!res.ok) {
                alert("Failed to add course: " + res.getStatusName() + res.get);
            }

            updateClassList();
        };

        div.appendChild(span);
    });
}

async function search() {
    const res = await getCourseQueriableFields();

    if (!res.ok) {
        alert("Failed to get course types: " + res.getStatusName());
        return;
    }

    const queriableTypes = res.data;
    const select = document.getElementById("course-select");
    const input = document.getElementById("course-search");

    for (const [key, value] of Object.entries(queriableTypes)) {
        const option = document.createElement("option");
        option.value = key;
        option.innerText = value;

        if (value === "Title") {
            option.selected = "selected";
        }

        select.appendChild(option);
    }

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
            const match = lastChange.match(/([a-zA-Z]+)\s*(\d+)/);
            if (match) {
                searchValue = `${match[1].toUpperCase()}-${match[2]}`;
            } else {
                setTimeout(searchTick, 100);
                return;
            }
        }

        const response = await queryCourses(searchKey, searchValue);

        if (!response.ok) {
            console.error("Failed to search courses:", response.status);
            setTimeout(searchTick, 1000);
            return;
        }

        updateSearchResults(response.data);
        setTimeout(searchTick, 100);
    }

    searchTick();
}

async function openSettings() {
    await updateSettings();
    settings.classList.remove("hidden");
}

function closeSettings() {
    settings.classList.add("hidden");
}

function openPeople(people) {
    const div = document.getElementById("class-students");
    console.log(people);
    div.innerHTML = "";

    people.users.forEach((person) => {
        const span = document.createElement("span");
        span.innerText = `${person.FirstName} ${person.LastName} - ${person.Email}`;

        div.appendChild(span);
    });
    peopleDialog.classList.remove("hidden");
}

function closePeople() {
    peopleDialog.classList.add("hidden");
}

async function updateSettings() {
    try {
        const response = await getMe(); // Call getMe and wait for the promise to resolve.
        const data = response.data; // Access the data property of the response.

        // Check if the response is successful and data is available
        if (response.status === 200 && data) {
            // Set the value for the first name input
            const firstNameInput =
                document.getElementById("settings-firstName");
            if (firstNameInput) firstNameInput.value = data.first || "";

            // Set the value for the last name input
            const lastNameInput = document.getElementById("settings-lastName");
            if (lastNameInput) lastNameInput.value = data.last || "";
        } else {
            console.error(
                "Failed to retrieve user data. Status:",
                response.status
            );
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

async function saveSettings() {
    const firstName = document.getElementById("settings-firstName").value;
    const lastName = document.getElementById("settings-lastName").value;

    const response = await changeName(firstName, lastName);

    if (response.status === 200) {
        alert("Name changed successfully!");
    } else {
        alert("Failed to change name. Status code: " + response.status);
    }
}

export function getBuildingRoom() {
    return { building, room };
}

// Assign function values
window.onload = onPageLoad;
window.search = search;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.openPeople = openPeople;
window.closePeople = closePeople;
window.updateClassList = updateClassList;
window.removeCourses = removeCourses;
window.removeRoute = removeRoute;
