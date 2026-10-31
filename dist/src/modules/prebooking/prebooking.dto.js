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
exports.CustomerCancelDto = exports.ReasonDto = exports.FieldDeliverDto = exports.AssignExecutiveDto = exports.SetBookingAreaDto = exports.GenerateInvoiceDto = exports.CreatePreBookingDto = exports.PreBookingItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const phone_util_1 = require("../../common/utils/phone.util");
const indian_states_1 = require("../../common/constants/indian-states");
const trim = ({ value }) => typeof value === 'string' ? value.trim() : value;
class PreBookingItemDto {
}
exports.PreBookingItemDto = PreBookingItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PreBookingItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Quantity must be a whole number' }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(999),
    __metadata("design:type", Number)
], PreBookingItemDto.prototype, "qty", void 0);
class CreatePreBookingDto {
}
exports.CreatePreBookingDto = CreatePreBookingDto;
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 80, { message: 'Please enter your full name' }),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? (0, phone_util_1.normalizePhone)(value) : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[6-9]\d{9}$/, {
        message: 'Please enter a valid 10-digit mobile number',
    }),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "phone", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() === ''
        ? undefined
        : trim({ value })),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 300, { message: 'Please enter your full delivery address' }),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "address", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 60),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "city", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsIn)(indian_states_1.INDIAN_STATES, { message: 'Please select your state' }),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "state", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.Matches)(/^[1-9]\d{5}$/, { message: 'Please enter a valid 6-digit pincode' }),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "pincode", void 0);
__decorate([
    (0, class_transformer_1.Transform)(trim),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreBookingDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Please select at least one product' }),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PreBookingItemDto),
    __metadata("design:type", Array)
], CreatePreBookingDto.prototype, "items", void 0);
class GenerateInvoiceDto {
}
exports.GenerateInvoiceDto = GenerateInvoiceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GenerateInvoiceDto.prototype, "withGst", void 0);
class SetBookingAreaDto {
}
exports.SetBookingAreaDto = SetBookingAreaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SetBookingAreaDto.prototype, "areaId", void 0);
class AssignExecutiveDto {
}
exports.AssignExecutiveDto = AssignExecutiveDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignExecutiveDto.prototype, "executiveId", void 0);
class FieldDeliverDto {
}
exports.FieldDeliverDto = FieldDeliverDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FieldDeliverDto.prototype, "paymentReceived", void 0);
class ReasonDto {
}
exports.ReasonDto = ReasonDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ReasonDto.prototype, "reason", void 0);
class CustomerCancelDto {
}
exports.CustomerCancelDto = CustomerCancelDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CustomerCancelDto.prototype, "bookingNo", void 0);
//# sourceMappingURL=prebooking.dto.js.map