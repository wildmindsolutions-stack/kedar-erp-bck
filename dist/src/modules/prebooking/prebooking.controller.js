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
const rate_limit_guard_1 = require("../../common/guards/rate-limit.guard");
const foundation_auth_guard_1 = require("../../common/guards/foundation-auth.guard");
let PreBookingController = class PreBookingController {
    constructor(preBookingService) {
        this.preBookingService = preBookingService;
    }
    findProducts() {
        return this.preBookingService.findProducts();
    }
    async checkPincode(pincode) {
        const { serviceable, area } = await this.preBookingService.checkPincode(pincode);
        return { serviceable, area };
    }
    create(req, dto) {
        return this.preBookingService.create(req.user.customerId, dto);
    }
    findMine(req) {
        return this.preBookingService.findMine(req.user.customerId);
    }
    cancelMine(req, dto) {
        return this.preBookingService.cancelByCustomer(req.user.customerId, dto.bookingNo);
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
    (0, common_1.Get)('pincode'),
    __param(0, (0, common_1.Query)('pincode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PreBookingController.prototype, "checkPincode", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard, rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_guard_1.RateLimit)(5),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, prebooking_dto_1.CreatePreBookingDto]),
    __metadata("design:returntype", void 0)
], PreBookingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PreBookingController.prototype, "findMine", null);
__decorate([
    (0, common_1.Post)('mine/cancel'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, prebooking_dto_1.CustomerCancelDto]),
    __metadata("design:returntype", void 0)
], PreBookingController.prototype, "cancelMine", null);
__decorate([
    (0, common_1.Get)('receipt'),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, rate_limit_guard_1.RateLimit)(20),
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