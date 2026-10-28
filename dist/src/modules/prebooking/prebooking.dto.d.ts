export declare class PreBookingItemDto {
    productId: string;
    qty: number;
}
export declare class CreatePreBookingDto {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
    website?: string;
    items: PreBookingItemDto[];
}
export declare class ConfirmPreBookingDto {
    generateInvoice?: boolean;
    withGst?: boolean;
}
export declare class GenerateInvoiceDto {
    withGst?: boolean;
}
export declare class DeliverPreBookingDto {
    paymentReceived?: boolean;
    generateInvoice?: boolean;
    withGst?: boolean;
}
