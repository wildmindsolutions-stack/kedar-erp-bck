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
exports.PreBookingDeliveryController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const prebooking_service_1 = require("./prebooking.service");
const prebooking_dto_1 = require("./prebooking.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const require_permission_decorator_1 = require("../../common/decorators/require-permission.decorator");
const permissions_1 = require("../../common/permissions");
let PreBookingDeliveryController = class PreBookingDeliveryController {
    constructor(preBookingService) {
        this.preBookingService = preBookingService;
    }
    board(user) {
        return this.preBookingService.findDeliveryBoard(user);
    }
    executives(user) {
        return this.preBookingService.findExecutives(user);
    }
    setArea(id, body, user) {
        return this.preBookingService.setArea(id, body.areaId, user);
    }
    assign(id, body, user) {
        return this.preBookingService.assignExecutive(id, body.executiveId, user);
    }
    outForDelivery(id, user) {
        return this.preBookingService.markOutForDelivery(id, user);
    }
    failed(id, body, user) {
        return this.preBookingService.failDelivery(id, user, body?.reason);
    }
    collectCash(id, user) {
        return this.preBookingService.collectCash(id, user);
    }
    cashHandover(id, user) {
        return this.preBookingService.confirmCashHandover(id, user);
    }
    delivered(id, body, user) {
        return this.preBookingService.fieldDeliver(id, user, body?.paymentReceived !== false);
    }
};
exports.PreBookingDeliveryController = PreBookingDeliveryController;
__decorate([
    (0, common_1.Get)('board'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_READ),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "board", null);
__decorate([
    (0, common_1.Get)('executives'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_READ),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "executives", null);
__decorate([
    (0, common_1.Patch)(':id/area'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prebooking_dto_1.SetBookingAreaDto, Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "setArea", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prebooking_dto_1.AssignExecutiveDto, Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "assign", null);
__decorate([
    (0, common_1.Patch)(':id/out-for-delivery'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "outForDelivery", null);
__decorate([
    (0, common_1.Patch)(':id/failed'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prebooking_dto_1.ReasonDto, Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "failed", null);
__decorate([
    (0, common_1.Patch)(':id/collect-cash'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "collectCash", null);
__decorate([
    (0, common_1.Patch)(':id/cash-handover'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "cashHandover", null);
__decorate([
    (0, common_1.Patch)(':id/delivered'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prebooking_dto_1.FieldDeliverDto, Object]),
    __metadata("design:returntype", void 0)
], PreBookingDeliveryController.prototype, "delivered", null);
exports.PreBookingDeliveryController = PreBookingDeliveryController = __decorate([
    (0, common_1.Controller)('prebook-delivery'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [prebooking_service_1.PreBookingService])
], PreBookingDeliveryController);
//# sourceMappingURL=prebooking-delivery.controller.js.map