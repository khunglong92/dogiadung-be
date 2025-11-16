import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: createDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const descriptionObj: Record<string, unknown> | undefined =
      createDto.description
        ? {
            overview: createDto.description.overview,
            features: createDto.description.features,
            applications: createDto.description.applications,
            materials: createDto.description.materials,
          }
        : undefined;

    const technicalSpecsObj: Record<string, unknown> | undefined =
      createDto.technicalSpecs
        ? {
            dimensions: createDto.technicalSpecs.dimensions,
            weight: createDto.technicalSpecs.weight,
            material: createDto.technicalSpecs.material,
            surfaceFinish: createDto.technicalSpecs.surfaceFinish,
            loadCapacity: createDto.technicalSpecs.loadCapacity,
            weldingType: createDto.technicalSpecs.weldingType,
            customizable: createDto.technicalSpecs.customizable,
          }
        : undefined;

    return this.prisma.product.create({
      data: {
        name: createDto.name,
        description: descriptionObj as Prisma.InputJsonValue,
        images: createDto.images || [],
        price: createDto.price ?? null,
        technicalSpecs: technicalSpecsObj as Prisma.InputJsonValue,
        categoryId: createDto.categoryId,
        isFeatured: createDto.isFeatured ?? false,
      },
      include: { category: true },
    });
  }

  async findAll(page = 1, limit = 10, categoryId?: number) {
    const where = {
      deletedAt: null,
      ...(categoryId && { categoryId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const found = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { category: true },
    });
    if (!found) {
      throw new NotFoundException('Product not found');
    }
    return found;
  }

  async update(id: number, updateDto: UpdateProductDto) {
    await this.findOne(id); // Check if exists

    if (typeof updateDto.categoryId === 'number') {
      const category = await this.prisma.category.findUnique({
        where: { id: updateDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const descriptionObj =
      updateDto.description !== undefined
        ? updateDto.description
          ? {
              ...(updateDto.description.overview !== undefined && {
                overview: updateDto.description.overview,
              }),
              ...(updateDto.description.features !== undefined && {
                features: updateDto.description.features,
              }),
              ...(updateDto.description.applications !== undefined && {
                applications: updateDto.description.applications,
              }),
              ...(updateDto.description.materials !== undefined && {
                materials: updateDto.description.materials,
              }),
            }
          : null
        : undefined;

    const technicalSpecsObj =
      updateDto.technicalSpecs !== undefined
        ? updateDto.technicalSpecs
          ? {
              ...(updateDto.technicalSpecs.dimensions !== undefined && {
                dimensions: updateDto.technicalSpecs.dimensions,
              }),
              ...(updateDto.technicalSpecs.weight !== undefined && {
                weight: updateDto.technicalSpecs.weight,
              }),
              ...(updateDto.technicalSpecs.material !== undefined && {
                material: updateDto.technicalSpecs.material,
              }),
              ...(updateDto.technicalSpecs.surfaceFinish !== undefined && {
                surfaceFinish: updateDto.technicalSpecs.surfaceFinish,
              }),
              ...(updateDto.technicalSpecs.loadCapacity !== undefined && {
                loadCapacity: updateDto.technicalSpecs.loadCapacity,
              }),
              ...(updateDto.technicalSpecs.weldingType !== undefined && {
                weldingType: updateDto.technicalSpecs.weldingType,
              }),
              ...(updateDto.technicalSpecs.customizable !== undefined && {
                customizable: updateDto.technicalSpecs.customizable,
              }),
            }
          : null
        : undefined;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(updateDto.name !== undefined && { name: updateDto.name }),
        ...(descriptionObj !== undefined && {
          description: descriptionObj as Prisma.InputJsonValue,
        }),
        ...(technicalSpecsObj !== undefined && {
          technicalSpecs: technicalSpecsObj as Prisma.InputJsonValue,
        }),
        ...(updateDto.price !== undefined && { price: updateDto.price }),
        ...(updateDto.images !== undefined && { images: updateDto.images }),
        ...(updateDto.isFeatured !== undefined && {
          isFeatured: updateDto.isFeatured,
        }),
      },
      include: { category: true },
    });
  }

  async findFeatured(page = 1, perPage = 10) {
    const where = { deletedAt: null, isFeatured: true };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { id: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      pagination: {
        total,
        page,
        perpage: perPage,
      },
      data,
    };
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async likeProduct(productId: number, userId: number) {
    // Check if product exists
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user already liked this product
    const existingLike = await this.prisma.productLike.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this product');
    }

    // Create like record and increment likes count
    await this.prisma.$transaction([
      this.prisma.productLike.create({
        data: {
          productId,
          userId,
        },
      }),
      this.prisma.product.update({
        where: { id: productId },
        data: {
          likes: {
            increment: 1,
          },
        },
      }),
    ]);

    // Return updated product
    return this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        likes: true,
      },
    });
  }

  async unlikeProduct(productId: number, userId: number) {
    // Check if product exists
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user has liked this product
    const existingLike = await this.prisma.productLike.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (!existingLike) {
      throw new BadRequestException('You have not liked this product yet');
    }

    // Delete like record and decrement likes count
    await this.prisma.$transaction([
      this.prisma.productLike.delete({
        where: {
          productId_userId: {
            productId,
            userId,
          },
        },
      }),
      this.prisma.product.update({
        where: { id: productId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      }),
    ]);

    // Return updated product
    return this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        likes: true,
      },
    });
  }

  async checkUserLiked(productId: number, userId: number): Promise<boolean> {
    const like = await this.prisma.productLike.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    return !!like;
  }
}
