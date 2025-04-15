import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Correct SMTP host for Gmail
    port: 465, // Use port 465 for secure connections
    secure: true, // Use true for SSL/TLS
    auth: {
      user: "dcd120401@gmail.com", // Your Gmail address
      pass: "epyr dhio vrtn dhuk", // Your Gmail App Password
    },
});

const mailOptions = {
  from: "dcd120401@gmail.com",
  to: "hewacov978@dpcos.com", // Replace with a test recipient
  subject: "Test Email",
  text: "This is a test email from Nodemailer.",
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("Error sending email:", err);
  } else {
    console.log("Email sent successfully:", info.response);
  }
});