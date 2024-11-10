import { takingMyClasses } from "./api/community.js";
import * as userAPI from "./api/user.js";

/**
 * Swap login form to register form and vice versa
 * @param {String} state Current form state (login/register)
 */
function switchForm(state) {
    const formSubmit = document.getElementById("account-submit");
    const switchButton = document.getElementById("account-switch");
    const formHeader = document.getElementById("account-header");
    const firstName = document.getElementById("first");
    const lastName = document.getElementById("last");
    const confirmPassword = document.getElementById("confirm");

    // Update form submit function
    formSubmit.onclick =
        state === "login"
            ? function () {
                submitForm("register");
            }
            : function () {
                submitForm("login");
            };

    // Update button html
    switchButton.innerHTML =
        state === "login"
            ? `Have an account? <span onclick="switchForm('register')">Login here</span>`
            : `Don't have an account? <span  onclick="switchForm('login')">Register now</span>`;

    // Change form header
    formHeader.innerHTML = state === "login" ? "Create an Account:" : "Login:";

    // Change form header
    confirmPassword.classList.toggle("hidden");
    firstName.classList.toggle("hidden");
    lastName.classList.toggle("hidden");

    // Clear confirm password
    confirmPassword.value = "";
}

/**
 * Handle form submit with backend
 * @param {String} state Current form state (login/register)
 */
async function submitForm(state) {
    const credentials = fetchInput();

    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm");
    const errorText = document.getElementById("error");

    // Check confirm password matches main password
    if (confirm.value && confirm.value !== credentials.password) {
        password.classList.add("error");
        confirm.classList.add("error");

        // Add something on the backend that returns a specific error message when failed.
        errorText.innerHTML = "ERROR: Passwords don't match";
        return;
    }

    // Run appropriate function
    const status =
        state === "login"
            ? await userAPI.login(credentials.email, credentials.password)
            : await userAPI.createAccount(credentials.email, credentials.first, credentials.last, credentials.password);

    // Check return status and redirect if OK is true
    if (status.ok) {
        setTimeout(() => {
            window.location.replace("./mapbox.html");
        }, 500);
    } else {
        password.classList.add("error");
        confirm.classList.add("error");

        // Add something on the backend that returns a specific error message when failed.
        errorText.innerHTML = "ERROR: Something went wrong";
        alert(status.getStatusName());
    }
}

/**
 * Handle getting user/password
 * Needs to be done this way because Evans weird backend
 */
function fetchInput() {
    const email = document.getElementById("email").value;
    const first = document.getElementById("first").value;
    const last = document.getElementById("last").value;
    const password = document.getElementById("password").value;

    return { email, first, last, password };
}

window.switchForm = switchForm;
window.submitForm = submitForm;