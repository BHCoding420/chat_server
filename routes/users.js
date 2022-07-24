const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
  log_in,
  sendmail,
  verifyUser,
  verifyJWT,
  searchUsers,
  getContacts,
} = require("../controllers/userController");
const { route } = require("../server");

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:email").get(getUser);
router.route("/searchUser/:search").get(searchUsers);
router.route("/getContacts/:email").get(getContacts);
router.route("/add").post(addUser);
router.route("/login").post(log_in);
router.route("/sendEmail/:address").get(sendmail);
router.route("/verify/:address").get(verifyUser);
router.route("/jwt").post(verifyJWT);
router.route("/:id").delete(deleteUser);
router.route("/:user_id").patch(updateUser);

module.exports = router;
