import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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

  async validate(payload: { sub: string; email: string; type?: string; customerId?: string }) {
    if (payload.type === 'foundation') {
      const account = await this.prisma.foundationAccount.findUnique({
        where: { id: payload.sub },
        include: { customer: true },
      });
      if (!account || !account.isActive || account.customer.isDeleted || !account.customer.isActive) {
        throw new UnauthorizedException();
      }
      return {
        sub: account.id,
        email: account.email,
        name: account.customer.name,
        customerId: account.customerId,
        type: 'foundation' as const,
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });
    if (!user || !user.isActive || !user.role.isActive) {
      throw new UnauthorizedException();
    }
    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      permissions: (user.role.permissions as string[]) || [],
      type: 'erp' as const,
    };
  }
}
