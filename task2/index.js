const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let members = [
  { id: 1, name: "Anubhavi Jaiswal", registrationNumber: "22BXXXXXXX", designation: "GDSC Club", role: "Lead" },
  { id: 2, name: "Akshay Kumar Mishra", registrationNumber: "22BXXXXXXX", designation: "GDSC Technical " , role: "Lead" },
  { id: 3, name: "Gagan Bhardwaj", registrationNumber: "22BXXXXXXX", designation: "GDSC Technical " , role: "Co-Lead" },];

app.get("/members", (req, res) => res.json(members));
app.get("/members/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const member = members.find(m => m.id === id);
  if (!member) return res.status(404).json({ message: "Member not found" });
  res.json(member);
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
