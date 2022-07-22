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
const sendMessageToUser = (req, res) => {
  const { sender, reciever, content } = req.body;
  console.log(req.body);
  const id = Math.floor(Math.random() * 10000);
  console.log(id);
  connection.query(
    "Insert Into Messages (Sender,Reciever,Content,Seen,MessageId)values (?,?,?,0,?)",
    [sender, reciever, content, id],
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
};
