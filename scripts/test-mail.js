require('dotenv').config();
const nodemailer = require('nodemailer');

async function testMail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const email = "prasadshaswat9265@gmail.com";
  const name = "Shaswat";
  const password = "SyncIntern123";
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const mailOptions = {
    from: `"Sync Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Synchronous Build Digital!",
    html: `
      <div style="font-family: sans-serif; padding: 40px; background: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #F05E23; padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Onboarding Briefing</h1>
          </div>
          <div style="padding: 40px;">
            <p>Welcome, <b>${name}</b>,</p>
            <p>Your access to the <b>Synchronous Build Digital</b> management console has been established.</p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;">Login Username:</p>
              <p style="margin: 5px 0; font-size: 16px; font-weight: 700; color: #111;">${email}</p>
              <div style="height: 10px;"></div>
              <p style="margin: 0; font-size: 14px; color: #666;">Temporary Password:</p>
              <p style="margin: 5px 0; font-size: 24px; font-weight: 800; color: #F05E23; letter-spacing: 2px;">${password}</p>
            </div>
            <p>Please log in and update your security credentials immediately.</p>
            <a href="${BASE_URL}/login" style="display: inline-block; background: black; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px;">ACCESS CONSOLE</a>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email successfully sent to " + email);
    console.log("Message ID: " + info.messageId);
  } catch (error) {
    console.error("Transmission failed:", error);
  }
}

testMail();
