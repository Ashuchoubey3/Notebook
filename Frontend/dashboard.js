// ------------------------
// Backend URL
// ------------------------
const backendURL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : window.location.origin;

// ------------------------
// TEMP STORAGE FOR MODAL
// ------------------------
let tempNoteContent = "";
let editingNoteId = null;

// ------------------------
// Save Note (Open Modal)
// ------------------------
function saveNote() {
  const noteInput = document.getElementById("note");
  const noteText = noteInput.value.trim();

  if (!noteText) {
    alert("Please write something!");
    return;
  }

  tempNoteContent = noteText;
  document.getElementById("titleModal").style.display = "flex";
}

// ------------------------
// Close Modal
// ------------------------
function closeModal() {
  document.getElementById("titleModal").style.display = "none";
  document.getElementById("noteTitle").value = "";
}

// ------------------------
// Confirm Save (Title + Content)
// ------------------------
async function confirmSave() {
  const title = document.getElementById("noteTitle").value.trim();
  const uniqueId = localStorage.getItem("uniqueId");

  if (!title) {
    alert("Please enter note title!");
    return;
  }

  try {
    if (editingNoteId) {
      // UPDATE NOTE
      const res = await fetch(`${backendURL}/note/${editingNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: tempNoteContent }),
      });
      await res.json();
      editingNoteId = null;
    } else {
      // SAVE NEW NOTE
      const res = await fetch(`${backendURL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: tempNoteContent, uniqueId }),
      });
      await res.json();
    }

    // Clear textarea & close modal
    document.getElementById("note").value = "";
    closeModal();

    // Reload notes
    getNotes();
  } catch (err) {
    console.error(err);
    alert("Error saving note!");
  }
}

// ------------------------
// Get Notes
// ------------------------
async function getNotes() {
  const uniqueId = localStorage.getItem("uniqueId");
  if (!uniqueId) return;

  try {
    const res = await fetch(`${backendURL}/note/${uniqueId}`);
    const data = await res.json();

    const container = document.getElementById("savedNotes");
    container.innerHTML = "";

    if (!data.notes || data.notes.length === 0) {
      container.innerHTML = "<p>No notes found.</p>";
      return;
    }

    data.notes.forEach((note) => {
      const div = document.createElement("div");
      div.className = "saved-note";

      const id = note.noteId || note._id;

      const date = new Date(note.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      div.innerHTML = `
        <div class="note-header">
          <div>
            <h4 class="note-title">${note.title}</h4>
            <small class="note-date">${date}</small>
          </div>
          <div class="note-actions">
            <span class="edit">📝</span>
            <span class="share">📤</span>
            <span class="whatsapp">🟢</span>
            <span class="delete">🗑</span>
          </div>
        </div>
        <div class="note-content" style="display:none;">${note.content}</div>
      `;

      // Open note page on title click
      div.querySelector("h4").addEventListener("click", () => {
        window.location.href = `note.html?noteId=${encodeURIComponent(id)}`;
      });

      // EDIT
      div
        .querySelector(".edit")
        .addEventListener("click", () => editNote(note));

      // DELETE
      div
        .querySelector(".delete")
        .addEventListener("click", () => deleteNote(id));

      // SHARE
      div
        .querySelector(".share")
        .addEventListener("click", () => shareNote(note.title, note.content));

      // WHATSAPP
      div
        .querySelector(".whatsapp")
        .addEventListener("click", () =>
          shareViaWhatsApp(note.title, note.content)
        );

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching notes:", err);
  }
}

// ------------------------
// SHARE NOTE
// ------------------------
function shareNote(title, content) {
  const text = `📝 ${title}\n\n${content}\n\n— Shared from Unique Notebook`;
  if (navigator.share) {
    navigator.share({ title, text });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showSharePopup("Note copied! Share it anywhere 👍");
    });
  }
}

function shareViaWhatsApp(title, content) {
  const text = `📝 ${title}\n\n${content}\n\n— Shared from Unique Notebook`;
  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encodedText}`, "_blank");
}

function showSharePopup(message) {
  let popup = document.getElementById("sharePopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "sharePopup";
    popup.textContent = message;
    Object.assign(popup.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#16a34a",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: "6px",
      fontSize: "14px",
      zIndex: "9999",
    });
    document.body.appendChild(popup);
  }
  popup.style.display = "block";
  setTimeout(() => (popup.style.display = "none"), 2500);
}

// ------------------------
// DELETE NOTE
// ------------------------
async function deleteNote(noteId) {
  if (!noteId) return alert("Invalid note ID");

  try {
    const res = await fetch(`${backendURL}/note/${noteId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Delete failed");
    getNotes();
  } catch (err) {
    console.error(err);
    alert("Error deleting note");
  }
}

// ------------------------
// EDIT NOTE
// ------------------------
function editNote(note) {
  document.getElementById("note").value = note.content;
  document.getElementById("noteTitle").value = note.title;
  tempNoteContent = note.content;
  editingNoteId = note.noteId;
  document.getElementById("note").focus();
}

// ------------------------
// LOGOUT
// ------------------------
function logout() {
  localStorage.removeItem("uniqueId");
  localStorage.removeItem("userName");
  window.location.href = "auth.html";
}

// ------------------------
// INIT ON DOM CONTENT LOADED
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const uniqueId = localStorage.getItem("uniqueId");
  if (!uniqueId) {
    alert("You are not logged in!");
    window.location.href = "auth.html";
    return;
  }

  // PROFILE INFO
  const userName = localStorage.getItem("userName") || "Guest";
  document.getElementById("userName").textContent = userName;
  document.getElementById("userId").textContent = `ID: ${uniqueId}`;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  document.getElementById("userInitials").textContent = initials;

  // BUTTONS
  document.getElementById("saveBtn")?.addEventListener("click", saveNote);
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document
    .getElementById("confirmSaveBtn")
    ?.addEventListener("click", confirmSave);
  document
    .getElementById("closeModalBtn")
    ?.addEventListener("click", closeModal);

  // SEARCH
  const searchInput = document.getElementById("searchNotes");
  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".saved-note").forEach((note) => {
      const title = note.querySelector("h4")?.textContent.toLowerCase() || "";
      note.style.display = title.includes(query) ? "block" : "none";
    });
  });

  // THEME TOGGLE
  const themeToggle = document.getElementById("themeToggle");
  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark")
      ? "☀️ Light"
      : "🌙 Dark";
  });

  // LOAD NOTES
  getNotes();
});
