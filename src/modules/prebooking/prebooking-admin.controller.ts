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
import { GenerateInvoiceDto, ReasonDto } from './prebooking.dto';
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

  @Get('summary')
  @RequirePermission(PERMISSIONS.DASHBOARD_READ)
  summary() {
    return this.preBookingService.getSummary();
  }

  @Post(':id/confirm')
  @RequirePermission(PERMISSIONS.SALES_WRITE)
  confirm(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.preBookingService.confirm(id, user.sub);
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

  @Patch(':id/cancel')
  @RequirePermission(PERMISSIONS.SALES_WRITE)
  cancel(@Param('id') id: string, @Body() body: ReasonDto) {
    return this.preBookingService.cancel(id, body?.reason);
  }
}
