export type OfferLetterPdfDetails = {
  candidateName: string;
  companyName: string;
  role: string;
  ctc: string;
  baseSalary: string;
  variableBonus: string;
  joiningDate: string;
};

function pdfSafe(value: string) {
  return value
    .replace(/₹/g, "INR ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export function renderOfferLetterPdf(details: OfferLetterPdfDetails): Buffer {
  const commands: string[] = [];
  const text = (
    value: string,
    x: number,
    y: number,
    size: number,
    font = "F1",
    color = "0.12 0.18 0.25",
  ) => {
    commands.push(
      `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${pdfSafe(value)}) Tj ET`,
    );
  };
  const line = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = "0.86 0.90 0.93",
  ) => {
    commands.push(`${color} RG 0.7 w ${x1} ${y1} m ${x2} ${y2} l S`);
  };
  const rect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) => {
    commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
  };
  const wrap = (value: string, maxLength: number) => {
    const words = pdfSafe(value).split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      if (current && `${current} ${word}`.length > maxLength) {
        lines.push(current);
        current = word;
      } else {
        current = current ? `${current} ${word}` : word;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  rect(0, 834, 595, 8, "0.06 0.46 0.43");
  text(details.companyName, 52, 786, 22, "F2", "0.06 0.09 0.15");
  text("FORMAL OFFER OF EMPLOYMENT", 52, 761, 9, "F2", "0.06 0.46 0.43");
  line(52, 744, 543, 744, "0.78 0.88 0.88");
  text("Offer of Employment", 52, 700, 27, "F2", "0.06 0.09 0.15");
  text(details.role, 52, 672, 14, "F2", "0.06 0.46 0.43");
  text(
    new Date().toLocaleDateString("en-IN", { dateStyle: "long" }),
    52,
    638,
    10,
    "F1",
    "0.39 0.45 0.52",
  );
  text(`Dear ${details.candidateName},`, 52, 600, 12, "F2");

  const intro = `We are pleased to offer you the position of ${details.role} at ${details.companyName}. We were impressed by your application and look forward to the contribution you will make to our team.`;
  let y = 578;
  for (const paragraphLine of wrap(intro, 88)) {
    text(paragraphLine, 52, y, 10, "F1", "0.28 0.34 0.41");
    y -= 16;
  }

  const cardY = y - 70;
  rect(52, cardY, 491, 60, "0.91 0.98 0.97");
  text("TOTAL COMPENSATION", 68, cardY + 39, 8, "F2", "0.06 0.46 0.43");
  text(details.ctc, 68, cardY + 15, 20, "F2", "0.05 0.37 0.35");

  let detailY = cardY - 24;
  const rows: [string, string][] = [
    ["Position", details.role],
    ["Base salary", details.baseSalary],
    ["Variable bonus", details.variableBonus],
    ["Expected joining date", details.joiningDate],
  ];
  for (const [label, value] of rows) {
    text(label, 56, detailY, 10, "F1", "0.39 0.45 0.52");
    text(value, 270, detailY, 10, "F2", "0.12 0.18 0.25");
    line(52, detailY - 10, 543, detailY - 10);
    detailY -= 34;
  }

  let nextY = detailY - 10;
  text("NEXT STEPS", 52, nextY, 8, "F2", "0.06 0.46 0.43");
  nextY -= 18;
  for (const paragraphLine of wrap(
    "Please reply to the email that delivered this letter to confirm your acceptance or contact your recruiter with any questions about the offer.",
    88,
  )) {
    text(paragraphLine, 52, nextY, 10, "F1", "0.28 0.34 0.41");
    nextY -= 15;
  }

  nextY -= 25;
  text(
    "We are excited about the possibility of working together.",
    52,
    nextY,
    10,
    "F1",
    "0.28 0.34 0.41",
  );
  nextY -= 34;
  text(
    `${details.companyName} Recruiting Team`,
    52,
    nextY,
    10,
    "F2",
    "0.12 0.18 0.25",
  );
  line(52, 58, 543, 58, "0.86 0.90 0.93");
  text(
    `Prepared for ${details.candidateName} | ${details.role} | ${details.companyName}`,
    52,
    42,
    7,
    "F1",
    "0.58 0.63 0.69",
  );

  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(stream, "ascii")} >>\nstream\n${stream}\nendstream`,
  ];

  let document = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(document, "ascii"));
    document += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(document, "ascii");
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1))
    document += `${String(offset).padStart(10, "0")} 00000 n \n`;
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(document, "ascii");
}
