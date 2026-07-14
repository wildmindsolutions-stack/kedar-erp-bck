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
exports.StoreController = void 0;
const common_1 = require("@nestjs/common");
const store_service_1 = require("./store.service");
const products_service_1 = require("../products/products.service");
const store_dto_1 = require("./store.dto");
const foundation_auth_guard_1 = require("../../common/guards/foundation-auth.guard");
let StoreController = class StoreController {
    constructor(storeService, productsService) {
        this.storeService = storeService;
        this.productsService = productsService;
    }
    findProducts() {
        return this.productsService.findStoreCatalog();
    }
    async findProduct(id) {
        const product = await this.productsService.findStoreProduct(id);
<<<<<<< HEAD
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
=======
        if (!product)
            throw new common_1.NotFoundException('Product not found');
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
        return product;
    }
    register(dto) {
        return this.storeService.register(dto);
    }
    login(dto) {
        return this.storeService.login(dto);
    }
<<<<<<< HEAD
    resetPassword(dto) {
        return this.storeService.resetPassword(dto);
    }
    me(req) {
        return this.storeService.getProfile(req.user.sub);
    }
    updateProfile(req, dto) {
        return this.storeService.updateProfile(req.user.sub, dto);
    }
=======
    me(req) {
        return this.storeService.getProfile(req.user.sub);
    }
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    placeOrder(req, dto) {
        return this.storeService.placeOrder(req.user.customerId, dto);
    }
    getOrders(req) {
        return this.storeService.getOrders(req.user.customerId);
    }
<<<<<<< HEAD
    cancelOrder(req, id) {
        return this.storeService.cancelOrder(req.user.customerId, id);
    }
    submitContact(dto) {
        return this.storeService.submitContact(dto);
    }
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    getInvoicePdf(req, id, res) {
        return this.storeService.getInvoicePdf(req.user.customerId, id, res);
    }
    getNotifications(req) {
        return this.storeService.getNotifications(req.user.customerId);
    }
    async getUnreadCount(req) {
        const count = await this.storeService.getUnreadCount(req.user.customerId);
        return { count };
    }
    markAllRead(req) {
        return this.storeService.markAllNotificationsRead(req.user.customerId);
    }
    markRead(req, id) {
        return this.storeService.markNotificationRead(req.user.customerId, id);
    }
};
exports.StoreController = StoreController;
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "findProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "findProduct", null);
__decorate([
    (0, common_1.Post)('auth/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [store_dto_1.StoreRegisterDto]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [store_dto_1.StoreLoginDto]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "login", null);
__decorate([
<<<<<<< HEAD
    (0, common_1.Post)('auth/reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [store_dto_1.StoreResetPasswordDto]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "resetPassword", null);
__decorate([
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    (0, common_1.Get)('auth/me'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "me", null);
__decorate([
<<<<<<< HEAD
    (0, common_1.Patch)('auth/profile'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_dto_1.StoreUpdateProfileDto]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "updateProfile", null);
__decorate([
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, store_dto_1.StorePlaceOrderDto]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "getOrders", null);
__decorate([
<<<<<<< HEAD
    (0, common_1.Post)('orders/:id/cancel'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Post)('contact'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [store_dto_1.StoreContactDto]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "submitContact", null);
__decorate([
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
    (0, common_1.Get)('invoices/:id/pdf'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "getInvoicePdf", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('notifications/unread-count'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)('notifications/read-all'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "markAllRead", null);
__decorate([
    (0, common_1.Patch)('notifications/:id/read'),
    (0, common_1.UseGuards)(foundation_auth_guard_1.FoundationAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "markRead", null);
exports.StoreController = StoreController = __decorate([
    (0, common_1.Controller)('store'),
    __metadata("design:paramtypes", [store_service_1.StoreService,
        products_service_1.ProductsService])
], StoreController);
//# sourceMappingURL=store.controller.js.map