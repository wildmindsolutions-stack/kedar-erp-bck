import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PreBookingService } from './prebooking.service';
import { CreatePreBookingDto } from './prebooking.dto';
import { PrebookRateLimitGuard } from './prebook-rate-limit.guard';

/** Public website pre-booking (guest, cash on delivery). */
@Controller('prebook')
export class PreBookingController {
  constructor(private preBookingService: PreBookingService) {}

  @Get('products')
  findProducts() {
    return this.preBookingService.findProducts();
  }

  @Post()
  @UseGuards(PrebookRateLimitGuard)
  create(@Body() dto: CreatePreBookingDto) {
    return this.preBookingService.create(dto);
  }

  /** Booking numbers contain slashes (PB/2026-27/0001), so they go in the query string. */
  @Get('receipt')
  getReceipt(
    @Query('bookingNo') bookingNo: string,
    @Query('phone') phone: string,
  ) {
    return this.preBookingService.getReceipt(bookingNo, phone);
  }
}
