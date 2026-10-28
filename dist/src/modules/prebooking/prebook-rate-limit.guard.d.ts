import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class PrebookRateLimitGuard implements CanActivate {
    private hits;
    canActivate(context: ExecutionContext): boolean;
}
