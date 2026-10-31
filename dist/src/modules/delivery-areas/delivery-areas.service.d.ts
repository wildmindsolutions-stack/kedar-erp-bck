import { PrismaService } from '../../prisma/prisma.service';
import { CreateDeliveryAreaDto, UpdateDeliveryAreaDto } from './delivery-areas.dto';
export declare class DeliveryAreasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        supervisor: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        supervisorId: string | null;
        pincodes: string[];
    })[]>;
    findStaff(): Promise<{
        supervisors: {
            id: string;
            name: string;
            role: {
                name: string;
            };
            email: string;
            supervisorId: string | null;
        }[];
        executives: {
            id: string;
            name: string;
            role: {
                name: string;
            };
            email: string;
            supervisorId: string | null;
        }[];
    }>;
    private assertSupervisor;
    private assertPincodesFree;
    private routeOpenBookings;
    create(dto: CreateDeliveryAreaDto): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        supervisorId: string | null;
        pincodes: string[];
    }>;
    update(id: string, dto: UpdateDeliveryAreaDto): Promise<{
        supervisor: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        supervisorId: string | null;
        pincodes: string[];
    }>;
    setExecutiveSupervisor(userId: string, supervisorId?: string | null): Promise<{
        id: string;
        name: string;
        supervisorId: string | null;
    }>;
}
