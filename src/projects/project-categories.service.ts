import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ProjectCategory } from './entities/project-category.entity';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';

@Injectable()
export class ProjectCategoriesService {
  constructor(
    @InjectRepository(ProjectCategory)
    private readonly repo: Repository<ProjectCategory>,
  ) {}

  create(dto: CreateProjectCategoryDto): Promise<ProjectCategory> {
    const entity = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      order: dto.order ?? 0,
      isActive: dto.isActive ?? true,
    });
    return this.repo.save(entity);
  }

  findAll(): Promise<ProjectCategory[]> {
    return this.repo.find({
      where: { deletedAt: IsNull() },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ProjectCategory> {
    const found = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!found) throw new NotFoundException('Project category not found');
    return found;
  }

  async update(
    id: string,
    dto: UpdateProjectCategoryDto,
  ): Promise<ProjectCategory> {
    const existing = await this.findOne(id);
    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.slug !== undefined) existing.slug = dto.slug;
    if (dto.description !== undefined) existing.description = dto.description;
    if (dto.order !== undefined) existing.order = dto.order;
    if (dto.isActive !== undefined) existing.isActive = dto.isActive;
    return this.repo.save(existing);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    existing.deletedAt = new Date();
    await this.repo.save(existing);
  }
}
