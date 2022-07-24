var connection = require("../db");
const bcrypt = require("bcryptjs");
const { generateToken, jwtVerify } = require("../utils/utils");
const nodemailer = require("nodemailer");

const addUserErrors = (sqlState, email, password) => {
  if (sqlState === "23000") {
    return "Email already used";
  }
  const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if (!regEmail.test(email)) {
    return "please enter a valid email";
  }
  if (!regPassword.test(password)) {
    return "password should be between 6 to 20 characters and should contain at least one numeric digit, one uppercase and one lowercase letter";
  }
  return null;
};
const sendmail = async (req, res) => {
  //let id = req.params.id;
  let address = req.params.address;
  console.log(req.params);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hello.test.980@gmail.com",
      pass: "rwdidgsmnkdbpztc",
    },
    tls: { rejectUnauthorized: false },
  });

  var mailOptions = {
    from: "hello.test.980@gmail.com",
    to: address,
    subject: "Sending Email using Node.js",
    text: `click this link to verify : http://localhost:5000/users/verify/${address}`,
  };

  let result_mail = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("sending fail");

      console.log(error);
      res.json({ success: false });
    } else {
      console.log("Email sent: " + info);

      res.json({ success: true });
    }
  });
  return;
};

const verifyUser = async (req, res) => {
  const { id, address } = req.params;

  connection.query(
    `UPDATE Users SET isVerified = 1 WHERE email = '${address}'`,

    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.send("<h1>Your account is verified</h1>");
    }
  );
};

const log_in = async (req, res) => {
  const { user } = req.body;

  connection.query(
    "SELECT * FROM Users where Email = ?",
    [user.Email],
    async function (error, results) {
      if (error) throw error;

      if (results.length == 0) {
        return res.send({
          error: "Cannot find user with this Email",
        });
      } else {
        if (results[0].isVerified === 0) {
          return res.send({
            error: "user not verified,click the link to verify",
          });
        } else {
          const compare = await bcrypt.compare(
            user.Password,
            results[0].Password
          );
          if (!compare) {
            return res.send({
              error: "Password incorrect",
            });
          }
          //console.log(generateToken(results[0]));
          //res.send(results[0]);
          return res.json({
            token: generateToken(results[0]),
          });
        }
      }
    }
  );
};
const getUsers = async (req, res) => {
  connection.query("SELECT * FROM Users", function (error, results) {
    if (error) throw error;
    return res.send({ data: results });
  });
};

const getUser = async (req, res) => {
  const { email } = req.params;
  connection.query(
    "SELECT * FROM Users where Email = ?",
    [email],
    function (error, results) {
      if (error) throw error;
      return res.send({ data: results });
    }
  );
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  connection.query(
    `DELETE FROM Users where id = ${id}`,
    function (error, results) {
      if (error) throw error;
      return res.send({ data: results });
    }
  );
};

const updateUser = async (req, res) => {
  console.log(req.body);
  const { LastName, FirstName, Address, City, PLZ, Telephone, Password } =
    req.body;
  const { user_id } = req.params;
  connection.query(
    `UPDATE Users SET LastName = "${LastName}",FirstName = "${FirstName}",Address = "${Address}",City = "${City}",PLZ = "${PLZ}",Telephone = "${Telephone}",Password = "${Password}" WHERE id = ${user_id}`,

    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "user has been updated successfully.",
      });
    }
  );
};

const addUser = async (req, res) => {
  try {
    const { user } = req.body;
    const error = addUserErrors(null, user.Email, user.Password);
    if (error) {
      res.status(400);
      return res.json({ error: error });
    }
    //console.log(user);
    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(user.Password, salt);

    try {
      connection.query(
        "INSERT INTO Users (ID, LastName, FirstName, Address, City, PLZ, Password,isVerified,Email) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          user.ID,
          user.LastName,
          user.FirstName,
          user.Address,
          user.City,
          user.PLZ,
          user.Password,
          user.isVerified,
          user.Email,
        ],
        function (error, results) {
          if (error) {
            //console.log(error);
            console.log(error.sqlMessage);
            res.status(400);

            return res.json({ error: addUserErrors(error.sqlState) });
          }
          try {
            console.log(results);
            return res.send({ data: results });
          } catch (error) {
            console.log(error);
            throw new Error(error.message);
          }
          //if (error) throw error;
        }
      );
    } catch (error) {
      console.log("error");
    }
  } catch (error) {
    res.send(error);
  }
};

const verifyJWT = async (req, res) => {
  const { user } = req.body;
  //console.log(req.body.user);
  //console.log("my user", user);
  const result = jwtVerify(user);
  res.send(result);
  //console.log(result);
};

const searchUsers = async (req, res) => {
  const { search } = req.params;

  connection.query(
    `Select * FROM Users WHERE FirstName LIKE '${search}%' OR LastName LIKE '${search}%' `,

    function (error, results, fields) {
      if (error) throw error;
      //console.log(results);
      res.send(results);
    }
  );
};

const getContacts = async (req, res) => {
  const { email } = req.params;

  connection.query(
    `Select Email,FirstName,LastName from Users where Email In(Select Sender from
      (Select Sender from Messages where Sender = "${email}" or Reciever = "${email}"
      group by Sender,Reciever)as Senders where Sender <> "${email}"  Union
      Select Sender from Messages where Sender = "${email}"  and Reciever = "${email}" )`,

    function (error, results, fields) {
      if (error) console.log(error);
      //console.log(results);
      res.send(results);
    }
  );
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  log_in,
  sendmail,
  verifyUser,
  verifyJWT,
  searchUsers,
  getContacts,
};
