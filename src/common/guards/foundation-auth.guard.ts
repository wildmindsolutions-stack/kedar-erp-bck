<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FoundationAuthGuard extends AuthGuard('foundation-jwt') {}
=======
import {
  Injectable, ExecutionContext, UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FoundationAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = { type: string }>(
    err: Error | null,
    user: TUser | false,
    _info: unknown,
    _context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Please log in to continue');
    }
    if ((user as { type?: string }).type !== 'foundation') {
      throw new UnauthorizedException('Please log in with your Kedar Foundation customer account');
    }
    return user;
  }
}
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
