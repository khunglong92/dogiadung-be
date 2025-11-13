import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo dự án mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách dự án (có phân trang)' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Lọc theo danh mục',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định là 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'perpage',
    required: false,
    description: 'Số lượng mỗi trang (mặc định là 10)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách dự án với phân trang',
    schema: {
      example: {
        pagination: { total: 0, page: 1, perpage: 10 },
        data: [],
      },
    },
  })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: string,
    @Query('perpage') perpage?: string,
  ) {
    const p = Number(page) > 0 ? Number(page) : 1;
    const pp =
      Number(perpage) > 0 && Number(perpage) <= 100 ? Number(perpage) : 10;
    return this.service.findAll(categoryId, p, pp);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Danh sách dự án nổi bật (có phân trang)' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định là 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'perpage',
    required: false,
    description: 'Số lượng mỗi trang (mặc định là 10)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách dự án nổi bật với phân trang',
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
    return this.service.findFeatured(p, pp);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết dự án' })
  @ApiResponse({ status: 200, description: 'Chi tiết dự án' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật dự án' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá dự án' })
  @ApiResponse({ status: 204, description: 'Xoá thành công' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
