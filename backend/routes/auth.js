import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { UserRepository } from "../repositories/user.repository.js";

const router = express.Router();

// Cookie's security configuration
const cookieOptions = {
  httpOnly: true, //cookie can not be read from FRONTEND
  secure: process.env.NODE_ENV === "production", //access only via HTTPS in PRODUCTION
  sameSite: "Strict", // wont be send to external sites
  maxAge: 24 * 60 * 60 * 1000, // 1 day after this browser eliminates cookie
};

// jwt.sign(payload,secret,options)
// payload=> token info to be sended
// secret=> secret key to signed token
// options=> configurations
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// ROUTES
// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const existingUser = await UserRepository.getUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserRepository.createUser(
    username,
    email,
    hashedPassword,
  );

  if (newUser) {
    const token = generateToken(newUser.id);
    res.cookie("token", token, cookieOptions); //sets a cookie in the client's browser!
    return res.status(201).json({ user: newUser }); //return everything but the password
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  const existingUser = await UserRepository.getUserByEmail(email);

  if (!existingUser) {
    return res.status(400).json("Invalid credentials");
  }

  // .compare() => returns true or false
  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    return res.status(400).json("Invalid Credentials");
  }

  const token = generateToken(existingUser.id);
  res.cookie("token", token, cookieOptions); //sets a cookie in the client's browser!
  return res
    .status(201)
    .json({
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser,
      },
    });
});

// {
//   command: 'SELECT',        // tipo de query ejecutada
//   rowCount: 1,              // cantidad de filas devueltas
//   oid: null,                // usado para inserts especiales
//   rows:
// [ { id: 1, email: 'test@mail.com', username: 'user1' }
// ], // los datos
//   fields: [ /* info de columnas */ ]
// }
