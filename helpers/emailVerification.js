const nodemailer = require("nodemailer");
const emailVerification = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: "twahidulislam2005@gmail.com",
      pass: "bpfgcvtaquzkslvy",
    },
  });
  const info = await transporter.sendMail({
    from: '"Backend E-Commerce" <twahidulislam2005@gmail.com>',
    to: email,
    subject: "Your OTP Verification Code",
    html: `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      
      <!-- Header -->
      <div style="background:#f9fafb;padding:20px;text-align:center;border-bottom:1px solid #e5e7eb">
        <h1 style="color:#111827;margin:0;font-size:22px;letter-spacing:1px">
          Backend E-Commerce
        </h1>
      </div>
      <!-- Body -->
      <div style="padding:25px;color:#374151">
        <h2 style="margin-top:0;color:#111827">OTP Verification</h2>
        <p style="font-size:14px;line-height:1.5">
          Hello,
        </p>
        <p style="font-size:14px;line-height:1.5">
          Use the following One-Time Password (OTP) to complete your verification.
          This OTP is valid for <strong>5 minutes</strong>.
        </p>
        <!-- OTP Box -->
        <div style="text-align:center;margin:30px 0">
          <span style="
            display:inline-block;
            padding:15px 30px;
            font-size:28px;
            font-weight:bold;
            letter-spacing:6px;
            color:#111827;
            background:#f9fafb;
            border-radius:6px;
            border:2px solid #e5e7eb;
          ">
            ${otp}
          </span>
        </div>
        <p style="font-size:14px;color:#6b7280;background:#f9fafb;padding:12px;border-radius:4px;text-align:center">
          If you did not request this code, please ignore this email.
        </p>
        <p style="font-size:14px;margin-top:30px">
          Regards,<br />
          <strong>Backend E-Commerce Team</strong>
        </p>
      </div>
      <!-- Footer -->
      <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb">
        © ${new Date().getFullYear()} Backend E-Commerce. All rights reserved.
      </div>
    </div>
  `,
  });
  
};
module.exports = emailVerification;
