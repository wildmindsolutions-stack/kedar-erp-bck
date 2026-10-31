import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeliveryAreasService } from './delivery-areas.service';
import {
  CreateDeliveryAreaDto,
  SetSupervisorDto,
  UpdateDeliveryAreaDto,
} from './delivery-areas.dto';
import {
  CurrentUser,
  JwtPayload,
} from '../../common/decorators/current-user.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PERMISSIONS, canManageDeliveryAreas } from '../../common/permissions';

@Controller('delivery-areas')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class DeliveryAreasController {
  constructor(private areasService: DeliveryAreasService) {}

  private assertManager(user: JwtPayload) {
    if (!canManageDeliveryAreas(user.role)) {
      throw new ForbiddenException(
        'Only Owner, Admin or Manager can manage delivery areas',
      );
    }
  }

  @Get()
  @RequirePermission(PERMISSIONS.DELIVERY_READ)
  findAll() {
    return this.areasService.findAll();
  }

  @Get('staff')
  @RequirePermission(PERMISSIONS.DELIVERY_READ)
  findStaff(@CurrentUser() user: JwtPayload) {
    this.assertManager(user);
    return this.areasService.findStaff();
  }

  @Post()
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  create(@Body() body: CreateDeliveryAreaDto, @CurrentUser() user: JwtPayload) {
    this.assertManager(user);
    return this.areasService.create(body);
  }

  @Patch('staff/:userId')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  setSupervisor(
    @Param('userId') userId: string,
    @Body() body: SetSupervisorDto,
    @CurrentUser() user: JwtPayload,
  ) {
    this.assertManager(user);
    return this.areasService.setExecutiveSupervisor(userId, body.supervisorId);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.DELIVERY_WRITE)
  update(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryAreaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    this.assertManager(user);
    return this.areasService.update(id, body);
  }
}
