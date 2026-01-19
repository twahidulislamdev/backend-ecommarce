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
    subject: "Secure OTP Verification",
    html: `
  <div style="max-width:620px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#f4f7fb;padding:20px">
    
    <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08)">

      <!-- Header -->
      <div style="
        background:linear-gradient(135deg,#4f46e5,#06b6d4);
        padding:30px;
        text-align:center;
      ">
        <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700">
          Backend E-Commerce
        </h1>
        <p style="color:#e0f2fe;margin-top:6px;font-size:14px">
          Secure Account Verification
        </p>
      </div>

      <!-- Body -->
      <div style="padding:35px;color:#374151">

        <h2 style="margin-top:0;color:#111827;font-size:20px">
          Verify Your Email Address
        </h2>

        <p style="font-size:15px;line-height:1.7">
          Hi there,
        </p>

        <p style="font-size:15px;line-height:1.7">
          Please use the One-Time Password (OTP) below to complete your verification.
          This code is valid for <strong>5 minutes</strong>.
        </p>

        <!-- OTP Card -->
        <div style="
          margin:30px 0;
          text-align:center;
          background:linear-gradient(135deg,#eef2ff,#ecfeff);
          padding:25px;
          border-radius:10px;
          border:1px solid #e5e7eb;
        ">
          <p style="margin:0 0 10px;font-size:14px;color:#475569">
            Your OTP Code
          </p>
          <div style="
            font-size:32px;
            font-weight:800;
            letter-spacing:8px;
            color:#4f46e5;
          ">
            ${otp}
          </div>
        </div>

        <p style="font-size:14px;color:#6b7280">
          For your security, do not share this code with anyone.
        </p>

        <p style="font-size:14px;color:#6b7280">
          If you did not request this verification, you can safely ignore this email.
        </p>

        <div style="margin-top:35px">
          <p style="margin:0;font-size:14px">
            Best regards,<br />
            <strong style="color:#111827">Backend E-Commerce Team</strong>
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="
        background:#f1f5f9;
        padding:18px;
        text-align:center;
        font-size:12px;
        color:#64748b;
      ">
        © ${new Date().getFullYear()} Backend E-Commerce · All rights reserved  
        <br />
        This is an automated message, please do not reply.
      </div>

    </div>

  </div>
  `,
  });
};
module.exports = emailVerification;
