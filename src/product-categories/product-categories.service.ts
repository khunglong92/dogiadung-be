import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repo: Repository<ProductCategory>,
  ) {}

  create(dto: CreateProductCategoryDto): Promise<ProductCategory> {
    const entity = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sampleProducts: dto.sampleProducts,
      contactPhone: dto.contactPhone,
      contactZalo: dto.contactZalo,
      isActive: dto.isActive ?? true,
    });
    return this.repo.save(entity);
  }

  findAll(): Promise<ProductCategory[]> {
    return this.repo.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ProductCategory> {
    const found = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!found) throw new NotFoundException('Product category not found');
    return found;
  }

  async update(
    id: string,
    dto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const existing = await this.findOne(id);
    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.slug !== undefined) existing.slug = dto.slug;
    if (dto.description !== undefined) existing.description = dto.description;
    if (dto.sampleProducts !== undefined)
      existing.sampleProducts =
        dto.sampleProducts
          ?.filter(
            (p) => !!p && typeof p.name === 'string' && p.name.length > 0,
          )
          .map((p) => ({
            name: p.name as string,
            image: p.image,
            description: p.description,
          })) ?? null;
    if (dto.contactPhone !== undefined)
      existing.contactPhone = dto.contactPhone;
    if (dto.contactZalo !== undefined) existing.contactZalo = dto.contactZalo;
    if (dto.isActive !== undefined) existing.isActive = dto.isActive;
    return this.repo.save(existing);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    existing.deletedAt = new Date();
    await this.repo.save(existing);
  }
}
