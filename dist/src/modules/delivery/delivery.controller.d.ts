import { DeliveryService } from './delivery.service';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class DeliveryController {
    private deliveryService;
    constructor(deliveryService: DeliveryService);
    getAvailableInvoices(): Promise<({
        order: {
            customer: {
                id: string;
                name: string;
                gstin: string | null;
                phone: string | null;
                email: string | null;
                address: string | null;
                city: string | null;
                state: string;
                creditLimit: import("@prisma/client/runtime/library").Decimal;
                isActive: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            notes: string | null;
            createdBy: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderDate: Date;
        };
    } & {
        id: string;
        isDeleted: boolean;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        orderId: string;
        invoiceNo: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        cgstAmount: import("@prisma/client/runtime/library").Decimal;
        sgstAmount: import("@prisma/client/runtime/library").Decimal;
        igstAmount: import("@prisma/client/runtime/library").Decimal;
        gstAmount: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        sellerGstin: string;
        buyerGstin: string | null;
        issuedAt: Date;
        financialYear: string;
    })[]>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        invoice: {
            order: {
                customer: {
                    id: string;
                    name: string;
                    gstin: string | null;
                    phone: string | null;
                    email: string | null;
                    address: string | null;
                    city: string | null;
                    state: string;
                    creditLimit: import("@prisma/client/runtime/library").Decimal;
                    isActive: boolean;
                    isDeleted: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                customerId: string;
                notes: string | null;
                createdBy: string | null;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderDate: Date;
            };
        } & {
            id: string;
            isDeleted: boolean;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            orderId: string;
            invoiceNo: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            cgstAmount: import("@prisma/client/runtime/library").Decimal;
            sgstAmount: import("@prisma/client/runtime/library").Decimal;
            igstAmount: import("@prisma/client/runtime/library").Decimal;
            gstAmount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            sellerGstin: string;
            buyerGstin: string | null;
            issuedAt: Date;
            financialYear: string;
        };
    } & {
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
    })[]>;
    create(body: {
        invoiceId: string;
        vehicle?: string;
        driverName?: string;
        notes?: string;
    }, user: JwtPayload): Promise<{
        invoice: {
            order: {
                customer: {
                    id: string;
                    name: string;
                    gstin: string | null;
                    phone: string | null;
                    email: string | null;
                    address: string | null;
                    city: string | null;
                    state: string;
                    creditLimit: import("@prisma/client/runtime/library").Decimal;
                    isActive: boolean;
                    isDeleted: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                customerId: string;
                notes: string | null;
                createdBy: string | null;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderDate: Date;
            };
        } & {
            id: string;
            isDeleted: boolean;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            orderId: string;
            invoiceNo: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            cgstAmount: import("@prisma/client/runtime/library").Decimal;
            sgstAmount: import("@prisma/client/runtime/library").Decimal;
            igstAmount: import("@prisma/client/runtime/library").Decimal;
            gstAmount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            sellerGstin: string;
            buyerGstin: string | null;
            issuedAt: Date;
            financialYear: string;
        };
    } & {
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
    }>;
    dispatch(id: string, body: {
        vehicle?: string;
        driverName?: string;
    }, user: JwtPayload): Promise<{
        invoice: {
            order: {
                customer: {
                    id: string;
                    name: string;
                    gstin: string | null;
                    phone: string | null;
                    email: string | null;
                    address: string | null;
                    city: string | null;
                    state: string;
                    creditLimit: import("@prisma/client/runtime/library").Decimal;
                    isActive: boolean;
                    isDeleted: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                customerId: string;
                notes: string | null;
                createdBy: string | null;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderDate: Date;
            };
        } & {
            id: string;
            isDeleted: boolean;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            orderId: string;
            invoiceNo: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            cgstAmount: import("@prisma/client/runtime/library").Decimal;
            sgstAmount: import("@prisma/client/runtime/library").Decimal;
            igstAmount: import("@prisma/client/runtime/library").Decimal;
            gstAmount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            sellerGstin: string;
            buyerGstin: string | null;
            issuedAt: Date;
            financialYear: string;
        };
    } & {
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
    }>;
    markDelivered(id: string, user: JwtPayload): Promise<{
        invoice: {
            order: {
                customer: {
                    id: string;
                    name: string;
                    gstin: string | null;
                    phone: string | null;
                    email: string | null;
                    address: string | null;
                    city: string | null;
                    state: string;
                    creditLimit: import("@prisma/client/runtime/library").Decimal;
                    isActive: boolean;
                    isDeleted: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                customerId: string;
                notes: string | null;
                createdBy: string | null;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderDate: Date;
            };
        } & {
            id: string;
            isDeleted: boolean;
            createdAt: Date;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            orderId: string;
            invoiceNo: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            cgstAmount: import("@prisma/client/runtime/library").Decimal;
            sgstAmount: import("@prisma/client/runtime/library").Decimal;
            igstAmount: import("@prisma/client/runtime/library").Decimal;
            gstAmount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            sellerGstin: string;
            buyerGstin: string | null;
            issuedAt: Date;
            financialYear: string;
        };
    } & {
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
    }>;
}
