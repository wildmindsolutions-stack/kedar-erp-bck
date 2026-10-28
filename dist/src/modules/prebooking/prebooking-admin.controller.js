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
exports.PreBookingAdminController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const prebooking_service_1 = require("./prebooking.service");
const prebooking_dto_1 = require("./prebooking.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const require_permission_decorator_1 = require("../../common/decorators/require-permission.decorator");
const permissions_1 = require("../../common/permissions");
let PreBookingAdminController = class PreBookingAdminController {
    constructor(preBookingService) {
        this.preBookingService = preBookingService;
    }
    findAll(status) {
        return this.preBookingService.findAll(status);
    }
    confirm(id, body, user) {
        return this.preBookingService.confirm(id, user.sub, {
            generateInvoice: body?.generateInvoice === true,
            withGst: body?.withGst !== false,
        });
    }
    generateInvoice(id, body, user) {
        if (!(0, permissions_1.canConfirmSalesOrders)(user.role)) {
            throw new common_1.ForbiddenException('Only Accountant or Manager can generate official invoices');
        }
        return this.preBookingService.generateInvoice(id, user.sub, body?.withGst !== false);
    }
    markDelivered(id, body, user) {
        return this.preBookingService.markDelivered(id, user.sub, {
            paymentReceived: body?.paymentReceived !== false,
            generateInvoice: body?.generateInvoice === true,
            withGst: body?.withGst !== false,
        });
    }
    cancel(id) {
        return this.preBookingService.cancel(id);
    }
};
exports.PreBookingAdminController = PreBookingAdminController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.SALES_READ),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PreBookingAdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.SALES_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prebooking_dto_1.ConfirmPreBookingDto, Object]),
    __metadata("design:returntype", void 0)
], PreBookingAdminController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/generate-invoice'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.SALES_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prebooking_dto_1.GenerateInvoiceDto, Object]),
    __metadata("design:returntype", void 0)
], PreBookingAdminController.prototype, "generateInvoice", null);
__decorate([
    (0, common_1.Patch)(':id/delivered'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.SALES_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prebooking_dto_1.DeliverPreBookingDto, Object]),
    __metadata("design:returntype", void 0)
], PreBookingAdminController.prototype, "markDelivered", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.SALES_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PreBookingAdminController.prototype, "cancel", null);
exports.PreBookingAdminController = PreBookingAdminController = __decorate([
    (0, common_1.Controller)('prebookings'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [prebooking_service_1.PreBookingService])
], PreBookingAdminController);
//# sourceMappingURL=prebooking-admin.controller.js.map