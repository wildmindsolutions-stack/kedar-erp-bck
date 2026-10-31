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
export declare class GenerateInvoiceDto {
    withGst?: boolean;
}
export declare class SetBookingAreaDto {
    areaId: string;
}
export declare class AssignExecutiveDto {
    executiveId: string;
}
export declare class FieldDeliverDto {
    paymentReceived?: boolean;
}
export declare class ReasonDto {
    reason?: string;
}
export declare class CustomerCancelDto {
    bookingNo: string;
}
