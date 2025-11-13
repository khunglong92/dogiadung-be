import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProjectCategoryDto) {
    return this.prisma.projectCategory.create({
      data: {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      order: dto.order ?? 0,
      isActive: dto.isActive ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.projectCategory.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const found = await this.prisma.projectCategory.findFirst({
      where: { id, deletedAt: null },
    });
    if (!found) throw new NotFoundException('Project category not found');
    return found;
  }

  async update(id: string, dto: UpdateProjectCategoryDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.projectCategory.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.prisma.projectCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
