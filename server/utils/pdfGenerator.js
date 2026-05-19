import PDFDocument from "pdfkit";
import fs from "fs";

const pdfGenerator = (
  fileName,
  content
) => {
  const doc = new PDFDocument();

  doc.pipe(
    fs.createWriteStream(
      `uploads/${fileName}.pdf`
    )
  );

  doc.fontSize(20).text(content);

  doc.end();

  return `${fileName}.pdf`;
};

export default pdfGenerator;