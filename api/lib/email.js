import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 465, 
    secure: true, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:5173/verify-email?token=${token}`;
  //console.log("Verification Link:", verificationLink);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email and complete registration:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  //console.log("Reset Link:", resetLink);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h1>Password Reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};