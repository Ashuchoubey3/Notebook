const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { nanoid } = require("nanoid");
const path = require("path");
require("dotenv").config(); // load MONGO_URI from .env

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notebook";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Serve frontend files
app.use(express.static(path.join(__dirname, "Frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

// Note Schema
const noteSchema = new mongoose.Schema({
  noteId: { type: String, unique: true },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

// Save note
app.post("/save", async (req, res) => {
  const { content } = req.body;
  const uniqueId = nanoid(14);

  const note = new Note({ noteId: uniqueId, content });
  await note.save();

  res.json({ message: "Note saved", noteId: uniqueId });
});

// Get note by ID
app.get("/note/:id", async (req, res) => {
  const note = await Note.findOne({ noteId: req.params.id });
  if (!note) return res.status(404).json({ message: "Not found" });
  res.json(note);
});

// Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
