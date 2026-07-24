const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { drawInvoicePdf } = require('../dist/src/common/utils/invoice-pdf.util');

async function main() {
  const prisma = new PrismaClient();
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { isDeleted: false },
      include: {
        items: { include: { product: { include: { unit: true } } } },
        order: { include: { customer: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });

    if (!invoice) {
      console.log('NO_INVOICE');
      return;
    }

    console.log('Using invoice', invoice.invoiceNo);

    const out = path.join(__dirname, '..', 'assets', 'sample-invoice-preview.pdf');
    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    const stream = fs.createWriteStream(out);
    doc.pipe(stream);

    drawInvoicePdf(doc, {
      invoiceNo: invoice.invoiceNo,
      issuedAt: invoice.issuedAt,
      sellerGstin: invoice.sellerGstin,
      buyerGstin: invoice.buyerGstin || invoice.order.customer.gstin,
      subtotal: Number(invoice.subtotal),
      cgstAmount: Number(invoice.cgstAmount),
      sgstAmount: Number(invoice.sgstAmount),
      igstAmount: Number(invoice.igstAmount),
      total: Number(invoice.total),
      company: {
        name: 'Kedar Enterprise',
        tagline: 'Seva. Spirituality. Service',
        address: '2-77, Gujarat Housing Board, Dehgam, PO: Dehgam, Dist: Gandhinagar, Gujarat, 382305',
        phone: '+91 99094 32021  ·  +91 63519 25121',
        email: 'foundation.kedar@gmail.com',
        website: 'kedarfoundation.com',
        gstin: invoice.sellerGstin || '27AAAAA0000A1Z5',
        state: 'Gujarat',
        bankName: 'HDFC BANK LTD',
        bankAccount: '',
        bankIfsc: '',
        bankBranch: '',
        payeeName: 'Kedar Enterprise',
      },
      customer: {
        name: invoice.order.customer.name,
        email: invoice.order.customer.email,
        phone: invoice.order.customer.phone,
        address: invoice.order.customer.address,
        city: invoice.order.customer.city,
        state: invoice.order.customer.state,
        gstin: invoice.order.customer.gstin,
      },
      items: invoice.items.map((item) => ({
        name: item.product.name,
        hsnCode: item.hsnCode,
        qty: Number(item.qty),
        unit: item.product.unit?.symbol,
        rate: Number(item.rate),
        taxable: Number(item.taxable),
        gstRate: Number(item.gstRate),
        cgst: Number(item.cgst),
        sgst: Number(item.sgst),
        igst: Number(item.igst),
        lineTotal: Number(item.lineTotal),
      })),
    });

    doc.end();
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    console.log('Wrote', out, 'bytes', fs.statSync(out).size);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
