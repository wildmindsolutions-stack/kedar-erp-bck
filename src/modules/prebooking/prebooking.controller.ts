import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PreBookingService } from './prebooking.service';
import { CreatePreBookingDto, CustomerCancelDto } from './prebooking.dto';
import {
  RateLimit,
  RateLimitGuard,
} from '../../common/guards/rate-limit.guard';
import { FoundationAuthGuard } from '../../common/guards/foundation-auth.guard';

interface FoundationRequest {
  user: { customerId: string };
}

/** Website pre-booking (cash on delivery). Browsing is public; ordering needs a customer login. */
@Controller('prebook')
export class PreBookingController {
  constructor(private preBookingService: PreBookingService) {}

  @Get('products')
  findProducts() {
    return this.preBookingService.findProducts();
  }

  @Get('pincode')
  async checkPincode(@Query('pincode') pincode: string) {
    const { serviceable, area } =
      await this.preBookingService.checkPincode(pincode);
    return { serviceable, area };
  }

  @Post()
  @UseGuards(FoundationAuthGuard, RateLimitGuard)
  @RateLimit(5)
  create(@Req() req: FoundationRequest, @Body() dto: CreatePreBookingDto) {
    return this.preBookingService.create(req.user.customerId, dto);
  }

  @Get('mine')
  @UseGuards(FoundationAuthGuard)
  findMine(@Req() req: FoundationRequest) {
    return this.preBookingService.findMine(req.user.customerId);
  }

  /** Booking numbers contain slashes (PB/2026-27/0001), so they go in the query string. */
  @Post('mine/cancel')
  @UseGuards(FoundationAuthGuard)
  cancelMine(@Req() req: FoundationRequest, @Body() dto: CustomerCancelDto) {
    return this.preBookingService.cancelByCustomer(
      req.user.customerId,
      dto.bookingNo,
    );
  }

  @Get('receipt')
  @UseGuards(RateLimitGuard)
  @RateLimit(20)
  getReceipt(
    @Query('bookingNo') bookingNo: string,
    @Query('phone') phone: string,
  ) {
    return this.preBookingService.getReceipt(bookingNo, phone);
  }
}
