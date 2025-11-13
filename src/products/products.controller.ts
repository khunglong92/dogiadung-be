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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Get()
  @ApiOperation({
    summary:
      'Danh sách sản phẩm (có phân trang, lọc theo danh mục, loại trừ xoá mềm)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định là 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng sản phẩm mỗi trang (mặc định là 10, tối đa 100)',
    type: Number,
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Lọc theo ID danh mục',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách sản phẩm với phân trang',
    schema: {
      example: {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      },
    },
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const p = Number(page) > 0 ? Number(page) : 1;
    const l = Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : 10;
    const cId = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.productsService.findAll(p, l, cId);
  }

  @Get('featured')
  @ApiOperation({
    summary: 'Danh sách sản phẩm nổi bật (có phân trang)',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách sản phẩm nổi bật với phân trang',
    schema: {
      example: {
        pagination: { total: 0, page: 1, perpage: 10 },
        data: [],
      },
    },
  })
  findFeatured(
    @Query('page') page?: string,
    @Query('perpage') perpage?: string,
  ) {
    const p = Number(page) > 0 ? Number(page) : 1;
    const pp =
      Number(perpage) > 0 && Number(perpage) <= 100 ? Number(perpage) : 10;
    return this.productsService.findFeatured(p, pp);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  @ApiResponse({ status: 200, description: 'Chi tiết sản phẩm' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá mềm sản phẩm' })
  @ApiResponse({ status: 204, description: 'Xoá thành công' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productsService.remove(id);
  }
}
