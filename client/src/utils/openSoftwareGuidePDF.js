import jsPDF from "jspdf";

const guideSections = [
  {
    title: "1. Login And Start",
    bullets: [
      "Open the software and login with the admin email and password.",
      "After login, the dashboard shows total expenses, pending payments, material cost, labour cost, and charts.",
      "Use the left sidebar to move between Dashboard, Materials, Vendors, Labour, Finance, Sites, and Reports.",
    ],
  },
  {
    title: "2. Create Construction Sites",
    bullets: [
      "Go to Sites and add each construction site with site name, location, and details.",
      "Always select the correct site while adding materials, labour, vendors, payments, and expenses.",
      "Site-wise records help the owner check separate reports for each project.",
    ],
  },
  {
    title: "3. Material Management",
    bullets: [
      "Go to Materials and add materials such as Cement, Sand, Steel, Bricks, Paint, etc.",
      "Record material purchases with quantity, unit cost, transport cost, vendor, date, and site.",
      "The system calculates total material cost automatically.",
      "Record used quantity whenever material is consumed at a site.",
      "Remaining stock is calculated from purchased quantity minus used quantity.",
      "Use material reports to check material-wise and site-wise stock and cost.",
    ],
  },
  {
    title: "4. Vendor Management",
    bullets: [
      "Go to Vendors and add vendor name, contact number, email, and address.",
      "When material is purchased from a vendor, record the purchase from the material purchase form.",
      "When payment is made to a vendor, add vendor payment with amount, date, and payment method.",
      "Vendor pending amount is calculated as total purchases minus total payments.",
      "Open Vendor Ledger to see complete purchase and payment history.",
      "Use PDF or Excel export when the owner needs a vendor statement.",
    ],
  },
  {
    title: "5. Labour Management",
    bullets: [
      "Go to Labour and add labour worker details with daily wage.",
      "Mark daily attendance for labour workers.",
      "Use wage management to calculate total wage from working days and per-day rate.",
      "Add labour payment whenever payment is given to a worker.",
      "Labour pending amount is calculated as total wage amount minus paid amount.",
      "Use daily, weekly, and monthly labour reports to review attendance and wages.",
    ],
  },
  {
    title: "6. Finance And Party Ledger",
    bullets: [
      "Go to Finance to add clients or parties from whom money is receivable.",
      "Add receivable amount, due date, and site if applicable.",
      "Record payment received when the client or party pays money.",
      "Party pending amount is calculated as total receivable minus payment received.",
      "Use party ledger to see the full receive and pending history.",
    ],
  },
  {
    title: "7. Expenses",
    bullets: [
      "Add site expenses such as transport, food, rent, tools, electricity, or other project expenses.",
      "Select the correct site and date for each expense.",
      "Expenses are included in dashboard totals and financial reports.",
    ],
  },
  {
    title: "8. Reports And Export",
    bullets: [
      "Open Reports from the left sidebar.",
      "Choose Material, Vendor, Labour, Labour Attendance, Financial, or Site Report.",
      "Use filters such as site, date, or labour name where available.",
      "Export PDF for printing and Excel for office records.",
    ],
  },
  {
    title: "9. Dashboard Review",
    bullets: [
      "Use Dashboard every day for quick business overview.",
      "Check total expenses, pending vendor payments, pending labour dues, material costs, and labour costs.",
      "Charts help the owner understand monthly material and expense movement.",
    ],
  },
  {
    title: "10. Important Working Rules",
    bullets: [
      "Create sites first before entering project records.",
      "Enter payment amounts carefully because ledgers and pending balances depend on payment entries.",
      "Use one admin account for main office control.",
      "Vendor email is saved as profile information only. Automatic email or WhatsApp sending is not enabled.",
      "If data is not visible, check that the correct admin account, site, and filters are selected.",
    ],
  },
];

const addFooter = (doc) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 130, 145);
    doc.text("Construction Management System - Client Guide", 18, pageHeight - 12);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - 18, pageHeight - 12, {
      align: "right",
    });
  }
};

const openSoftwareGuidePDF = () => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (neededHeight) => {
    if (y + neededHeight <= pageHeight - 24) {
      return;
    }

    doc.addPage();
    y = 18;
  };

  const addText = (text, options = {}) => {
    const {
      size = 11,
      style = "normal",
      color = [45, 55, 72],
      spacing = 5.5,
      indent = 0,
    } = options;

    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(text, contentWidth - indent);
    ensureSpace(lines.length * spacing + 2);
    doc.text(lines, margin + indent, y);
    y += lines.length * spacing + 2;
  };

  const addHeading = (text) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 82, 78);
    doc.text(text, margin, y);
    y += 8;
  };

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 38, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("How To Use This Software", margin, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(220, 226, 235);
  doc.text("Construction Management System - Simple Client Working Guide", margin, 28);

  y = 48;
  addText(
    "This guide explains the daily working flow of the construction management software in simple steps. The client can use it to understand how records are added, how balances are calculated, and where reports are available.",
    { size: 11.5, color: [30, 41, 59], spacing: 6 }
  );

  addHeading("Daily Working Flow");
  [
    "Login as admin.",
    "Create or select the construction site.",
    "Add vendors, materials, labour workers, clients or parties.",
    "Record purchases, material usage, attendance, wages, expenses, and payments.",
    "Check dashboard, ledgers, and reports for pending amounts and total cost.",
    "Export PDF or Excel reports whenever printed records are required.",
  ].forEach((item) => addText(`- ${item}`, { indent: 4 }));

  guideSections.forEach((section) => {
    addHeading(section.title);
    section.bullets.forEach((item) => {
      addText(`- ${item}`, { indent: 4 });
    });
  });

  addHeading("Simple Example");
  [
    "First create a site named Main Bungalow Site.",
    "Add vendor ABC Cement Supplier.",
    "Add material Cement and record 100 bags purchased from ABC vendor.",
    "Record transport cost if paid.",
    "Add labour worker Ramesh with daily wage.",
    "Mark Ramesh present for today.",
    "Add payment when vendor or labour is paid.",
    "Open dashboard and reports to see total cost and pending balance.",
  ].forEach((item) => addText(`- ${item}`, { indent: 4 }));

  addFooter(doc);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const openedWindow = window.open(pdfUrl, "_blank", "noopener,noreferrer");

  if (!openedWindow) {
    doc.save("Construction-Management-System-Guide.pdf");
  }

  setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
};

export default openSoftwareGuidePDF;
