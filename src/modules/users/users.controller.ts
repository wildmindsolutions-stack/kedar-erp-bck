import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('Owner', 'Admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @Roles('Owner', 'Admin')
  findRoles() {
    return this.usersService.findRoles();
  }

  @Post()
  @Roles('Owner', 'Admin')
  create(@Body() body: { name: string; email: string; password: string; roleId: string }) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  @Roles('Owner', 'Admin')
  update(@Param('id') id: string, @Body() body: { name?: string; email?: string; roleId?: string; isActive?: boolean }) {
    return this.usersService.update(id, body);
  }

  @Post(':id/reset-password')
  @Roles('Owner', 'Admin')
  resetPassword(@Param('id') id: string, @Body() body: { password: string }) {
    return this.usersService.resetPassword(id, body.password);
  }
}
