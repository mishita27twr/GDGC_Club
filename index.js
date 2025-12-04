const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let members = [{ name: "Anubhavi Jaiswal", reg: "23BXXXXXXX", designation: "GDSC Club", position: "Lead", skills: "JS, React", bio: "Frontend dev", image: "" },
  { name: "Akshay Kumar Mishra", reg: "23BXXXXXXX", designation: "GDSC Tech Team", position: "Lead", skills: "Figma, Photoshop", bio: "UI/UX designer", image: "" },
  { name: "Gagan Bhardwaj", reg: "24BXXXXXXX", designation: "GDSC Tech Team", position: "Co-Lead", skills: "Figma, Photoshop", bio: "UI/UX designer", image: "" }];

// GET members
app.get("/members", (req, res) => res.json(members));

// POST members
app.post("/members", (req, res) => {
  const { name, reg, designation, skills, bio } = req.body;
  if (!name || !reg || !designation) return res.status(400).json({ error: "Missing required fields" });
  const newMember = { name, reg, designation, skills, bio };
  members.push(newMember);
  res.json(members);
});

// DELETE member by index
app.delete("/members/:index", (req, res) => {
  members.splice(req.params.index, 1);
  res.json(members);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
