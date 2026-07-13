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
            createdAt: Date;
            name: string;
        };
        unit: {
            symbol: string;
            id: string;
            createdAt: Date;
            name: string;
        };
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
        categoryId: string;
        unitId: string;
        hsnCode: string;
        imageUrl: string | null;
    }[]>;
    findCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
    }[]>;
    findUnits(): import(".prisma/client").Prisma.PrismaPromise<{
        symbol: string;
        id: string;
        createdAt: Date;
        name: string;
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
            createdAt: Date;
            name: string;
        };
        unit: {
            symbol: string;
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
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
            createdAt: Date;
            name: string;
        };
        unit: {
            symbol: string;
            id: string;
            createdAt: Date;
            name: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isDeleted: boolean;
        categoryId: string;
        unitId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        hsnCode: string;
        gstRate: import("@prisma/client/runtime/library").Decimal;
        imageUrl: string | null;
        lowStockThreshold: import("@prisma/client/runtime/library").Decimal;
    }>;
}
