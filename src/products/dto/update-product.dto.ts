import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

class UpdateProductDescriptionDto {
  @ApiPropertyOptional({ description: 'Tổng quan' })
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiPropertyOptional({ description: 'Các đặc tính', type: [String] })
  @IsArray()
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({ description: 'Ứng dụng', type: [String] })
  @IsArray()
  @IsOptional()
  applications?: string[];

  @ApiPropertyOptional({ description: 'Vật liệu', type: [String] })
  @IsArray()
  @IsOptional()
  materials?: string[];
}

class UpdateProductTechnicalSpecsDto {
  @ApiPropertyOptional({ description: 'Kích thước' })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiPropertyOptional({ description: 'Khối lượng' })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiPropertyOptional({ description: 'Chất liệu' })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiPropertyOptional({ description: 'Bề mặt hoàn thiện' })
  @IsString()
  @IsOptional()
  surfaceFinish?: string;

  @ApiPropertyOptional({ description: 'Tải trọng' })
  @IsString()
  @IsOptional()
  loadCapacity?: string;

  @ApiPropertyOptional({ description: 'Kiểu hàn' })
  @IsString()
  @IsOptional()
  weldingType?: string;

  @ApiPropertyOptional({ description: 'Có tuỳ chỉnh' })
  @IsOptional()
  customizable?: boolean;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Tên sản phẩm' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết',
    type: UpdateProductDescriptionDto,
  })
  @IsOptional()
  description?: UpdateProductDescriptionDto;

  @ApiPropertyOptional({
    description: 'Thông số kỹ thuật',
    type: UpdateProductTechnicalSpecsDto,
  })
  @IsOptional()
  technicalSpecs?: UpdateProductTechnicalSpecsDto;

  @ApiPropertyOptional({ description: 'Giá sản phẩm (VND)', type: String })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({
    description: 'Danh sách hình ảnh URL',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ description: 'Chế độ bảo hành', example: '12 tháng' })
  @IsString()
  @IsOptional()
  warrantyPolicy?: string;

  @ApiPropertyOptional({ description: 'Sản phẩm nổi bật' })
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'ID danh mục' })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;
}
