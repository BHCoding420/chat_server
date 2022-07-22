var mysql = require("mysql");

var db_config = {
  host: "b5xac9nkorjkmvx0ujv6-mysql.services.clever-cloud.com",
  user: "u3irk7dmszofnzgy",
  password: "L9zdNVboqJYVEQJ39uw0",
  database: "b5xac9nkorjkmvx0ujv6",
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", handleDisconnect);
}

handleDisconnect();

module.exports = connection;
