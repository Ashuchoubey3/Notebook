// Dynamic backend URL
const backendURL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000" // for local testing
    : window.location.origin; // for Render deployed site

function saveNote() {
  const noteText = document.getElementById("note").value.trim();

  if (!noteText) {
    alert("Please write something!");
    return;
  }

  fetch(`${backendURL}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: noteText }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to save note");
      return res.json();
    })
    .then((data) => {
      if (!data.noteId) throw new Error("Unique ID not returned from server");

      document.getElementById("result").innerText =
        "SAVE THIS UNIQUE ID: " + data.noteId;

      localStorage.setItem("lastNoteId", data.noteId);
    })
    .catch((err) => {
      console.error(err);
      alert("Error saving note. Please try again.");
    });
}

function getNote() {
  const id = document.getElementById("noteId").value.trim();

  if (!id) {
    document.getElementById("output").innerText = "";
    return;
  }

  fetch(`${backendURL}/note/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch note");
      return res.json();
    })
    .then((data) => {
      document.getElementById("output").innerText =
        data.content || "Note not found";
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("output").innerText = "Error fetching note";
    });
}

function copyID() {
  const resultText = document.getElementById("result").innerText;
  const id = resultText.replace("SAVE THIS UNIQUE ID: ", "").trim();

  if (!id) {
    alert("No ID to copy");
    return;
  }

  navigator.clipboard.writeText(id).then(() => {
    alert("Unique ID copied to clipboard!");
  });
}

window.onload = function () {
  const savedId = localStorage.getItem("lastNoteId");
  if (savedId) {
    document.getElementById("noteId").value = savedId;
  }
};
