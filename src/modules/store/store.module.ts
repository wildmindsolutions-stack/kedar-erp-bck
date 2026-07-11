import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { SalesModule } from '../sales/sales.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductsModule, CustomersModule, SalesModule, AuthModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
