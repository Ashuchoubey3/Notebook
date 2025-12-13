const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
// Replace this with your online MongoDB URI if deploying on Render
// Example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/notebook?retryWrites=true&w=majority
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notebook";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

  const path = require("path");

  // Serve frontend files
  app.use(express.static(path.join(__dirname, "frontend")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
  });


app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

const noteSchema = new mongoose.Schema({
  noteId: { type: String, unique: true },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

app.post("/save", async (req, res) => {
  const { content } = req.body;

  const uniqueId = nanoid(14);

  const note = new Note({
    noteId: uniqueId,
    content,
  });

  await note.save();

  res.json({
    message: "Note saved",
    noteId: uniqueId,
  });
});

app.get("/note/:id", async (req, res) => {
  const note = await Note.findOne({ noteId: req.params.id });

  if (!note) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(note);
});

// Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
