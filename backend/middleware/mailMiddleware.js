import nodemailer from "nodemailer";
import process from "process";
import dotenv from "dotenv";

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
    subject: "Email Verification to myCryptoFolio",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
        <h2 style="color: #333333;">Verify Your Email Address</h2>
        <p style="color: #555555;">Thank you for registering with us! Please click the button below to verify your email address and complete your registration:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="http://localhost:5173/verify-email?token=${token}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </div>
        <p style="color: #555555;">If you did not create an account, no further action is required.</p>
        <p style="color: #555555;">Best regards,<br>myCryptoFolio</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
  });
};

export { sendVerificationEmail };
