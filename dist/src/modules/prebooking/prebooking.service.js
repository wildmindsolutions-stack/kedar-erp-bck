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
exports.PreBookingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const customer_notifications_service_1 = require("../customer-notifications/customer-notifications.service");
const customers_service_1 = require("../customers/customers.service");
const sales_service_1 = require("../sales/sales.service");
const payments_service_1 = require("../payments/payments.service");
const gst_util_1 = require("../../common/utils/gst.util");
const phone_util_1 = require("../../common/utils/phone.util");
const permissions_1 = require("../../common/permissions");
const MAX_OPEN_BOOKINGS = 5;
const round2 = (n) => Math.round(n * 100) / 100;
const BOOKING_INCLUDE = {
    items: { orderBy: { productName: 'asc' } },
    area: { select: { id: true, name: true } },
    supervisor: { select: { id: true, name: true } },
    executive: { select: { id: true, name: true } },
    salesOrder: {
        select: {
            id: true,
            status: true,
            invoice: {
                select: { id: true, invoiceNo: true, total: true, withGst: true },
            },
        },
    },
};
let PreBookingService = class PreBookingService {
    constructor(prisma, notifications, customerNotifications, customersService, salesService, paymentsService) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.customerNotifications = customerNotifications;
        this.customersService = customersService;
        this.salesService = salesService;
        this.paymentsService = paymentsService;
    }
    async findProducts() {
        const products = await this.prisma.product.findMany({
            where: { prebookEnabled: true, isActive: true, isDeleted: false },
            include: { unit: true, category: true },
            orderBy: [{ category: { name: 'desc' } }, { name: 'asc' }],
        });
        return products.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category.name,
            packSize: p.packSize,
            description: p.description,
            price: Number(p.price),
            unit: p.unit.symbol,
            unitName: p.unit.name,
            imageUrl: p.imageUrl,
        }));
    }
    async checkPincode(pincode) {
        const area = await this.prisma.deliveryArea.findFirst({
            where: { isActive: true, pincodes: { has: pincode ?? '' } },
            select: { id: true, name: true, supervisorId: true },
        });
        if (area)
            return { serviceable: true, area: area.name, areaRecord: area };
        const activeAreas = await this.prisma.deliveryArea.count({
            where: { isActive: true },
        });
        return { serviceable: activeAreas === 0, area: null, areaRecord: null };
    }
    async create(customerId, dto) {
        if (dto.website)
            throw new common_1.BadRequestException('Unable to submit pre-booking');
        const openBookings = await this.prisma.preBooking.count({
            where: { customerId, status: { in: ['PENDING', 'CONFIRMED'] } },
        });
        if (openBookings >= MAX_OPEN_BOOKINGS) {
            throw new common_1.BadRequestException('You already have several open pre-bookings. Please wait for delivery or call us.');
        }
        const qtyByProduct = new Map();
        for (const item of dto.items) {
            qtyByProduct.set(item.productId, (qtyByProduct.get(item.productId) ?? 0) + item.qty);
        }
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: [...qtyByProduct.keys()] },
                prebookEnabled: true,
                isActive: true,
                isDeleted: false,
            },
        });
        if (products.length !== qtyByProduct.size) {
            throw new common_1.BadRequestException('One or more selected products are no longer available for pre-booking');
        }
        const items = products.map((p) => {
            const qty = qtyByProduct.get(p.id);
            const rate = Number(p.price);
            return {
                productId: p.id,
                productName: p.name,
                packSize: p.packSize,
                qty,
                rate,
                lineTotal: round2(qty * rate),
            };
        });
        const subtotal = round2(items.reduce((sum, i) => sum + i.lineTotal, 0));
        const { serviceable, areaRecord: area } = await this.checkPincode(dto.pincode);
        if (!serviceable) {
            throw new common_1.BadRequestException(`Sorry, we do not deliver to pincode ${dto.pincode} yet`);
        }
        const booking = await this.prisma.$transaction(async (tx) => {
            const fy = (0, gst_util_1.getFinancialYear)();
            const seq = await tx.$queryRaw `
        SELECT last_number FROM pre_booking_sequences WHERE financial_year = ${fy} FOR UPDATE
      `;
            let nextNum;
            if (!seq.length) {
                await tx.preBookingSequence.create({
                    data: { financialYear: fy, lastNumber: 1 },
                });
                nextNum = 1;
            }
            else {
                nextNum = seq[0].last_number + 1;
                await tx.preBookingSequence.update({
                    where: { financialYear: fy },
                    data: { lastNumber: nextNum },
                });
            }
            return tx.preBooking.create({
                data: {
                    bookingNo: `PB/${fy}/${String(nextNum).padStart(4, '0')}`,
                    name: dto.name,
                    phone: dto.phone,
                    email: dto.email,
                    address: dto.address,
                    city: dto.city,
                    state: dto.state,
                    pincode: dto.pincode,
                    notes: dto.notes || null,
                    customerId,
                    areaId: area?.id,
                    supervisorId: area?.supervisorId,
                    subtotal,
                    total: subtotal,
                    items: { create: items },
                },
                include: BOOKING_INCLUDE,
            });
        });
        await this.notifications.notifyByModule({
            module: 'sales',
            type: 'PREBOOKING_RECEIVED',
            title: 'New Website Pre-booking',
            message: `${booking.bookingNo}: ${booking.name} (${booking.city} ${booking.pincode}) pre-booked ₹${subtotal.toLocaleString('en-IN')} — cash on delivery (5% GST included)`,
            refId: booking.id,
            link: `/sales/pre-bookings?highlight=${booking.id}`,
        });
        return this.toReceipt(booking);
    }
    async findMine(customerId) {
        const bookings = await this.prisma.preBooking.findMany({
            where: { customerId },
            include: BOOKING_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
        return bookings.map((b) => this.toReceipt(b));
    }
    async getReceipt(bookingNo, phone) {
        const booking = await this.prisma.preBooking.findUnique({
            where: { bookingNo },
            include: BOOKING_INCLUDE,
        });
        if (!booking || !phone || (0, phone_util_1.normalizePhone)(phone) !== booking.phone) {
            throw new common_1.NotFoundException('Pre-booking not found');
        }
        return this.toReceipt(booking);
    }
    toReceipt(b) {
        return {
            bookingNo: b.bookingNo,
            createdAt: b.createdAt,
            status: b.status,
            name: b.name,
            phone: b.phone,
            email: b.email,
            address: b.address,
            city: b.city,
            state: b.state,
            pincode: b.pincode,
            notes: b.notes,
            paymentMode: b.paymentMode,
            paymentReceived: b.paymentReceived,
            confirmedAt: b.confirmedAt,
            assignedAt: b.assignedAt,
            outForDeliveryAt: b.outForDeliveryAt,
            deliveredAt: b.deliveredAt,
            failedAttempts: b.failedAttempts,
            lastFailReason: b.lastFailReason,
            executiveName: b.executive?.name.split(' ')[0] ?? null,
            items: b.items.map((i) => ({
                productName: i.productName,
                packSize: i.packSize,
                qty: Number(i.qty),
                rate: Number(i.rate),
                lineTotal: Number(i.lineTotal),
            })),
            subtotal: Number(b.subtotal),
            total: Number(b.total),
        };
    }
    findAll(status) {
        const where = {};
        if (status && status in client_1.PreBookingStatus)
            where.status = status;
        return this.prisma.preBooking.findMany({
            where,
            include: BOOKING_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getOrThrow(id) {
        const booking = await this.prisma.preBooking.findUnique({
            where: { id },
            include: BOOKING_INCLUDE,
        });
        if (!booking)
            throw new common_1.NotFoundException('Pre-booking not found');
        return booking;
    }
    async resolveCustomer(booking, userId) {
        const candidates = await this.prisma.customer.findMany({
            where: { isDeleted: false, phone: { not: null } },
            select: { id: true, phone: true },
        });
        const match = candidates.find((c) => c.phone && (0, phone_util_1.normalizePhone)(c.phone) === booking.phone);
        if (match)
            return match.id;
        const customer = await this.customersService.create({
            name: booking.name,
            phone: booking.phone,
            email: booking.email ?? undefined,
            address: `${booking.address}, ${booking.city} - ${booking.pincode}`,
            city: booking.city,
            state: booking.state,
            createdBy: userId,
        });
        return customer.id;
    }
    async tellCustomer(booking, type, title, message) {
        if (!booking.customerId)
            return;
        await this.customerNotifications.notifyCustomer(booking.customerId, {
            type,
            title,
            message,
            refId: booking.id,
        });
    }
    async confirm(id, userId) {
        const booking = await this.getOrThrow(id);
        if (booking.status !== 'PENDING') {
            throw new common_1.BadRequestException(`Pre-booking is already ${booking.status.toLowerCase()}`);
        }
        const customerId = booking.customerId ?? (await this.resolveCustomer(booking, userId));
        await this.prisma.preBooking.update({
            where: { id },
            data: { status: 'CONFIRMED', confirmedAt: new Date(), customerId },
        });
        await this.notifySupervisor(booking, userId);
        await this.tellCustomer({ ...booking, customerId }, 'PREBOOKING_CONFIRMED', 'Pre-booking Confirmed', `Your pre-booking ${booking.bookingNo} is confirmed. We will arrange delivery soon.`);
        return { bookingNo: booking.bookingNo, status: 'CONFIRMED' };
    }
    async generateInvoice(id, userId, withGst = true) {
        const booking = await this.getOrThrow(id);
        if (booking.salesOrder?.invoice) {
            return {
                invoiceId: booking.salesOrder.invoice.id,
                invoiceNo: booking.salesOrder.invoice.invoiceNo,
                total: Number(booking.salesOrder.invoice.total),
            };
        }
        if (booking.status !== 'DELIVERED') {
            throw new common_1.BadRequestException('Invoices are generated after the order is delivered');
        }
        const customerId = booking.customerId ?? (await this.resolveCustomer(booking, userId));
        let orderId = booking.salesOrderId;
        if (!orderId) {
            const order = await this.salesService.createOrder({
                customerId,
                orderDate: new Date().toISOString().slice(0, 10),
                notes: `Pre-booking ${booking.bookingNo} — cash on delivery${booking.notes ? `\n${booking.notes}` : ''}`,
                items: booking.items.map((i) => ({
                    productId: i.productId,
                    qty: Number(i.qty),
                    rate: Number(i.rate),
                })),
                createdBy: userId,
                sourceMessage: `Invoice raised for pre-booking ${booking.bookingNo} (${booking.name})`,
            });
            orderId = order.id;
            await this.prisma.preBooking.update({
                where: { id },
                data: { customerId, salesOrderId: orderId },
            });
        }
        const invoice = await this.salesService.confirmOrder(orderId, userId, {
            withGst,
            taxInclusive: true,
            buyerState: booking.state,
            fulfilled: Boolean(booking.stockDeductedAt),
        });
        if (!booking.stockDeductedAt && booking.paymentReceived) {
            await this.recordCash({ ...booking, customerId }, userId, invoice.invoiceNo);
        }
        return {
            invoiceId: invoice.id,
            invoiceNo: invoice.invoiceNo,
            total: Number(invoice.total),
        };
    }
    async recordCash(booking, userId, reference) {
        if (!booking.customerId)
            return;
        const outstanding = await (0, gst_util_1.getCustomerOutstanding)(this.prisma, booking.customerId);
        const amount = round2(Math.min(Number(booking.total), outstanding));
        if (amount <= 0)
            return;
        await this.paymentsService.create({
            customerId: booking.customerId,
            amount,
            mode: booking.paymentMode,
            reference: booking.bookingNo,
            receivedAt: new Date().toISOString(),
            notes: `Cash on delivery — ${reference ?? booking.bookingNo}`,
            createdBy: userId,
        });
    }
    async fulfil(booking, userId) {
        const customerId = booking.customerId ?? (await this.resolveCustomer(booking, userId));
        if (booking.stockDeductedAt || booking.salesOrder?.invoice) {
            return customerId;
        }
        await this.prisma.$transaction([
            this.prisma.stockLedger.createMany({
                data: booking.items.map((i) => ({
                    productId: i.productId,
                    qtyChange: -Number(i.qty),
                    reason: 'SALE',
                    refId: booking.id,
                    notes: `Delivered ${booking.bookingNo}`,
                    createdBy: userId,
                })),
            }),
            this.prisma.customerLedger.create({
                data: {
                    customerId,
                    amount: booking.total,
                    type: 'DEBIT',
                    refId: booking.id,
                    notes: `Pre-booking ${booking.bookingNo} delivered`,
                },
            }),
            this.prisma.preBooking.update({
                where: { id: booking.id },
                data: { customerId, stockDeductedAt: new Date() },
            }),
        ]);
        return customerId;
    }
    async markDelivered(id, userId, paymentReceived) {
        const booking = await this.getOrThrow(id);
        if (booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Only confirmed pre-bookings can be marked delivered');
        }
        const customerId = await this.fulfil(booking, userId);
        if (paymentReceived) {
            await this.recordCash({ ...booking, customerId }, userId);
        }
        const updated = await this.prisma.preBooking.update({
            where: { id },
            data: {
                status: 'DELIVERED',
                deliveredAt: new Date(),
                paymentReceived,
                lastFailReason: null,
            },
            include: BOOKING_INCLUDE,
        });
        await this.tellCustomer(updated, 'PREBOOKING_DELIVERED', 'Order Delivered', `Your pre-booking ${booking.bookingNo} has been delivered. Thank you!`);
        return updated;
    }
    async notifySupervisor(booking, actorId) {
        if (!booking.supervisorId || booking.supervisorId === actorId)
            return;
        await this.notifications.notifyUser(booking.supervisorId, {
            module: 'delivery',
            type: 'PREBOOKING_FOR_ASSIGNMENT',
            title: 'Assign Delivery Executive',
            message: `${booking.bookingNo}: ${booking.name} (${booking.city} ${booking.pincode}) is confirmed — assign an executive`,
            refId: booking.id,
            link: '/delivery/board',
            actorId,
        });
    }
    scopeFor(actor) {
        if (actor.role === permissions_1.DELIVERY_SUPERVISOR)
            return { supervisorId: actor.sub };
        if (actor.role === permissions_1.DELIVERY_EXECUTIVE)
            return { executiveId: actor.sub };
        return {};
    }
    findDeliveryBoard(actor) {
        return this.prisma.preBooking.findMany({
            where: {
                ...this.scopeFor(actor),
                status: { in: ['CONFIRMED', 'DELIVERED'] },
            },
            include: BOOKING_INCLUDE,
            orderBy: { confirmedAt: 'desc' },
        });
    }
    findExecutives(actor) {
        return this.prisma.user.findMany({
            where: {
                isActive: true,
                role: { name: permissions_1.DELIVERY_EXECUTIVE },
                ...(actor.role === permissions_1.DELIVERY_SUPERVISOR
                    ? { supervisorId: actor.sub }
                    : {}),
            },
            select: { id: true, name: true, supervisorId: true },
            orderBy: { name: 'asc' },
        });
    }
    async setArea(id, areaId, actor) {
        if (!(0, permissions_1.canManageDeliveryAreas)(actor.role)) {
            throw new common_1.ForbiddenException('Only Owner, Admin or Manager can change the area');
        }
        const booking = await this.getOrThrow(id);
        if (booking.status === 'DELIVERED' || booking.status === 'CANCELLED') {
            throw new common_1.BadRequestException(`Pre-booking is already ${booking.status.toLowerCase()}`);
        }
        const area = await this.prisma.deliveryArea.findUnique({
            where: { id: areaId },
        });
        if (!area)
            throw new common_1.NotFoundException('Delivery area not found');
        const updated = await this.prisma.preBooking.update({
            where: { id },
            data: {
                areaId,
                supervisorId: area.supervisorId,
                executiveId: null,
                assignedAt: null,
                outForDeliveryAt: null,
            },
            include: BOOKING_INCLUDE,
        });
        if (updated.status === 'CONFIRMED') {
            await this.notifySupervisor(updated, actor.sub);
        }
        return updated;
    }
    async assignExecutive(id, executiveId, actor) {
        const booking = await this.getOrThrow(id);
        const isOwnSupervisor = actor.role === permissions_1.DELIVERY_SUPERVISOR && booking.supervisorId === actor.sub;
        if (!isOwnSupervisor && !(0, permissions_1.canManageDeliveryAreas)(actor.role)) {
            throw new common_1.ForbiddenException('This pre-booking is not in your area');
        }
        if (booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Only confirmed pre-bookings can be assigned');
        }
        if (!booking.supervisorId) {
            throw new common_1.BadRequestException('Set a delivery area with a supervisor before assigning an executive');
        }
        const executive = await this.prisma.user.findFirst({
            where: {
                id: executiveId,
                isActive: true,
                role: { name: permissions_1.DELIVERY_EXECUTIVE },
            },
        });
        if (!executive)
            throw new common_1.NotFoundException('Delivery executive not found');
        if (executive.supervisorId !== booking.supervisorId) {
            throw new common_1.BadRequestException(`${executive.name} is not in this supervisor's team`);
        }
        const updated = await this.prisma.preBooking.update({
            where: { id },
            data: { executiveId, assignedAt: new Date(), outForDeliveryAt: null },
            include: BOOKING_INCLUDE,
        });
        await this.notifications.notifyUser(executiveId, {
            module: 'delivery',
            type: 'PREBOOKING_ASSIGNED',
            title: 'New Delivery Assigned',
            message: `${updated.bookingNo}: deliver to ${updated.name}, ${updated.city} ${updated.pincode}`,
            refId: updated.id,
            link: '/delivery/board',
            actorId: actor.sub,
        });
        return updated;
    }
    async getForFieldUpdate(id, actor) {
        const booking = await this.getOrThrow(id);
        const allowed = (0, permissions_1.canManageDeliveryAreas)(actor.role) ||
            (actor.role === permissions_1.DELIVERY_EXECUTIVE &&
                booking.executiveId === actor.sub) ||
            (actor.role === permissions_1.DELIVERY_SUPERVISOR &&
                booking.supervisorId === actor.sub);
        if (!allowed) {
            throw new common_1.ForbiddenException('This delivery is not assigned to you');
        }
        if (!booking.executiveId) {
            throw new common_1.BadRequestException('Assign a delivery executive first');
        }
        return booking;
    }
    async markOutForDelivery(id, actor) {
        const booking = await this.getForFieldUpdate(id, actor);
        if (booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Only confirmed pre-bookings can go out');
        }
        const updated = await this.prisma.preBooking.update({
            where: { id },
            data: { outForDeliveryAt: booking.outForDeliveryAt ?? new Date() },
            include: BOOKING_INCLUDE,
        });
        await this.tellCustomer(updated, 'PREBOOKING_OUT_FOR_DELIVERY', 'Out for Delivery', `Your pre-booking ${booking.bookingNo} is on the way. Please keep ₹${Number(booking.total).toLocaleString('en-IN')} cash ready.`);
        return updated;
    }
    async failDelivery(id, actor, reason) {
        const booking = await this.getForFieldUpdate(id, actor);
        if (booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Only open deliveries can be marked failed');
        }
        const updated = await this.prisma.preBooking.update({
            where: { id },
            data: {
                outForDeliveryAt: null,
                failedAttempts: { increment: 1 },
                lastFailReason: reason?.trim() || 'Not delivered',
            },
            include: BOOKING_INCLUDE,
        });
        if (updated.supervisorId && updated.supervisorId !== actor.sub) {
            await this.notifications.notifyUser(updated.supervisorId, {
                module: 'delivery',
                type: 'PREBOOKING_DELIVERY_FAILED',
                title: 'Delivery Failed',
                message: `${updated.bookingNo}: ${updated.lastFailReason}`,
                refId: updated.id,
                link: '/delivery/board',
                actorId: actor.sub,
            });
        }
        await this.tellCustomer(updated, 'PREBOOKING_DELIVERY_FAILED', 'Delivery Attempt Missed', `We could not deliver ${booking.bookingNo}. Our team will contact you to reschedule.`);
        return updated;
    }
    async collectCash(id, actor) {
        const booking = await this.getForFieldUpdate(id, actor);
        if (booking.status !== 'DELIVERED' || booking.paymentReceived) {
            throw new common_1.BadRequestException('No cash is pending on this order');
        }
        await this.recordCash(booking, actor.sub);
        return this.prisma.preBooking.update({
            where: { id },
            data: { paymentReceived: true },
            include: BOOKING_INCLUDE,
        });
    }
    async confirmCashHandover(id, actor) {
        const booking = await this.getOrThrow(id);
        const allowed = (0, permissions_1.canManageDeliveryAreas)(actor.role) ||
            (actor.role === permissions_1.DELIVERY_SUPERVISOR &&
                booking.supervisorId === actor.sub);
        if (!allowed) {
            throw new common_1.ForbiddenException('Only the supervisor or office can receive cash');
        }
        if (!booking.paymentReceived) {
            throw new common_1.BadRequestException('No cash has been collected on this order');
        }
        return this.prisma.preBooking.update({
            where: { id },
            data: { cashHandedOverAt: booking.cashHandedOverAt ?? new Date() },
            include: BOOKING_INCLUDE,
        });
    }
    async fieldDeliver(id, actor, paymentReceived) {
        const booking = await this.getForFieldUpdate(id, actor);
        if (!booking.outForDeliveryAt) {
            await this.prisma.preBooking.update({
                where: { id },
                data: { outForDeliveryAt: new Date() },
            });
        }
        return this.markDelivered(id, actor.sub, paymentReceived);
    }
    async cancel(id, reason) {
        const booking = await this.getOrThrow(id);
        if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException(`Pre-booking is already ${booking.status.toLowerCase()}`);
        }
        if (booking.salesOrder?.invoice) {
            throw new common_1.BadRequestException('An invoice exists for this order. Cancel the invoice first.');
        }
        if (booking.salesOrder?.status === 'DRAFT') {
            await this.salesService.cancelOrder(booking.salesOrder.id);
        }
        const updated = await this.prisma.preBooking.update({
            where: { id },
            data: { status: 'CANCELLED', cancelReason: reason?.trim() || null },
            include: BOOKING_INCLUDE,
        });
        await this.tellCustomer(updated, 'PREBOOKING_CANCELLED', 'Pre-booking Cancelled', `Your pre-booking ${booking.bookingNo} has been cancelled.`);
        return updated;
    }
    async cancelByCustomer(customerId, bookingNo) {
        const booking = await this.prisma.preBooking.findUnique({
            where: { bookingNo },
        });
        if (!booking || booking.customerId !== customerId) {
            throw new common_1.NotFoundException('Pre-booking not found');
        }
        if (booking.executiveId) {
            throw new common_1.BadRequestException('Your order is already with our delivery team. Please call us to cancel.');
        }
        await this.cancel(booking.id, 'Cancelled by customer');
        await this.notifications.notifyByModule({
            module: 'sales',
            type: 'PREBOOKING_CANCELLED',
            title: 'Pre-booking Cancelled by Customer',
            message: `${booking.bookingNo}: ${booking.name} cancelled their pre-booking`,
            refId: booking.id,
            link: `/sales/pre-bookings?highlight=${booking.id}`,
        });
        return { bookingNo, status: 'CANCELLED' };
    }
    async getSummary() {
        const open = ['PENDING', 'CONFIRMED'];
        const [byStatus, cash, demand] = await Promise.all([
            this.prisma.preBooking.groupBy({
                by: ['status'],
                _count: true,
                _sum: { total: true },
            }),
            this.prisma.preBooking.aggregate({
                where: { paymentReceived: true, cashHandedOverAt: null },
                _sum: { total: true },
            }),
            this.prisma.preBookingItem.groupBy({
                by: ['productId', 'productName'],
                where: { preBooking: { status: { in: open } } },
                _sum: { qty: true },
            }),
        ]);
        const rows = await Promise.all(demand.map(async (d) => {
            const required = Number(d._sum.qty ?? 0);
            const stock = await (0, gst_util_1.getProductStock)(this.prisma, d.productId);
            return {
                productId: d.productId,
                productName: d.productName,
                required,
                stock,
                shortfall: Math.max(0, required - stock),
            };
        }));
        const find = (status) => byStatus.find((s) => s.status === status);
        return {
            pending: find('PENDING')?._count ?? 0,
            confirmed: find('CONFIRMED')?._count ?? 0,
            delivered: find('DELIVERED')?._count ?? 0,
            openValue: Number(find('PENDING')?._sum.total ?? 0) +
                Number(find('CONFIRMED')?._sum.total ?? 0),
            cashWithStaff: Number(cash._sum.total ?? 0),
            demand: rows.sort((a, b) => b.shortfall - a.shortfall),
        };
    }
};
exports.PreBookingService = PreBookingService;
exports.PreBookingService = PreBookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        customer_notifications_service_1.CustomerNotificationsService,
        customers_service_1.CustomersService,
        sales_service_1.SalesService,
        payments_service_1.PaymentsService])
], PreBookingService);
//# sourceMappingURL=prebooking.service.js.map