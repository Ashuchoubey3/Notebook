// ------------------------
// Backend URL
// ------------------------
const backendURL = "https://my-unique-notebook-backend.onrender.com";

// const backendURL =
//   location.hostname === "localhost" ? "http://localhost:3000" : location.origin;

// ------------------------
// GET noteId FROM URL
// ------------------------
const params = new URLSearchParams(window.location.search);
const noteId = params.get("noteId");

if (!noteId) {
  document.body.innerHTML = "<h2> Invalid note</h2>";
  throw new Error("No noteId found");
}

// ------------------------
// LOAD NOTE
// ------------------------
async function loadNote() {
  try {
    const res = await fetch(`${backendURL}/note/view/${noteId}`);

    if (!res.ok) {
      throw new Error("Note not found");
    }

    const data = await res.json();

    document.getElementById("noteTitle").innerText = data.note.title;
    document.getElementById("noteContent").innerText = data.note.content;
  } catch (err) {
    console.error(err);
    document.getElementById("noteContent").innerText = " No note found";
  }
}

document.addEventListener("DOMContentLoaded", loadNote);
