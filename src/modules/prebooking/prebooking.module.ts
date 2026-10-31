import { Module } from '@nestjs/common';
import { PreBookingController } from './prebooking.controller';
import { PreBookingAdminController } from './prebooking-admin.controller';
import { PreBookingDeliveryController } from './prebooking-delivery.controller';
import { PreBookingService } from './prebooking.service';
import { CustomersModule } from '../customers/customers.module';
import { SalesModule } from '../sales/sales.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [CustomersModule, SalesModule, PaymentsModule],
  controllers: [
    PreBookingController,
    PreBookingAdminController,
    PreBookingDeliveryController,
  ],
  providers: [PreBookingService],
})
export class PreBookingModule {}
