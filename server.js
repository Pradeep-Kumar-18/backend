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

// ✅ Student Schema
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

// ✅ Home Route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

// ✅ Save Student Data to MongoDB
app.post("/save", async (req, res) => {
  try {
    console.log("Received Data:", req.body); // 👈 ADD THIS
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