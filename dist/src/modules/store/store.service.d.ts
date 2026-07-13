import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomersService } from '../customers/customers.service';
import { SalesService } from '../sales/sales.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CustomerNotificationsService } from '../customer-notifications/customer-notifications.service';
import { StoreLoginDto, StorePlaceOrderDto, StoreRegisterDto } from './store.dto';
export declare class StoreService {
    private prisma;
    private jwt;
    private customersService;
    private salesService;
    private notifications;
    private customerNotifications;
    constructor(prisma: PrismaService, jwt: JwtService, customersService: CustomersService, salesService: SalesService, notifications: NotificationsService, customerNotifications: CustomerNotificationsService);
    private normalizePhone;
    private findCustomerByPhone;
    private toProfile;
    private signToken;
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
    getProfile(accountId: string): Promise<{
        id: string;
        customerId: string;
        name: string;
        email: string;
        phone: string | null;
        city: string | null;
        state: string;
        type: "foundation";
    }>;
    placeOrder(customerId: string, dto: StorePlaceOrderDto): Promise<{
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
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            gstin: string | null;
            phone: string | null;
            address: string | null;
            city: string | null;
            state: string;
            creditLimit: import("@prisma/client/runtime/library").Decimal;
            isDeleted: boolean;
        };
        items: ({
            product: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isDeleted: boolean;
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
        id: string;
        customerId: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        createdBy: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderDate: Date;
    }>;
    getNotifications(customerId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        customerId: string;
        createdAt: Date;
        refId: string | null;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(customerId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    markNotificationRead(customerId: string, id: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    markAllNotificationsRead(customerId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    getOrders(customerId: string): Promise<{
        items: {
            qty: number;
            rate: number;
            product: {
                unit: {
                    symbol: string;
                    id: string;
                    createdAt: Date;
                    name: string;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isDeleted: boolean;
                categoryId: string;
                unitId: string;
                price: import("@prisma/client/runtime/library").Decimal;
                hsnCode: string;
                gstRate: import("@prisma/client/runtime/library").Decimal;
                imageUrl: string | null;
                lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
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
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    isDeleted: boolean;
                    categoryId: string;
                    unitId: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                    hsnCode: string;
                    gstRate: import("@prisma/client/runtime/library").Decimal;
                    imageUrl: string | null;
                    lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
                };
                id: string;
                hsnCode: string;
                productId: string;
                invoiceId: string;
            }[];
        } | null;
        id: string;
        customerId: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        createdBy: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderDate: Date;
    }[]>;
    getInvoicePdf(customerId: string, invoiceId: string, res: Response): Promise<void>;
}
