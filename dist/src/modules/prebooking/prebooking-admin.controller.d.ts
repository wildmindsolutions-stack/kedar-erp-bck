import { PreBookingService } from './prebooking.service';
import { GenerateInvoiceDto, ReasonDto } from './prebooking.dto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class PreBookingAdminController {
    private preBookingService;
    constructor(preBookingService: PreBookingService);
    findAll(status?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        subtotal: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
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
    summary(): Promise<{
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
    confirm(id: string, user: JwtPayload): Promise<{
        bookingNo: string;
        status: string;
    }>;
    generateInvoice(id: string, body: GenerateInvoiceDto, user: JwtPayload): Promise<{
        invoiceId: string;
        invoiceNo: string;
        total: number;
    }>;
    cancel(id: string, body: ReasonDto): Promise<{
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
        subtotal: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
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
}
