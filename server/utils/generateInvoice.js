const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = (payment) => {
  const filePath = `uploads/invoices/${payment.paymentId}.pdf`;

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("BikeBook Invoice", { align: "center" });
  doc.moveDown();
  doc.text(`Payment ID: ${payment.paymentId}`);
  doc.text(`Order ID: ${payment.orderId}`);
  doc.text(`Amount: ₹${payment.amount}`);
  doc.text(`Status: ${payment.status}`);

  doc.end();

  return filePath;
};
