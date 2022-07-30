var connection = require("../db");

const checkChat = async (req, res) => {
  const { sender, reciever } = req.params;

  connection.query(
    `Select * From Chats where (Chatter1 = '${sender}' && Chatter2 = '${reciever}') OR
    (Chatter1 = '${reciever}' && Chatter2 = '${sender}')`,
    async function (error, results) {
      res.send(results);
    }
  );
  /**/
};
const addchat = (req, res) => {
  const { sender, reciever, messageId } = req.body;
  console.log(req.body);
  if (sender <= reciever) {
    connection.query(
      `Insert into Chats(Chatter1,Chatter2,LastSentMessage) Values ("${sender}","${reciever}",${messageId})`,
      async function (error, results) {
        console.log("here");
        console.log(
          `Insert into Chats(Chatter1,Chatter2,LastSentMessage) Values ("${sender}","${reciever}",${messageId})`
        );
        console.log(results);
        res.send(results);
      }
    );
  } else {
    connection.query(
      `Insert into Chats(Chatter1,Chatter2,LastSentMessage) Values ("${reciever}","${sender}",${messageId})`,
      async function (error, results) {
        console.log("here 2");
        console.log(results);
        res.send(results);
      }
    );
  }
};

const updatechat = (req, res) => {
  const { sender, reciever, messageId } = req.body;
  connection.query(
    `Update Chats set LastSentMessage = ${messageId} where Chatter1 = '${sender}' and Chatter2 = '${reciever}'`,
    async function (error, results) {
      if (error) console.log("eroor", error);
      console.log(results);
      res.send(results);
    }
  );
};

const getnewchat = (req, res) => {
  const { id } = req.params;
  connection.query(
    `Select * From Chats where LastSentMessage = ${id} '`,
    async function (error, results) {
      res.send(results);
    }
  );
};

const getChats = (req, res) => {
  const { currentUser } = req.params;

  connection.query(
    `Select Chatter1 as Email,FirstName,LastName,LastSentMessage,Date,Content from Chats join Messages join Users on
    Chats.LastSentMessage = Messages.MessageId
    and Chats.Chatter1 = Users.Email
    where Chatter2="${currentUser}"
    UNION
    Select Chatter2 as Email,FirstName,LastName,LastSentMessage,Date,Content from Chats join Messages join Users on
    Chats.LastSentMessage = Messages.MessageId
    and Chats.Chatter2 = Users.Email
    where Chatter1="${currentUser}"
    UNION
    Select Chatter2 as Email,FirstName,LastName,LastSentMessage,Date,Content from Chats join Messages join Users on
    Chats.LastSentMessage = Messages.MessageId
    and Chats.Chatter2 = Users.Email
    where Chatter1="${currentUser}" and Chatter2="${currentUser}"
    Order by Date desc;`,
    async function (error, results) {
      res.send(results);
    }
  );
};
module.exports = {
  checkChat,
  addchat,
  updatechat,
  getnewchat,
  getChats,
};
