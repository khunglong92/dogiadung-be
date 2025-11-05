import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategory } from './product-category.entity';

@ApiTags('Product Categories')
@ApiBearerAuth()
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly service: ProductCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh mục sản phẩm' })
  @ApiResponse({ status: 201, type: ProductCategory })
  create(@Body() dto: CreateProductCategoryDto): Promise<ProductCategory> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách danh mục (kèm sample_products)' })
  @ApiResponse({ status: 200, type: [ProductCategory] })
  findAll(): Promise<ProductCategory[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết danh mục' })
  @ApiResponse({ status: 200, type: ProductCategory })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductCategory> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @ApiResponse({ status: 200, type: ProductCategory })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá danh mục' })
  @ApiResponse({ status: 204, description: 'Xoá thành công' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}


