"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateCode = getStateCode;
exports.amountInWords = amountInWords;
exports.formatInr = formatInr;
exports.resolveInvoiceLogoPath = resolveInvoiceLogoPath;
exports.drawInvoicePdf = drawInvoicePdf;
const path = require("path");
const fs = require("fs");
const NAVY = '#0B2447';
const GOLD = '#D4AF37';
const LIGHT_BLUE = '#D6EAF8';
const YELLOW = '#FFF3B0';
const MUTED = '#5A6A7A';
const LINE = '#C5D0DA';
const STATE_CODES = {
    gujarat: '24',
    maharashtra: '27',
    rajasthan: '08',
    karnataka: '29',
    delhi: '07',
    'uttar pradesh': '09',
    'madhya pradesh': '23',
    punjab: '03',
    haryana: '06',
    goa: '30',
    telangana: '36',
    'tamil nadu': '33',
    kerala: '32',
    'west bengal': '19',
    bihar: '10',
    odisha: '21',
    assam: '18',
    jharkhand: '20',
    chhattisgarh: '22',
};
function getStateCode(state) {
    if (!state)
        return '24';
    return STATE_CODES[state.trim().toLowerCase()] || '24';
}
function amountInWords(amount) {
    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen',
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const twoDigits = (n) => {
        if (n < 20)
            return ones[n];
        return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ''}`.trim();
    };
    const threeDigits = (n) => {
        if (n < 100)
            return twoDigits(n);
        return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${twoDigits(n % 100)}` : ''}`.trim();
    };
    const rupees = Math.floor(Math.abs(amount));
    const paise = Math.round((Math.abs(amount) - rupees) * 100);
    if (rupees === 0 && paise === 0)
        return 'Zero Rupees Only';
    let n = rupees;
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const hundred = n;
    const parts = [];
    if (crore)
        parts.push(`${threeDigits(crore)} Crore`);
    if (lakh)
        parts.push(`${threeDigits(lakh)} Lakh`);
    if (thousand)
        parts.push(`${threeDigits(thousand)} Thousand`);
    if (hundred)
        parts.push(threeDigits(hundred));
    let words = parts.join(' ').trim() || 'Zero';
    words = `${words} Rupee${rupees === 1 ? '' : 's'}`;
    if (paise > 0) {
        words += ` and ${twoDigits(paise)} Paise`;
    }
    return `${words} Only`;
}
function formatInr(n) {
    return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function resolveInvoiceLogoPath() {
    const candidates = [
        path.join(process.cwd(), 'assets', 'invoice-logo.png'),
        path.join(process.cwd(), 'assets', 'logo.png'),
        path.join(__dirname, '..', '..', '..', 'assets', 'invoice-logo.png'),
        path.join(__dirname, '..', '..', '..', 'assets', 'logo.png'),
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate))
            return candidate;
    }
    return null;
}
function drawInvoicePdf(doc, data) {
    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const margin = 32;
    const contentW = pageW - margin * 2;
    const left = margin;
    const right = pageW - margin;
    const footerY = pageH - 28;
    const watermark = resolveInvoiceLogoPath();
    if (watermark) {
        try {
            doc.save();
            doc.opacity(0.05);
            doc.image(watermark, pageW / 2 - 90, 300, { width: 180, height: 180 });
            doc.restore();
        }
        catch {
        }
    }
    const at = (text, x, yPos, opts = {}) => {
        const { bold, size = 8, color = '#111', ...rest } = opts;
        doc.fillColor(color)
            .font(bold ? 'Helvetica-Bold' : 'Helvetica')
            .fontSize(size)
            .text(text, x, yPos, { lineBreak: false, ...rest });
    };
    let y = 24;
    const logoPath = resolveInvoiceLogoPath();
    if (logoPath) {
        try {
            doc.image(logoPath, left, y, { width: 48, height: 48 });
        }
        catch {
        }
    }
    at(data.company.name.toUpperCase(), left + 58, y + 2, { bold: true, size: 16, color: NAVY, width: 240 });
    at(data.company.tagline || 'Seva. Spirituality. Service', left + 58, y + 22, { size: 8, color: GOLD, width: 240 });
    if (data.withGst && data.company.gstin) {
        at(`GSTIN: ${data.company.gstin}`, left + 58, y + 34, { size: 7, color: MUTED, width: 240 });
    }
    const contactW = contentW - 300;
    const contactX = left + 300;
    at(data.company.phone, contactX, y + 2, { size: 7.5, color: NAVY, width: contactW, align: 'right' });
    at(data.company.email, contactX, y + 13, { size: 7.5, color: NAVY, width: contactW, align: 'right' });
    if (data.company.website) {
        at(data.company.website, contactX, y + 24, { size: 7.5, color: NAVY, width: contactW, align: 'right' });
    }
    at(data.company.address, contactX, y + 35, {
        size: 6.5, color: MUTED, width: contactW, align: 'right', lineBreak: true, height: 20,
    });
    y = 82;
    doc.strokeColor(GOLD).lineWidth(1)
        .moveTo(left, y).lineTo(right, y).stroke();
    doc.circle((left + right) / 2, y, 2.5).fill(GOLD);
    y += 10;
    at(data.withGst ? 'Tax Invoice' : 'Invoice', left, y, {
        bold: true, size: 14, color: NAVY, width: contentW, align: 'center',
    });
    if (!data.withGst) {
        at('(Without GST)', left, y + 16, {
            size: 8, color: MUTED, width: contentW, align: 'center',
        });
        y += 10;
    }
    y += 20;
    const boxH = 100;
    const gap = 8;
    const halfW = (contentW - gap) / 2;
    const leftBoxX = left;
    const rightBoxX = left + halfW + gap;
    doc.roundedRect(leftBoxX, y, halfW, boxH, 3).strokeColor(LINE).lineWidth(0.8).stroke();
    doc.rect(leftBoxX, y, halfW, 16).fill(LIGHT_BLUE);
    at('Bill To', leftBoxX + 8, y + 4, { bold: true, size: 8, color: NAVY });
    const c = data.customer;
    let by = y + 22;
    at(c.name || '—', leftBoxX + 8, by, { bold: true, size: 9, color: NAVY, width: halfW - 16 });
    by += 12;
    const billLines = [
        c.address,
        [c.city, c.state].filter(Boolean).join(', '),
        c.phone ? `Phone: ${c.phone}` : null,
        c.email ? `Email: ${c.email}` : null,
    ].filter(Boolean);
    for (const line of billLines.slice(0, 4)) {
        at(line, leftBoxX + 8, by, { size: 7.5, color: '#333', width: halfW - 16, lineBreak: true, height: 12 });
        by += 11;
    }
    const buyerGstin = data.withGst
        ? (data.buyerGstin || c.gstin || 'N.A.')
        : 'N.A.';
    const stateCode = getStateCode(c.state || data.company.state);
    if (data.withGst) {
        at(`GSTIN: ${buyerGstin}  |  State Code: ${stateCode}`, leftBoxX + 8, y + boxH - 14, {
            bold: true, size: 7.5, color: NAVY, width: halfW - 16,
        });
    }
    else {
        at('Bill type: Without GST (Parchi / Trade)', leftBoxX + 8, y + boxH - 14, {
            bold: true, size: 7.5, color: NAVY, width: halfW - 16,
        });
    }
    doc.roundedRect(rightBoxX, y, halfW, boxH, 3).strokeColor(LINE).lineWidth(0.8).stroke();
    doc.rect(rightBoxX, y, halfW, 16).fill(LIGHT_BLUE);
    at('Invoice Details', rightBoxX + 8, y + 4, { bold: true, size: 8, color: NAVY });
    const invDate = data.issuedAt.toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
    const placeOfSupply = `${c.state || data.company.state} (${stateCode})`;
    const detailRows = [
        ['Invoice No.', data.invoiceNo, true],
        ['Invoice Date', invDate, true],
        ['Place of Supply', placeOfSupply, false],
    ];
    if (data.withGst) {
        detailRows.push(['Seller GSTIN', data.sellerGstin || data.company.gstin, false]);
    }
    else {
        detailRows.push(['Bill Type', 'Without GST', false]);
    }
    let dy = y + 24;
    for (const [label, value, highlight] of detailRows) {
        at(label, rightBoxX + 8, dy, { size: 7.5, color: MUTED, width: 78 });
        if (highlight) {
            doc.rect(rightBoxX + 90, dy - 2, halfW - 102, 12).fill(YELLOW);
        }
        at(String(value), rightBoxX + 92, dy, { bold: true, size: 8, color: NAVY, width: halfW - 106 });
        dy += 16;
    }
    y += boxH + 12;
    const cols = {
        sno: left,
        desc: left + 26,
        hsn: left + 210,
        qty: left + 270,
        rate: left + 340,
        amount: left + 420,
    };
    const colEnds = right;
    const headerH = 18;
    doc.rect(left, y, contentW, headerH).fill(NAVY);
    const hy = y + 5;
    at('S.No', cols.sno + 4, hy, { bold: true, size: 7.5, color: '#FFFFFF' });
    at('Description of Product', cols.desc, hy, { bold: true, size: 7.5, color: '#FFFFFF' });
    at('HSN', cols.hsn, hy, { bold: true, size: 7.5, color: '#FFFFFF' });
    at('Qty', cols.qty, hy, { bold: true, size: 7.5, color: '#FFFFFF' });
    at('Rate', cols.rate, hy, { bold: true, size: 7.5, color: '#FFFFFF' });
    at('Amount (Rs.)', cols.amount, hy, {
        bold: true, size: 7.5, color: '#FFFFFF', width: colEnds - cols.amount - 4, align: 'right',
    });
    y += headerH;
    data.items.forEach((item, idx) => {
        const rowH = 18;
        if (idx % 2 === 1) {
            doc.rect(left, y, contentW, rowH).fill('#F7FAFC');
        }
        doc.strokeColor(LINE).lineWidth(0.4)
            .moveTo(left, y + rowH).lineTo(right, y + rowH).stroke();
        const qtyLabel = item.unit
            ? `${formatQty(item.qty)} ${item.unit}`
            : formatQty(item.qty);
        at(String(idx + 1), cols.sno + 4, y + 5, { size: 7.5, width: 18 });
        at(item.name, cols.desc, y + 5, { size: 7.5, width: 178 });
        at(item.hsnCode || '—', cols.hsn, y + 5, { size: 7.5, width: 55 });
        at(qtyLabel, cols.qty, y + 5, { size: 7.5, width: 65 });
        at(formatInr(item.rate), cols.rate, y + 5, { size: 7.5, width: 70 });
        doc.rect(cols.amount, y + 2, colEnds - cols.amount - 2, 13).fill(YELLOW);
        at(formatInr(item.taxable), cols.amount, y + 5, {
            bold: true, size: 7.5, color: NAVY, width: colEnds - cols.amount - 6, align: 'right',
        });
        y += rowH;
    });
    y += 6;
    const totalsX = left + contentW * 0.55;
    const totalsW = contentW * 0.45;
    const labelW = totalsW * 0.55;
    const valueW = totalsW * 0.45;
    const avgGst = data.items.length
        ? data.items.reduce((s, i) => s + i.gstRate, 0) / data.items.length
        : 0;
    const halfRate = avgGst / 2;
    const drawTotalRow = (label, value, opts) => {
        at(label, totalsX, y, {
            bold: opts?.bold, size: 8.5, color: opts?.blue ? NAVY : '#333', width: labelW, align: 'right',
        });
        at(value, totalsX + labelW, y, {
            bold: opts?.bold, size: 8.5, color: opts?.blue ? NAVY : '#333', width: valueW - 4, align: 'right',
        });
        y += 12;
    };
    drawTotalRow('Total', formatInr(data.subtotal), { bold: true });
    if (data.withGst && data.cgstAmount > 0) {
        drawTotalRow(`CGST@${halfRate.toFixed(0)}%`, formatInr(data.cgstAmount), { blue: true });
        drawTotalRow(`SGST@${halfRate.toFixed(0)}%`, formatInr(data.sgstAmount), { blue: true });
    }
    if (data.withGst && data.igstAmount > 0) {
        drawTotalRow(`IGST@${avgGst.toFixed(0)}%`, formatInr(data.igstAmount), { blue: true });
    }
    y += 2;
    doc.rect(totalsX, y, totalsW, 18).fill(NAVY);
    at('Grand Total (Rs.)', totalsX + 8, y + 5, { bold: true, size: 9, color: '#FFFFFF', width: labelW - 8 });
    at(`Rs. ${formatInr(data.total)}`, totalsX + labelW, y + 5, {
        bold: true, size: 9, color: '#FFFFFF', width: valueW - 10, align: 'right',
    });
    y += 24;
    at('Amount in words: ', left, y, { bold: true, size: 8, color: NAVY });
    at(amountInWords(data.total), left + 88, y, { size: 8, color: '#333', width: contentW - 88, lineBreak: true, height: 20 });
    y += 18;
    const midY = y;
    at('Declaration', left, midY, { bold: true, size: 8, color: NAVY });
    at('(1) Interest 21% will be Charged on all bills not paid within 30 days after the date of bill', left, midY + 12, { size: 7, color: '#444', width: contentW * 0.52, lineBreak: true, height: 24 });
    at('(2) We reserved to our selves every right to demand payment to bill any time.', left, midY + 36, { size: 7, color: '#444', width: contentW * 0.52, lineBreak: true, height: 24 });
    const bankX = left + contentW * 0.56;
    at('Company Bank Details', bankX, midY, { bold: true, size: 8, color: NAVY });
    const bankLines = [
        `Bank: ${data.company.bankName || '—'}`,
        `A/C No: ${data.company.bankAccount || '—'}`,
        `IFSC: ${data.company.bankIfsc || '—'}`,
        `Branch: ${data.company.bankBranch || '—'}`,
    ];
    bankLines.forEach((line, i) => {
        at(line, bankX, midY + 12 + i * 10, { size: 7.5, color: '#333', width: contentW * 0.42 });
    });
    if (data.company.payeeName) {
        at(`Pay in favour of "${data.company.payeeName}"`, bankX, midY + 54, {
            size: 7, color: MUTED, width: contentW * 0.42, lineBreak: true, height: 16,
        });
    }
    const sigY = footerY - 52;
    at(`For, ${data.company.name}`, right - 180, sigY, {
        bold: true, size: 8, color: NAVY, width: 180, align: 'right',
    });
    at('Authorised Signatory', right - 180, sigY + 28, {
        size: 7.5, color: MUTED, width: 180, align: 'right',
    });
    doc.strokeColor(GOLD).lineWidth(0.8)
        .moveTo(left, footerY - 8).lineTo(right, footerY - 8).stroke();
    at(`${data.company.address}  ·  This is a computer-generated invoice.`, left, footerY, { size: 6.5, color: MUTED, width: contentW, align: 'center' });
}
function formatQty(qty) {
    return Number.isInteger(qty) ? String(qty) : qty.toFixed(3).replace(/\.?0+$/, '');
}
//# sourceMappingURL=invoice-pdf.util.js.map