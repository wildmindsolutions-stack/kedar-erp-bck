import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class NoFieldDeliveryGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
