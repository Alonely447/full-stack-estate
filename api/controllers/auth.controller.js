import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "../lib/email.js";

export const requestEmailVerification = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if the email or username is already registered
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or username is already registered!" });
    }

    // Generate a verification token
    const token = jwt.sign(
      { email, username, password },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" } // Token expires in 1 day
    );
    console.log("Token generated:", token);
    // Send the verification email
    await sendVerificationEmail(email, token);

    res.status(200).json({ message: "Verification email sent. Please check your inbox.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send verification email!" });
  }
};

export const verifyEmailAndRegister = async (req, res) => {
  const  token  = req.query.token;
 // console.log("Token from query:", token);

  if (!token) {
    return res.status(400).json({ message: "Token is missing!" });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { email, username, password } = decoded;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: ""});
  }
};


export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin, // Include admin role in the token
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Generate a reset token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send the reset email
    await sendResetPasswordEmail(email, token);

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset email!" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token!" });
  }
};
