import jsPDF from "jspdf";

const generatePDF = (title, content) => {
  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(title, 20, 20);

  doc.setFontSize(12);

  doc.text(content, 20, 40);

  doc.save(`${title}.pdf`);
};

export default generatePDF;