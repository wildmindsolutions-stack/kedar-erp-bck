import {
<<<<<<< HEAD
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomersService } from '../customers/customers.service';
import { SalesService } from '../sales/sales.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CustomerNotificationsService } from '../customer-notifications/customer-notifications.service';
import { getProductStock } from '../../common/utils/gst.util';
import { isWebsiteOrder } from '../../common/utils/store.util';
import { StoreLoginDto, StorePlaceOrderDto, StoreRegisterDto, StoreResetPasswordDto, StoreUpdateProfileDto, StoreContactDto } from './store.dto';

@Injectable()
export class StoreService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private customersService: CustomersService,
    private salesService: SalesService,
    private notifications: NotificationsService,
    private customerNotifications: CustomerNotificationsService,
  ) {}

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits.slice(-10);
  }

  private async findCustomerByPhone(phone: string) {
    const normalized = this.normalizePhone(phone);
    if (normalized.length < 10) return null;

    const customers = await this.prisma.customer.findMany({
      where: { isDeleted: false, phone: { not: null } },
      include: { foundationAccount: true },
    });

    return customers.find(
      (c) => c.phone && this.normalizePhone(c.phone) === normalized,
    ) ?? null;
  }

  private toProfile(account: {
    id: string;
    email: string;
    customer: {
      id: string;
      name: string;
      phone: string | null;
      city: string | null;
      state: string;
    };
  }) {
    return {
      id: account.id,
      customerId: account.customer.id,
      name: account.customer.name,
      email: account.email,
      phone: account.customer.phone,
      city: account.customer.city,
      state: account.customer.state,
      type: 'foundation' as const,
    };
  }

  private signToken(accountId: string, email: string, customerId: string) {
    return this.jwt.sign(
      { sub: accountId, email, type: 'foundation', customerId },
      { expiresIn: '30d' },
    );
  }

  async register(dto: StoreRegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const phone = dto.phone?.trim();

    if (!phone) {
      throw new BadRequestException('Phone number is required');
    }

    const normalizedPhone = this.normalizePhone(phone);
    if (normalizedPhone.length < 10) {
      throw new BadRequestException('Please enter a valid 10-digit phone number');
    }

    const [existingAccountByEmail, existingUser] = await Promise.all([
      this.prisma.foundationAccount.findUnique({ where: { email } }),
      this.prisma.user.findUnique({ where: { email } }),
    ]);

    if (existingAccountByEmail || existingUser) {
      throw new ConflictException(
        'An account with this email already exists. Please login.',
      );
    }

    const existingCustomer = await this.findCustomerByPhone(phone);
    if (existingCustomer?.foundationAccount) {
      throw new ConflictException(
        'A customer with this phone number already exists. Please login with your email and password.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
=======

  Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException,

} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { Response } from 'express';

import { PrismaService } from '../../prisma/prisma.service';

import { CustomersService } from '../customers/customers.service';

import { SalesService } from '../sales/sales.service';

import { NotificationsService } from '../notifications/notifications.service';

import { CustomerNotificationsService } from '../customer-notifications/customer-notifications.service';
import { getProductStock } from '../../common/utils/gst.util';
import { StoreLoginDto, StorePlaceOrderDto, StoreRegisterDto } from './store.dto';



@Injectable()

export class StoreService {

  constructor(

    private prisma: PrismaService,

    private jwt: JwtService,

    private customersService: CustomersService,

    private salesService: SalesService,

    private notifications: NotificationsService,

    private customerNotifications: CustomerNotificationsService,

  ) {}



  /** Normalize to 10-digit Indian mobile for comparison. */

  private normalizePhone(phone: string): string {

    const digits = phone.replace(/\D/g, '');

    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);

    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);

    return digits.slice(-10);

  }



  private async findCustomerByPhone(phone: string) {

    const normalized = this.normalizePhone(phone);

    if (normalized.length < 10) return null;



    const customers = await this.prisma.customer.findMany({

      where: { isDeleted: false, phone: { not: null } },

      include: { foundationAccount: true },

    });



    return customers.find(

      (c) => c.phone && this.normalizePhone(c.phone) === normalized,

    ) ?? null;

  }



  private toProfile(account: {

    id: string;

    email: string;

    customer: { id: string; name: string; phone: string | null; city: string | null; state: string };

  }) {

    return {

      id: account.id,

      customerId: account.customer.id,

      name: account.customer.name,

      email: account.email,

      phone: account.customer.phone,

      city: account.customer.city,

      state: account.customer.state,

      type: 'foundation' as const,

    };

  }



  private signToken(accountId: string, email: string, customerId: string) {

    return this.jwt.sign(

      { sub: accountId, email, type: 'foundation', customerId },

      { expiresIn: '30d' },

    );

  }



  async register(dto: StoreRegisterDto) {

    const email = dto.email.toLowerCase().trim();

    const phone = dto.phone?.trim();



    if (!phone) {

      throw new BadRequestException('Phone number is required');

    }



    const normalizedPhone = this.normalizePhone(phone);

    if (normalizedPhone.length < 10) {

      throw new BadRequestException('Please enter a valid 10-digit phone number');

    }



    const [existingAccountByEmail, existingUser] = await Promise.all([

      this.prisma.foundationAccount.findUnique({ where: { email } }),

      this.prisma.user.findUnique({ where: { email } }),

    ]);

    if (existingAccountByEmail || existingUser) {

      throw new ConflictException('An account with this email already exists. Please login.');

    }



    const existingCustomer = await this.findCustomerByPhone(phone);



    if (existingCustomer?.foundationAccount) {

      throw new ConflictException(

        'A customer with this phone number already exists. Please login with your email and password.',

      );

    }



    const passwordHash = await bcrypt.hash(dto.password, 10);



>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    let customer;
    let profileFromErp = false;

    if (existingCustomer) {
<<<<<<< HEAD
      const erpName = existingCustomer.name?.trim();
      const erpCity = existingCustomer.city?.trim();
      const erpState = existingCustomer.state?.trim();
=======
      // ERP record is source of truth — only fill empty fields from signup
      const erpName = existingCustomer.name?.trim();
      const erpCity = existingCustomer.city?.trim();
      const erpState = existingCustomer.state?.trim();

>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
      profileFromErp = Boolean(
        (erpName && erpName !== dto.name.trim())
        || (erpCity && dto.city?.trim() && erpCity !== dto.city.trim())
        || (erpState && dto.state?.trim() && erpState !== dto.state.trim()),
      );

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
    } else {
<<<<<<< HEAD
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
=======

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

>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    return {
      accessToken,
      user: this.toProfile(account),
      linkedExistingCustomer: Boolean(existingCustomer),
      profileFromErp,
    };
<<<<<<< HEAD
  }

  async login(dto: StoreLoginDto) {
    const email = dto.email.toLowerCase().trim();
    const account = await this.prisma.foundationAccount.findUnique({
      where: { email },
      include: { customer: true },
    });

    if (
      !account
      || !account.isActive
      || account.customer.isDeleted
      || !account.customer.isActive
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, account.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.signToken(account.id, email, account.customerId);
    return { accessToken, user: this.toProfile(account) };
  }

  async resetPassword(dto: StoreResetPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const account = await this.prisma.foundationAccount.findUnique({
      where: { email },
      include: { customer: true },
    });

    const normalizedPhone = this.normalizePhone(dto.phone);
    const customerPhone = account?.customer.phone
      ? this.normalizePhone(account.customer.phone)
      : '';

    if (
      !account
      || !account.isActive
      || account.customer.isDeleted
      || !account.customer.isActive
      || normalizedPhone.length < 10
      || customerPhone !== normalizedPhone
    ) {
      throw new BadRequestException(
        'Email and phone number do not match our records. Please check your details or contact support.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.prisma.foundationAccount.update({
      where: { id: account.id },
      data: { passwordHash, isActive: true },
    });

    return { message: 'Password updated successfully. You can now log in.' };
  }

  async getProfile(accountId: string) {
    const account = await this.prisma.foundationAccount.findUnique({
      where: { id: accountId },
      include: { customer: true },
    });

    if (!account || !account.isActive) {
      throw new UnauthorizedException();
    }

    return this.toProfile(account);
  }

=======

  }



  async login(dto: StoreLoginDto) {

    const email = dto.email.toLowerCase().trim();

    const account = await this.prisma.foundationAccount.findUnique({

      where: { email },

      include: { customer: true },

    });



    if (!account || !account.isActive || account.customer.isDeleted || !account.customer.isActive) {

      throw new UnauthorizedException('Invalid credentials');

    }



    const valid = await bcrypt.compare(dto.password, account.passwordHash);

    if (!valid) throw new UnauthorizedException('Invalid credentials');



    const accessToken = this.signToken(account.id, email, account.customerId);

    return { accessToken, user: this.toProfile(account) };

  }



  async getProfile(accountId: string) {

    const account = await this.prisma.foundationAccount.findUnique({

      where: { id: accountId },

      include: { customer: true },

    });

    if (!account || !account.isActive) throw new UnauthorizedException();

    return this.toProfile(account);

  }



>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  async placeOrder(customerId: string, dto: StorePlaceOrderDto) {
    if (!dto.items?.length) {
      throw new BadRequestException('Order must have at least one item');
    }

    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, isDeleted: false, isActive: true },
    });
