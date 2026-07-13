import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FoundationJwtStrategy extends PassportStrategy(Strategy, 'foundation-jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'kedar-erp-secret',
    });
  }

  async validate(payload: { sub: string; type?: string; customerId?: string }) {
    if (payload.type !== 'foundation') {
      throw new UnauthorizedException();
    }

    const account = await this.prisma.foundationAccount.findUnique({
      where: { id: payload.sub },
      include: { customer: true },
    });

    if (
      !account
      || !account.isActive
      || account.customer.isDeleted
      || !account.customer.isActive
    ) {
      throw new UnauthorizedException();
    }

    return {
      sub: account.id,
      email: account.email,
      customerId: account.customerId,
      type: 'foundation' as const,
    };
  }
}
