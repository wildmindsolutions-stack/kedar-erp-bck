import { Global, Module } from '@nestjs/common';
import { CustomerNotificationsService } from './customer-notifications.service';

@Global()
@Module({
  providers: [CustomerNotificationsService],
  exports: [CustomerNotificationsService],
})
export class CustomerNotificationsModule {}
