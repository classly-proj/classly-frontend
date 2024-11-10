import { addCourses, changeName, getMe, removeCourses } from "./api/user.js";
import { getCourse, getCourseCRNS, getCourseQueriableFields, queryCourses } from "./api/course.js";
import { getCurrCoords, findEntrance, loadRoute} from "./mapbox.js";

const dialog = document.getElementById("dialog");

async function onPageLoad() {
    const user = await getMe();

    if (!user.ok) {
        alert("Error! " + user.getStatusName());
        setTimeout(() => {

            getMe().then(res => {
                alert(res.ok);
            });
        }, 5000);
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
        console.log("hi");
        return;
    }

    for (let i = 0; i < classes.length; i++) {
        const response = await getCourse(classes[i]);

        if (!response.ok) {
            console.log("Failed to get course: " + response.status);
            continue;
        }

        const course = response.data;
        console.log(course)

        const span = document.createElement("span");

        {
            const button = document.createElement("button");
            button.innerText = `${course.COURSE_DATA.SYVSCHD_SUBJ_CODE}${course.COURSE_DATA.SYVSCHD_CRSE_NUMB} ${course.COURSE_DATA.SYVSCHD_CRSE_LONG_TITLE}`;
            span.appendChild(button);
            button.onclick = async() => {
                const goalCoords = await findEntrance(course.COURSE_DATA.MEETINGS[0].BUILDING)
                console.log(goalCoords)
                await loadRoute(getCurrCoords(), goalCoords)
            }
        }
        {
            const button = document.createElement("button");
            button.innerHTML = `<img src="./img/icons/minus.svg" alt="">`;
            button.onclick = async () => {
                if ((await removeCourses(course.TERM_CRN)).ok) {
                    updateClassList();
                }
            };
            span.appendChild(button);
        }

        classMenu.appendChild(span);

        // classMenu.innerHTML = `<span><button>${course.data.COURSE_DATA.SYVSCHD_SUBJ_CODE}-${course.data.COURSE_DATA.SYVSCHD_CRSE_NUMB}</button><button onclick='removeClass("${classes[i]}")'><img src='./img/icons/minus.svg' alt=''></button></span>`;
    }
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

    results.forEach(course => {
        const span = document.createElement("span");
        span.innerText = `${course.COURSE_DATA.SYVSCHD_SUBJ_CODE}${course.COURSE_DATA.SYVSCHD_CRSE_NUMB} ${course.COURSE_DATA.SYVSCHD_CRSE_LONG_TITLE}`;
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
    await updateSettings()
    settings.classList.remove("hidden");
}

function closeSettings() {
    settings.classList.add("hidden");
}

async function updateSettings() {
    try {
        const response = await getMe();  // Call getMe and wait for the promise to resolve.
        const data = response.data;      // Access the data property of the response.

        // Check if the response is successful and data is available
        if (response.status === 200 && data) {
            // Set the value for the first name input
            const firstNameInput = document.getElementById('settings-firstName');
            if (firstNameInput) firstNameInput.value = data.first || '';

            // Set the value for the last name input
            const lastNameInput = document.getElementById('settings-lastName');
            if (lastNameInput) lastNameInput.value = data.last || '';
        } else {
            console.error('Failed to retrieve user data. Status:', response.status);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
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


// Assign function values
window.onload = onPageLoad;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.search = search;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.updateClassList = updateClassList;
window.removeCourses = removeCourses;