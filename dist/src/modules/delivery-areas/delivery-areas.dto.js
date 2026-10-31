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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetSupervisorDto = exports.UpdateDeliveryAreaDto = exports.CreateDeliveryAreaDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const trim = ({ value }) => typeof value === 'string' ? value.trim() : value;
class CreateDeliveryAreaDto {
}
exports.CreateDeliveryAreaDto = CreateDeliveryAreaDto;
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 80),
    __metadata("design:type", String)
], CreateDeliveryAreaDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(500),
    (0, class_validator_1.Matches)(/^[1-9]\d{5}$/, {
        each: true,
        message: 'Each pincode must be 6 digits',
    }),
    __metadata("design:type", Array)
], CreateDeliveryAreaDto.prototype, "pincodes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateDeliveryAreaDto.prototype, "supervisorId", void 0);
class UpdateDeliveryAreaDto {
}
exports.UpdateDeliveryAreaDto = UpdateDeliveryAreaDto;
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 80),
    __metadata("design:type", String)
], UpdateDeliveryAreaDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(500),
    (0, class_validator_1.Matches)(/^[1-9]\d{5}$/, {
        each: true,
        message: 'Each pincode must be 6 digits',
    }),
    __metadata("design:type", Array)
], UpdateDeliveryAreaDto.prototype, "pincodes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UpdateDeliveryAreaDto.prototype, "supervisorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDeliveryAreaDto.prototype, "isActive", void 0);
class SetSupervisorDto {
}
exports.SetSupervisorDto = SetSupervisorDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], SetSupervisorDto.prototype, "supervisorId", void 0);
//# sourceMappingURL=delivery-areas.dto.js.map