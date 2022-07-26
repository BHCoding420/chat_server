const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ user }, "197291298179", {
    expiresIn: "3d",
  });
};

const jwtVerify = (user) => {
  try {
    const result = jwt.verify(user, "197291298179");
    //console.log(result);
    return { result: result };
  } catch (error) {
    console.log("carch error");
    return { error: error };
  }
};

module.exports = { generateToken, jwtVerify };
