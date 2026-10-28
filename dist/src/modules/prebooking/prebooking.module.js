"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreBookingModule = void 0;
const common_1 = require("@nestjs/common");
const prebooking_controller_1 = require("./prebooking.controller");
const prebooking_admin_controller_1 = require("./prebooking-admin.controller");
const prebooking_service_1 = require("./prebooking.service");
const prebook_rate_limit_guard_1 = require("./prebook-rate-limit.guard");
const customers_module_1 = require("../customers/customers.module");
const sales_module_1 = require("../sales/sales.module");
const payments_module_1 = require("../payments/payments.module");
let PreBookingModule = class PreBookingModule {
};
exports.PreBookingModule = PreBookingModule;
exports.PreBookingModule = PreBookingModule = __decorate([
    (0, common_1.Module)({
        imports: [customers_module_1.CustomersModule, sales_module_1.SalesModule, payments_module_1.PaymentsModule],
        controllers: [prebooking_controller_1.PreBookingController, prebooking_admin_controller_1.PreBookingAdminController],
        providers: [prebooking_service_1.PreBookingService, prebook_rate_limit_guard_1.PrebookRateLimitGuard],
    })
], PreBookingModule);
//# sourceMappingURL=prebooking.module.js.map