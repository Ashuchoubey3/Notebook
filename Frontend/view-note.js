// const uniqueId = localStorage.getItem("uniqueId");

// if (!uniqueId) {
//   alert("Please login first");
//   window.location.href = "/auth.html"; // STOP HERE
//   throw new Error("Not logged in");
// }

const backendURL =
  location.hostname === "localhost" ? "http://localhost:3000" : location.origin;

const params = new URLSearchParams(window.location.search);
const noteId = params.get("id");

// SAFETY CHECK
if (!noteId) {
  alert("Invalid note");
  window.location.href = "/dashboard.html";
}

async function loadNote() {
  try {
    const res = await fetch(`${backendURL}/note/single/${noteId}`);
    const data = await res.json();

    if (!data.note) {
      alert("Note not found");
      return;
    }

    document.getElementById("noteContent").textContent = data.note.content;

    document.getElementById("noteTime").textContent = new Date(
      data.note.createdAt
    ).toLocaleString();
  } catch (err) {
    console.error("Error loading note:", err);
  }
}

function goBack() {
  window.location.href = "/dashboard.html";
}

loadNote();
