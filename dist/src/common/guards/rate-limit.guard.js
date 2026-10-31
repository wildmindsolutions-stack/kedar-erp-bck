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
exports.RateLimitGuard = exports.RateLimit = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const WINDOW_MS = 60_000;
const RATE_LIMIT_KEY = 'rateLimitPerMinute';
const RateLimit = (perMinute) => (0, common_1.SetMetadata)(RATE_LIMIT_KEY, perMinute);
exports.RateLimit = RateLimit;
let RateLimitGuard = class RateLimitGuard {
    constructor(reflector) {
        this.reflector = reflector;
        this.hits = new Map();
    }
    canActivate(context) {
        const limit = this.reflector.get(RATE_LIMIT_KEY, context.getHandler()) ?? 10;
        const req = context.switchToHttp().getRequest();
        const key = `${req.path}:${req.ip ?? 'unknown'}`;
        const now = Date.now();
        const recent = (this.hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
        if (recent.length >= limit) {
            throw new common_1.HttpException('Too many requests. Please try again in a minute.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        recent.push(now);
        this.hits.set(key, recent);
        if (this.hits.size > 5000) {
            for (const [k, times] of this.hits) {
                if (!times.some((t) => now - t < WINDOW_MS))
                    this.hits.delete(k);
            }
        }
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map