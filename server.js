const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Home Route Fix
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

// ✅ Save Student Data
app.post("/save", (req, res) => {
  const file = "results.xlsx";
  let data = [];

  // If Excel exists, read old data
  if (fs.existsSync(file)) {
    const wb = XLSX.readFile(file);
    const ws = wb.Sheets[wb.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(ws);
  }

  // Add new student record
  data.push(req.body);

  // Convert JSON → Excel
  const newWB = XLSX.utils.book_new();
  const newWS = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(newWB, newWS, "Students");
  XLSX.writeFile(newWB, file);

  res.json({ message: "Data saved successfully" });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
