import { DeliveryAreasService } from './delivery-areas.service';
import { CreateDeliveryAreaDto, SetSupervisorDto, UpdateDeliveryAreaDto } from './delivery-areas.dto';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class DeliveryAreasController {
    private areasService;
    constructor(areasService: DeliveryAreasService);
    private assertManager;
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
    findStaff(user: JwtPayload): Promise<{
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
    create(body: CreateDeliveryAreaDto, user: JwtPayload): Promise<{
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
    setSupervisor(userId: string, body: SetSupervisorDto, user: JwtPayload): Promise<{
        id: string;
        name: string;
        supervisorId: string | null;
    }>;
    update(id: string, body: UpdateDeliveryAreaDto, user: JwtPayload): Promise<{
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
}
