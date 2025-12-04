const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let members = [{ id: 1, name: "Anubhavi Jaiswal", registrationNumber: "22BXXXXXXX", designation: "GDSC Club", role: "Lead" },
  { id: 2, name: "Akshay Kumar Mishra", registrationNumber: "22BXXXXXXX", designation: "GDSC Technical " , role: "Lead" },
  { id: 3, name: "Gagan Bhardwaj", registrationNumber: "22BXXXXXXX", designation: "GDSC Technical " , role: "Co-Lead" },];

app.get("/members", (req, res) => {
  res.json(members);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
