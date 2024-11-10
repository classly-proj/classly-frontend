import { getMe, removeCourses } from "./api/user.js";
import { getCourse, getCourseCRNS } from "./api/course.js";

const body = document.querySelector("body");
const dialog = document.getElementById("dialog");

async function onPageLoad() {
    const user = await getMe();

    if (!user.ok) {
        alert("NOT LOGGED IN");
        return;
    }

    // Init search
    search();

    // Grab class list
    updateClassList();
    console.log(user);
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
        let course = await getCourse(classes[i]);
        console.log(course);

        const span = document.createElement("span");

        {
            const button = document.createElement("button");
            button.innerText = `${course.data.COURSE_DATA.SYVSCHD_SUBJ_CODE}-${course.data.COURSE_DATA.SYVSCHD_CRSE_NUMB}`;
            span.appendChild(button);
        }
        {
            const button = document.createElement("button");
            button.innerHTML = `<img src='./img/icons/minus.svg' alt=''>`;
            button.onclick = async () => {
                const res = await removeCourses(course.data.TERM_CRN);
                console.log(res);
                updateClassList();
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

async function search() {
    const res = await fetch("http://127.0.0.1:8000/course/query/list");
    if (res.status !== 200) {
        return {
            ok: false,
            status: res.status,
        };
    }

    const queriableTypes = await res.json();
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
            // Grep a string any number of whitespace, and a number
            const match = lastChange.match(/([a-zA-Z]+)\s*(\d+)/);
            if (match) {
                searchValue = `${match[1].toUpperCase()}-${match[2]}`;
            } else {
                setTimeout(searchTick, 100);
                return;
            }
        }

        const response = await fetch("http://127.0.0.1:8000/course/query", {
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
}

async function updateCourseList(courses) {
    const user = await getMe();

    let classes = user.data.courses;
    let classMenu = document.getElementById("class-menu");

    classMenu.innerHTML = "";

    if (!classes) {
        console.log("hi");
        return;
    }

    for (let i = 0; i < classes.length; i++) {
        let course = await getCourse(classes[i]);
        console.log(course);

        const span = document.createElement("span");

        {
            const button = document.createElement("button");
            button.innerText = `${course.data.COURSE_DATA.SYVSCHD_SUBJ_CODE}-${course.data.COURSE_DATA.SYVSCHD_CRSE_NUMB}`;
            span.appendChild(button);
        }
        {
            const button = document.createElement("button");
            button.innerHTML = `<img src='./img/icons/minus.svg' alt=''>`;
            button.onclick = async () => {
                const res = await removeCourses(course.data.TERM_CRN);
                console.log(res);
                updateClassList();
            };
            span.appendChild(button);
        }

        classMenu.appendChild(span);

        // classMenu.innerHTML = `<span><button>${course.data.COURSE_DATA.SYVSCHD_SUBJ_CODE}-${course.data.COURSE_DATA.SYVSCHD_CRSE_NUMB}</button><button onclick='removeClass("${classes[i]}")'><img src='./img/icons/minus.svg' alt=''></button></span>`;
    }
}

// Assign function values
window.onload = onPageLoad;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.search = search;
window.updateClassList = updateClassList;
window.removeCourses = removeCourses;