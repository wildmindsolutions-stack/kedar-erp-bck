import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const RateLimit: (perMinute: number) => import("@nestjs/common").CustomDecorator<string>;
export declare class RateLimitGuard implements CanActivate {
    private reflector;
    private hits;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