<<<<<<< HEAD
    if (!customer) {
      throw new UnauthorizedException('Customer account not found');
    }
=======
    if (!customer) throw new UnauthorizedException('Customer account not found');
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9

    const stockChecks: {
      productId: string;
      productName: string;
      unit: string;
      ordered: number;
      available: number;
      shortfall: number;
    }[] = [];
<<<<<<< HEAD
    const validatedItems: { productId: string; qty: number; rate: number }[] = [];
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9

    for (const item of dto.items) {
      const product = await this.prisma.product.findFirst({
        where: { id: item.productId, isDeleted: false, isActive: true },
        include: { unit: true },
      });
      if (!product) {
        throw new BadRequestException(`Product not found: ${item.productId}`);
      }

      const available = await getProductStock(this.prisma, item.productId);
      const ordered = Number(item.qty);
      if (ordered < 1) {
        throw new BadRequestException(`Invalid quantity for ${product.name}`);
      }
<<<<<<< HEAD
=======
      if (available < 1 && ordered > 0) {
        throw new BadRequestException(`${product.name} is out of stock.`);
      }
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9

      const shortfall = Math.max(0, ordered - available);
      stockChecks.push({
        productId: product.id,
        productName: product.name,
        unit: product.unit.symbol,
        ordered,
        available,
        shortfall,
      });
<<<<<<< HEAD
      validatedItems.push({
        productId: product.id,
        qty: ordered,
        rate: Number(product.price),
      });
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    }

    const awaitingStock = stockChecks.filter((s) => s.shortfall > 0);
    const orderDate = new Date().toISOString().slice(0, 10);
