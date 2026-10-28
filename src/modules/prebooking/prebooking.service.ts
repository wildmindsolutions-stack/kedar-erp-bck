import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PreBookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CustomersService } from '../customers/customers.service';
import { SalesService } from '../sales/sales.service';
import { PaymentsService } from '../payments/payments.service';
import {
  getCustomerOutstanding,
  getFinancialYear,
} from '../../common/utils/gst.util';
import { normalizePhone } from '../../common/utils/phone.util';
import { CreatePreBookingDto } from './prebooking.dto';

const round2 = (n: number) => Math.round(n * 100) / 100;

const BOOKING_INCLUDE = {
  items: { orderBy: { productName: 'asc' } },
  salesOrder: {
    select: {
      id: true,
      status: true,
      invoice: { select: { id: true, invoiceNo: true, total: true, withGst: true } },
    },
  },
} satisfies Prisma.PreBookingInclude;

type BookingWithItems = Prisma.PreBookingGetPayload<{
  include: typeof BOOKING_INCLUDE;
}>;

@Injectable()
export class PreBookingService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private customersService: CustomersService,
    private salesService: SalesService,
    private paymentsService: PaymentsService,
  ) {}

  /** Public catalogue: products flagged for website pre-booking. */
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

  async create(dto: CreatePreBookingDto) {
    if (dto.website)
      throw new BadRequestException('Unable to submit pre-booking');

    // Merge duplicate lines for the same product
    const qtyByProduct = new Map<string, number>();
    for (const item of dto.items) {
      qtyByProduct.set(
        item.productId,
        (qtyByProduct.get(item.productId) ?? 0) + item.qty,
      );
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
      throw new BadRequestException(
        'One or more selected products are no longer available for pre-booking',
      );
    }

    // Prices always come from the ERP, 5% tax included directly
    const items = products.map((p) => {
      const qty = qtyByProduct.get(p.id)!;
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
      const fy = getFinancialYear();
      const seq = await tx.$queryRaw<{ last_number: number }[]>`
        SELECT last_number FROM pre_booking_sequences WHERE financial_year = ${fy} FOR UPDATE
      `;

      let nextNum: number;
      if (!seq.length) {
        await tx.preBookingSequence.create({
          data: { financialYear: fy, lastNumber: 1 },
        });
        nextNum = 1;
      } else {
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

  /** Public receipt lookup — requires the phone used on the booking. */
  async getReceipt(bookingNo: string, phone: string) {
    const booking = await this.prisma.preBooking.findUnique({
      where: { bookingNo },
      include: BOOKING_INCLUDE,
    });
    if (!booking || !phone || normalizePhone(phone) !== booking.phone) {
      throw new NotFoundException('Pre-booking not found');
    }
    return this.toReceipt(booking);
  }

  private toReceipt(b: BookingWithItems) {
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

  // ─── ERP admin ───────────────────────────────────────────────

  findAll(status?: string) {
    const where: Prisma.PreBookingWhereInput = {};
    if (status && status in PreBookingStatus)
      where.status = status as PreBookingStatus;
    return this.prisma.preBooking.findMany({
      where,
      include: BOOKING_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getOrThrow(id: string) {
    const booking = await this.prisma.preBooking.findUnique({
      where: { id },
      include: BOOKING_INCLUDE,
    });
    if (!booking) throw new NotFoundException('Pre-booking not found');
    return booking;
  }

  /** Find the ERP customer by mobile number, or create one from the booking details. */
  private async resolveCustomer(booking: BookingWithItems, userId: string) {
    const candidates = await this.prisma.customer.findMany({
      where: { isDeleted: false, phone: { not: null } },
      select: { id: true, phone: true },
    });
    const match = candidates.find(
      (c) => c.phone && normalizePhone(c.phone) === booking.phone,
    );
    if (match) return match.id;

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

  /**
   * Staff confirmation: moves booking to CONFIRMED.
   * Creates the ERP sales order in DRAFT at booked rates.
   * If generateInvoice is true, immediately generates invoice as well.
   */
  async confirm(
    id: string,
    userId: string,
    options?: { generateInvoice?: boolean; withGst?: boolean },
  ) {
    const booking = await this.getOrThrow(id);
    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        `Pre-booking is already ${booking.status.toLowerCase()}`,
      );
    }

    const customerId =
      booking.customerId ?? (await this.resolveCustomer(booking, userId));

    let orderId =
      booking.salesOrder?.status === 'DRAFT' ? booking.salesOrder.id : null;
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
    } else if (booking.salesOrderId) {
      orderId = booking.salesOrderId;
    }

    let invoiceResult: { id: string; invoiceNo: string; total: number } | null =
      null;

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

  /**
   * Manual Invoice Generation: can be called at delivery time or any time after from the dashboard
   * if the customer asks for a bill/invoice.
   */
  async generateInvoice(id: string, userId: string, withGst: boolean = true) {
    let booking = await this.getOrThrow(id);

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException(
        'Cannot generate invoice for a cancelled pre-booking',
      );
    }

    // If an invoice already exists, return it
    if (booking.salesOrder?.invoice) {
      return {
        invoiceId: booking.salesOrder.invoice.id,
        invoiceNo: booking.salesOrder.invoice.invoiceNo,
        total: Number(booking.salesOrder.invoice.total),
      };
    }

    const customerId =
      booking.customerId ?? (await this.resolveCustomer(booking, userId));

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

    // If already delivered and payment was recorded, ensure payment allocation
    if (booking.status === 'DELIVERED' && booking.paymentReceived) {
      const outstanding = await getCustomerOutstanding(
        this.prisma,
        customerId,
      );
      const amount = round2(
        Math.min(Number(invoice.total), outstanding),
      );
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

  async markDelivered(
    id: string,
    userId: string,
    options?: {
      paymentReceived?: boolean;
      generateInvoice?: boolean;
      withGst?: boolean;
    },
  ) {
    let booking = await this.getOrThrow(id);
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException(
        'Only confirmed pre-bookings can be marked delivered',
      );
    }

    const shouldGenInvoice = options?.generateInvoice === true;
    if (shouldGenInvoice && !booking.salesOrder?.invoice) {
      await this.generateInvoice(id, userId, options?.withGst !== false);
      booking = await this.getOrThrow(id);
    }

    const paymentReceived = options?.paymentReceived !== false;

    if (paymentReceived && booking.customerId && booking.salesOrder?.invoice) {
      const outstanding = await getCustomerOutstanding(
        this.prisma,
        booking.customerId,
      );
      const amount = round2(
        Math.min(Number(booking.salesOrder.invoice.total), outstanding),
      );
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

  async cancel(id: string) {
    const booking = await this.getOrThrow(id);
    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending pre-bookings can be cancelled',
      );
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
}
