export declare class StoreLoginDto {
    email: string;
    password: string;
}
export declare class StoreResetPasswordDto {
    email: string;
    phone: string;
    password: string;
}
export declare class StoreRegisterDto {
    name: string;
    email: string;
    password: string;
    phone: string;
    city?: string;
    state?: string;
}
declare class StoreOrderItemDto {
    productId: string;
    qty: number;
    rate: number;
}
export declare class StorePlaceOrderDto {
    items: StoreOrderItemDto[];
    notes?: string;
}
export declare class StoreUpdateProfileDto {
    name?: string;
    city?: string;
    state?: string;
}
export declare class StoreContactDto {
    name: string;
    email: string;
    subject: string;
    message: string;
}
export {};
