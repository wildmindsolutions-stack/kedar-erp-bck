import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PreBookingService } from './prebooking.service';
import {
  AssignExecutiveDto,
  FieldDeliverDto,
  ReasonDto,
  SetBookingAreaDto,
} from './prebooking.dto';
import {
  CurrentUser,
  JwtPayload,
} from '../../common/decorators/current-user.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PERMISSIONS } from '../../common/permissions';

/** Area-wise delivery: supervisor assigns, executive delivers. Results are scoped per user. */
@Controller('prebook-delivery')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class PreBookingDeliveryController {
  constructor(private preBookingService: PreBookingService) {}

  @Get('board')
  @RequirePermission(PERMISSIONS.DELIVERY_READ)
  board(@CurrentUser() user: JwtPayload) {
    return this.preBookingService.findDeliveryBoard(user);
  }

  @Get('executives')
  @RequirePermission(PERMISSIONS.DELIVERY_READ)
  executives(@CurrentUser() user: JwtPayload) {
    return this.preBookingService.findExecutives(user);
  }

  @Patch(':id/area')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  setArea(
    @Param('id') id: string,
    @Body() body: SetBookingAreaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.preBookingService.setArea(id, body.areaId, user);
  }

  @Patch(':id/assign')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  assign(
    @Param('id') id: string,
    @Body() body: AssignExecutiveDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.preBookingService.assignExecutive(id, body.executiveId, user);
  }

  @Patch(':id/out-for-delivery')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  outForDelivery(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.preBookingService.markOutForDelivery(id, user);
  }

  @Patch(':id/failed')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  failed(
    @Param('id') id: string,
    @Body() body: ReasonDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.preBookingService.failDelivery(id, user, body?.reason);
  }

  @Patch(':id/collect-cash')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  collectCash(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.preBookingService.collectCash(id, user);
  }

  @Patch(':id/cash-handover')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  cashHandover(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.preBookingService.confirmCashHandover(id, user);
  }

  @Patch(':id/delivered')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  delivered(
    @Param('id') id: string,
    @Body() body: FieldDeliverDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.preBookingService.fieldDeliver(
      id,
      user,
      body?.paymentReceived !== false,
    );
  }
}
