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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with isAdminVerified and isEmailVerified set to false
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAdminVerified: false,
        isEmailVerified: false,
      },
    });

    // Do NOT send verification email yet, wait for admin approval
    res.status(201).json({ message: "Registration successful. Awaiting admin approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user!" });
  }
};

export const verifyEmailAndRegister = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ message: "Token is missing!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { email } = decoded;

    // Set isEmailVerified to true for the user with this email
    const updatedUser = await prisma.user.updateMany({
      where: { email },
      data: { isEmailVerified: true },
    });

    if (updatedUser.count === 0) {
      return res.status(400).json({ message: "User not found or already verified." });
    }

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token!" });
  }
};

// New function to send verification email after admin approval
export const sendVerificationEmailAfterAdminApproval = async (email) => {
  try {
    // Generate a verification token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    console.log("Token generated for admin approved user:", token);

    // Send the verification email
    await sendVerificationEmail(email, token);
  } catch (err) {
    console.error("Failed to send verification email after admin approval:", err);
    throw err;
  }
};


export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // Check if user is admin verified
    if (!user.isAdminVerified) {
      return res.status(403).json({ message: "User not verified by admin yet." });
    }

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
      .json({
        ...userInfo,
        isSuspended: user.isSuspended,
        suspensionExpiresAt: user.suspensionExpiresAt,
      });
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
