"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const customer_notifications_service_1 = require("../customer-notifications/customer-notifications.service");
let DeliveryService = class DeliveryService {
    constructor(prisma, notifications, customerNotifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.customerNotifications = customerNotifications;
    }
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
    async create(data) {
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
    async dispatch(id, data) {
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
        const vehicleInfo = delivery.vehicle ? ` Vehicle: ${delivery.vehicle}.` : '';
        await this.customerNotifications.notifyCustomer(delivery.invoice.order.customerId, {
            type: 'ORDER_DISPATCHED',
            title: 'Order Dispatched',
            message: `Your order is on the way! Challan ${delivery.challanNo}.${vehicleInfo}`,
            refId: delivery.invoice.orderId,
        });
        return delivery;
    }
    async markDelivered(id, actorId) {
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
        await this.customerNotifications.notifyCustomer(delivery.invoice.order.customerId, {
            type: 'ORDER_DELIVERED',
            title: 'Order Delivered',
            message: `Your order has been delivered successfully. Thank you for choosing Kedar Foundation!`,
            refId: delivery.invoice.orderId,
        });
        return delivery;
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        customer_notifications_service_1.CustomerNotificationsService])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map