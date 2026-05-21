import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const value = (input) => {
  if (input === null || input === undefined || input === "") {
    return "-";
  }

  return String(input);
};

const money = (input) =>
  `Rs. ${Number(input || 0).toLocaleString("en-IN")}`;

const generateVendorReportPDF = ({
  vendor = {},
  transactions = [],
  fileName = "Vendor Report",
}) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`${vendor.vendor_name || "Vendor"} Report`, 14, 18);

  autoTable(doc, {
    startY: 28,
    head: [["Field", "Value"]],
    body: [
      ["Vendor Name", value(vendor.vendor_name)],
      ["Contact", value(vendor.contact_number)],
      ["Email", value(vendor.email)],
      ["Address", value(vendor.address)],
      ["Total Purchase", money(vendor.total_purchase)],
      ["Paid Amount", money(vendor.paid_amount)],
      ["Pending Amount", money(vendor.pending_amount)],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  const finalY = doc.lastAutoTable?.finalY || 76;

  autoTable(doc, {
    startY: finalY + 10,
    head: [["Date", "Type", "Details", "Purchase", "Payment"]],
    body: transactions.map((item) => [
      item.date,
      item.type,
      item.description,
      money(item.debit),
      money(item.credit),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [5, 150, 105] },
  });

  doc.save(`${fileName}.pdf`);
};

export default generateVendorReportPDF;
