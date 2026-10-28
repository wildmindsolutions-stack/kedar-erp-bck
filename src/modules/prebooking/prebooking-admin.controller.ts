import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PreBookingService } from './prebooking.service';
import {
  ConfirmPreBookingDto,
  DeliverPreBookingDto,
  GenerateInvoiceDto,
} from './prebooking.dto';
import {
  CurrentUser,
  JwtPayload,
} from '../../common/decorators/current-user.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PERMISSIONS, canConfirmSalesOrders } from '../../common/permissions';

@Controller('prebookings')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class PreBookingAdminController {
  constructor(private preBookingService: PreBookingService) {}

  @Get()
  @RequirePermission(PERMISSIONS.SALES_READ)
  findAll(@Query('status') status?: string) {
    return this.preBookingService.findAll(status);
  }

  @Post(':id/confirm')
  @RequirePermission(PERMISSIONS.SALES_WRITE)
  confirm(
    @Param('id') id: string,
    @Body() body: ConfirmPreBookingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.preBookingService.confirm(id, user.sub, {
      generateInvoice: body?.generateInvoice === true,
      withGst: body?.withGst !== false,
    });
  }

  @Post(':id/generate-invoice')
  @RequirePermission(PERMISSIONS.SALES_WRITE)
  generateInvoice(
    @Param('id') id: string,
    @Body() body: GenerateInvoiceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!canConfirmSalesOrders(user.role)) {
      throw new ForbiddenException(
        'Only Accountant or Manager can generate official invoices',
      );
    }
    return this.preBookingService.generateInvoice(
      id,
      user.sub,
      body?.withGst !== false,
    );
  }

  @Patch(':id/delivered')
  @RequirePermission(PERMISSIONS.SALES_WRITE)
  markDelivered(
    @Param('id') id: string,
    @Body() body: DeliverPreBookingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.preBookingService.markDelivered(id, user.sub, {
      paymentReceived: body?.paymentReceived !== false,
      generateInvoice: body?.generateInvoice === true,
      withGst: body?.withGst !== false,
    });
  }

  @Patch(':id/cancel')
  @RequirePermission(PERMISSIONS.SALES_WRITE)
  cancel(@Param('id') id: string) {
    return this.preBookingService.cancel(id);
  }
}
