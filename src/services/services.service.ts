import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyService } from './services.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(CompanyService)
    private readonly repo: Repository<CompanyService>,
  ) {}

  async create(dto: CreateServiceDto): Promise<CompanyService> {
    const entity = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      content: dto.content,
      image: dto.image,
      order: dto.order ?? 0,
      isActive: dto.isActive ?? true,
    });
    if (dto.parentId) {
      entity.parent = await this.repo.findOne({ where: { id: dto.parentId } });
    }
    return this.repo.save(entity);
  }

  async findAll(parentId?: string): Promise<CompanyService[]> {
    return this.repo.find({
      where: parentId ? { parent: { id: parentId } } : {},
      relations: { parent: true, children: false },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CompanyService> {
    const found = await this.repo.findOne({ where: { id }, relations: { parent: true } });
    if (!found) throw new NotFoundException('Service not found');
    return found;
  }

  async update(id: string, dto: UpdateServiceDto): Promise<CompanyService> {
    const existing = await this.findOne(id);
    if (dto.parentId !== undefined) {
      existing.parent = dto.parentId
        ? await this.repo.findOne({ where: { id: dto.parentId } })
        : null;
    }
    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.slug !== undefined) existing.slug = dto.slug;
    if (dto.description !== undefined) existing.description = dto.description;
    if (dto.content !== undefined) existing.content = dto.content;
    if (dto.image !== undefined) existing.image = dto.image;
    if (dto.order !== undefined) existing.order = dto.order;
    if (dto.isActive !== undefined) existing.isActive = dto.isActive;
    return this.repo.save(existing);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}


