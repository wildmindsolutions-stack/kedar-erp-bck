import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CustomerNotifyPayload {
  type: string;
  title: string;
  message: string;
  refId?: string;
}

@Injectable()
export class CustomerNotificationsService {
  constructor(private prisma: PrismaService) {}

<<<<<<< HEAD
=======
  /** Notify website customer if they have a Foundation account. */
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  async notifyCustomer(customerId: string, payload: CustomerNotifyPayload) {
    const account = await this.prisma.foundationAccount.findUnique({
      where: { customerId },
    });
    if (!account?.isActive) return null;

    return this.prisma.customerNotification.create({
      data: {
        customerId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        refId: payload.refId,
      },
    });
  }

  getForCustomer(customerId: string, limit = 30) {
    return this.prisma.customerNotification.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  getUnreadCount(customerId: string) {
    return this.prisma.customerNotification.count({
      where: { customerId, isRead: false },
    });
  }

  markRead(customerId: string, id: string) {
    return this.prisma.customerNotification.updateMany({
      where: { id, customerId },
      data: { isRead: true },
    });
  }

  markAllRead(customerId: string) {
    return this.prisma.customerNotification.updateMany({
      where: { customerId, isRead: false },
      data: { isRead: true },
    });
  }
}
