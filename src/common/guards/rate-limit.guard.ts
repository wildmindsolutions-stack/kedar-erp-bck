import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

const WINDOW_MS = 60_000;
const RATE_LIMIT_KEY = 'rateLimitPerMinute';

/** Requests allowed per minute, per IP, per route. */
export const RateLimit = (perMinute: number) =>
  SetMetadata(RATE_LIMIT_KEY, perMinute);

/** Small in-memory limiter for public and login endpoints. Per-instance only. */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private hits = new Map<string, number[]>();

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const limit =
      this.reflector.get<number>(RATE_LIMIT_KEY, context.getHandler()) ?? 10;
    const req = context.switchToHttp().getRequest<Request>();
    const key = `${req.path}:${req.ip ?? 'unknown'}`;

    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter(
      (t) => now - t < WINDOW_MS,
    );
    if (recent.length >= limit) {
      throw new HttpException(
        'Too many requests. Please try again in a minute.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    recent.push(now);
    this.hits.set(key, recent);

    if (this.hits.size > 5000) {
      for (const [k, times] of this.hits) {
        if (!times.some((t) => now - t < WINDOW_MS)) this.hits.delete(k);
      }
    }
    return true;
  }
}
