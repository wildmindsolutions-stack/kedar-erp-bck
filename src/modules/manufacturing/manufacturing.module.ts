import { Module } from '@nestjs/common';
import { ManufacturingService } from './manufacturing.service';
import { ManufacturingController } from './manufacturing.controller';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [SalesModule],
  controllers: [ManufacturingController],
  providers: [ManufacturingService],
  exports: [ManufacturingService],
})
export class ManufacturingModule {}
