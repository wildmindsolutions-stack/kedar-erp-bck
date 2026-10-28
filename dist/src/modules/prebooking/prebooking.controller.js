"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreBookingController = void 0;
const common_1 = require("@nestjs/common");
const prebooking_service_1 = require("./prebooking.service");
const prebooking_dto_1 = require("./prebooking.dto");
const prebook_rate_limit_guard_1 = require("./prebook-rate-limit.guard");
let PreBookingController = class PreBookingController {
    constructor(preBookingService) {
        this.preBookingService = preBookingService;
    }
    findProducts() {
        return this.preBookingService.findProducts();
    }
    create(dto) {
        return this.preBookingService.create(dto);
    }
    getReceipt(bookingNo, phone) {
        return this.preBookingService.getReceipt(bookingNo, phone);
    }
};
exports.PreBookingController = PreBookingController;
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PreBookingController.prototype, "findProducts", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(prebook_rate_limit_guard_1.PrebookRateLimitGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prebooking_dto_1.CreatePreBookingDto]),
    __metadata("design:returntype", void 0)
], PreBookingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('receipt'),
    __param(0, (0, common_1.Query)('bookingNo')),
    __param(1, (0, common_1.Query)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PreBookingController.prototype, "getReceipt", null);
exports.PreBookingController = PreBookingController = __decorate([
    (0, common_1.Controller)('prebook'),
    __metadata("design:paramtypes", [prebooking_service_1.PreBookingService])
], PreBookingController);
//# sourceMappingURL=prebooking.controller.js.map