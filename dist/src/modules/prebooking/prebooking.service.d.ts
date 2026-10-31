import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CustomerNotificationsService } from '../customer-notifications/customer-notifications.service';
import { CustomersService } from '../customers/customers.service';
import { SalesService } from '../sales/sales.service';
import { PaymentsService } from '../payments/payments.service';
import { CreatePreBookingDto } from './prebooking.dto';
interface DeliveryActor {
    sub: string;
    role: string;
}
export declare class PreBookingService {
    private prisma;
    private notifications;
    private customerNotifications;
    private customersService;
    private salesService;
    private paymentsService;
    constructor(prisma: PrismaService, notifications: NotificationsService, customerNotifications: CustomerNotificationsService, customersService: CustomersService, salesService: SalesService, paymentsService: PaymentsService);
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
    checkPincode(pincode: string): Promise<{
        serviceable: boolean;
        area: string;
        areaRecord: {
            id: string;
            name: string;
            supervisorId: string | null;
        };
    } | {
        serviceable: boolean;
        area: null;
        areaRecord: null;
    }>;
    create(customerId: string, dto: CreatePreBookingDto): Promise<{
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
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        deliveredAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        executiveName: string | null;
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
    findMine(customerId: string): Promise<{
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
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        deliveredAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        executiveName: string | null;
        items: {
            productName: string;
            packSize: string | null;
            qty: number;
            rate: number;
            lineTotal: number;
        }[];
        subtotal: number;
        total: number;
    }[]>;
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
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        deliveredAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        executiveName: string | null;
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
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    })[]>;
    private getOrThrow;
    private resolveCustomer;
    private tellCustomer;
    confirm(id: string, userId: string): Promise<{
        bookingNo: string;
        status: string;
    }>;
    generateInvoice(id: string, userId: string, withGst?: boolean): Promise<{
        invoiceId: string;
        invoiceNo: string;
        total: number;
    }>;
    private recordCash;
    private fulfil;
    markDelivered(id: string, userId: string, paymentReceived: boolean): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    private notifySupervisor;
    private scopeFor;
    findDeliveryBoard(actor: DeliveryActor): Prisma.PrismaPromise<({
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    })[]>;
    findExecutives(actor: DeliveryActor): Prisma.PrismaPromise<{
        id: string;
        name: string;
        supervisorId: string | null;
    }[]>;
    setArea(id: string, areaId: string, actor: DeliveryActor): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    assignExecutive(id: string, executiveId: string, actor: DeliveryActor): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    private getForFieldUpdate;
    markOutForDelivery(id: string, actor: DeliveryActor): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    failDelivery(id: string, actor: DeliveryActor, reason?: string): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    collectCash(id: string, actor: DeliveryActor): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    confirmCashHandover(id: string, actor: DeliveryActor): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    fieldDeliver(id: string, actor: DeliveryActor, paymentReceived: boolean): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    cancel(id: string, reason?: string): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
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
        area: {
            id: string;
            name: string;
        } | null;
        executive: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        supervisorId: string | null;
        phone: string;
        address: string;
        city: string;
        state: string;
        customerId: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.PreBookingStatus;
        subtotal: Prisma.Decimal;
        total: Prisma.Decimal;
        bookingNo: string;
        pincode: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        paymentReceived: boolean;
        salesOrderId: string | null;
        areaId: string | null;
        executiveId: string | null;
        confirmedAt: Date | null;
        assignedAt: Date | null;
        outForDeliveryAt: Date | null;
        stockDeductedAt: Date | null;
        cashHandedOverAt: Date | null;
        failedAttempts: number;
        lastFailReason: string | null;
        cancelReason: string | null;
        deliveredAt: Date | null;
    }>;
    cancelByCustomer(customerId: string, bookingNo: string): Promise<{
        bookingNo: string;
        status: string;
    }>;
    getSummary(): Promise<{
        pending: number;
        confirmed: number;
        delivered: number;
        openValue: number;
        cashWithStaff: number;
        demand: {
            productId: string;
            productName: string;
            required: number;
            stock: number;
            shortfall: number;
        }[];
    }>;
}
export {};
