export declare function getFinancialYear(date?: Date): string;
export declare function isInterState(sellerState: string, buyerState: string): boolean;
export interface GstLineItem {
    qty: number;
    rate: number;
    gstRate: number;
}
export interface GstCalculation {
    taxable: number;
    cgst: number;
    sgst: number;
    igst: number;
    lineTotal: number;
}
export declare function calculateGstLine(item: GstLineItem, interState: boolean): GstCalculation;
export declare function getCustomerOutstanding(prisma: {
    customerLedger: {
        findMany: (args: object) => Promise<{
            type: string;
            amount: {
                toNumber: () => number;
            };
        }[]>;
    };
}, customerId: string): Promise<number>;
export declare function getProductStock(prisma: {
    stockLedger: {
        findMany: (args: object) => Promise<{
            qtyChange: {
                toNumber: () => number;
            };
        }[]>;
    };
}, productId: string): Promise<number>;
