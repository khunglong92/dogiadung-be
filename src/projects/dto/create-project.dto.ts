import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'ID danh mục', format: 'uuid' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'Tên dự án' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Slug duy nhất' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Nội dung chi tiết' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Địa điểm thi công' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Ngày hoàn thành', format: 'date' })
  @IsDateString()
  @IsOptional()
  completionDate?: string;

  @ApiPropertyOptional({ description: 'Ảnh đại diện (URL)' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ description: 'Bộ sưu tập ảnh (JSON)' })
  @IsOptional()
  gallery?: Array<{ url: string; caption?: string }>;

  @ApiPropertyOptional({ description: 'Dự án tiêu biểu', default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Kích hoạt', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
