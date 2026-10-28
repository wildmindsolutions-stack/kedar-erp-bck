import { PreBookingService } from './prebooking.service';
import { CreatePreBookingDto } from './prebooking.dto';
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
}
