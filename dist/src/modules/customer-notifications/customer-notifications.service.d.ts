import { PrismaService } from '../../prisma/prisma.service';
export interface CustomerNotifyPayload {
    type: string;
    title: string;
    message: string;
    refId?: string;
}
export declare class CustomerNotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    notifyCustomer(customerId: string, payload: CustomerNotifyPayload): Promise<{
        id: string;
        createdAt: Date;
        refId: string | null;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        customerId: string;
    } | null>;
    getForCustomer(customerId: string, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        refId: string | null;
        type: string;
        title: string;
        message: string;
        isRead: boolean;
        customerId: string;
    }[]>;
    getUnreadCount(customerId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    markRead(customerId: string, id: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    markAllRead(customerId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
