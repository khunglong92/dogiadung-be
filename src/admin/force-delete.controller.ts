import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';

class ForceDeleteDto {
  type: 'category' | 'product';
  id: number;
}

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class ForceDeleteController {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  @Post('force-delete')
  @ApiOperation({ summary: 'Xoá cứng một thực thể và quan hệ liên quan' })
  @ApiBody({ schema: { example: { type: 'category', id: 1 } } })
  @ApiResponse({ status: 200, schema: { example: { success: true } } })
  async forceDelete(@Body() body: ForceDeleteDto) {
    if (body.type === 'product') {
      await this.productRepo.delete({ id: body.id });
      return { success: true };
    }
    if (body.type === 'category') {
      // delete all products in this category then category itself
      await this.productRepo.delete({ category: { id: body.id } as any });
      await this.categoryRepo.delete({ id: body.id });
      return { success: true };
    }
    return { success: false };
  }
}


