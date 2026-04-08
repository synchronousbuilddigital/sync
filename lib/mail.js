import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const sendOnboardingEmail = async (email, name, password) => {
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

  return transporter.sendMail(mailOptions);
};

export const sendLeaveStatusEmail = async (email, name, status, adminNote = "") => {
  const isApproved = status === "Approved";
  const mailOptions = {
    from: `"Sync Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Holiday Request Update: ${status}`,
    html: `
      <div style="font-family: sans-serif; padding: 40px; background: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: ${isApproved ? '#10B981' : '#EF4444'}; padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Holiday Update</h1>
          </div>
          <div style="padding: 40px;">
            <p>Greetings, <b>${name}</b>,</p>
            <p>Your leave application has been reviewed and marked as: <b style="color: ${isApproved ? '#10B981' : '#EF4444'};">${status}</b>.</p>
            ${adminNote ? `<p style="background: #f0f0f0; padding: 20px; border-radius: 10px; border-left: 4px solid #F05E23;"><b>Admin Memo:</b> ${adminNote}</p>` : ''}
            <p>Please check your dashboard for details.</p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendForgotPasswordEmail = async (email, name, resetLink) => {
  const mailOptions = {
    from: `"Sync Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Sync Access Password",
    html: `
      <div style="font-family: sans-serif; padding: 40px; background: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #000; padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Security Protocol</h1>
          </div>
          <div style="padding: 40px;">
            <p>Greetings, <b>${name}</b>,</p>
            <p>A request to reset your password was detected. Click the button below to establish new credentials.</p>
            <a href="${resetLink}" style="display: inline-block; background: #F05E23; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px;">RESET PASSWORD</a>
            <p style="margin-top: 30px; font-size: 12px; color: #999;">If you did not request this, please ignore this email.</p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendAnnouncementEmail = async (email, name, message) => {
  const mailOptions = {
    from: `"Sync Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Administrative Briefing: Announcement",
    html: `
      <div style="font-family: sans-serif; padding: 40px; background: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #F05E23; padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Announcement</h1>
          </div>
          <div style="padding: 40px;">
            <p>Greetings, <b>${name}</b>,</p>
            <div style="background: #f0f0f0; padding: 30px; border-radius: 10px; border-left: 4px solid black; font-weight: 600; line-height: 1.6;">
              ${message}
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">This is a system-wide broadcast from administrative headquarters.</p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
