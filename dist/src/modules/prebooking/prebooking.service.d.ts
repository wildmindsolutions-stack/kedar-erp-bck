import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CustomersService } from '../customers/customers.service';
import { SalesService } from '../sales/sales.service';
import { PaymentsService } from '../payments/payments.service';
import { CreatePreBookingDto } from './prebooking.dto';
export declare class PreBookingService {
    private prisma;
    private notifications;
    private customersService;
    private salesService;
    private paymentsService;
    constructor(prisma: PrismaService, notifications: NotificationsService, customersService: CustomersService, salesService: SalesService, paymentsService: PaymentsService);
    findProducts(): Promise<{
        id: string;
        name: string;
        category: string;
        packSize: string | null;
        description: string | null;
        price: number;
        unit: string;
        unitName: string;
        imageUrl: string | null;
    }[]>;
    create(dto: CreatePreBookingDto): Promise<{
        bookingNo: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        name: string;
        phone: string;
        email: string | null;
        address: string;
        city: string;
        state: string;
        pincode: string;
        notes: string | null;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        items: {
            productName: string;
            packSize: string | null;
            qty: number;
            rate: number;
            lineTotal: number;
        }[];
        subtotal: number;
        total: number;
    }>;
    getReceipt(bookingNo: string, phone: string): Promise<{
        bookingNo: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        name: string;
        phone: string;
        email: string | null;
        address: string;
        city: string;
        state: string;
        pincode: string;
        notes: string | null;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        items: {
            productName: string;
            packSize: string | null;
            qty: number;
            rate: number;
            lineTotal: number;
        }[];
        subtotal: number;
        total: number;
    }>;
    private toReceipt;
    findAll(status?: string): Prisma.PrismaPromise<({
        salesOrder: {
            id: string;
            invoice: {
                id: string;
                invoiceNo: string;
                withGst: boolean;
                total: Prisma.Decimal;
            } | null;
            status: import(".prisma/client").$Enums.OrderStatus;
        } | null;
        items: {
            id: string;
            packSize: string | null;
            productId: string;
            productName: string;
            qty: Prisma.Decimal;
            rate: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
            preBookingId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        deliveredAt: Date | null;
        pincode: string;
        paymentReceived: boolean;
        bookingNo: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        salesOrderId: string | null;
        confirmedAt: Date | null;
    })[]>;
    private getOrThrow;
    private resolveCustomer;
    confirm(id: string, userId: string, options?: {
        generateInvoice?: boolean;
        withGst?: boolean;
    }): Promise<{
        bookingNo: string;
        status: string;
        invoice: {
            id: string;
            invoiceNo: string;
            total: number;
        } | null;
    }>;
    generateInvoice(id: string, userId: string, withGst?: boolean): Promise<{
        invoiceId: string;
        invoiceNo: string;
        total: number;
    }>;
    markDelivered(id: string, userId: string, options?: {
        paymentReceived?: boolean;
        generateInvoice?: boolean;
        withGst?: boolean;
    }): Promise<{
        salesOrder: {
            id: string;
            invoice: {
                id: string;
                invoiceNo: string;
                withGst: boolean;
                total: Prisma.Decimal;
            } | null;
            status: import(".prisma/client").$Enums.OrderStatus;
        } | null;
        items: {
            id: string;
            packSize: string | null;
            productId: string;
            productName: string;
            qty: Prisma.Decimal;
            rate: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
            preBookingId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        deliveredAt: Date | null;
        pincode: string;
        paymentReceived: boolean;
        bookingNo: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        salesOrderId: string | null;
        confirmedAt: Date | null;
    }>;
    cancel(id: string): Promise<{
        salesOrder: {
            id: string;
            invoice: {
                id: string;
                invoiceNo: string;
                withGst: boolean;
                total: Prisma.Decimal;
            } | null;
            status: import(".prisma/client").$Enums.OrderStatus;
        } | null;
        items: {
            id: string;
            packSize: string | null;
            productId: string;
            productName: string;
            qty: Prisma.Decimal;
            rate: Prisma.Decimal;
            lineTotal: Prisma.Decimal;
            preBookingId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        deliveredAt: Date | null;
        pincode: string;
        paymentReceived: boolean;
        bookingNo: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        salesOrderId: string | null;
        confirmedAt: Date | null;
    }>;
}
