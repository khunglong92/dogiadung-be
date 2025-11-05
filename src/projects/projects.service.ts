import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, FindOptionsWhere } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectCategory } from './entities/project-category.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectCategory)
    private readonly categoryRepo: Repository<ProjectCategory>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId, deletedAt: IsNull() },
    });
    if (!category) throw new NotFoundException('Project category not found');
    const entity = this.projectRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      content: dto.content,
      location: dto.location,
      completionDate: dto.completionDate,
      image: dto.image,
      gallery: dto.gallery,
      isFeatured: dto.isFeatured ?? false,
      isActive: dto.isActive ?? true,
      category,
    });
    return this.projectRepo.save(entity);
  }

  findAll(categoryId?: string): Promise<Project[]> {
    const baseWhere: FindOptionsWhere<Project> = { deletedAt: IsNull() };
    const where: FindOptionsWhere<Project> = categoryId
      ? {
          ...baseWhere,
          category: { id: categoryId } as FindOptionsWhere<Project>,
        }
      : baseWhere;
    return this.projectRepo.find({
      where,
      relations: { category: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const found = await this.projectRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: { category: true },
    });
    if (!found) throw new NotFoundException('Project not found');
    return found;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const existing = await this.findOne(id);
    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId, deletedAt: IsNull() },
      });
      if (!category) throw new NotFoundException('Project category not found');
      existing.category = category;
    }
    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.slug !== undefined) existing.slug = dto.slug;
    if (dto.description !== undefined) existing.description = dto.description;
    if (dto.content !== undefined) existing.content = dto.content;
    if (dto.location !== undefined) existing.location = dto.location;
    if (dto.completionDate !== undefined)
      existing.completionDate = dto.completionDate;
    if (dto.image !== undefined) existing.image = dto.image;
    if (dto.gallery !== undefined) existing.gallery = dto.gallery;
    if (dto.isFeatured !== undefined) existing.isFeatured = dto.isFeatured;
    if (dto.isActive !== undefined) existing.isActive = dto.isActive;
    return this.projectRepo.save(existing);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    existing.deletedAt = new Date();
    await this.projectRepo.save(existing);
  }
}
