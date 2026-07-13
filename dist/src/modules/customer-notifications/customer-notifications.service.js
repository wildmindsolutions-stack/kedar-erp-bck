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
exports.CustomerNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CustomerNotificationsService = class CustomerNotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async notifyCustomer(customerId, payload) {
        const account = await this.prisma.foundationAccount.findUnique({
            where: { customerId },
        });
        if (!account?.isActive)
            return null;
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
    getForCustomer(customerId, limit = 30) {
        return this.prisma.customerNotification.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    getUnreadCount(customerId) {
        return this.prisma.customerNotification.count({
            where: { customerId, isRead: false },
        });
    }
    markRead(customerId, id) {
        return this.prisma.customerNotification.updateMany({
            where: { id, customerId },
            data: { isRead: true },
        });
    }
    markAllRead(customerId) {
        return this.prisma.customerNotification.updateMany({
            where: { customerId, isRead: false },
            data: { isRead: true },
        });
    }
};
exports.CustomerNotificationsService = CustomerNotificationsService;
exports.CustomerNotificationsService = CustomerNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerNotificationsService);
//# sourceMappingURL=customer-notifications.service.js.map