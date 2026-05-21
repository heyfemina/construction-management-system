import nodemailer from "nodemailer";

const adminEmail =
  process.env.ADMIN_EMAIL ||
  process.env.EMAIL_USER ||
  "coretechsoftwaresolution2910@gmail.com";

const formatAmount = (amount) => {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return "Today";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTransporter = () => {
  const user = process.env.EMAIL_USER || adminEmail;
  const pass =
    process.env.EMAIL_SMTP_KEY ||
    process.env.BREVO_SMTP_KEY ||
    process.env.EMAIL_APP_PASSWORD;
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);

  if (!user || !pass) {
    return null;
  }

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

const buildPaymentEmail = ({
  recipientName,
  recipientType,
  amount,
  totalAmount,
  pendingAmount,
  paymentDate,
  paymentMethod,
  reference,
}) => {
  const subject = `${recipientType} payment confirmation`;

  const text = [
    `Hello ${recipientName || recipientType},`,
    "",
    "This is a confirmation that your payment has been recorded.",
    "",
    `Paid Amount: ${formatAmount(amount)}`,
    `Total Amount: ${formatAmount(totalAmount || amount)}`,
    `Pending Amount: ${formatAmount(pendingAmount || 0)}`,
    `Payment Date: ${formatDate(paymentDate)}`,
    `Payment Method: ${paymentMethod || "Not specified"}`,
    `Reference: ${reference || "Not available"}`,
    "",
    `Sent by: ${adminEmail}`,
    "",
    "Thank you.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6">
      <h2 style="margin:0 0 12px">Payment Confirmation</h2>
      <p>Hello ${recipientName || recipientType},</p>
      <p>This is a confirmation that your payment has been recorded.</p>
      <table style="border-collapse:collapse;width:100%;max-width:520px">
        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Paid Amount</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${formatAmount(amount)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Total Amount</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${formatAmount(totalAmount || amount)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Pending Amount</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${formatAmount(pendingAmount || 0)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Payment Date</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${formatDate(paymentDate)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Payment Method</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${paymentMethod || "Not specified"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Reference</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${reference || "Not available"}</td></tr>
      </table>
      <p style="margin-top:16px">Sent by: ${adminEmail}</p>
      <p>Thank you.</p>
    </div>
  `;

  return { subject, text, html };
};

export const sendPaymentConfirmationEmail = async ({
  to,
  recipientName,
  recipientType,
  amount,
  totalAmount,
  pendingAmount,
  paymentDate,
  paymentMethod,
  reference,
}) => {
  const transporter = getTransporter();

  if (!transporter || !to) {
    return {
      sent: false,
      skipped: true,
      reason: "Email recipient or SMTP credentials are missing",
    };
  }

  const email = buildPaymentEmail({
    recipientName,
    recipientType,
    amount,
    totalAmount,
    pendingAmount,
    paymentDate,
    paymentMethod,
    reference,
  });

  const result = await transporter.sendMail({
    from: `"Construction Management" <${adminEmail}>`,
    to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  return {
    sent: true,
    messageId: result.messageId,
  };
};
