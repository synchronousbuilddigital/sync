import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const ADVANCED_WRAPPER = (content, accentColor = "#F05E23", statusText = "OPERATIONAL") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sync Briefing</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0A0A0A; border-radius: 40px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 40px 80px rgba(0,0,0,0.5);">
          <!-- Futuristic Header -->
          <tr>
            <td style="background: linear-gradient(180deg, rgba(240, 94, 35, 0.1) 0%, rgba(0, 0, 0, 0) 100%); padding: 60px 40px; text-align: center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 8px 16px; background-color: rgba(240, 94, 35, 0.1); border: 1px solid rgba(240, 94, 35, 0.2); border-radius: 100px; margin-bottom: 24px;">
                      <span style="color: #F05E23; font-size: 10px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase;">Node: ${statusText}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: -1.5px; text-transform: uppercase;">
                    Sync<span style="color: #F05E23;">.</span>Digital
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 50px 60px 50px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.8;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- High-End Footer -->
          <tr>
            <td style="padding: 40px 50px; background-color: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.03);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                    Administrative Headquarters
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 0;">
                    <div style="height: 1px; background: linear-gradient(90deg, #F05E23 0%, rgba(240,94,35,0) 100%); width: 100px;"></div>
                  </td>
                </tr>
                <tr>
                  <td style="color: rgba(255,255,255,0.3); font-size: 10px; line-height: 1.8;">
                    Confidential Directive. This communication contains proprietary information intended solely for the authorized recipient. Cyber-security protocols active.
                    <br><br>
                    © 2026 Synchronous Build Digital. Established 2024.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendOnboardingEmail = async (email, name, password) => {
  const content = `
    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 20px 0;">Personnel <span style="text-decoration: underline; text-decoration-color: #F05E23;">Onboarding</span></h2>
    <p>Greetings <b>${name}</b>, your integration into the Synchronous Build Digital talent matrix is complete. Your credentials have been authorized and are ready for initialization.</p>
    
    <div style="margin: 40px 0; padding: 35px; background: rgba(240, 94, 35, 0.03); border: 1px solid rgba(240, 94, 35, 0.1); border-radius: 30px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding-bottom: 25px;">
            <p style="margin: 0; font-size: 10px; font-weight: 800; color: #F05E23; text-transform: uppercase; letter-spacing: 2px;">Access Identifiers</p>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 20px;">
            <span style="display: block; font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 6px;">Portal User</span>
            <span style="display: block; font-size: 18px; font-weight: 700; color: #ffffff;">${email}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span style="display: block; font-size: 12px; color: rgba(255,255,255,0.4); margin-bottom: 6px;">Secure Password</span>
            <span style="display: block; font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">${password}</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 45px;">
      <p style="color: #ffffff; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 1.5px; margin-bottom: 16px;">Mandatory Protocols:</p>
      <div style="color: rgba(255,255,255,0.6); font-size: 14px;">
        • Establish secure session at the link below<br>
        • Recalibrate security credentials (Change Password)<br>
        • Sync with assigned objective matrix
      </div>
    </div>

    <a href="${BASE_URL}/login" style="display: block; background-color: #F05E23; color: #ffffff; text-align: center; padding: 25px; border-radius: 20px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 4px; box-shadow: 0 20px 40px rgba(240,94,35,0.2);">Initialize Workspace</a>
  `;

  return transporter.sendMail({
    from: `"Sync Command" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "DEPLOYMENT: Your Synchronous Digital Workspace",
    html: ADVANCED_WRAPPER(content, "#F05E23", "ONBOARDING-ACTIVE"),
  });
};

export const sendLeaveStatusEmail = async (email, name, status, adminNote = "") => {
  const isApproved = status === "Approved";
  const accentColor = isApproved ? "#10B981" : "#EF4444";
  
  const content = `
    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 20px 0;">Status Update: <span style="color: ${accentColor};">${status}</span></h2>
    <p>Greetings ${name}, we have finalized the review of your holiday application request.</p>
    
    <div style="margin: 40px 0; padding: 40px; background: rgba(255, 255, 255, 0.02); border-left: 4px solid ${accentColor}; border-radius: 0 30px 30px 0;">
       <p style="margin: 0; font-size: 20px; font-weight: 900; color: #ffffff;">Protocol Result: <span style="color: ${accentColor};">${status.toUpperCase()}</span></p>
       ${adminNote ? `
         <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05);">
           <p style="font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px;">Admin Memo</p>
           <p style="font-size: 15px; color: rgba(255,255,255,0.8); font-style: italic;">"${adminNote}"</p>
         </div>
       ` : ''}
    </div>

    <a href="${BASE_URL}/intern" style="display: inline-block; border: 1px solid rgba(255,255,255,0.1); color: #ffffff; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; background-color: rgba(255,255,255,0.03);">Open Dashboard</a>
  `;

  return transporter.sendMail({
    from: `"Sync Command" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `ALERT: Holiday Request ${status}`,
    html: ADVANCED_WRAPPER(content, accentColor, `STATUS-${status.toUpperCase()}`),
  });
};

