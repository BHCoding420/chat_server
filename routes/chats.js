const express = require("express");
const {
  checkChat,
  addchat,
  updatechat,
  getnewchat,
  getChats,
} = require("../controllers/ChatsController");
const { route } = require("../server");

const router = express.Router();

router.route("/:sender/:reciever").get(checkChat);
router.route("/getChats/get/:currentUser").get(getChats);
router.route("/getnewchat/:id").get(getnewchat);

router.route("/:sender/:reciever/:messageId").post(addchat);
router.route("/:sender/:reciever/:messageId").patch(updatechat);

module.exports = router;
