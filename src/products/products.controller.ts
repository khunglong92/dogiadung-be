import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo sản phẩm mới',
    description:
      'Fields: name (required), description?, technicalSpecs?, price?, images?, warrantyPolicy?, categoryId (required).',
  })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: Product })
  create(@Body() body: CreateProductDto): Promise<Product> {
    return this.productsService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Danh sách sản phẩm (có phân trang, loại trừ xoá mềm)',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách sản phẩm bao gồm danh mục',
    schema: {
      example: { data: [], total: 0, page: 1, limit: 10 },
    },
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const p = Number(page) > 0 ? Number(page) : 1;
    const l = Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 10;
    return this.productsService.findAll(p, l);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  @ApiResponse({ status: 200, description: 'Chi tiết sản phẩm', type: Product })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: Product,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá sản phẩm' })
  @ApiResponse({ status: 204, description: 'Xoá thành công' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productsService.remove(id);
  }
}
