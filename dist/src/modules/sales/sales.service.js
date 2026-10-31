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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const gst_util_1 = require("../../common/utils/gst.util");
const PDFKit = require("pdfkit");
const notifications_service_1 = require("../notifications/notifications.service");
const customer_notifications_service_1 = require("../customer-notifications/customer-notifications.service");
const invoice_pdf_util_1 = require("../../common/utils/invoice-pdf.util");
let SalesService = class SalesService {
    constructor(prisma, config, notifications, customerNotifications) {
        this.prisma = prisma;
        this.config = config;
        this.notifications = notifications;
        this.customerNotifications = customerNotifications;
    }
    findAll() {
        return this.prisma.salesOrder.findMany({
            include: {
                customer: true,
                items: { include: { product: true } },
                invoice: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    findInvoices() {
        return this.prisma.invoice.findMany({
            where: { isDeleted: false },
            include: {
                order: { include: { customer: true } },
                items: { include: { product: true } },
            },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async createOrder(data) {
        if (!data.items?.length) {
            throw new common_1.BadRequestException('Order must have at least one item');
        }
        const order = await this.prisma.salesOrder.create({
            data: {
                customerId: data.customerId,
                orderDate: new Date(data.orderDate),
                notes: data.notes,
                createdBy: data.createdBy,
                status: 'DRAFT',
                items: {
                    create: data.items.map((i) => ({
                        productId: i.productId,
                        qty: i.qty,
                        rate: i.rate,
                    })),
                },
            },
            include: {
                customer: true,
                items: { include: { product: true } },
            },
        });
        const actor = data.createdBy
            ? await this.prisma.user.findUnique({ where: { id: data.createdBy } })
            : null;
        await this.notifications.notifyByModule({
            module: 'sales',
            type: 'ORDER_CREATED',
            title: 'New Sales Order',
            message: data.sourceMessage
                || `${actor?.name || 'Sales'} created a draft order for ${order.customer.name}`,
            refId: order.id,
            link: '/sales',
            actorId: data.createdBy,
        });
        return order;
    }
    async confirmOrder(orderId, userId, options) {
        const withGst = options?.withGst !== false;
        const sellerState = this.config.get('COMPANY_STATE') || 'Maharashtra';
        const sellerGstin = this.config.get('COMPANY_GSTIN') || '';
        const invoice = await this.prisma.$transaction(async (tx) => {
            const order = await tx.salesOrder.findUnique({
                where: { id: orderId },
                include: {
                    customer: true,
                    items: { include: { product: { include: { unit: true } } } },
                    invoice: true,
                },
            });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (order.status === 'CONFIRMED') {
                throw new common_1.BadRequestException('Order already confirmed');
            }
            if (order.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Cannot confirm cancelled order');
            }
            for (const item of options?.fulfilled ? [] : order.items) {
                const stock = await (0, gst_util_1.getProductStock)(tx, item.productId);
                const needed = Number(item.qty);
                if (stock < needed) {
                    const shortfall = needed - stock;
                    const unit = item.product.unit?.symbol ?? 'units';
                    await this.notifications.notifyByModule({
                        module: 'manufacturing',
                        type: 'PRODUCTION_REQUIRED',
                        title: 'Cannot Confirm — Production Needed',
                        message: `Order for ${order.customer.name}: ${item.product.name} needs ${shortfall} more ${unit} (have ${stock}, need ${needed}). Produce before confirming.`,
                        refId: orderId,
                        link: '/manufacturing',
                        actorId: userId,
                    });
                    await this.notifications.notifyByModule({
                        module: 'inventory',
                        type: 'CONFIRM_BLOCKED',
                        title: 'Order Confirmation Blocked',
                        message: `Insufficient stock for ${item.product.name} (${stock} available, ${needed} required). Order cannot be confirmed until stock is available.`,
                        refId: orderId,
                        link: '/inventory',
                        actorId: userId,
                    });
                    throw new common_1.BadRequestException(`Insufficient stock for ${item.product.name}. Available: ${stock}, required: ${needed}. Produce ${shortfall} more before confirming.`);
                }
            }
            const outstanding = await (0, gst_util_1.getCustomerOutstanding)(tx, order.customerId);
            const orderTotal = order.items.reduce((sum, i) => sum + Number(i.qty) * Number(i.rate), 0);
            const creditLimit = Number(order.customer.creditLimit);
            if (!options?.fulfilled && creditLimit > 0 && outstanding + orderTotal > creditLimit) {
                const available = Math.max(0, creditLimit - outstanding);
                throw new common_1.BadRequestException(`Customer credit limit exceeded. Credit limit: ₹${creditLimit.toFixed(2)}, outstanding: ₹${outstanding.toFixed(2)}, order total: ₹${orderTotal.toFixed(2)}, available credit: ₹${available.toFixed(2)}.`);
            }
            const interState = (0, gst_util_1.isInterState)(sellerState, options?.buyerState ?? order.customer.state);
            const fy = (0, gst_util_1.getFinancialYear)();
            const seq = await tx.$queryRaw `
        SELECT last_number FROM invoice_sequences WHERE financial_year = ${fy} FOR UPDATE
      `;
            let nextNum;
            if (!seq.length) {
                await tx.invoiceSequence.create({ data: { financialYear: fy, lastNumber: 1 } });
                nextNum = 1;
            }
            else {
                nextNum = seq[0].last_number + 1;
                await tx.invoiceSequence.update({
                    where: { financialYear: fy },
                    data: { lastNumber: nextNum },
                });
            }
            const invoiceNo = `KE/${fy}/${String(nextNum).padStart(4, '0')}`;
            let subtotal = 0;
            let cgstTotal = 0;
            let sgstTotal = 0;
            let igstTotal = 0;
            const isTaxInclusive = options?.taxInclusive || Boolean(order.notes?.includes('Pre-booking'));
            const invoiceItemsData = order.items.map((item) => {
                const qty = Number(item.qty);
                const rate = Number(item.rate);
                const lineGross = Math.round(qty * rate * 100) / 100;
                if (!withGst) {
                    subtotal += lineGross;
                    return {
                        productId: item.productId,
                        qty: item.qty,
                        rate: item.rate,
                        hsnCode: item.product.hsnCode,
                        gstRate: 0,
                        taxable: lineGross,
                        cgst: 0,
                        sgst: 0,
                        igst: 0,
                        lineTotal: lineGross,
                    };
                }
                if (isTaxInclusive) {
                    const gstRate = Number(item.product.gstRate) || 5;
                    const taxable = Math.round((lineGross / (1 + gstRate / 100)) * 100) / 100;
                    const gstAmount = Math.round((lineGross - taxable) * 100) / 100;
                    let cgst = 0;
                    let sgst = 0;
                    let igst = 0;
                    if (interState) {
                        igst = gstAmount;
                    }
                    else {
                        cgst = Math.round((gstAmount / 2) * 100) / 100;
                        sgst = Math.round((gstAmount - cgst) * 100) / 100;
                    }
                    subtotal += taxable;
                    cgstTotal += cgst;
                    sgstTotal += sgst;
                    igstTotal += igst;
                    return {
                        productId: item.productId,
                        qty: item.qty,
                        rate: item.rate,
                        hsnCode: item.product.hsnCode,
                        gstRate,
                        taxable,
                        cgst,
                        sgst,
                        igst,
                        lineTotal: lineGross,
                    };
                }
                const gst = (0, gst_util_1.calculateGstLine)({
                    qty,
                    rate,
                    gstRate: Number(item.product.gstRate),
                }, interState);
                subtotal += gst.taxable;
                cgstTotal += gst.cgst;
                sgstTotal += gst.sgst;
                igstTotal += gst.igst;
                return {
                    productId: item.productId,
                    qty: item.qty,
                    rate: item.rate,
                    hsnCode: item.product.hsnCode,
                    gstRate: item.product.gstRate,
                    taxable: gst.taxable,
                    cgst: gst.cgst,
                    sgst: gst.sgst,
                    igst: gst.igst,
                    lineTotal: gst.lineTotal,
                };
            });
            const gstAmount = Math.round((cgstTotal + sgstTotal + igstTotal) * 100) / 100;
            const total = isTaxInclusive && withGst
                ? Math.round(order.items.reduce((sum, i) => sum + Number(i.qty) * Number(i.rate), 0) * 100) / 100
                : Math.round((subtotal + gstAmount) * 100) / 100;
            const invoice = await tx.invoice.create({
                data: {
                    orderId: order.id,
                    invoiceNo,
                    withGst,
                    subtotal,
                    cgstAmount: cgstTotal,
                    sgstAmount: sgstTotal,
                    igstAmount: igstTotal,
                    gstAmount,
                    total,
                    sellerGstin: withGst ? sellerGstin : '',
                    buyerGstin: withGst ? order.customer.gstin : null,
                    issuedAt: new Date(),
                    financialYear: fy,
                    items: { create: invoiceItemsData },
                },
                include: { items: { include: { product: true } }, order: { include: { customer: true } } },
            });
            for (const item of options?.fulfilled ? [] : order.items) {
                await tx.stockLedger.create({
                    data: {
                        productId: item.productId,
                        qtyChange: -Number(item.qty),
                        reason: 'SALE',
                        refId: invoice.id,
                        createdBy: userId,
                    },
                });
            }
            if (!options?.fulfilled)
                await tx.customerLedger.create({
                    data: {
                        customerId: order.customerId,
                        amount: total,
                        type: 'DEBIT',
                        refId: invoice.id,
                        notes: withGst ? `Tax Invoice ${invoiceNo}` : `Invoice ${invoiceNo} (without GST)`,
                    },
                });
            await tx.salesOrder.update({
                where: { id: orderId },
                data: { status: 'CONFIRMED' },
            });
            await tx.auditLog.create({
                data: {
                    userId,
                    entity: 'sales_order',
                    action: 'confirm',
                    after: { orderId, invoiceNo, total, withGst },
                },
            });
            return invoice;
        });
        const actor = await this.prisma.user.findUnique({ where: { id: userId } });
        const invoiceLabel = withGst ? 'Tax Invoice' : 'Invoice (without GST)';
        await this.notifications.notifyByModule({
            module: 'sales',
            type: 'ORDER_CONFIRMED',
            title: `${invoiceLabel} Generated`,
            message: `${actor?.name || 'User'} confirmed order — ${invoiceLabel} ${invoice.invoiceNo} for ₹${Number(invoice.total)} (${invoice.order.customer.name})`,
            refId: invoice.id,
            link: '/sales',
            actorId: userId,
        });
        await this.notifications.notifyByModule({
            module: 'payments',
            type: 'INVOICE_ISSUED',
            title: 'New Invoice — Payment Due',
            message: `${invoiceLabel} ${invoice.invoiceNo}: ₹${Number(invoice.total)} due from ${invoice.order.customer.name}`,
            refId: invoice.id,
            link: '/payments',
            actorId: userId,
        });
        if (!options?.fulfilled)
            await this.notifications.notifyByModule({
                module: 'inventory',
                type: 'STOCK_DEDUCTED',
                title: 'Stock Deducted for Sale',
                message: `Stock reduced for invoice ${invoice.invoiceNo}`,
                refId: invoice.id,
                link: '/inventory',
                actorId: userId,
            });
        if (!options?.fulfilled)
            await this.notifications.notifyByModule({
                module: 'delivery',
                type: 'READY_FOR_DISPATCH',
                title: 'Invoice Ready for Dispatch',
                message: `Invoice ${invoice.invoiceNo} confirmed for ${invoice.order.customer.name} — create delivery challan`,
                refId: invoice.id,
                link: '/delivery',
                actorId: userId,
            });
        await this.customerNotifications.notifyCustomer(invoice.order.customerId, {
            type: 'ORDER_CONFIRMED',
            title: 'Order Confirmed',
            message: withGst
                ? `Your order has been confirmed. Tax Invoice ${invoice.invoiceNo} for ₹${Number(invoice.total).toLocaleString('en-IN')} has been generated.`
                : `Your order has been confirmed. Invoice ${invoice.invoiceNo} for ₹${Number(invoice.total).toLocaleString('en-IN')} has been generated.`,
            refId: invoice.orderId,
        });
        return invoice;
    }
    async cancelOrder(orderId) {
        const order = await this.prisma.salesOrder.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status === 'CONFIRMED') {
            throw new common_1.BadRequestException('Cannot cancel confirmed order');
        }
        const updated = await this.prisma.salesOrder.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
        if (order.notes?.includes('Kedar Foundation')) {
            await this.customerNotifications.notifyCustomer(order.customerId, {
                type: 'ORDER_CANCELLED',
                title: 'Order Cancelled',
                message: 'Your order was cancelled. Please contact us if you need assistance.',
                refId: orderId,
            });
        }
        return updated;
    }
    async generateInvoicePdf(invoiceId, res) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                items: { include: { product: { include: { unit: true } } } },
                order: { include: { customer: true } },
            },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        const companyName = this.config.get('COMPANY_NAME') || 'Kedar Enterprise';
        const companyState = this.config.get('COMPANY_STATE') || 'Gujarat';
        const pdfData = {
            invoiceNo: invoice.invoiceNo,
            issuedAt: invoice.issuedAt,
            withGst: invoice.withGst !== false,
            sellerGstin: invoice.sellerGstin,
            buyerGstin: invoice.buyerGstin || invoice.order.customer.gstin,
            subtotal: Number(invoice.subtotal),
            cgstAmount: Number(invoice.cgstAmount),
            sgstAmount: Number(invoice.sgstAmount),
            igstAmount: Number(invoice.igstAmount),
            total: Number(invoice.total),
            company: {
                name: companyName,
                tagline: this.config.get('COMPANY_TAGLINE') || 'Seva. Spirituality. Service',
                address: this.config.get('COMPANY_ADDRESS')
                    || '2-77, Gujarat Housing Board, Dehgam, PO: Dehgam, Dist: Gandhinagar, Gujarat, 382305',
                phone: this.config.get('COMPANY_PHONE') || '+91 99094 32021  ·  +91 63519 25121',
                email: this.config.get('COMPANY_EMAIL') || 'foundation.kedar@gmail.com',
                website: this.config.get('COMPANY_WEBSITE') || 'kedarfoundation.com',
                gstin: invoice.sellerGstin || this.config.get('COMPANY_GSTIN') || '',
                state: companyState,
                bankName: this.config.get('COMPANY_BANK_NAME') || '',
                bankAccount: this.config.get('COMPANY_BANK_ACCOUNT') || '',
                bankIfsc: this.config.get('COMPANY_BANK_IFSC') || '',
                bankBranch: this.config.get('COMPANY_BANK_BRANCH') || '',
                payeeName: this.config.get('COMPANY_PAYEE_NAME') || companyName,
            },
            customer: {
                name: invoice.order.customer.name,
                email: invoice.order.customer.email,
                phone: invoice.order.customer.phone,
                address: invoice.order.customer.address,
                city: invoice.order.customer.city,
                state: invoice.order.customer.state,
                gstin: invoice.order.customer.gstin,
            },
            items: invoice.items.map((item) => ({
                name: item.product.name,
                hsnCode: item.hsnCode,
                qty: Number(item.qty),
                unit: item.product.unit?.symbol,
                rate: Number(item.rate),
                taxable: Number(item.taxable),
                gstRate: Number(item.gstRate),
                cgst: Number(item.cgst),
                sgst: Number(item.sgst),
                igst: Number(item.igst),
                lineTotal: Number(item.lineTotal),
            })),
        };
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${invoice.invoiceNo.replace(/\//g, '-')}.pdf"`);
        const doc = new PDFKit({ margin: 0, size: 'A4' });
        doc.pipe(res);
        (0, invoice_pdf_util_1.drawInvoicePdf)(doc, pdfData);
        doc.end();
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        notifications_service_1.NotificationsService,
        customer_notifications_service_1.CustomerNotificationsService])
], SalesService);
//# sourceMappingURL=sales.service.js.map