"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = void 0;
const common_1 = require("@nestjs/common");
<<<<<<< HEAD
const auth_module_1 = require("../auth/auth.module");
const customers_module_1 = require("../customers/customers.module");
const products_module_1 = require("../products/products.module");
const sales_module_1 = require("../sales/sales.module");
const store_controller_1 = require("./store.controller");
const store_service_1 = require("./store.service");
const foundation_jwt_strategy_1 = require("../../common/guards/foundation-jwt.strategy");
=======
const store_controller_1 = require("./store.controller");
const store_service_1 = require("./store.service");
const products_module_1 = require("../products/products.module");
const customers_module_1 = require("../customers/customers.module");
const sales_module_1 = require("../sales/sales.module");
const auth_module_1 = require("../auth/auth.module");
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
let StoreModule = class StoreModule {
};
exports.StoreModule = StoreModule;
exports.StoreModule = StoreModule = __decorate([
    (0, common_1.Module)({
<<<<<<< HEAD
        imports: [auth_module_1.AuthModule, customers_module_1.CustomersModule, products_module_1.ProductsModule, sales_module_1.SalesModule],
        controllers: [store_controller_1.StoreController],
        providers: [store_service_1.StoreService, foundation_jwt_strategy_1.FoundationJwtStrategy],
=======
        imports: [products_module_1.ProductsModule, customers_module_1.CustomersModule, sales_module_1.SalesModule, auth_module_1.AuthModule],
        controllers: [store_controller_1.StoreController],
        providers: [store_service_1.StoreService],
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    })
], StoreModule);
//# sourceMappingURL=store.module.js.map