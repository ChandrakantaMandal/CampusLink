export function verificationOtpTemplate(otp: string) {
  return {
    subject: `${otp} — Your HireBridge verification code`,

    text: `
Verify your HireBridge account

Your verification code is: ${otp}

This code expires in 10 minutes.

If you didn't request this code, you can safely ignore this email.
    `.trim(),

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Verify your HireBridge account</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background: #f4f7fb;
  font-family: Arial, Helvetica, sans-serif;
  color: #0f172a;
">

  <div style="
    width: 100%;
    padding: 48px 16px;
    box-sizing: border-box;
  ">

    <div style="
      max-width: 560px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 35px rgba(15, 23, 42, 0.08);
    ">

      <!-- Header -->
      <div style="
        padding: 28px 32px;
        background: linear-gradient(135deg, #2563eb, #4f46e5);
      ">

        <div style="
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
        ">
          HireBridge
        </div>

        <div style="
          margin-top: 5px;
          font-size: 13px;
          color: #dbeafe;
        ">
          Connecting talent with opportunity
        </div>

      </div>

      <!-- Content -->
      <div style="padding: 40px 32px;">

        <div style="
          display: inline-block;
          padding: 7px 12px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        ">
          EMAIL VERIFICATION
        </div>

        <h1 style="
          margin: 20px 0 12px;
          font-size: 28px;
          line-height: 1.25;
          color: #0f172a;
        ">
          Verify your email
        </h1>

        <p style="
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: #64748b;
        ">
          Use the verification code below to complete your
          HireBridge account setup.
        </p>

        <!-- OTP -->
        <div style="
          margin: 30px 0;
          padding: 24px;
          text-align: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
        ">

          <div style="
            font-size: 12px;
            color: #64748b;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">
            Verification code
          </div>

          <div style="
            font-size: 36px;
            line-height: 1;
            font-weight: 800;
            letter-spacing: 10px;
            color: #2563eb;
          ">
            ${otp}
          </div>

        </div>

        <p style="
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: #64748b;
        ">
          This code will expire in
          <strong style="color: #0f172a;">10 minutes</strong>.
        </p>

        <div style="
          margin-top: 28px;
          padding: 14px 16px;
          background: #fff7ed;
          border-left: 4px solid #f97316;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.6;
          color: #7c2d12;
        ">
          Never share this code with anyone.
          HireBridge will never ask you for your verification code.
        </div>

      </div>

      <!-- Footer -->
      <div style="
        padding: 24px 32px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
      ">

        <p style="
          margin: 0;
          font-size: 12px;
          line-height: 1.6;
          color: #94a3b8;
        ">
          If you didn't create a HireBridge account,
          you can safely ignore this email.
        </p>

        <p style="
          margin: 14px 0 0;
          font-size: 12px;
          color: #94a3b8;
        ">
          © HireBridge
        </p>

      </div>

    </div>

  </div>

</body>
</html>
    `.trim(),
  };
}