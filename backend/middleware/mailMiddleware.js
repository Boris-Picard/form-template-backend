import nodemailer from "nodemailer";
import process from "process";
import dotenv from "dotenv"

dotenv.config(); 

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendVerificationEmail = (userEmail, token) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: userEmail,
    subject: "Email Verification",
    html: `<p>Click <a href="http://localhost:5173/verify-email?token=${token}">here</a> to verify your email.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
  });
};

export { sendVerificationEmail };
