import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const resolveCellValue = (row, key) => {
  const value = row[key];

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const generatePDF = (title, data = [], columns = []) => {
  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(title, 20, 20);

  const tableColumns =
    columns.length > 0
      ? columns
      : Object.keys(data[0] || {}).map((key) => ({
          key,
          label: key,
        }));

  if (tableColumns.length === 0 || data.length === 0) {
    doc.setFontSize(12);
    doc.text("No records available.", 20, 40);
  } else {
    autoTable(doc, {
      startY: 32,
      head: [tableColumns.map((column) => column.label)],
      body: data.map((row) =>
        tableColumns.map((column) =>
          resolveCellValue(row, column.key)
        )
      ),
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [37, 99, 235],
      },
    });
  }

  doc.save(`${title}.pdf`);
};

export default generatePDF;
