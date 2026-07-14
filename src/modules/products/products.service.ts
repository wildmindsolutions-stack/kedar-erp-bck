import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getProductStock } from '../../common/utils/gst.util';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async findAll() {
    const products = await this.prisma.product.findMany({
      where: { isDeleted: false },
      include: { category: true, unit: true },
      orderBy: { name: 'asc' },
    });
    return Promise.all(
      products.map(async (p) => ({
        ...p,
        price: Number(p.price),
        gstRate: Number(p.gstRate),
        lowStockThreshold: Number(p.lowStockThreshold),
        stock: await getProductStock(this.prisma, p.id),
      })),
    );
  }

  findCategories() {
    return this.prisma.productCategory.findMany({ orderBy: { name: 'asc' } });
  }

  findUnits() {
    return this.prisma.unit.findMany({ orderBy: { name: 'asc' } });
  }

  async create(data: {
    name: string;
    categoryId: string;
    unitId: string;
    price: number;
    hsnCode: string;
    gstRate?: number;
    lowStockThreshold?: number;
    createdBy?: string;
  }) {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        unitId: data.unitId,
        price: data.price,
        hsnCode: data.hsnCode,
        gstRate: data.gstRate ?? 5,
        lowStockThreshold: data.lowStockThreshold ?? 10,
      },
      include: { category: true, unit: true },
    });

    await this.notifications.notifyByModule({
      module: 'products',
      type: 'PRODUCT_CREATED',
      title: 'New Product Added',
      message: `Product "${product.name}" added to catalogue`,
      refId: product.id,
      link: '/products',
      actorId: data.createdBy,
    });

    return product;
  }

  async update(id: string, data: Partial<{
    name: string;
    categoryId: string;
    unitId: string;
    price: number;
    hsnCode: string;
    gstRate: number;
    lowStockThreshold: number;
    isActive: boolean;
  }>) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: { category: true, unit: true },
    });
  }

  async remove(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { isDeleted: true, isActive: false },
    });
  }

<<<<<<< HEAD
  private toStoreProduct(
    product: {
      id: string;
      name: string;
      price: unknown;
      hsnCode: string;
      gstRate: unknown;
      imageUrl: string | null;
      category: { name: string };
      unit: { name: string; symbol: string };
    },
    stock: number,
  ) {
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return {
      id: product.id,
      slug,
      name: product.name,
      category: product.category.name,
      unit: product.unit.symbol,
      unitName: product.unit.name,
      price: Number(product.price),
      hsnCode: product.hsnCode,
      gstRate: Number(product.gstRate),
      imageUrl: product.imageUrl,
      inStock: stock >= 1,
    };
  }

=======
  /** Public storefront catalogue (Kedar Foundation website). */
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  async findStoreCatalog() {
    const products = await this.prisma.product.findMany({
      where: { isDeleted: false, isActive: true },
      include: { category: true, unit: true },
      orderBy: { name: 'asc' },
    });
<<<<<<< HEAD

    return Promise.all(
      products.map(async (product) => {
        const stock = await getProductStock(this.prisma, product.id);
        return this.toStoreProduct(product, stock);
      }),
    );
=======
    return Promise.all(products.map((p) => this.toStoreProduct(p)));
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  }

  async findStoreProduct(id: string) {
    const product = await this.prisma.product.findFirst({
<<<<<<< HEAD
      where: {
        isDeleted: false,
        isActive: true,
        OR: [{ id }, { name: { equals: id, mode: 'insensitive' } }],
      },
      include: { category: true, unit: true },
    });

    if (!product) return null;

    const stock = await getProductStock(this.prisma, product.id);
    return this.toStoreProduct(product, stock);
=======
      where: { id, isDeleted: false, isActive: true },
      include: { category: true, unit: true },
    });
    if (!product) return null;
    return this.toStoreProduct(product);
  }

  private async toStoreProduct(p: {
    id: string;
    name: string;
    price: unknown;
    hsnCode: string;
    gstRate: unknown;
    imageUrl: string | null;
    category: { name: string };
    unit: { name: string; symbol: string };
  }) {
    const stock = await getProductStock(this.prisma, p.id);
    return {
      id: p.id,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: p.name,
      category: p.category.name,
      unit: p.unit.symbol,
      unitName: p.unit.name,
      price: Number(p.price),
      hsnCode: p.hsnCode,
      gstRate: Number(p.gstRate),
      imageUrl: p.imageUrl,
      inStock: stock > 0,
      stock,
    };
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  }
}
