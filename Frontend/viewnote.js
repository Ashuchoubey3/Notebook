const backendURL =
  location.hostname === "localhost" ? "http://localhost:3000" : location.origin;

const params = new URLSearchParams(window.location.search);
const noteId = params.get("id");

async function loadNote() {
  try {
    const res = await fetch(`${backendURL}/note/single/${noteId}`);
    const data = await res.json();

    document.getElementById("noteContent").textContent = data.note.content;
    document.getElementById("noteTime").textContent = new Date(
      data.note.createdAt
    ).toLocaleString();
  } catch (err) {
    console.error("Error loading note:", err);
  }
}

function goBack() {
  window.history.back();
}

loadNote();
