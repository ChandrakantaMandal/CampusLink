export function welcomeTemplate(name: string) {
  return {
    subject: `Welcome to CampusLink, ${name}!`,

    text: `
Welcome to CampusLink, ${name}!

Your account has been successfully created.

CampusLink helps students discover opportunities,
build their career profiles, and connect with recruiters.

We're excited to have you here.
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
  <title>Welcome to CampusLink</title>
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

      <!-- Hero -->
      <div style="
        padding: 48px 32px;
        text-align: center;
        background: linear-gradient(135deg, #2563eb, #4f46e5);
      ">

        <div style="
          display: inline-block;
          padding: 8px 14px;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 999px;
          color: #dbeafe;
          font-size: 12px;
          font-weight: 700;
        ">
          WELCOME TO CampusLink
        </div>

        <h1 style="
          margin: 20px 0 10px;
          color: #ffffff;
          font-size: 32px;
          line-height: 1.2;
        ">
          Welcome aboard, ${name}!
        </h1>

        <p style="
          margin: 0;
          color: #dbeafe;
          font-size: 15px;
          line-height: 1.6;
        ">
          Your career journey starts here.
        </p>

      </div>

      <!-- Content -->
      <div style="padding: 40px 32px;">

        <p style="
          margin: 0;
          font-size: 16px;
          line-height: 1.7;
          color: #334155;
        ">
          Your CampusLink account has been successfully created.
          You're now ready to explore opportunities,
          build your profile, and connect with recruiters.
        </p>

        <!-- Features -->
        <div style="margin-top: 30px;">

          <div style="
            padding: 18px;
            margin-bottom: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
          ">
            <strong style="color: #0f172a;">
              Discover opportunities
            </strong>

            <p style="
              margin: 6px 0 0;
              font-size: 13px;
              line-height: 1.6;
              color: #64748b;
            ">
              Find internships, jobs, and career opportunities
              that match your profile.
            </p>
          </div>

          <div style="
            padding: 18px;
            margin-bottom: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
          ">
            <strong style="color: #0f172a;">
              Build your profile
            </strong>

            <p style="
              margin: 6px 0 0;
              font-size: 13px;
              line-height: 1.6;
              color: #64748b;
            ">
              Showcase your skills, projects, education,
              and experience.
            </p>
          </div>

          <div style="
            padding: 18px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
          ">
            <strong style="color: #0f172a;">
              Connect with recruiters
            </strong>

            <p style="
              margin: 6px 0 0;
              font-size: 13px;
              line-height: 1.6;
              color: #64748b;
            ">
              Connect with organizations looking for
              your skills and talent.
            </p>
          </div>

        </div>

      </div>

      <!-- Footer -->
      <div style="
        padding: 24px 32px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        text-align: center;
      ">

        <p style="
          margin: 0;
          font-size: 12px;
          line-height: 1.6;
          color: #94a3b8;
        ">
          You're receiving this email because you created
          a CampusLink account.
        </p>

        <p style="
          margin: 12px 0 0;
          font-size: 12px;
          color: #94a3b8;
        ">
          © CampusLink
        </p>

      </div>

    </div>

  </div>

</body>
</html>
    `.trim(),
  };
}
