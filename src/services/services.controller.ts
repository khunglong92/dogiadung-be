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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CompanyService } from './services.entity';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo dịch vụ' })
  @ApiResponse({ status: 201, type: CompanyService })
  create(@Body() dto: CreateServiceDto): Promise<CompanyService> {
    return this.servicesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách dịch vụ (lọc theo parent_id nếu có)' })
  @ApiResponse({ status: 200, type: [CompanyService] })
  findAll(@Query('parent_id') parentId?: string): Promise<CompanyService[]> {
    return this.servicesService.findAll(parentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết dịch vụ' })
  @ApiResponse({ status: 200, type: CompanyService })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CompanyService> {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật dịch vụ' })
  @ApiResponse({ status: 200, type: CompanyService })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<CompanyService> {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá dịch vụ' })
  @ApiResponse({ status: 204, description: 'Xoá thành công' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.servicesService.remove(id);
  }
}
