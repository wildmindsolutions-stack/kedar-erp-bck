import { Module } from '@nestjs/common';
import { PreBookingController } from './prebooking.controller';
import { PreBookingAdminController } from './prebooking-admin.controller';
import { PreBookingService } from './prebooking.service';
import { PrebookRateLimitGuard } from './prebook-rate-limit.guard';
import { CustomersModule } from '../customers/customers.module';
import { SalesModule } from '../sales/sales.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [CustomersModule, SalesModule, PaymentsModule],
  controllers: [PreBookingController, PreBookingAdminController],
  providers: [PreBookingService, PrebookRateLimitGuard],
})
export class PreBookingModule {}
