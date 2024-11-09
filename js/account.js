import { createAccount, login } from "./api/user.js";

/**
 * Swap login form to register form and vice versa
 * @param {String} state Current form state (login/register)
 */
function switchForm(state) {
  const formSubmit = document.getElementById("account-submit");
  const switchButton = document.getElementById("account-switch");
  const formHeader = document.getElementById("account-header");
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
      ? "Have an account? Login here"
      : "Don't have an account? Register now";

  // Update login to account create event
  switchButton.onclick =
    state === "login"
      ? function () {
          switchForm("register");
        }
      : function () {
          switchForm("login");
        };

  // Change form header
  formHeader.innerHTML = state === "login" ? "Create an Account:" : "Login:";

  // Change form header
  confirmPassword.classList.toggle("hidden");

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
      ? await login(credentials.username, credentials.password)
      : await createAccount(credentials.username, credentials.password);

  // Check return status and redirect if OK is true
  if (status.ok) {
    window.location.replace("./mapbox.html");
  } else {
    password.classList.add("error");
    confirm.classList.add("error");

    // Add something on the backend that returns a specific error message when failed.
    errorText.innerHTML = "ERROR: Something went wrong";
  }
}

/**
 * Handle getting user/password
 * Needs to be done this way because Evans weird backend
 */
function fetchInput() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  return { username, password };
}

window.switchForm = switchForm;
window.submitForm = submitForm;
