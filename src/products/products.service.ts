import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: createDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const entity = this.productRepository.create({
      name: createDto.name,
      description: createDto.description as unknown as
        | Record<string, unknown>
        | undefined,
      images: createDto.images,
      price: typeof createDto.price === 'number' ? createDto.price : null,
      technicalSpecs: createDto.technicalSpecs as unknown as
        | Record<string, unknown>
        | undefined,
      category,
    });
    return this.productRepository.save(entity);
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.productRepository.findAndCount({
      where: { deletedAt: IsNull() },
      relations: { category: true },
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Product> {
    const found = await this.productRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: { category: true },
    });
    if (!found) {
      throw new NotFoundException('Product not found');
    }
    return found;
  }

  async update(id: number, updateDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (typeof updateDto.categoryId === 'number') {
      const category = await this.categoryRepository.findOne({
        where: { id: updateDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    if (typeof updateDto.price === 'number') {
      product.price = updateDto.price;
    }
    if (updateDto.name !== undefined) product.name = updateDto.name;
    if (updateDto.description !== undefined)
      product.description = updateDto.description as unknown as Record<
        string,
        unknown
      >;
    if (updateDto.technicalSpecs !== undefined)
      product.technicalSpecs = updateDto.technicalSpecs as unknown as Record<
        string,
        unknown
      >;
    if (updateDto.images !== undefined) product.images = updateDto.images;
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    product.deletedAt = new Date();
    await this.productRepository.save(product);
  }
}
