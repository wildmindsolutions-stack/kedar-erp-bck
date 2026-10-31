import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DELIVERY_EXECUTIVE,
  DELIVERY_SUPERVISOR,
} from '../../common/permissions';
import {
  CreateDeliveryAreaDto,
  UpdateDeliveryAreaDto,
} from './delivery-areas.dto';

const AREA_INCLUDE = { supervisor: { select: { id: true, name: true } } };

@Injectable()
export class DeliveryAreasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.deliveryArea.findMany({
      include: AREA_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async findStaff() {
    const staff = await this.prisma.user.findMany({
      where: {
        isActive: true,
        role: { name: { in: [DELIVERY_SUPERVISOR, DELIVERY_EXECUTIVE] } },
      },
      select: {
        id: true,
        name: true,
        email: true,
        supervisorId: true,
        role: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });
    return {
      supervisors: staff.filter((u) => u.role.name === DELIVERY_SUPERVISOR),
      executives: staff.filter((u) => u.role.name === DELIVERY_EXECUTIVE),
    };
  }

  private async assertSupervisor(supervisorId?: string | null) {
    if (!supervisorId) return;
    const supervisor = await this.prisma.user.findFirst({
      where: {
        id: supervisorId,
        isActive: true,
        role: { name: DELIVERY_SUPERVISOR },
      },
    });
    if (!supervisor) {
      throw new BadRequestException('Select an active Delivery Supervisor');
    }
  }

  /** One pincode routes to exactly one area. */
  private async assertPincodesFree(pincodes: string[], excludeAreaId?: string) {
    if (!pincodes.length) return;
    const clash = await this.prisma.deliveryArea.findFirst({
      where: {
        isActive: true,
        pincodes: { hasSome: pincodes },
        ...(excludeAreaId ? { id: { not: excludeAreaId } } : {}),
      },
    });
    if (clash) {
      const shared = clash.pincodes.filter((p) => pincodes.includes(p));
      throw new BadRequestException(
        `Pincode ${shared.join(', ')} already belongs to ${clash.name}`,
      );
    }
  }

  /** Open orders that had no area when booked join as soon as an area covers their pincode. */
  private async routeOpenBookings(area: {
    id: string;
    pincodes: string[];
    supervisorId: string | null;
    isActive: boolean;
  }) {
    if (!area.isActive || !area.pincodes.length) return;
    await this.prisma.preBooking.updateMany({
      where: {
        areaId: null,
        pincode: { in: area.pincodes },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      data: { areaId: area.id, supervisorId: area.supervisorId },
    });
  }

  async create(dto: CreateDeliveryAreaDto) {
    await this.assertSupervisor(dto.supervisorId);
    const pincodes = [...new Set(dto.pincodes)];
    await this.assertPincodesFree(pincodes);
    const area = await this.prisma.deliveryArea.create({
      data: {
        name: dto.name,
        pincodes,
        supervisorId: dto.supervisorId || null,
      },
      include: AREA_INCLUDE,
    });
    await this.routeOpenBookings(area);
    return area;
  }

  async update(id: string, dto: UpdateDeliveryAreaDto) {
    const area = await this.prisma.deliveryArea.findUnique({ where: { id } });
    if (!area) throw new NotFoundException('Delivery area not found');
    await this.assertSupervisor(dto.supervisorId);
    const pincodes = dto.pincodes ? [...new Set(dto.pincodes)] : undefined;
    if (pincodes) await this.assertPincodesFree(pincodes, id);

    const supervisorChanged =
      dto.supervisorId !== undefined &&
      (dto.supervisorId || null) !== area.supervisorId;
    const updated = await this.prisma.deliveryArea.update({
      where: { id },
      data: {
        name: dto.name,
        pincodes,
        isActive: dto.isActive,
        supervisorId:
          dto.supervisorId === undefined ? undefined : dto.supervisorId || null,
      },
      include: AREA_INCLUDE,
    });

    // Orders not yet given to an executive move to the new supervisor
    if (supervisorChanged) {
      await this.prisma.preBooking.updateMany({
        where: {
          areaId: id,
          executiveId: null,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        data: { supervisorId: updated.supervisorId },
      });
    }
    await this.routeOpenBookings(updated);
    return updated;
  }

  async setExecutiveSupervisor(userId: string, supervisorId?: string | null) {
    const executive = await this.prisma.user.findFirst({
      where: { id: userId, role: { name: DELIVERY_EXECUTIVE } },
    });
    if (!executive) throw new NotFoundException('Delivery executive not found');
    await this.assertSupervisor(supervisorId);
    return this.prisma.user.update({
      where: { id: userId },
      data: { supervisorId: supervisorId || null },
      select: { id: true, name: true, supervisorId: true },
    });
  }
}
