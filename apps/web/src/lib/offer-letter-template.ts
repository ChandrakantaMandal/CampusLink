export type OfferLetterDetails = {
  candidateName: string;
  companyName: string;
  role: string;
  ctc: string;
  baseSalary: string;
  variableBonus: string;
  joiningDate: string;
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
}

export function renderOfferLetterHtml(details: OfferLetterDetails) {
  const company = escapeHtml(details.companyName);
  const candidate = escapeHtml(details.candidateName);
  const role = escapeHtml(details.role);
  const issueDate = escapeHtml(
    new Date().toLocaleDateString("en-IN", { dateStyle: "long" }),
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Offer Letter | ${company}</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 32px 16px; background: #edf2f7; color: #1e293b; font-family: Arial, Helvetica, sans-serif; line-height: 1.65; }
      .letter { max-width: 820px; margin: 0 auto; overflow: hidden; border: 1px solid #dbe4ee; border-radius: 18px; background: #fff; box-shadow: 0 18px 55px rgba(15, 23, 42, .12); }
      .accent { height: 8px; background: linear-gradient(90deg, #0f766e, #14b8a6, #99f6e4); }
      .content { padding: 52px 64px 56px; }
      .eyebrow { margin: 0 0 12px; color: #0f766e; font-size: 12px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
      .company { margin: 0; color: #0f172a; font-size: 28px; font-weight: 800; letter-spacing: -.03em; }
      .title { margin: 38px 0 8px; color: #0f172a; font-size: 32px; line-height: 1.2; letter-spacing: -.04em; }
      .role { margin: 0; color: #0f766e; font-size: 18px; font-weight: 700; }
      .date { margin: 26px 0 32px; color: #64748b; font-size: 14px; }
      .greeting { margin: 0 0 14px; color: #0f172a; font-size: 17px; font-weight: 700; }
      .copy { margin: 0 0 18px; color: #475569; font-size: 15px; }
      .compensation { margin: 28px 0; padding: 22px 24px; border: 1px solid #b7e4df; border-radius: 14px; background: #f0fdfa; }
      .compensation-label { margin: 0 0 4px; color: #0f766e; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
      .compensation-value { margin: 0; color: #115e59; font-size: 28px; font-weight: 800; letter-spacing: -.03em; }
      .details { width: 100%; margin: 22px 0 30px; border-collapse: collapse; }
      .details td { padding: 13px 4px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 14px; }
      .details td:first-child { width: 42%; color: #64748b; }
      .details td:last-child { color: #1e293b; font-weight: 700; }
      .next-step { margin: 28px 0; padding: 16px 18px; border-left: 3px solid #14b8a6; border-radius: 0 10px 10px 0; background: #f8fafc; color: #475569; font-size: 14px; }
      .signature { margin-top: 38px; color: #475569; font-size: 14px; }
      .signature-name { display: block; margin-top: 22px; color: #0f172a; font-weight: 700; }
      .footer { margin-top: 42px; padding-top: 18px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px; }
      @media (max-width: 600px) { body { padding: 12px 8px; } .letter { border-radius: 12px; } .content { padding: 32px 24px 36px; } .company { font-size: 23px; } .title { margin-top: 30px; font-size: 27px; } .compensation-value { font-size: 24px; } }
      @media print { body { padding: 0; background: #fff; } .letter { max-width: none; border: 0; border-radius: 0; box-shadow: none; } .content { padding: 42px 48px; } }
    </style>
  </head>
  <body>
    <main class="letter">
      <div class="accent"></div>
      <article class="content">
        <p class="eyebrow">Formal offer of employment</p>
        <p class="company">${company}</p>
        <h1 class="title">Welcome to the next step</h1>
        <p class="role">${role}</p>
        <p class="date">${issueDate}</p>
        <p class="greeting">Dear ${candidate},</p>
        <p class="copy">We are pleased to offer you the position of <strong>${role}</strong> at <strong>${company}</strong>. We were impressed by your application and look forward to the contribution you will make to our team.</p>
        <section class="compensation" aria-label="Total compensation">
          <p class="compensation-label">Total compensation</p>
          <p class="compensation-value">${escapeHtml(details.ctc)}</p>
        </section>
        <table class="details" aria-label="Offer details">
          <tbody>
            <tr><td>Position</td><td>${role}</td></tr>
            <tr><td>Base salary</td><td>${escapeHtml(details.baseSalary)}</td></tr>
            <tr><td>Variable bonus</td><td>${escapeHtml(details.variableBonus)}</td></tr>
            <tr><td>Expected joining date</td><td>${escapeHtml(details.joiningDate)}</td></tr>
          </tbody>
        </table>
        <p class="next-step">Please reply to the email that delivered this letter to confirm your acceptance or contact your recruiter with any questions about the offer.</p>
        <p class="signature">We are excited about the possibility of working together.<span class="signature-name">${company} Recruiting Team</span></p>
        <p class="footer">This offer letter was prepared for ${candidate} for the ${role} position at ${company}.</p>
      </article>
    </main>
  </body>
</html>`;
}
