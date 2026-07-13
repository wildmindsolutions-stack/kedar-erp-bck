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
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const customers_service_1 = require("../customers/customers.service");
const sales_service_1 = require("../sales/sales.service");
const notifications_service_1 = require("../notifications/notifications.service");
const customer_notifications_service_1 = require("../customer-notifications/customer-notifications.service");
const gst_util_1 = require("../../common/utils/gst.util");
let StoreService = class StoreService {
    constructor(prisma, jwt, customersService, salesService, notifications, customerNotifications) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.customersService = customersService;
        this.salesService = salesService;
        this.notifications = notifications;
        this.customerNotifications = customerNotifications;
    }
    normalizePhone(phone) {
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91'))
            return digits.slice(2);
        if (digits.length === 11 && digits.startsWith('0'))
            return digits.slice(1);
        return digits.slice(-10);
    }
    async findCustomerByPhone(phone) {
        const normalized = this.normalizePhone(phone);
        if (normalized.length < 10)
            return null;
        const customers = await this.prisma.customer.findMany({
            where: { isDeleted: false, phone: { not: null } },
            include: { foundationAccount: true },
        });
        return customers.find((c) => c.phone && this.normalizePhone(c.phone) === normalized) ?? null;
    }
    toProfile(account) {
        return {
            id: account.id,
            customerId: account.customer.id,
            name: account.customer.name,
            email: account.email,
            phone: account.customer.phone,
            city: account.customer.city,
            state: account.customer.state,
            type: 'foundation',
        };
    }
    signToken(accountId, email, customerId) {
        return this.jwt.sign({ sub: accountId, email, type: 'foundation', customerId }, { expiresIn: '30d' });
    }
    async register(dto) {
        const email = dto.email.toLowerCase().trim();
        const phone = dto.phone?.trim();
        if (!phone) {
            throw new common_1.BadRequestException('Phone number is required');
        }
        const normalizedPhone = this.normalizePhone(phone);
        if (normalizedPhone.length < 10) {
            throw new common_1.BadRequestException('Please enter a valid 10-digit phone number');
        }
        const [existingAccountByEmail, existingUser] = await Promise.all([
            this.prisma.foundationAccount.findUnique({ where: { email } }),
            this.prisma.user.findUnique({ where: { email } }),
        ]);
        if (existingAccountByEmail || existingUser) {
            throw new common_1.ConflictException('An account with this email already exists. Please login.');
        }
        const existingCustomer = await this.findCustomerByPhone(phone);
        if (existingCustomer?.foundationAccount) {
            throw new common_1.ConflictException('A customer with this phone number already exists. Please login with your email and password.');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        let customer;
        let profileFromErp = false;
        if (existingCustomer) {
            const erpName = existingCustomer.name?.trim();
            const erpCity = existingCustomer.city?.trim();
            const erpState = existingCustomer.state?.trim();
            profileFromErp = Boolean((erpName && erpName !== dto.name.trim())
                || (erpCity && dto.city?.trim() && erpCity !== dto.city.trim())
                || (erpState && dto.state?.trim() && erpState !== dto.state.trim()));
            customer = await this.prisma.customer.update({
                where: { id: existingCustomer.id },
                data: {
                    name: erpName || dto.name.trim(),
                    email,
                    phone,
                    city: erpCity || dto.city?.trim() || null,
                    state: erpState || dto.state?.trim() || 'Gujarat',
                },
            });
        }
        else {
            customer = await this.customersService.create({
                name: dto.name.trim(),
                email,
                phone,
                city: dto.city?.trim(),
                state: dto.state?.trim() || 'Gujarat',
                creditLimit: 0,
            });
        }
        const account = await this.prisma.foundationAccount.create({
            data: {
                customerId: customer.id,
                email,
                passwordHash,
            },
            include: { customer: true },
        });
        const accessToken = this.signToken(account.id, email, customer.id);
        return {
            accessToken,
            user: this.toProfile(account),
            linkedExistingCustomer: Boolean(existingCustomer),
            profileFromErp,
        };
    }
    async login(dto) {
        const email = dto.email.toLowerCase().trim();
        const account = await this.prisma.foundationAccount.findUnique({
            where: { email },
            include: { customer: true },
        });
        if (!account || !account.isActive || account.customer.isDeleted || !account.customer.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, account.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const accessToken = this.signToken(account.id, email, account.customerId);
        return { accessToken, user: this.toProfile(account) };
    }
    async getProfile(accountId) {
        const account = await this.prisma.foundationAccount.findUnique({
            where: { id: accountId },
            include: { customer: true },
        });
        if (!account || !account.isActive)
            throw new common_1.UnauthorizedException();
        return this.toProfile(account);
    }
    async placeOrder(customerId, dto) {
        if (!dto.items?.length) {
            throw new common_1.BadRequestException('Order must have at least one item');
        }
        const customer = await this.prisma.customer.findFirst({
            where: { id: customerId, isDeleted: false, isActive: true },
        });
        if (!customer)
            throw new common_1.UnauthorizedException('Customer account not found');
        const stockChecks = [];
        for (const item of dto.items) {
            const product = await this.prisma.product.findFirst({
                where: { id: item.productId, isDeleted: false, isActive: true },
                include: { unit: true },
            });
            if (!product) {
                throw new common_1.BadRequestException(`Product not found: ${item.productId}`);
            }
            const available = await (0, gst_util_1.getProductStock)(this.prisma, item.productId);
            const ordered = Number(item.qty);
            if (ordered < 1) {
                throw new common_1.BadRequestException(`Invalid quantity for ${product.name}`);
            }
            if (available < 1 && ordered > 0) {
                throw new common_1.BadRequestException(`${product.name} is out of stock.`);
            }
            const shortfall = Math.max(0, ordered - available);
            stockChecks.push({
                productId: product.id,
                productName: product.name,
                unit: product.unit.symbol,
                ordered,
                available,
                shortfall,
            });
        }
        const awaitingStock = stockChecks.filter((s) => s.shortfall > 0);
        const orderDate = new Date().toISOString().slice(0, 10);
        let notes = dto.notes || 'Order placed via Kedar Foundation website';
        if (awaitingStock.length) {
            const lines = awaitingStock.map((s) => `${s.productName}: ordered ${s.ordered} ${s.unit}, in stock ${s.available} ${s.unit}, need production for ${s.shortfall} ${s.unit}`);
            notes = `${notes}\n\nAWAITING_STOCK:\n${lines.join('\n')}`;
        }
        const order = await this.salesService.createOrder({
            customerId,
            orderDate,
            items: dto.items.map((i) => ({
                productId: i.productId,
                qty: Number(i.qty),
                rate: Number(i.rate),
            })),
            notes,
            sourceMessage: `${customer.name} placed a new order via Kedar Foundation website`,
        });
        await this.notifications.notifyByModule({
            module: 'payments',
            type: 'WEBSITE_ORDER_RECEIVED',
            title: 'New Website Order',
            message: awaitingStock.length
                ? `Draft order from ${customer.name} — awaiting stock before confirmation`
                : `Draft order from ${customer.name} — review in Sales & Billing`,
            refId: order.id,
            link: '/sales',
        });
        if (awaitingStock.length) {
            for (const s of awaitingStock) {
                await this.notifications.notifyByModule({
                    module: 'manufacturing',
                    type: 'PRODUCTION_NEEDED',
                    title: 'Production Required for Website Order',
                    message: `${customer.name} ordered ${s.ordered} ${s.unit} of ${s.productName}. Only ${s.available} ${s.unit} in stock — produce ${s.shortfall} ${s.unit} before order can be confirmed.`,
                    refId: order.id,
                    link: '/manufacturing',
                });
                await this.notifications.notifyByModule({
                    module: 'inventory',
                    type: 'STOCK_SHORTFALL',
                    title: 'Stock Shortfall on Website Order',
                    message: `${s.productName}: ${s.available} ${s.unit} available, ${s.ordered} ${s.unit} ordered. Reserve existing stock and plan replenishment.`,
                    refId: order.id,
                    link: '/inventory',
                });
            }
            await this.customerNotifications.notifyCustomer(customerId, {
                type: 'ORDER_AWAITING_STOCK',
                title: 'Order Received — Awaiting Stock',
                message: 'Your order has been received. Some items need production before we can confirm. We will notify you once ready.',
                refId: order.id,
            });
        }
        else {
            await this.customerNotifications.notifyCustomer(customerId, {
                type: 'ORDER_RECEIVED',
                title: 'Order Received',
                message: 'Your order has been received and is pending confirmation by our team.',
                refId: order.id,
            });
        }
        return { ...order, awaitingStock: awaitingStock.length > 0, stockChecks };
    }
    getNotifications(customerId) {
        return this.customerNotifications.getForCustomer(customerId);
    }
    getUnreadCount(customerId) {
        return this.customerNotifications.getUnreadCount(customerId);
    }
    markNotificationRead(customerId, id) {
        return this.customerNotifications.markRead(customerId, id);
    }
    markAllNotificationsRead(customerId) {
        return this.customerNotifications.markAllRead(customerId);
    }
    getOrders(customerId) {
        return this.prisma.salesOrder.findMany({
            where: { customerId },
            include: {
                items: { include: { product: { include: { unit: true } } } },
                invoice: {
                    include: {
                        deliveries: true,
                        items: { include: { product: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        }).then((orders) => orders.map((order) => ({
            ...order,
            items: order.items.map((i) => ({
                ...i,
                qty: Number(i.qty),
                rate: Number(i.rate),
            })),
            invoice: order.invoice
                ? {
                    id: order.invoice.id,
                    invoiceNo: order.invoice.invoiceNo,
                    subtotal: Number(order.invoice.subtotal),
                    cgstAmount: Number(order.invoice.cgstAmount),
                    sgstAmount: Number(order.invoice.sgstAmount),
                    igstAmount: Number(order.invoice.igstAmount),
                    gstAmount: Number(order.invoice.gstAmount),
                    total: Number(order.invoice.total),
                    issuedAt: order.invoice.issuedAt,
                    deliveries: order.invoice.deliveries,
                    items: order.invoice.items.map((ii) => ({
                        ...ii,
                        qty: Number(ii.qty),
                        rate: Number(ii.rate),
                        gstRate: Number(ii.gstRate),
                        taxable: Number(ii.taxable),
                        cgst: Number(ii.cgst),
                        sgst: Number(ii.sgst),
                        igst: Number(ii.igst),
                        lineTotal: Number(ii.lineTotal),
                    })),
                }
                : null,
        })));
    }
    async getInvoicePdf(customerId, invoiceId, res) {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id: invoiceId,
                isDeleted: false,
                order: { customerId },
            },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return this.salesService.generateInvoicePdf(invoiceId, res);
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        customers_service_1.CustomersService,
        sales_service_1.SalesService,
        notifications_service_1.NotificationsService,
        customer_notifications_service_1.CustomerNotificationsService])
], StoreService);
//# sourceMappingURL=store.service.js.map