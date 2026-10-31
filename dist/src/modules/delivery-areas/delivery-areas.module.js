"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryAreasModule = void 0;
const common_1 = require("@nestjs/common");
const delivery_areas_controller_1 = require("./delivery-areas.controller");
const delivery_areas_service_1 = require("./delivery-areas.service");
let DeliveryAreasModule = class DeliveryAreasModule {
};
exports.DeliveryAreasModule = DeliveryAreasModule;
exports.DeliveryAreasModule = DeliveryAreasModule = __decorate([
    (0, common_1.Module)({
        controllers: [delivery_areas_controller_1.DeliveryAreasController],
        providers: [delivery_areas_service_1.DeliveryAreasService],
    })
], DeliveryAreasModule);
//# sourceMappingURL=delivery-areas.module.js.map