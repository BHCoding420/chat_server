var connection = require("../db");

const getMessagesBetweenUsers = (req, res) => {
  const { chatter1, chatter2 } = req.params;
  //console.log(req.params);
  connection.query(
    "SELECT * FROM Messages where (Sender = ? && Reciever = ?) or  (Sender = ? && Reciever = ?) ORDER BY Date",
    [chatter1, chatter2, chatter2, chatter1],
    async function (error, results) {
      //console.log(results);
      res.send(results);
    }
  );
};

const getLastMessageBetweenUsers = (req, res) => {
  const { chatter1, chatter2 } = req.params;
  //console.log(req.params);
  connection.query(
    "SELECT Date FROM Messages where (Sender = ? && Reciever = ? ) or  (Sender = ? && Reciever = ?) ORDER BY Date Desc LIMIT 1",
    [chatter1, chatter2, chatter2, chatter1],
    async function (error, results) {
      //console.log(results);
      res.send(results);
    }
  );
};

const updateRead = (req, res) => {
  const { sender, reciever } = req.params;
  //console.log(req.r);
  connection.query(
    "Update Messages set Seen = 1 where Sender = ? and Reciever = ?",
    [sender, reciever],
    async function (error, results) {
      //console.log(results);
      res.send(results);
    }
  );
};
const sendMessageToUser = (req, res) => {
  const { sender, reciever, content, MessageId } = req.body;
  console.log(req.body);

  //console.log(id);
  connection.query(
    "Insert Into Messages (Sender,Reciever,Content,Seen,MessageId)values (?,?,?,0,?)",
    [sender, reciever, content, MessageId],
    async function (error, results) {
      if (error) {
        throw error;
      }
      console.log(results);
      res.send(results);
    }
  );
};
module.exports = {
  getMessagesBetweenUsers,
  sendMessageToUser,
  getLastMessageBetweenUsers,
  updateRead,
};
