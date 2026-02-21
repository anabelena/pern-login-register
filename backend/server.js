import express from "express";

// create server
const app = express();

// routes
app.get("/", (req, res) => {
  res.send("!hi");
});

app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
