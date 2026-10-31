import { PreBookingService } from './prebooking.service';
import { CreatePreBookingDto, CustomerCancelDto } from './prebooking.dto';
interface FoundationRequest {
    user: {
        customerId: string;
    };
}
export declare class PreBookingController {
    private preBookingService;
    constructor(preBookingService: PreBookingService);
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
        area: string | null;
    }>;
    create(req: FoundationRequest, dto: CreatePreBookingDto): Promise<{
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
    findMine(req: FoundationRequest): Promise<{
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
    cancelMine(req: FoundationRequest, dto: CustomerCancelDto): Promise<{
        bookingNo: string;
        status: string;
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
}
export {};
