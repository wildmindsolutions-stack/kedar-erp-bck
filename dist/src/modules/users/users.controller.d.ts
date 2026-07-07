import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        role: {
            id: string;
            name: string;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        roleId: string;
        isActive: boolean;
    })[]>;
    findRoles(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(body: {
        name: string;
        email: string;
        password: string;
        roleId: string;
    }): Promise<{
        role: {
            id: string;
            name: string;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        roleId: string;
        isActive: boolean;
    }>;
    update(id: string, body: {
        name?: string;
        email?: string;
        roleId?: string;
        isActive?: boolean;
    }): Promise<{
        role: {
            id: string;
            name: string;
            permissions: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        roleId: string;
        isActive: boolean;
    }>;
    resetPassword(id: string, body: {
        password: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        roleId: string;
        isActive: boolean;
    }>;
}
