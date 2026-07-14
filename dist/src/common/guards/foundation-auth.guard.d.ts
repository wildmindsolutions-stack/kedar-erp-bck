<<<<<<< HEAD
declare const FoundationAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class FoundationAuthGuard extends FoundationAuthGuard_base {
=======
import { ExecutionContext } from '@nestjs/common';
declare const FoundationAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class FoundationAuthGuard extends FoundationAuthGuard_base {
    handleRequest<TUser = {
        type: string;
    }>(err: Error | null, user: TUser | false, _info: unknown, _context: ExecutionContext): TUser;
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
}
export {};
