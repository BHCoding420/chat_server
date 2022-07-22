var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());

const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");

// default route
app.get("/", function (req, res) {
  return res.send({ error: true, message: "hello" });
});

// connection configurations

var connection = require("./db");

app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

// set port
app.listen(5000, function () {
  console.log("Node app is running on port 5000");
});
module.exports = app;
