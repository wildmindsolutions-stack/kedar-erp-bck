export declare function getStateCode(state?: string | null): string;
export declare function amountInWords(amount: number): string;
export declare function formatInr(n: number): string;
export declare function resolveInvoiceLogoPath(): string | null;
export interface InvoicePdfCompany {
    name: string;
    tagline?: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    gstin: string;
    state: string;
    bankName?: string;
    bankAccount?: string;
    bankIfsc?: string;
    bankBranch?: string;
    payeeName?: string;
}
export interface InvoicePdfCustomer {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    gstin?: string | null;
}
export interface InvoicePdfItem {
    name: string;
    hsnCode: string;
    qty: number;
    unit?: string;
    rate: number;
    taxable: number;
    gstRate: number;
    cgst: number;
    sgst: number;
    igst: number;
    lineTotal: number;
}
export interface InvoicePdfData {
    invoiceNo: string;
    issuedAt: Date;
    withGst: boolean;
    sellerGstin: string;
    buyerGstin?: string | null;
    subtotal: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    total: number;
    company: InvoicePdfCompany;
    customer: InvoicePdfCustomer;
    items: InvoicePdfItem[];
}
export declare function drawInvoicePdf(doc: PDFKit.PDFDocument, data: InvoicePdfData): void;
