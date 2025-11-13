import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    const category = await this.prisma.projectCategory.findFirst({
      where: { id: dto.categoryId, deletedAt: null },
    });
    if (!category) throw new NotFoundException('Project category not found');

    return this.prisma.project.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        content: dto.content,
        location: dto.location,
        completionDate: dto.completionDate,
        image: dto.image,
        gallery: dto.gallery as Prisma.InputJsonValue,
        isFeatured: dto.isFeatured ?? false,
        isActive: dto.isActive ?? true,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
  }

  async findAll(
    categoryId?: string,
    page = 1,
    perPage = 10,
  ): Promise<{
    pagination: { total: number; page: number; perpage: number };
    data: any[];
  }> {
    const where = {
      deletedAt: null,
      ...(categoryId && { categoryId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.project.count({ where }),
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

  async findOne(id: string) {
    const found = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: { category: true },
    });
    if (!found) throw new NotFoundException('Project not found');
    return found;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id); // Check if exists

    if (dto.categoryId) {
      const category = await this.prisma.projectCategory.findFirst({
        where: { id: dto.categoryId, deletedAt: null },
      });
      if (!category) throw new NotFoundException('Project category not found');
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.completionDate !== undefined && {
          completionDate: dto.completionDate,
        }),
        ...(dto.image !== undefined && { image: dto.image }),
        ...(dto.gallery !== undefined && {
          gallery: dto.gallery as Prisma.InputJsonValue,
        }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
      },
      include: { category: true },
    });
  }

  async findFeatured(
    page = 1,
    perPage = 10,
  ): Promise<{
    pagination: { total: number; page: number; perpage: number };
    data: any[];
  }> {
    const where = { deletedAt: null, isFeatured: true };

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.project.count({ where }),
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

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
