export function passwordResetTemplate(resetUrl: string) {
  return {
    subject: "Reset your CampusLink password",

    text: `
Reset your CampusLink password

We received a request to reset your password.

Reset your password here:
${resetUrl}

This link is temporary and should only be used by you.

If you didn't request a password reset, you can safely ignore this email.
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
  <title>Reset your CampusLink password</title>
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
        background: linear-gradient(135deg, #0f172a, #1e293b);
      ">

        <div style="
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
        ">
          CampusLink
        </div>

        <div style="
          margin-top: 5px;
          font-size: 13px;
          color: #cbd5e1;
        ">
          Secure account access
        </div>

      </div>

      <!-- Content -->
      <div style="padding: 40px 32px;">

        <div style="
          width: 52px;
          height: 52px;
          line-height: 52px;
          text-align: center;
          border-radius: 14px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 24px;
          font-weight: 700;
        ">
          ↻
        </div>

        <h1 style="
          margin: 22px 0 12px;
          font-size: 28px;
          line-height: 1.25;
        ">
          Reset your password
        </h1>

        <p style="
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: #64748b;
        ">
          We received a request to reset the password
          associated with your CampusLink account.
        </p>

        <!-- CTA -->
        <div style="margin: 32px 0;">

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 10px;
              font-size: 14px;
              font-weight: 700;
            "
          >
            Reset Password →
          </a>

        </div>

        <p style="
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
          color: #64748b;
        ">
          For your security, this link is temporary.
          If the button doesn't work, copy and paste the
          following URL into your browser:
        </p>

        <div style="
          margin-top: 14px;
          padding: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          word-break: break-all;
          font-size: 12px;
          color: #475569;
        ">
          ${resetUrl}
        </div>

        <div style="
          margin-top: 28px;
          padding: 14px 16px;
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.6;
          color: #991b1b;
        ">
          If you didn't request this password reset,
          you can safely ignore this email.
          Your password will remain unchanged.
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
          color: #94a3b8;
        ">
          © CampusLink · Secure account services
        </p>

      </div>

    </div>

  </div>

</body>
</html>
    `.trim(),
  };
}
