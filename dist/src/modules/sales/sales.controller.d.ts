import { Response } from 'express';
import { SalesService } from './sales.service';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class SalesController {
    private salesService;
    constructor(salesService: SalesService);
    findOrders(): import(".prisma/client").Prisma.PrismaPromise<({
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
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string;
                unitId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                hsnCode: string;
                gstRate: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            rate: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
        invoice: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        notes: string | null;
        createdBy: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderDate: Date;
    })[]>;
    findInvoices(): import(".prisma/client").Prisma.PrismaPromise<({
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string;
                unitId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                hsnCode: string;
                gstRate: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            hsnCode: string;
            gstRate: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            rate: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            taxable: import("@prisma/client/runtime/library").Decimal;
            cgst: import("@prisma/client/runtime/library").Decimal;
            sgst: import("@prisma/client/runtime/library").Decimal;
            igst: import("@prisma/client/runtime/library").Decimal;
            lineTotal: import("@prisma/client/runtime/library").Decimal;
        })[];
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
    createOrder(body: {
        customerId: string;
        orderDate: string;
        notes?: string;
        items: {
            productId: string;
            qty: number;
            rate: number;
        }[];
    }, user: JwtPayload): Promise<{
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
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string;
                unitId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                hsnCode: string;
                gstRate: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            rate: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        notes: string | null;
        createdBy: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderDate: Date;
    }>;
    confirmOrder(id: string, user: JwtPayload): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                isActive: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string;
                unitId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                hsnCode: string;
                gstRate: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            hsnCode: string;
            gstRate: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            rate: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            taxable: import("@prisma/client/runtime/library").Decimal;
            cgst: import("@prisma/client/runtime/library").Decimal;
            sgst: import("@prisma/client/runtime/library").Decimal;
            igst: import("@prisma/client/runtime/library").Decimal;
            lineTotal: import("@prisma/client/runtime/library").Decimal;
        })[];
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
    }>;
    cancelOrder(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        notes: string | null;
        createdBy: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderDate: Date;
    }>;
    getInvoicePdf(id: string, res: Response): Promise<void>;
}
