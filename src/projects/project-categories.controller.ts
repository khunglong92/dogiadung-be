import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectCategoriesService } from './project-categories.service';
import { CreateProjectCategoryDto } from './dto/create-project-category.dto';
import { UpdateProjectCategoryDto } from './dto/update-project-category.dto';
import { ProjectCategory } from './entities/project-category.entity';

@ApiTags('Project Categories')
@ApiBearerAuth()
@Controller('project-categories')
export class ProjectCategoriesController {
  constructor(private readonly service: ProjectCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh mục dự án' })
  @ApiResponse({ status: 201, type: ProjectCategory })
  create(@Body() dto: CreateProjectCategoryDto): Promise<ProjectCategory> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách danh mục dự án' })
  @ApiResponse({ status: 200, type: [ProjectCategory] })
  findAll(): Promise<ProjectCategory[]> {
    return this.service.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục dự án' })
  @ApiResponse({ status: 200, type: ProjectCategory })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectCategoryDto,
  ): Promise<ProjectCategory> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá danh mục dự án' })
  @ApiResponse({ status: 204, description: 'Xoá thành công' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}
