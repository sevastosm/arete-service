// server.js

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());

// Configure Nodemailer to use Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Brevo SMTP server
  port: process.env.SMTP_PORT,
  secure: false, // SMTP port
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const mailOptions = {
    from: email, // Sender's email
    to: process.env.RECIPIENT_EMAIL, // Recipient's email
    subject: `Message from ${name} (${email})`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
