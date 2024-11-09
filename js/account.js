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
}

/**
 * Handle form submit with backend
 * @param {String} state Current form state (login/register)
 */
async function submitForm(state) {
  const credentials = fetchInput();
  const confirm = document.getElementById("confirm").value;

  // Check confirm password matches main password
  if (confirm && confirm !== credentials.password) {
    console.log("no" + credentials.password + " " + confirm);
    return;
  }

  // Run appropriate function
  const status =
    state === "login"
      ? await login(credentials)
      : await createAccount(credentials);

  // Check return status and redirect if OK is true
  if (status.ok) {
    window.location.replace("./mapbox.html");
  } else {
    console.log(`ERROR: Something went wrong (${status})`);
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

/**
 * Handle account creation
 * @param {Object} creds Username and Password credentials
 */
async function createAccount(creds) {
  const res = await fetch("http://127.0.0.1:8000/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(creds),
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

/**
 * Handle login event
 * @param {Object} creds Username and Password credentials
 */
async function login(creds) {
  const res = await fetch("http://localhost:8000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(creds),
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
