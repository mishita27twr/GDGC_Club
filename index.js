const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Preloaded members
let members = [
  {
    name: "Anubhavi Jaiswal",
    reg: "23BXXXXXXX",
    designation: "GDSC Club",
    position: "Lead",
    skills: "JS, React",
    bio: "Frontend dev",
    image: ""
  },
  {
    name: "Akshay Kumar Mishra",
    reg: "23BXXXXXXX",
    designation: "GDSC Tech Team",
    position: "Lead",
    skills: "Figma, Photoshop",
    bio: "UI/UX designer",
    image: ""
  },
  {
    name: "Gagan Bhardwaj",
    reg: "24BXXXXXXX",
    designation: "GDSC Tech Team",
    position: "Co-Lead",
    skills: "Figma, Photoshop",
    bio: "UI/UX designer",
    image: ""
  }
];

// GET all members
app.get("/members", (req, res) => {
  res.json(members);
});

// POST add a new member
app.post("/members", (req, res) => {
  const { name, reg, designation, position, skills, bio, image } = req.body;

  if (!name || !reg || !designation || !position) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newMember = { name, reg, designation, position, skills, bio, image: image || "" };
  members.push(newMember);
  res.json(members);
});

// DELETE member by index
app.delete("/members/:index", (req, res) => {
  const idx = parseInt(req.params.index);
  if (isNaN(idx) || idx < 0 || idx >= members.length) {
    return res.status(400).json({ error: "Invalid index" });
  }
  members.splice(idx, 1);
  res.json(members);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
