const express = require("express");
const {
  getMessagesBetweenUsers,
  sendMessageToUser,
  getLastMessageBetweenUsers,
  updateRead,
} = require("../controllers/messageController");
const { route } = require("../server");

const router = express.Router();

router.route("/:chatter1/:chatter2").get(getMessagesBetweenUsers);
router
  .route("/lastMessage/:chatter1/:chatter2")
  .get(getLastMessageBetweenUsers);
router.route("/").post(sendMessageToUser);
router.route("/updateRead/:sender/:reciever").patch(updateRead);

module.exports = router;
