import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo danh mục mới',
    description:
      'Tạo danh mục với các trường: name (bắt buộc), description (tùy chọn).',
  })
  @ApiResponse({ status: 201, description: 'Tạo thành công', type: Category })
  create(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách danh mục (loại trừ xoá mềm)' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách các danh mục',
    type: [Category],
  })
  findAll(): Promise<Category[]> {
    // Simple: giữ nguyên trả mảng, có thể nâng cấp phân trang sau
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết danh mục' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết danh mục',
    type: Category,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật danh mục',
    description:
      'Cập nhật các trường: name?, description?, updatedByUserId?, updatedByName?.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: Category,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá danh mục' })
  @ApiResponse({ status: 204, description: 'Xoá thành công' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
