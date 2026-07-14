import {
<<<<<<< HEAD
  Body, Controller, Get, NotFoundException, Param, Patch, Post, Req, Res, UseGuards,
=======
  Controller, Get, Post, Body, UseGuards, Req, Param, NotFoundException, Patch, Res,
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
} from '@nestjs/common';
import { Response } from 'express';
import { StoreService } from './store.service';
import { ProductsService } from '../products/products.service';
<<<<<<< HEAD
import { StoreLoginDto, StorePlaceOrderDto, StoreRegisterDto, StoreResetPasswordDto, StoreUpdateProfileDto, StoreContactDto } from './store.dto';
import { FoundationAuthGuard } from '../../common/guards/foundation-auth.guard';

interface FoundationRequest {
  user: {
    sub: string;
    customerId: string;
    type: string;
  };
}

=======
import { StoreLoginDto, StorePlaceOrderDto, StoreRegisterDto } from './store.dto';
import { FoundationAuthGuard } from '../../common/guards/foundation-auth.guard';

interface FoundationRequest {
  user: { sub: string; customerId: string; type: string };
}

/** Public catalogue + foundation customer auth & orders. */
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
@Controller('store')
export class StoreController {
  constructor(
    private storeService: StoreService,
    private productsService: ProductsService,
  ) {}

  @Get('products')
  findProducts() {
    return this.productsService.findStoreCatalog();
  }

  @Get('products/:id')
  async findProduct(@Param('id') id: string) {
    const product = await this.productsService.findStoreProduct(id);
<<<<<<< HEAD
    if (!product) {
      throw new NotFoundException('Product not found');
    }
=======
    if (!product) throw new NotFoundException('Product not found');
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    return product;
  }

  @Post('auth/register')
  register(@Body() dto: StoreRegisterDto) {
    return this.storeService.register(dto);
  }

  @Post('auth/login')
  login(@Body() dto: StoreLoginDto) {
    return this.storeService.login(dto);
  }

<<<<<<< HEAD
  @Post('auth/reset-password')
  resetPassword(@Body() dto: StoreResetPasswordDto) {
    return this.storeService.resetPassword(dto);
  }

=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  @Get('auth/me')
  @UseGuards(FoundationAuthGuard)
  me(@Req() req: FoundationRequest) {
    return this.storeService.getProfile(req.user.sub);
  }

<<<<<<< HEAD
  @Patch('auth/profile')
  @UseGuards(FoundationAuthGuard)
  updateProfile(@Req() req: FoundationRequest, @Body() dto: StoreUpdateProfileDto) {
    return this.storeService.updateProfile(req.user.sub, dto);
  }

=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  @Post('orders')
  @UseGuards(FoundationAuthGuard)
  placeOrder(@Req() req: FoundationRequest, @Body() dto: StorePlaceOrderDto) {
    return this.storeService.placeOrder(req.user.customerId, dto);
  }

  @Get('orders')
  @UseGuards(FoundationAuthGuard)
  getOrders(@Req() req: FoundationRequest) {
    return this.storeService.getOrders(req.user.customerId);
  }

<<<<<<< HEAD
  @Post('orders/:id/cancel')
  @UseGuards(FoundationAuthGuard)
  cancelOrder(@Req() req: FoundationRequest, @Param('id') id: string) {
    return this.storeService.cancelOrder(req.user.customerId, id);
  }

  @Post('contact')
  submitContact(@Body() dto: StoreContactDto) {
    return this.storeService.submitContact(dto);
  }

=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  @Get('invoices/:id/pdf')
  @UseGuards(FoundationAuthGuard)
  getInvoicePdf(
    @Req() req: FoundationRequest,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.storeService.getInvoicePdf(req.user.customerId, id, res);
  }

  @Get('notifications')
  @UseGuards(FoundationAuthGuard)
  getNotifications(@Req() req: FoundationRequest) {
    return this.storeService.getNotifications(req.user.customerId);
  }

  @Get('notifications/unread-count')
  @UseGuards(FoundationAuthGuard)
  async getUnreadCount(@Req() req: FoundationRequest) {
    const count = await this.storeService.getUnreadCount(req.user.customerId);
    return { count };
  }

  @Patch('notifications/read-all')
  @UseGuards(FoundationAuthGuard)
  markAllRead(@Req() req: FoundationRequest) {
    return this.storeService.markAllNotificationsRead(req.user.customerId);
  }

  @Patch('notifications/:id/read')
  @UseGuards(FoundationAuthGuard)
  markRead(@Req() req: FoundationRequest, @Param('id') id: string) {
    return this.storeService.markNotificationRead(req.user.customerId, id);
  }
}
