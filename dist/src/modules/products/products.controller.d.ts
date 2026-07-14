import { ProductsService } from './products.service';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<{
        price: number;
        gstRate: number;
        lowStockThreshold: number;
        stock: number;
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
        unit: {
            symbol: string;
            id: string;
            name: string;
            createdAt: Date;
        };
        id: string;
        name: string;
        isActive: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        unitId: string;
        hsnCode: string;
        imageUrl: string | null;
    }[]>;
    findCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
    }[]>;
    findUnits(): import(".prisma/client").Prisma.PrismaPromise<{
        symbol: string;
        id: string;
        name: string;
        createdAt: Date;
    }[]>;
    create(body: {
        name: string;
        categoryId: string;
        unitId: string;
        price: number;
        hsnCode: string;
        gstRate?: number;
        lowStockThreshold?: number;
    }, user: JwtPayload): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
        unit: {
            symbol: string;
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        unitId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        hsnCode: string;
        gstRate: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, body: Record<string, unknown>): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
        };
        unit: {
            symbol: string;
            id: string;
            name: string;
            createdAt: Date;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        unitId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        hsnCode: string;
        gstRate: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        unitId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        hsnCode: string;
        gstRate: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
    }>;
}
