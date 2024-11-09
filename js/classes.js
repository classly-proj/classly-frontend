// // Run on load
// let classes = [""];

// //
// if (classes != [""]) {
//   console.log("hi");
// } else {
//   console.log("no");
// }

// const body = document.querySelector("body");

////////////////

async function addClass() {
  return;
}

async function removeClass() {
  return;
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
