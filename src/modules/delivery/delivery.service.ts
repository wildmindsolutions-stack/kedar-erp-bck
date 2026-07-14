import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CustomerNotificationsService } from '../customer-notifications/customer-notifications.service';
<<<<<<< HEAD
import { isWebsiteOrder } from '../../common/utils/store.util';
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9

@Injectable()
export class DeliveryService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private customerNotifications: CustomerNotificationsService,
  ) {}

  async getAvailableInvoices() {
    return this.prisma.invoice.findMany({
      where: {
        isDeleted: false,
        status: 'ISSUED',
        deliveries: { none: {} },
      },
      include: {
        order: { include: { customer: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.delivery.findMany({
      include: {
        invoice: {
          include: {
            order: { include: { customer: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    invoiceId: string;
    vehicle?: string;
    driverName?: string;
    notes?: string;
    createdBy?: string;
  }) {
    const count = await this.prisma.delivery.count();
    const challanNo = `DC/${new Date().getFullYear()}/${String(count + 1).padStart(4, '0')}`;
    const delivery = await this.prisma.delivery.create({
      data: {
        invoiceId: data.invoiceId,
        challanNo,
        vehicle: data.vehicle,
        driverName: data.driverName,
        notes: data.notes,
        status: 'PENDING',
      },
      include: {
        invoice: { include: { order: { include: { customer: true } } } },
      },
    });

    await this.notifications.notifyByModule({
      module: 'delivery',
      type: 'CHALLAN_CREATED',
      title: 'Delivery Challan Created',
      message: `Challan ${challanNo} created for ${delivery.invoice.order.customer.name} (Invoice ${delivery.invoice.invoiceNo})`,
      refId: delivery.id,
      link: '/delivery',
      actorId: data.createdBy,
    });

    return delivery;
  }

  async dispatch(id: string, data: { vehicle?: string; driverName?: string; actorId?: string }) {
    const delivery = await this.prisma.delivery.update({
      where: { id },
      data: {
        status: 'DISPATCHED',
        dispatchedAt: new Date(),
        vehicle: data.vehicle,
        driverName: data.driverName,
      },
      include: { invoice: { include: { order: { include: { customer: true } } } } },
    });

    await this.notifications.notifyByModule({
      module: 'delivery',
      type: 'DISPATCHED',
      title: 'Order Dispatched',
      message: `Challan ${delivery.challanNo} dispatched to ${delivery.invoice.order.customer.name}`,
      refId: delivery.id,
      link: '/delivery',
      actorId: data.actorId,
    });

<<<<<<< HEAD
    if (isWebsiteOrder(delivery.invoice.order.notes)) {
      await this.customerNotifications.notifyCustomer(delivery.invoice.order.customerId, {
        type: 'ORDER_DISPATCHED',
        title: 'Order Dispatched',
        message: `Your order has been dispatched. Challan ${delivery.challanNo}.`,
        refId: delivery.invoice.orderId,
      });
    }
=======
    const vehicleInfo = delivery.vehicle ? ` Vehicle: ${delivery.vehicle}.` : '';
    await this.customerNotifications.notifyCustomer(delivery.invoice.order.customerId, {
      type: 'ORDER_DISPATCHED',
      title: 'Order Dispatched',
      message: `Your order is on the way! Challan ${delivery.challanNo}.${vehicleInfo}`,
      refId: delivery.invoice.orderId,
    });
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9

    return delivery;
  }

  async markDelivered(id: string, actorId?: string) {
    const delivery = await this.prisma.delivery.update({
      where: { id },
      data: { status: 'DELIVERED', deliveredAt: new Date() },
      include: { invoice: { include: { order: { include: { customer: true } } } } },
    });

    await this.notifications.notifyByModule({
      module: 'delivery',
      type: 'DELIVERED',
      title: 'Delivery Completed',
      message: `Challan ${delivery.challanNo} delivered to ${delivery.invoice.order.customer.name}`,
      refId: delivery.id,
      link: '/delivery',
      actorId,
    });

<<<<<<< HEAD
    if (isWebsiteOrder(delivery.invoice.order.notes)) {
      await this.customerNotifications.notifyCustomer(delivery.invoice.order.customerId, {
        type: 'ORDER_DELIVERED',
        title: 'Order Delivered',
        message: 'Your order has been delivered. Thank you for shopping with Kedar Foundation.',
        refId: delivery.invoice.orderId,
      });
    }
=======
    await this.customerNotifications.notifyCustomer(delivery.invoice.order.customerId, {
      type: 'ORDER_DELIVERED',
      title: 'Order Delivered',
      message: `Your order has been delivered successfully. Thank you for choosing Kedar Foundation!`,
      refId: delivery.invoice.orderId,
    });
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9

    return delivery;
  }
}
