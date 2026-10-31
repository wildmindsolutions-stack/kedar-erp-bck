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
exports.DeliveryAreasController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const delivery_areas_service_1 = require("./delivery-areas.service");
const delivery_areas_dto_1 = require("./delivery-areas.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const require_permission_decorator_1 = require("../../common/decorators/require-permission.decorator");
const permissions_1 = require("../../common/permissions");
let DeliveryAreasController = class DeliveryAreasController {
    constructor(areasService) {
        this.areasService = areasService;
    }
    assertManager(user) {
        if (!(0, permissions_1.canManageDeliveryAreas)(user.role)) {
            throw new common_1.ForbiddenException('Only Owner, Admin or Manager can manage delivery areas');
        }
    }
    findAll() {
        return this.areasService.findAll();
    }
    findStaff(user) {
        this.assertManager(user);
        return this.areasService.findStaff();
    }
    create(body, user) {
        this.assertManager(user);
        return this.areasService.create(body);
    }
    setSupervisor(userId, body, user) {
        this.assertManager(user);
        return this.areasService.setExecutiveSupervisor(userId, body.supervisorId);
    }
    update(id, body, user) {
        this.assertManager(user);
        return this.areasService.update(id, body);
    }
};
exports.DeliveryAreasController = DeliveryAreasController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_READ),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeliveryAreasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('staff'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_READ),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DeliveryAreasController.prototype, "findStaff", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delivery_areas_dto_1.CreateDeliveryAreaDto, Object]),
    __metadata("design:returntype", void 0)
], DeliveryAreasController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('staff/:userId'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, delivery_areas_dto_1.SetSupervisorDto, Object]),
    __metadata("design:returntype", void 0)
], DeliveryAreasController.prototype, "setSupervisor", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permission_decorator_1.RequirePermission)(permissions_1.PERMISSIONS.DELIVERY_WRITE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, delivery_areas_dto_1.UpdateDeliveryAreaDto, Object]),
    __metadata("design:returntype", void 0)
], DeliveryAreasController.prototype, "update", null);
exports.DeliveryAreasController = DeliveryAreasController = __decorate([
    (0, common_1.Controller)('delivery-areas'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [delivery_areas_service_1.DeliveryAreasService])
], DeliveryAreasController);
//# sourceMappingURL=delivery-areas.controller.js.map