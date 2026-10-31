import { PrismaService } from '../../prisma/prisma.service';
export interface NotifyPayload {
    module: string;
    type: string;
    title: string;
    message: string;
    refId?: string;
    link?: string;
    actorId?: string;
    notifyAdmins?: boolean;
}
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    notifyByModule(payload: NotifyPayload): Promise<import(".prisma/client").Prisma.BatchPayload | never[]>;
    notifyUser(userId: string, payload: Omit<NotifyPayload, 'notifyAdmins'>): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        refId: string | null;
        module: string;
        type: string;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getForUser(userId: string, limit?: number): import(".prisma/client").Prisma.PrismaPromise<({
        actor: {
            name: string;
            role: {
                name: string;
            };
        } | null;
    } & {
        id: string;
        createdAt: Date;
        createdBy: string | null;
        refId: string | null;
        module: string;
        type: string;
        title: string;
        message: string;
        link: string | null;
        isRead: boolean;
        userId: string;
    })[]>;
    getUnreadCount(userId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    markRead(userId: string, id: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    markAllRead(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
