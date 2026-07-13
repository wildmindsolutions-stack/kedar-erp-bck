export declare class StoreLoginDto {
    email: string;
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
export {};
