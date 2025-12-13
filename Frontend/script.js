function saveNote() {
  const noteText = document.getElementById("note").value;

  if (!noteText) {
    alert("Please write something!");
    return;
  }

  fetch("http://localhost:3000/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: noteText }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("result").innerText =
        "SAVE THIS UNIQUE ID: " + data.noteId;
     

      localStorage.setItem("lastNoteId", data.noteId);
    });
}

function getNote() {
  const id = document.getElementById("noteId").value;

  if (!id) {
    document.getElementById("output").innerText = "";
    return;
  }

  fetch("http://localhost:3000/note/" + id)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("output").innerText =
        data.content || "Note not found";
    });
}



window.onload = function () {
  const savedId = localStorage.getItem("lastNoteId");
  if (savedId) {
    document.getElementById("noteId").value = savedId;
  }
};

