// ------------------------
// BACKEND URL (unchanged)
// ------------------------
const backendURL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : window.location.origin;

// ------------------------
// SLIDER TOGGLE (UI)
// ------------------------
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// ------------------------
// SIGN UP
// ------------------------
document
  .querySelector(".sign-up-container button")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document
      .querySelector(".sign-up-container input[placeholder='Full Name']")
      .value.trim();
    const email = document
      .querySelector(".sign-up-container input[placeholder='Email Address']")
      .value.trim();
    const mobile = document
      .querySelector(".sign-up-container input[placeholder='Mobile Number']")
      .value.trim();

    if (!name || !email || !mobile) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed!");
        return;
      }

      // Save data
      localStorage.setItem("uniqueId", data.uniqueId);
      localStorage.setItem("userName", data.name);

      // ✅ SHOW MESSAGE BELOW SIGNUP BUTTON
      const msgBox = document.getElementById("signupMessage");
      const uidText = document.getElementById("uniqueIdText");

      uidText.textContent = data.uniqueId;
      msgBox.style.display = "block";
    } catch (err) {
      console.error(err);
      alert("Signup error. Please try again.");
    }
  });

// ------------------------
// COPY UNIQUE ID
// ------------------------
function copyUniqueId() {
  const text = document.getElementById("uniqueIdText").textContent;
  const popup = document.getElementById("copyPopup");

  navigator.clipboard.writeText(text).then(() => {
    popup.style.display = "inline";

    setTimeout(() => {
      popup.style.display = "none";
    }, 2000);
  });
}


// ------------------------
// LOGIN
// ------------------------
document
  .querySelector(".sign-in-container button")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const uniqueId = document
      .querySelector(".sign-in-container input[placeholder='Unique ID']")
      .value.trim();

    if (!uniqueId) {
      alert("Enter your Unique ID!");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed!");
        return;
      }

      // Save data
      localStorage.setItem("uniqueId", data.uniqueId);
      localStorage.setItem("userName", data.name);

      // Redirect
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
      alert("Login error. Please try again.");
    }
  });
