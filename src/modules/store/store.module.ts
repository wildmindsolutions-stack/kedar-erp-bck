import { Module } from '@nestjs/common';
<<<<<<< HEAD
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
=======
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
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
})
export class StoreModule {}
