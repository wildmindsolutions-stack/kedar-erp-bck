import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

/**
 * Small in-memory per-IP limiter for the public pre-booking form
 * (the only unauthenticated write endpoint). Per-instance only.
 */
@Injectable()
export class PrebookRateLimitGuard implements CanActivate {
  private hits = new Map<string, number[]>();

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded)
        ?.split(',')[0]
        .trim() ||
      req.ip ||
      'unknown';

    const now = Date.now();
    const recent = (this.hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_REQUESTS) {
      throw new HttpException(
        'Too many requests. Please try again in a minute.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    recent.push(now);
    this.hits.set(ip, recent);

    if (this.hits.size > 5000) {
      for (const [key, times] of this.hits) {
        if (!times.some((t) => now - t < WINDOW_MS)) this.hits.delete(key);
      }
    }
    return true;
  }
}
