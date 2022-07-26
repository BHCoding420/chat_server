const http = require("http");
var express = require("express");
const { Server } = require("socket.io");
var bodyParser = require("body-parser");
var mysql = require("mysql");
const cors = require("cors");

var app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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
const chatsRouter = require("./routes/chats");
// default route
app.get("/", function (req, res) {
  return res.send("hello");
});

// connection configurations

var connection = require("./db");

app.use("/users", usersRouter);
app.use("/messages", messagesRouter);
app.use("/chats", chatsRouter);

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  console.log("this mf connected " + socket.id);
  socket.on("join", ({ user }, callback) => {
    onlineUsers.set(user.Email, socket.id);
    console.log("online users:", onlineUsers);
    callback();
  });

  socket.on("send-msg", (data) => {
    console.log("sent message on server", data);
    const sendUserSocket = onlineUsers.get(data.msg.Reciever);
    console.log(sendUserSocket);
    console.log("socket to send to : ", data.msg.Reciever);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
      console.log("emitting ", data.msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("he disconnect");
  });
});
// set port
server.listen(5000, function () {
  console.log("Node app is running on port 5000");
});
module.exports = app;
