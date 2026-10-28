import { PreBookingService } from './prebooking.service';
import { ConfirmPreBookingDto, DeliverPreBookingDto, GenerateInvoiceDto } from './prebooking.dto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class PreBookingAdminController {
    private preBookingService;
    constructor(preBookingService: PreBookingService);
    findAll(status?: string): import(".prisma/client").Prisma.PrismaPromise<({
        salesOrder: {
            id: string;
            invoice: {
                id: string;
                invoiceNo: string;
                withGst: boolean;
                total: import("@prisma/client/runtime/library").Decimal;
            } | null;
            status: import(".prisma/client").$Enums.OrderStatus;
        } | null;
        items: {
            id: string;
            packSize: string | null;
            productId: string;
            productName: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            rate: import("@prisma/client/runtime/library").Decimal;
            lineTotal: import("@prisma/client/runtime/library").Decimal;
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
        subtotal: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveredAt: Date | null;
        pincode: string;
        paymentReceived: boolean;
        bookingNo: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        salesOrderId: string | null;
        confirmedAt: Date | null;
    })[]>;
    confirm(id: string, body: ConfirmPreBookingDto, user: JwtPayload): Promise<{
        bookingNo: string;
        status: string;
        invoice: {
            id: string;
            invoiceNo: string;
            total: number;
        } | null;
    }>;
    generateInvoice(id: string, body: GenerateInvoiceDto, user: JwtPayload): Promise<{
        invoiceId: string;
        invoiceNo: string;
        total: number;
    }>;
    markDelivered(id: string, body: DeliverPreBookingDto, user: JwtPayload): Promise<{
        salesOrder: {
            id: string;
            invoice: {
                id: string;
                invoiceNo: string;
                withGst: boolean;
                total: import("@prisma/client/runtime/library").Decimal;
            } | null;
            status: import(".prisma/client").$Enums.OrderStatus;
        } | null;
        items: {
            id: string;
            packSize: string | null;
            productId: string;
            productName: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            rate: import("@prisma/client/runtime/library").Decimal;
            lineTotal: import("@prisma/client/runtime/library").Decimal;
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
        subtotal: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
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
                total: import("@prisma/client/runtime/library").Decimal;
            } | null;
            status: import(".prisma/client").$Enums.OrderStatus;
        } | null;
        items: {
            id: string;
            packSize: string | null;
            productId: string;
            productName: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            rate: import("@prisma/client/runtime/library").Decimal;
            lineTotal: import("@prisma/client/runtime/library").Decimal;
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
        subtotal: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        deliveredAt: Date | null;
        pincode: string;
        paymentReceived: boolean;
        bookingNo: string;
        paymentMode: import(".prisma/client").$Enums.PaymentMode;
        salesOrderId: string | null;
        confirmedAt: Date | null;
    }>;
}
