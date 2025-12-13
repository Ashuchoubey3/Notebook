const backendURL = "https://notebook-app.onrender.com"; 

function saveNote() {
  const noteText = document.getElementById("note").value;

  if (!noteText) {
    alert("Please write something!");
    return;
  }

  fetch(`${backendURL}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: noteText }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("result").innerText =
        "SAVE THIS UNIQUE ID: " + data.noteId;

      localStorage.setItem("lastNoteId", data.noteId);
    })
    .catch((err) => console.error("Error saving note:", err));
}

function getNote() {
  const id = document.getElementById("noteId").value;

  if (!id) {
    document.getElementById("output").innerText = "";
    return;
  }

  fetch(`${backendURL}/note/${id}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("output").innerText =
        data.content || "Note not found";
    })
    .catch((err) => console.error("Error fetching note:", err));
}

function copyID() {
  const text = document
    .getElementById("result")
    .innerText.replace("SAVE THIS UNIQUE ID: ", "")
    .trim();

  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Unique ID copied to clipboard!");
    });
  }
}

window.onload = function () {
  const savedId = localStorage.getItem("lastNoteId");
  if (savedId) {
    document.getElementById("noteId").value = savedId;
  }
};
