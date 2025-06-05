import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "./models/user.js";
import x from "./user-services.js";

function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    );
  });
}

export async function registerUser(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Invalid input data." });
  }

  try {
    const existingUser = await x.findUserByName(username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ username, password: hashedPassword });
    await newUser.save();

    const token = await generateAccessToken(username);
    return res.status(201).json({ token });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error during signup" });
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const retrievedUser = await x.findUserByName(username);
    if (!retrievedUser) {
      return res.status(401).json({ error: "Unauthorized: user not found" });
    }

    const matched = await bcrypt.compare(password, retrievedUser.password);
    if (!matched) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = await generateAccessToken(username);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    return res.status(401).end();
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (decoded) {
      next();
    } else {
      console.log("JWT error:", error);
      res.status(401).end();
    }
  });
}


