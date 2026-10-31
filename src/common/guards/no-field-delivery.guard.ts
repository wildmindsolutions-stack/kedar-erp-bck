import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isFieldDeliveryRole } from '../permissions';

/** Keeps field staff out of the company-wide challan list. */
@Injectable()
export class NoFieldDeliveryGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (isFieldDeliveryRole(user?.role)) {
      throw new ForbiddenException(
        'Use the delivery board for your assigned orders',
      );
    }
    return true;
  }
}
