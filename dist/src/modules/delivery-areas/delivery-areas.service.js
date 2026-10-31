"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryAreasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const permissions_1 = require("../../common/permissions");
const AREA_INCLUDE = { supervisor: { select: { id: true, name: true } } };
let DeliveryAreasService = class DeliveryAreasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
                role: { name: { in: [permissions_1.DELIVERY_SUPERVISOR, permissions_1.DELIVERY_EXECUTIVE] } },
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
            supervisors: staff.filter((u) => u.role.name === permissions_1.DELIVERY_SUPERVISOR),
            executives: staff.filter((u) => u.role.name === permissions_1.DELIVERY_EXECUTIVE),
        };
    }
    async assertSupervisor(supervisorId) {
        if (!supervisorId)
            return;
        const supervisor = await this.prisma.user.findFirst({
            where: {
                id: supervisorId,
                isActive: true,
                role: { name: permissions_1.DELIVERY_SUPERVISOR },
            },
        });
        if (!supervisor) {
            throw new common_1.BadRequestException('Select an active Delivery Supervisor');
        }
    }
    async assertPincodesFree(pincodes, excludeAreaId) {
        if (!pincodes.length)
            return;
        const clash = await this.prisma.deliveryArea.findFirst({
            where: {
                isActive: true,
                pincodes: { hasSome: pincodes },
                ...(excludeAreaId ? { id: { not: excludeAreaId } } : {}),
            },
        });
        if (clash) {
            const shared = clash.pincodes.filter((p) => pincodes.includes(p));
            throw new common_1.BadRequestException(`Pincode ${shared.join(', ')} already belongs to ${clash.name}`);
        }
    }
    async routeOpenBookings(area) {
        if (!area.isActive || !area.pincodes.length)
            return;
        await this.prisma.preBooking.updateMany({
            where: {
                areaId: null,
                pincode: { in: area.pincodes },
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
            data: { areaId: area.id, supervisorId: area.supervisorId },
        });
    }
    async create(dto) {
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
    async update(id, dto) {
        const area = await this.prisma.deliveryArea.findUnique({ where: { id } });
        if (!area)
            throw new common_1.NotFoundException('Delivery area not found');
        await this.assertSupervisor(dto.supervisorId);
        const pincodes = dto.pincodes ? [...new Set(dto.pincodes)] : undefined;
        if (pincodes)
            await this.assertPincodesFree(pincodes, id);
        const supervisorChanged = dto.supervisorId !== undefined &&
            (dto.supervisorId || null) !== area.supervisorId;
        const updated = await this.prisma.deliveryArea.update({
            where: { id },
            data: {
                name: dto.name,
                pincodes,
                isActive: dto.isActive,
                supervisorId: dto.supervisorId === undefined ? undefined : dto.supervisorId || null,
            },
            include: AREA_INCLUDE,
        });
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
    async setExecutiveSupervisor(userId, supervisorId) {
        const executive = await this.prisma.user.findFirst({
            where: { id: userId, role: { name: permissions_1.DELIVERY_EXECUTIVE } },
        });
        if (!executive)
            throw new common_1.NotFoundException('Delivery executive not found');
        await this.assertSupervisor(supervisorId);
        return this.prisma.user.update({
            where: { id: userId },
            data: { supervisorId: supervisorId || null },
            select: { id: true, name: true, supervisorId: true },
        });
    }
};
exports.DeliveryAreasService = DeliveryAreasService;
exports.DeliveryAreasService = DeliveryAreasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliveryAreasService);
//# sourceMappingURL=delivery-areas.service.js.map