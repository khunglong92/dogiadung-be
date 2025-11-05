import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const entity = this.categoryRepository.create(createDto);
    return this.categoryRepository.save(entity);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { deletedAt: IsNull() },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const found = await this.categoryRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!found) {
      throw new NotFoundException('Category not found');
    }
    return found;
  }

  async update(id: number, updateDto: UpdateCategoryDto): Promise<Category> {
    const existing = await this.findOne(id);
    Object.assign(existing, updateDto);
    return this.categoryRepository.save(existing);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);
    existing.deletedAt = new Date();
    await this.categoryRepository.save(existing);
  }
}
