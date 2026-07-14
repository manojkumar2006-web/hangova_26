import nodemailer from "nodemailer";

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendOtpEmail(to: string, otp: string, name?: string) {
  const transporter = createTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HANGOVA — Verify your email</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#12102090,#0a09149f);border:1px solid rgba(124,111,255,0.2);border-radius:24px;overflow:hidden;max-width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center;background:linear-gradient(180deg,rgba(124,111,255,0.08) 0%,transparent 100%);">
              <div style="display:inline-block;width:56px;height:56px;background:linear-gradient(135deg,#7c6fff,#6357e0);border-radius:16px;line-height:56px;font-size:26px;margin-bottom:20px;">✨</div>
              <h1 style="color:#f0f0f0;font-size:22px;font-weight:800;margin:0 0 8px;">Verify your email</h1>
              <p style="color:#666;font-size:14px;margin:0;">Hey ${name || "there"}, welcome to HANGOVA!</p>
            </td>
          </tr>
          <!-- OTP Box -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="color:#888;font-size:14px;line-height:1.6;margin:0 0 24px;">
                Use this one-time passcode to verify your email address. It expires in <strong style="color:#a89dff;">10 minutes</strong>.
              </p>
              <div style="background:rgba(124,111,255,0.06);border:1px solid rgba(124,111,255,0.2);border-radius:16px;padding:24px;text-align:center;">
                <p style="color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">Your verification code</p>
                <div style="letter-spacing:16px;font-size:40px;font-weight:900;color:#ffffff;font-variant-numeric:tabular-nums;">${otp}</div>
              </div>
              <p style="color:#444;font-size:12px;text-align:center;margin:20px 0 0;">
                If you didn't create a HANGOVA account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="color:#333;font-size:11px;margin:0;">© 2025 HANGOVA · Your private media hub</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"HANGOVA" <${process.env.SMTP_USER}>`,
    to,
    subject: `${otp} is your HANGOVA verification code`,
    html,
  });
}
