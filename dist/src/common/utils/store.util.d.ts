export declare const WEBSITE_ORDER_MARKER = "Kedar Foundation website";
export declare function isWebsiteOrder(notes?: string | null): boolean;
export declare function hasAwaitingStockNotes(notes?: string | null): boolean;
export interface AwaitingStockLine {
    productName: string;
    ordered: number;
    unit: string;
    available: number;
    shortfall: number;
}
export declare function parseAwaitingStockNotes(notes?: string | null): AwaitingStockLine[];
