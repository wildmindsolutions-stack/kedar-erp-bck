import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findRoles() {
    return this.prisma.role.findMany({ orderBy: { name: 'asc' } });
  }

  async create(data: { name: string; email: string; password: string; roleId: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, passwordHash },
      include: { role: true },
    });
  }

  async update(id: string, data: { name?: string; email?: string; roleId?: string; isActive?: boolean }) {
    return this.prisma.user.update({ where: { id }, data, include: { role: true } });
  }

  async resetPassword(id: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }
}
