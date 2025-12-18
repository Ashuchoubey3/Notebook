const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { nanoid } = require("nanoid");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ------------------------
// MongoDB Connection
// ------------------------
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notebook";

mongoose
  .connect(mongoUri) 
  .then(() =>
    console.log(
      ` MongoDB connected: ${
        mongoUri.includes("127.0.0.1") ? "Local" : "Atlas"
      }`
    )
  )
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ------------------------
// Note Schema
// ------------------------
const noteSchema = new mongoose.Schema({
  noteId: { type: String, unique: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

// ------------------------
// Save Note Route
// ------------------------
app.post("/save", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Note content cannot be empty" });
    }

    const uniqueId = nanoid(14);
    const note = new Note({ noteId: uniqueId, content });
    await note.save();

    res.json({ message: "Note saved", noteId: uniqueId });
  } catch (err) {
    console.error("Error saving note:", err);
    res.status(500).json({ message: "Error saving note. Please try again." });
  }
});

// ------------------------
// Get Note by ID Route
// ------------------------
app.get("/note/:id", async (req, res) => {
  try {
    const note = await Note.findOne({ noteId: req.params.id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json(note);
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ message: "Error fetching note" });
  }
});

// ------------------------
// Serve Frontend (after API routes)
// ------------------------
app.use(express.static(path.join(__dirname, "Frontend")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
