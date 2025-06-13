const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/post", (req, res) => {
  res.send("profile");
});

app.listen(7777);
