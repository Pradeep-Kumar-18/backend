require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Connection Error ❌", err));

// ==========================
// ✅ STUDENT MODEL
// ==========================
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Student = mongoose.model("Student", studentSchema);

// ==========================
// ✅ QUESTION MODEL
// ==========================
const Question = require("./models/Question");

// ==========================
// ✅ HOME ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

// ==========================
// ✅ GET 30 RANDOM QUESTIONS
// ==========================
app.get("/questions", async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: 30 } }
    ]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// ==========================
// ✅ SAVE STUDENT DATA
// ==========================
app.post("/save", async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(200).json({ message: "Data saved to MongoDB ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});