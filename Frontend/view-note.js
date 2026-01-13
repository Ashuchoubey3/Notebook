// ------------------------
// Backend URL
// ------------------------
const backendURL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://book-38lz.onrender.com";

//
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
    console.log(data, "data in view-note.js");

    document.getElementById("noteTitle").innerText = data.note.title;
    document.getElementById("noteContent").innerText = data.note.content;
  } catch (err) {
    console.error(err);
    document.getElementById("noteContent").innerText =
      " Still working on it, please have patience :) ";
  }
}

document.addEventListener("DOMContentLoaded", loadNote);

//download note as txt file//
function downloadNote() {
  const noteContent = document.getElementById("noteContent").innerText;

  if (!noteContent.trim()) {
    alert("Note is empty");
    return;
  }

  const blob = new Blob([noteContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `note-${new Date().getTime()}.txt`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
