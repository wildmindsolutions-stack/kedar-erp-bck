<<<<<<< HEAD
export declare class StoreLoginDto {
    email: string;
    password: string;
}
export declare class StoreResetPasswordDto {
    email: string;
    phone: string;
    password: string;
}
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
export declare class StoreRegisterDto {
    name: string;
    email: string;
    password: string;
    phone: string;
    city?: string;
    state?: string;
}
<<<<<<< HEAD
declare class StoreOrderItemDto {
=======
export declare class StoreLoginDto {
    email: string;
    password: string;
}
export declare class StoreOrderItemDto {
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    productId: string;
    qty: number;
    rate: number;
}
export declare class StorePlaceOrderDto {
    items: StoreOrderItemDto[];
    notes?: string;
}
<<<<<<< HEAD
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
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
