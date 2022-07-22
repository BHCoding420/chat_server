const express = require("express");
const {
  getMessagesBetweenUsers,
  sendMessageToUser,
  getLastMessageBetweenUsers,
} = require("../controllers/messageController");
const { route } = require("../server");

const router = express.Router();

router.route("/:chatter1/:chatter2").get(getMessagesBetweenUsers);
router
  .route("/lastMessage/:chatter1/:chatter2")
  .get(getLastMessageBetweenUsers);
router.route("/").post(sendMessageToUser);

module.exports = router;
