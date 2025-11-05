import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo dự án' })
  @ApiResponse({ status: 201, type: Project })
  create(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách dự án (lọc theo category_id nếu có)' })
  @ApiResponse({ status: 200, type: [Project] })
  findAll(@Query('category_id') categoryId?: string): Promise<Project[]> {
    return this.service.findAll(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết dự án' })
  @ApiResponse({ status: 200, type: Project })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật dự án' })
  @ApiResponse({ status: 200, type: Project })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá dự án' })
  @ApiResponse({ status: 204, description: 'Xoá thành công' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}
