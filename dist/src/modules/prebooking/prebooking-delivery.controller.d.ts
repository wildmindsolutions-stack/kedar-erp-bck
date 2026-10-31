import { PreBookingService } from './prebooking.service';
import { AssignExecutiveDto, FieldDeliverDto, ReasonDto, SetBookingAreaDto } from './prebooking.dto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class PreBookingDeliveryController {
    private preBookingService;
    constructor(preBookingService: PreBookingService);
    board(user: JwtPayload): import(".prisma/client").Prisma.PrismaPromise<({
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
    executives(user: JwtPayload): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        supervisorId: string | null;
    }[]>;
    setArea(id: string, body: SetBookingAreaDto, user: JwtPayload): Promise<{
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
    assign(id: string, body: AssignExecutiveDto, user: JwtPayload): Promise<{
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
    outForDelivery(id: string, user: JwtPayload): Promise<{
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
    failed(id: string, body: ReasonDto, user: JwtPayload): Promise<{
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
    collectCash(id: string, user: JwtPayload): Promise<{
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
    cashHandover(id: string, user: JwtPayload): Promise<{
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
    delivered(id: string, body: FieldDeliverDto, user: JwtPayload): Promise<{
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
