import { Module } from '@nestjs/common';
import { DeliveryAreasController } from './delivery-areas.controller';
import { DeliveryAreasService } from './delivery-areas.service';

@Module({
  controllers: [DeliveryAreasController],
  providers: [DeliveryAreasService],
})
export class DeliveryAreasModule {}