<<<<<<< HEAD
    let notes = dto.notes || 'Order placed via Kedar Foundation website';

=======

    let notes = dto.notes || 'Order placed via Kedar Foundation website';
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    if (awaitingStock.length) {
      const lines = awaitingStock.map(
        (s) => `${s.productName}: ordered ${s.ordered} ${s.unit}, in stock ${s.available} ${s.unit}, need production for ${s.shortfall} ${s.unit}`,
      );
      notes = `${notes}\n\nAWAITING_STOCK:\n${lines.join('\n')}`;
    }

    const order = await this.salesService.createOrder({
      customerId,
      orderDate,
<<<<<<< HEAD
      items: validatedItems,
      notes,
    });

    await this.notifications.notifyByModule({
      module: 'sales',
=======
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
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
      type: 'WEBSITE_ORDER_RECEIVED',
      title: 'New Website Order',
      message: awaitingStock.length
        ? `Draft order from ${customer.name} — awaiting stock before confirmation`
        : `Draft order from ${customer.name} — review in Sales & Billing`,
      refId: order.id,
<<<<<<< HEAD
      link: `/sales?highlight=${order.id}`,
=======
      link: '/sales',
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    });

    if (awaitingStock.length) {
      for (const s of awaitingStock) {
        await this.notifications.notifyByModule({
          module: 'manufacturing',
          type: 'PRODUCTION_NEEDED',
          title: 'Production Required for Website Order',
          message: `${customer.name} ordered ${s.ordered} ${s.unit} of ${s.productName}. Only ${s.available} ${s.unit} in stock — produce ${s.shortfall} ${s.unit} before order can be confirmed.`,
          refId: order.id,
<<<<<<< HEAD
          link: `/manufacturing?order=${order.id}`,
=======
          link: '/manufacturing',
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
        });
        await this.notifications.notifyByModule({
          module: 'inventory',
          type: 'STOCK_SHORTFALL',
          title: 'Stock Shortfall on Website Order',
          message: `${s.productName}: ${s.available} ${s.unit} available, ${s.ordered} ${s.unit} ordered. Reserve existing stock and plan replenishment.`,
          refId: order.id,
<<<<<<< HEAD
          link: `/inventory?order=${order.id}`,
=======
          link: '/inventory',
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
        });
      }

      await this.customerNotifications.notifyCustomer(customerId, {
        type: 'ORDER_AWAITING_STOCK',
        title: 'Order Received — Awaiting Stock',
        message: 'Your order has been received. Some items need production before we can confirm. We will notify you once ready.',
        refId: order.id,
      });
    } else {
      await this.customerNotifications.notifyCustomer(customerId, {
        type: 'ORDER_RECEIVED',
        title: 'Order Received',
        message: 'Your order has been received and is pending confirmation by our team.',
        refId: order.id,
      });
    }

    return { ...order, awaitingStock: awaitingStock.length > 0, stockChecks };
  }

  getNotifications(customerId: string) {
<<<<<<< HEAD
    return this.customerNotifications.getForCustomer(customerId);
  }

  getUnreadCount(customerId: string) {
    return this.customerNotifications.getUnreadCount(customerId);
  }

  markNotificationRead(customerId: string, id: string) {
    return this.customerNotifications.markRead(customerId, id);
  }

  markAllNotificationsRead(customerId: string) {
    return this.customerNotifications.markAllRead(customerId);
  }

  getOrders(customerId: string) {
    return this.prisma.salesOrder
      .findMany({
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
      })
      .then((orders) => orders.map((order) => ({
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
=======

    return this.customerNotifications.getForCustomer(customerId);

  }

  getUnreadCount(customerId: string) {

    return this.customerNotifications.getUnreadCount(customerId);

  }

  markNotificationRead(customerId: string, id: string) {

    return this.customerNotifications.markRead(customerId, id);

  }

  markAllNotificationsRead(customerId: string) {

    return this.customerNotifications.markAllRead(customerId);

  }

  getOrders(customerId: string) {
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
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  }

  async getInvoicePdf(customerId: string, invoiceId: string, res: Response) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        isDeleted: false,
        order: { customerId },
      },
    });
<<<<<<< HEAD
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return this.salesService.generateInvoicePdf(invoiceId, res);
  }

  async updateProfile(accountId: string, dto: StoreUpdateProfileDto) {
    const account = await this.prisma.foundationAccount.findUnique({
      where: { id: accountId },
      include: { customer: true },
    });

    if (!account || !account.isActive) {
      throw new UnauthorizedException();
    }

    const data: { name?: string; city?: string | null; state?: string } = {};
    if (dto.name?.trim()) data.name = dto.name.trim();
    if (dto.city !== undefined) data.city = dto.city.trim() || null;
    if (dto.state?.trim()) data.state = dto.state.trim();

    if (!Object.keys(data).length) {
      throw new BadRequestException('No profile fields to update');
    }

    const customer = await this.prisma.customer.update({
      where: { id: account.customerId },
      data,
    });

    return this.toProfile({ ...account, customer });
  }

  async cancelOrder(customerId: string, orderId: string) {
    const order = await this.prisma.salesOrder.findFirst({
      where: { id: orderId, customerId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== 'DRAFT') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }
    if (!isWebsiteOrder(order.notes)) {
      throw new BadRequestException('This order cannot be cancelled online. Please contact support.');
    }

    return this.salesService.cancelOrder(orderId);
  }

  async submitContact(dto: StoreContactDto) {
    const name = dto.name.trim();
    const email = dto.email.toLowerCase().trim();
    const subject = dto.subject.trim();
    const message = dto.message.trim();

    if (!name || !message) {
      throw new BadRequestException('Name and message are required');
    }

    await this.notifications.notifyByModule({
      module: 'customers',
      type: 'CONTACT_FORM',
      title: `Website contact: ${subject}`,
      message: `${name} (${email}): ${message.slice(0, 500)}${message.length > 500 ? '…' : ''}`,
      link: '/customers',
      notifyAdmins: true,
    });

    return { message: 'Thank you for reaching out. Our team will get back to you shortly.' };
  }
}
=======
    if (!invoice) throw new NotFoundException('Invoice not found');
    return this.salesService.generateInvoicePdf(invoiceId, res);
  }

}


>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
