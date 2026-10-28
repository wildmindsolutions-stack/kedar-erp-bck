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
const customers_service_1 = require("../customers/customers.service");
const sales_service_1 = require("../sales/sales.service");
const payments_service_1 = require("../payments/payments.service");
const gst_util_1 = require("../../common/utils/gst.util");
const phone_util_1 = require("../../common/utils/phone.util");
const round2 = (n) => Math.round(n * 100) / 100;
const BOOKING_INCLUDE = {
    items: { orderBy: { productName: 'asc' } },
    salesOrder: {
        select: {
            id: true,
            status: true,
            invoice: { select: { id: true, invoiceNo: true, total: true, withGst: true } },
        },
    },
};
let PreBookingService = class PreBookingService {
    constructor(prisma, notifications, customersService, salesService, paymentsService) {
        this.prisma = prisma;
        this.notifications = notifications;
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
    async create(dto) {
        if (dto.website)
            throw new common_1.BadRequestException('Unable to submit pre-booking');
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
    async confirm(id, userId, options) {
        const booking = await this.getOrThrow(id);
        if (booking.status !== 'PENDING') {
            throw new common_1.BadRequestException(`Pre-booking is already ${booking.status.toLowerCase()}`);
        }
        const customerId = booking.customerId ?? (await this.resolveCustomer(booking, userId));
        let orderId = booking.salesOrder?.status === 'DRAFT' ? booking.salesOrder.id : null;
        if (!orderId && !booking.salesOrderId) {
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
                sourceMessage: `Pre-booking ${booking.bookingNo} (${booking.name}) moved to Sales`,
            });
            orderId = order.id;
            await this.prisma.preBooking.update({
                where: { id },
                data: { customerId, salesOrderId: orderId },
            });
        }
        else if (booking.salesOrderId) {
            orderId = booking.salesOrderId;
        }
        let invoiceResult = null;
        if (options?.generateInvoice && orderId) {
            const invoice = await this.salesService.confirmOrder(orderId, userId, {
                withGst: options.withGst !== false,
                taxInclusive: true,
            });
            invoiceResult = {
                id: invoice.id,
                invoiceNo: invoice.invoiceNo,
                total: Number(invoice.total),
            };
        }
        await this.prisma.preBooking.update({
            where: { id },
            data: { status: 'CONFIRMED', confirmedAt: new Date() },
        });
        return {
            bookingNo: booking.bookingNo,
            status: 'CONFIRMED',
            invoice: invoiceResult,
        };
    }
    async generateInvoice(id, userId, withGst = true) {
        let booking = await this.getOrThrow(id);
        if (booking.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cannot generate invoice for a cancelled pre-booking');
        }
        if (booking.salesOrder?.invoice) {
            return {
                invoiceId: booking.salesOrder.invoice.id,
                invoiceNo: booking.salesOrder.invoice.invoiceNo,
                total: Number(booking.salesOrder.invoice.total),
            };
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
                sourceMessage: `Pre-booking ${booking.bookingNo} (${booking.name}) moved to Sales`,
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
        });
        if (booking.status === 'DELIVERED' && booking.paymentReceived) {
            const outstanding = await (0, gst_util_1.getCustomerOutstanding)(this.prisma, customerId);
            const amount = round2(Math.min(Number(invoice.total), outstanding));
            if (amount > 0) {
                await this.paymentsService.create({
                    customerId,
                    amount,
                    mode: booking.paymentMode,
                    reference: booking.bookingNo,
                    receivedAt: new Date().toISOString(),
                    notes: `Cash on delivery — ${booking.bookingNo} / ${invoice.invoiceNo}`,
                    createdBy: userId,
                });
            }
        }
        return {
            invoiceId: invoice.id,
            invoiceNo: invoice.invoiceNo,
            total: Number(invoice.total),
        };
    }
    async markDelivered(id, userId, options) {
        let booking = await this.getOrThrow(id);
        if (booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Only confirmed pre-bookings can be marked delivered');
        }
        const shouldGenInvoice = options?.generateInvoice === true;
        if (shouldGenInvoice && !booking.salesOrder?.invoice) {
            await this.generateInvoice(id, userId, options?.withGst !== false);
            booking = await this.getOrThrow(id);
        }
        const paymentReceived = options?.paymentReceived !== false;
        if (paymentReceived && booking.customerId && booking.salesOrder?.invoice) {
            const outstanding = await (0, gst_util_1.getCustomerOutstanding)(this.prisma, booking.customerId);
            const amount = round2(Math.min(Number(booking.salesOrder.invoice.total), outstanding));
            if (amount > 0) {
                await this.paymentsService.create({
                    customerId: booking.customerId,
                    amount,
                    mode: booking.paymentMode,
                    reference: booking.bookingNo,
                    receivedAt: new Date().toISOString(),
                    notes: `Cash on delivery — ${booking.bookingNo} / ${booking.salesOrder.invoice.invoiceNo}`,
                    createdBy: userId,
                });
            }
        }
        return this.prisma.preBooking.update({
            where: { id },
            data: { status: 'DELIVERED', deliveredAt: new Date(), paymentReceived },
            include: BOOKING_INCLUDE,
        });
    }
    async cancel(id) {
        const booking = await this.getOrThrow(id);
        if (booking.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only pending pre-bookings can be cancelled');
        }
        if (booking.salesOrder?.status === 'DRAFT') {
            await this.salesService.cancelOrder(booking.salesOrder.id);
        }
        return this.prisma.preBooking.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: BOOKING_INCLUDE,
        });
    }
};
exports.PreBookingService = PreBookingService;
exports.PreBookingService = PreBookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        customers_service_1.CustomersService,
        sales_service_1.SalesService,
        payments_service_1.PaymentsService])
], PreBookingService);
//# sourceMappingURL=prebooking.service.js.map