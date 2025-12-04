const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory members array
let members = [
  { name: "Anubhavi Jaiswal", reg: "23BXXXXXXX", designation: "GDSC Club", position: "Lead", skills: "JS, React", bio: "Frontend dev", image: "" },
  { name: "Akshay Kumar Mishra", reg: "23BXXXXXXX", designation: "GDSC Tech Team", position: "Lead", skills: "Figma, Photoshop", bio: "UI/UX designer", image: "" },
  { name: "Gagan Bhardwaj", reg: "24BXXXXXXX", designation: "GDSC Tech Team", position: "Co-Lead", skills: "Figma, Photoshop", bio: "UI/UX designer", image: "" }
];

// GET all members
app.get("/members", (req, res) => {
  res.json(members);
});

// POST a new member
app.post("/members", (req, res) => {
  const member = req.body;
  if (!member.name || !member.reg || !member.designation || !member.position) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  members.push(member);
  res.json(member); // return the added member
});

// DELETE a member by registration number
app.delete("/members/:reg", (req, res) => {
  const { reg } = req.params;
  members = members.filter((m) => m.reg !== reg);
  res.json(members);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));