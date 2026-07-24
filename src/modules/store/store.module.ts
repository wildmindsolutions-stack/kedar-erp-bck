import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { SalesModule } from '../sales/sales.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { FoundationJwtStrategy } from '../../common/guards/foundation-jwt.strategy';

@Module({
  imports: [AuthModule, CustomersModule, ProductsModule, SalesModule],
  controllers: [StoreController],
  providers: [StoreService, FoundationJwtStrategy],
})
export class StoreModule {}
