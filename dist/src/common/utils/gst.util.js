"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialYear = getFinancialYear;
exports.isInterState = isInterState;
exports.calculateGstLine = calculateGstLine;
exports.getCustomerOutstanding = getCustomerOutstanding;
exports.getProductStock = getProductStock;
function getFinancialYear(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    if (month >= 3) {
        return `${year}-${(year + 1).toString().slice(-2)}`;
    }
    return `${year - 1}-${year.toString().slice(-2)}`;
}
function isInterState(sellerState, buyerState) {
    return sellerState.toLowerCase() !== buyerState.toLowerCase();
}
function calculateGstLine(item, interState) {
    const taxable = Math.round(item.qty * item.rate * 100) / 100;
    const gstAmount = Math.round(taxable * (item.gstRate / 100) * 100) / 100;
    if (interState) {
        return {
            taxable,
            cgst: 0,
            sgst: 0,
            igst: gstAmount,
            lineTotal: Math.round((taxable + gstAmount) * 100) / 100,
        };
    }
    const half = Math.round((gstAmount / 2) * 100) / 100;
    return {
        taxable,
        cgst: half,
        sgst: half,
        igst: 0,
        lineTotal: Math.round((taxable + gstAmount) * 100) / 100,
    };
}
async function getCustomerOutstanding(prisma, customerId) {
    const entries = await prisma.customerLedger.findMany({ where: { customerId } });
    return entries.reduce((sum, e) => {
        const amt = Number(e.amount);
        return e.type === 'DEBIT' ? sum + amt : sum - amt;
    }, 0);
}
async function getProductStock(prisma, productId) {
    const entries = await prisma.stockLedger.findMany({ where: { productId } });
    return entries.reduce((sum, e) => sum + Number(e.qtyChange), 0);
}
//# sourceMappingURL=gst.util.js.map