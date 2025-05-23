import jwt from "jsonwebtoken";
import 'dotenv/config'
// import dotenv from "dotenv";
// dotenv.config();

const createToken = (data) => {
  return jwt.sign(data,process.env.JWT_SECRET, { expiresIn: "45min" });
};

export default createToken;