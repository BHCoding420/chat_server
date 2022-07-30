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
global.offlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  offlineUsers.delete(undefined);
  console.log("this mf connected " + socket.id);
  var current_user = null;
  socket.on("join", ({ user }, callback) => {
    onlineUsers.set(user.Email, socket.id);
    offlineUsers.has(user.Email) && offlineUsers.delete(user.Email);
    console.log("offline users:", offlineUsers);
    current_user = user;
    console.log("online users:", onlineUsers);
    io.emit("userJoin", {
      Email: current_user?.Email,
      Status: "Online",
    });
    callback();
  });

  socket.on("send-msg", (data) => {
    console.log("sent message on server", data);
    const sendUserSocket = onlineUsers.get(data.msg.Reciever);
    console.log(sendUserSocket);
    console.log("sent from : ", socket.id);
    console.log("socket to send to : ", data.msg.Reciever);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
      //console.log("emitting ", data.msg);
    }
  });

  socket.on;

  socket.on("checkOnline", (data) => {
    console.log("check online", data);
    //console.log("current_user", current_user);
    //console.log(onlineUsers.get(current_user.Email));
    console.log("has", onlineUsers.has(data));
    if (onlineUsers.has(data)) {
      console.log("send status to :", onlineUsers.get(current_user.Email));
      io.to(onlineUsers.get(current_user.Email)).emit("status", {
        status: "Online",
        Email: data,
      });
    } else {
      io.to(onlineUsers.get(current_user.Email)).emit("status", {
        status: "Offline",
        LastSeen: offlineUsers.get(data),
      });
    }
  });

  socket.on("reading", (data) => {
    console.log("reading", data);
    if (onlineUsers.has(data.reciever)) {
      socket.to(onlineUsers.get(data.reciever)).emit("latestMessagesRead", {
        readby: data.user,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("he disconnect", current_user?.Email);
    let d = new Date(Date.now());
    console.log("at ", d.toString());
    onlineUsers.delete(current_user?.Email);
    offlineUsers.set(current_user?.Email, d);
    console.log("online users:", onlineUsers);
    offlineUsers.delete(undefined);
    console.log("offline users:", offlineUsers);
    io.emit("userLeft", {
      Email: current_user?.Email,
      LastSeen: offlineUsers.get(current_user?.Email),
    });
  });
});
// set port
server.listen(5000, function () {
  console.log("Node app is running on port 5000");
});
module.exports = app;
