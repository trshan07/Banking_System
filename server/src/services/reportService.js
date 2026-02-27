// backend/src/services/reportService.js
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

class ReportService {
  async generateTransactionReport(transactions, format = 'excel') {
    if (format === 'excel') {
      return this.generateExcelReport(transactions);
    } else if (format === 'pdf') {
      return this.generatePDFReport(transactions);
    }
  }

  async generateExcelReport(transactions) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Add headers
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Status', key: 'status', width: 10 }
    ];

    // Add rows
    transactions.forEach(transaction => {
      worksheet.addRow({
        date: transaction.createdAt,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async generatePDFReport(transactions) {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add content
      doc.fontSize(16).text('Transaction Report', { align: 'center' });
      doc.moveDown();

      transactions.forEach(transaction => {
        doc.fontSize(10)
          .text(`Date: ${transaction.createdAt}`)
          .text(`Description: ${transaction.description}`)
          .text(`Amount: $${transaction.amount}`)
          .text(`Type: ${transaction.type}`)
          .text(`Status: ${transaction.status}`)
          .moveDown();
      });

      doc.end();
    });
  }

  calculateSummary(transactions) {
    const summary = {
      totalCredits: 0,
      totalDebits: 0,
      netBalance: 0,
      transactionCount: transactions.length
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'credit') {
        summary.totalCredits += transaction.amount;
      } else {
        summary.totalDebits += transaction.amount;
      }
    });

    summary.netBalance = summary.totalCredits - summary.totalDebits;
    return summary;
  }
}

module.exports = new ReportService();