// // Run on load
import { getMe } from "./api/user.js";

let classes = [""];

console.log(getMe());

//
if (classes != [""]) {
  console.log("hi");
} else {
  console.log("no");
}

const body = document.querySelector("body");

////////////////

async function addClass(crn) {
  const res = await fetch("/user/addclass", {
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
