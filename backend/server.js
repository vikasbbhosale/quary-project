const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// SMTP CONFIGURATION
// ==============================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP Host
  port: process.env.SMTP_PORT, // SMTP Port
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // Your Email
    pass: process.env.SMTP_PASS, // App Password
  },
});

// ==============================
// ENQUIRY API
// ==============================

app.post("/send-enquiry", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      country,
      location,
      section,
      quantity,
      product,
      message,
    } = req.body;

    const mailOptions = {
      from: process.env.SMTP_USER,

      // Yaha enquiry receive hogi
      to: process.env.RECEIVER_EMAIL,

      subject: `New Product Enquiry from ${name}`,

      html: `
        <h2>New Enquiry Received</h2>

        <table border="1" cellpadding="10" cellspacing="0">
          <tr>
            <td><strong>Name</strong></td>
            <td>${name}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><strong>Phone</strong></td>
            <td>${phone}</td>
          </tr>

          <tr>
            <td><strong>Country</strong></td>
            <td>${country}</td>
          </tr>

          <tr>
            <td><strong>Location</strong></td>
            <td>${location}</td>
          </tr>

          <tr>
            <td><strong>Business Type</strong></td>
            <td>${section}</td>
          </tr>

          <tr>
            <td><strong>Quantity</strong></td>
            <td>${quantity}</td>
          </tr>

          <tr>
            <td><strong>Product</strong></td>
            <td>${product}</td>
          </tr>

          <tr>
            <td><strong>Message</strong></td>
            <td>${message}</td>
          </tr>
        </table>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Enquiry sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send enquiry",
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server Running on Port ${process.env.PORT || 5000}`
  );
});