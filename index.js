require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { nanoid } = require("nanoid");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notebook";

mongoose
  .connect(mongoUri)
  .then(() =>
    console.log(
      `MongoDB connected: ${mongoUri.includes("127.0.0.1") ? "Local" : "Atlas"}`
    )
  )
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Schemas & Models
const noteSchema = new mongoose.Schema({
  noteId: { type: String, unique: true },
  uniqueId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);
const User = require("./models/User");

// ------------------------
// Signup
// ------------------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: "Mobile already registered" });
    }

    const uniqueId = "UNQ-" + nanoid(6);
    await User.create({ name, email, mobile, uniqueId });

    res.status(201).json({ message: "Signup successful", uniqueId });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ------------------------
// Login
// ------------------------
app.post("/login", async (req, res) => {
  try {
    const { uniqueId } = req.body;
    if (!uniqueId) {
      return res.status(400).json({ message: "Unique ID is required" });
    }

    const user = await User.findOne({ uniqueId });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Login successful",
      uniqueId: user.uniqueId,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ------------------------
// SAVE NOTE
// ------------------------
app.post("/save", async (req, res) => {
  try {
    const { title, content, uniqueId } = req.body;
    if (!title || !content || !uniqueId)
      return res
        .status(400)
        .json({ message: "Title, content and uniqueId are required" });

    const note = await Note.create({
      noteId: nanoid(14),
      title,
      content,
      uniqueId,
    });

    res.json({ message: "Note saved successfully", noteId: note.noteId });
  } catch (err) {
    console.error("Save note error:", err);
    res.status(500).json({ message: err.message || "Error saving note" });
  }
});

// ------------------------
// GET NOTES BY USER
// ------------------------
app.get("/note/:uniqueId", async (req, res) => {
  try {
    const notes = await Note.find({ uniqueId: req.params.uniqueId }).sort({
      createdAt: -1,
    });
    res.json({ notes });
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// ------------------------
// UPDATE NOTE
// ------------------------
app.put("/note/:noteId", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updated = await Note.findOneAndUpdate(
      { noteId: req.params.noteId },
      { title, content },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note updated successfully" });
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ message: "Error updating note" });
  }
});

// ------------------------
// DELETE NOTE
// ------------------------
app.delete("/note/:noteId", async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({ noteId: req.params.noteId });

    if (!deleted) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: "Error deleting note" });
  }
});

// Get single note by noteId
app.get("/noteById/:noteId", async (req, res) => {
  try {
    const note = await Note.findOne({ noteId: req.params.noteId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ note });
  } catch (err) {
    console.error("Fetch note error:", err);
    res.status(500).json({ message: "Error fetching note" });
  }
});
// Get single note by noteId
app.get("/noteById/:noteId", async (req, res) => {
  try {
    const note = await Note.findOne({ noteId: req.params.noteId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ note });
  } catch (err) {
    console.error("Fetch note error:", err);
    res.status(500).json({ message: "Error fetching note" });
  }
});
// Get single note by noteId
app.get("/noteById/:noteId", async (req, res) => {
  try {
    const note = await Note.findOne({ noteId: req.params.noteId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ note });
  } catch (err) {
    console.error("Fetch note error:", err);
    res.status(500).json({ message: "Error fetching note" });
  }
});



// ------------------------
// Serve Frontend
// ------------------------
app.use(express.static(path.join(__dirname, "Frontend")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "auth.html"));
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
