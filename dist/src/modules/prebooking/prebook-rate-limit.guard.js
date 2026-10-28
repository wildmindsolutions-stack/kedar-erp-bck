"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrebookRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
let PrebookRateLimitGuard = class PrebookRateLimitGuard {
    constructor() {
        this.hits = new Map();
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const forwarded = req.headers['x-forwarded-for'];
        const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
            ?.split(',')[0]
            .trim() ||
            req.ip ||
            'unknown';
        const now = Date.now();
        const recent = (this.hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
        if (recent.length >= MAX_REQUESTS) {
            throw new common_1.HttpException('Too many requests. Please try again in a minute.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        recent.push(now);
        this.hits.set(ip, recent);
        if (this.hits.size > 5000) {
            for (const [key, times] of this.hits) {
                if (!times.some((t) => now - t < WINDOW_MS))
                    this.hits.delete(key);
            }
        }
        return true;
    }
};
exports.PrebookRateLimitGuard = PrebookRateLimitGuard;
exports.PrebookRateLimitGuard = PrebookRateLimitGuard = __decorate([
    (0, common_1.Injectable)()
], PrebookRateLimitGuard);
//# sourceMappingURL=prebook-rate-limit.guard.js.map