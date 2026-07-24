import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FoundationAuthGuard extends AuthGuard('foundation-jwt') {}
