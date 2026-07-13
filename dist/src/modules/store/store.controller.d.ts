import { Response } from 'express';
import { StoreService } from './store.service';
import { ProductsService } from '../products/products.service';
import { StoreLoginDto, StorePlaceOrderDto, StoreRegisterDto } from './store.dto';
interface FoundationRequest {
    user: {
        sub: string;
        customerId: string;
        type: string;
    };
}
export declare class StoreController {
    private storeService;
    private productsService;
    constructor(storeService: StoreService, productsService: ProductsService);
    findProducts(): Promise<{
        id: string;
        slug: string;
        name: string;
        category: string;
        unit: string;
        unitName: string;
        price: number;
        hsnCode: string;
        gstRate: number;
        imageUrl: string | null;
        inStock: boolean;
        stock: number;
    }[]>;
    findProduct(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        category: string;
        unit: string;
        unitName: string;
        price: number;
        hsnCode: string;
        gstRate: number;
        imageUrl: string | null;
        inStock: boolean;
        stock: number;
    }>;
    register(dto: StoreRegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            customerId: string;
            name: string;
            email: string;
            phone: string | null;
            city: string | null;
            state: string;
            type: "foundation";
        };
        linkedExistingCustomer: boolean;
        profileFromErp: boolean;
    }>;
    login(dto: StoreLoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            customerId: string;
            name: string;
            email: string;
            phone: string | null;
            city: string | null;
            state: string;
            type: "foundation";
        };
    }>;
    me(req: FoundationRequest): Promise<{
        id: string;
        customerId: string;
        name: string;
        email: string;
        phone: string | null;
        city: string | null;
        state: string;
        type: "foundation";
    }>;
    placeOrder(req: FoundationRequest, dto: StorePlaceOrderDto): Promise<{
        awaitingStock: boolean;
        stockChecks: {
            productId: string;
            productName: string;
            unit: string;
            ordered: number;
            available: number;
            shortfall: number;
        }[];
        customer: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            isDeleted: boolean;
            gstin: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string;
            creditLimit: import("@prisma/client/runtime/library").Decimal;
        };
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string;
                unitId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                hsnCode: string;
                gstRate: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
                isDeleted: boolean;
            };
        } & {
            id: string;
            productId: string;
            orderId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            rate: import("@prisma/client/runtime/library").Decimal;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        createdBy: string | null;
        customerId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderDate: Date;
    }>;
    getOrders(req: FoundationRequest): Promise<{
        items: {
            qty: number;
            rate: number;
            product: {
                unit: {
                    symbol: string;
                    id: string;
                    name: string;
                    createdAt: Date;
                };
            } & {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string;
                unitId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                hsnCode: string;
                gstRate: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
                isDeleted: boolean;
            };
            id: string;
            productId: string;
            orderId: string;
        }[];
        invoice: {
            id: string;
            invoiceNo: string;
            subtotal: number;
            cgstAmount: number;
            sgstAmount: number;
            igstAmount: number;
            gstAmount: number;
            total: number;
            issuedAt: Date;
            deliveries: {
                id: string;
                createdAt: Date;
                notes: string | null;
                status: import(".prisma/client").$Enums.DeliveryStatus;
                invoiceId: string;
                challanNo: string;
                vehicle: string | null;
                driverName: string | null;
                dispatchedAt: Date | null;
                deliveredAt: Date | null;
            }[];
            items: {
                qty: number;
                rate: number;
                gstRate: number;
                taxable: number;
                cgst: number;
                sgst: number;
                igst: number;
                lineTotal: number;
                product: {
                    id: string;
                    name: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    categoryId: string;
                    unitId: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    hsnCode: string;
                    gstRate: import("@prisma/client/runtime/library").Decimal;
                    imageUrl: string | null;
                    lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
                    isDeleted: boolean;
                };
                id: string;
                hsnCode: string;
                productId: string;
                invoiceId: string;
            }[];
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        createdBy: string | null;
        customerId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderDate: Date;
    }[]>;
    getInvoicePdf(req: FoundationRequest, id: string, res: Response): Promise<void>;
    getNotifications(req: FoundationRequest): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        refId: string | null;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        customerId: string;
    }[]>;
    getUnreadCount(req: FoundationRequest): Promise<{
        count: number;
    }>;
    markAllRead(req: FoundationRequest): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    markRead(req: FoundationRequest, id: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
export {};