export const sendForgotPasswordEmail = async (email, name, resetLink) => {
  const content = `
    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 20px 0;">Credential <span style="color: #F05E23;">Recovery</span></h2>
    <p>We have detected a security override request for your account credentials. Please activate the recovery protocol using the link below.</p>
    
    <div style="margin: 40px 0; background: linear-gradient(90deg, rgba(240,94,35,0.1) 0%, rgba(240,94,35,0) 100%); padding: 30px; border-radius: 20px;">
      <p style="margin: 0; color: #ffffff; font-weight: 700; font-size: 14px;">Protocol active for: 60 Minutes</p>
    </div>

    <a href="${resetLink}" style="display: block; background-color: #ffffff; color: #000000; text-align: center; padding: 25px; border-radius: 20px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 4px;">Recalibrate Keys</a>
    
    <p style="margin-top: 40px; font-size: 11px; color: rgba(255,255,255,0.3); text-align: center;">Security breach? If you did not request this, secure your account instantly by disregarding this directive.</p>
  `;

  return transporter.sendMail({
    from: `"Sync Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "SECURE: Credential Override Protocol",
    html: ADVANCED_WRAPPER(content, "#F05E23", "SECURITY-OVERRIDE"),
  });
};

export const sendAnnouncementEmail = async (email, name, message) => {
  const content = `
    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 20px 0;">Direct <span style="color: #F05E23;">Broadcast</span></h2>
    <p>Administrative priorities have shifted. Please review the following directive carefully.</p>
    
    <div style="margin: 40px 0; padding: 45px; background: #111; border: 1px solid rgba(255,255,255,0.05); border-radius: 35px; color: #ffffff; font-size: 18px; line-height: 1.8; font-weight: 500;">
      ${message}
    </div>

    <p style="font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px;">Transmission Source: Admin Headquarters</p>
  `;

  return transporter.sendMail({
    from: `"Sync Command" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "URGENT BROADCAST: New Directives Issued",
    html: ADVANCED_WRAPPER(content, "#F05E23", "GLOBAL-BROADCAST"),
  });
};
export const sendBrandProjectEmail = async (email, name, projectName, trackingLink) => {
  const content = `
    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 20px 0;">Project <span style="color: #F05E23;">Initialization</span></h2>
    <p>Greetings <b>${name}</b>, we have successfully initialized the roadmap for <b>${projectName}</b>. You can now track the mission progress in real-time through our secure gateway.</p>
    
    <div style="margin: 40px 0; padding: 35px; background: rgba(240, 94, 35, 0.03); border: 1px solid rgba(240, 94, 35, 0.1); border-radius: 30px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding-bottom: 25px;">
            <p style="margin: 0; font-size: 10px; font-weight: 800; color: #F05E23; text-transform: uppercase; letter-spacing: 2px;">Active Objective</p>
          </td>
        </tr>
        <tr>
          <td>
            <span style="display: block; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; text-transform: uppercase; italic;">${projectName}</span>
            <span style="display: block; font-size: 12px; color: rgba(255,255,255,0.4); mt-2;">Roadmap Version 1.0 Deployment Active</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 45px;">
      <p style="color: #ffffff; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 1.5px; margin-bottom: 16px;">Tracking Protocol:</p>
      <div style="color: rgba(255,255,255,0.6); font-size: 14px;">
        • Access the live link below for real-time status updates<br>
        • Monitor workflow stages and administrative notes<br>
        • Sync with our team via the integrated command console
      </div>
    </div>

    <a href="${trackingLink}" style="display: block; background-color: #F05E23; color: #ffffff; text-align: center; padding: 25px; border-radius: 20px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 4px; box-shadow: 0 20px 40px rgba(240,94,35,0.2);">Track Progress</a>
    
    <p style="margin-top: 40px; font-size: 11px; color: rgba(255,255,255,0.3); text-align: center;">Note: This link is unique to your project node. Keep it secure.</p>
  `;

  return transporter.sendMail({
    from: `"Sync Command" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `INITIALIZED: Roadmap for ${projectName}`,
    html: ADVANCED_WRAPPER(content, "#F05E23", "PROJECT-DEployed"),
  });
};
