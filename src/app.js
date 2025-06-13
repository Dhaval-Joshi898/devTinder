const express = require("express");

const app = express();

app.get("/test/:name/:surname", (req, res) => {
  console.log('anme',req.params)
  res.send({
    firstName: "Dhaval",
    lastName: "Joshi",
  });
});

app.post("/user", (req, res) => {
  res.send("Data send to database");
});

app.delete("/remove", (req, res) => {
  res.send("Data deleted from DB");
});
app.listen(9999);
