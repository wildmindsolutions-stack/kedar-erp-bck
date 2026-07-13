"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundationAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let FoundationAuthGuard = class FoundationAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    handleRequest(err, user, _info, _context) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Please log in to continue');
        }
        if (user.type !== 'foundation') {
            throw new common_1.UnauthorizedException('Please log in with your Kedar Foundation customer account');
        }
        return user;
    }
};
exports.FoundationAuthGuard = FoundationAuthGuard;
exports.FoundationAuthGuard = FoundationAuthGuard = __decorate([
    (0, common_1.Injectable)()
], FoundationAuthGuard);
//# sourceMappingURL=foundation-auth.guard.js.map