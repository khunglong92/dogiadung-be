import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

class ProductDescriptionDto {
  @ApiProperty({ description: 'Tổng quan' })
  @IsString()
  overview: string;

  @ApiProperty({ description: 'Các đặc tính', type: [String] })
  @IsArray()
  features: string[];

  @ApiProperty({ description: 'Ứng dụng', type: [String] })
  @IsArray()
  applications: string[];

  @ApiProperty({ description: 'Vật liệu', type: [String] })
  @IsArray()
  materials: string[];
}

class ProductTechnicalSpecsDto {
  @ApiProperty({ description: 'Kích thước' })
  @IsString()
  dimensions: string;

  @ApiProperty({ description: 'Khối lượng' })
  @IsString()
  weight: string;

  @ApiProperty({ description: 'Chất liệu' })
  @IsString()
  material: string;

  @ApiProperty({ description: 'Bề mặt hoàn thiện' })
  @IsString()
  surfaceFinish: string;

  @ApiProperty({ description: 'Tải trọng' })
  @IsString()
  loadCapacity: string;

  @ApiProperty({ description: 'Kiểu hàn' })
  @IsString()
  weldingType: string;

  @ApiProperty({ description: 'Có tuỳ chỉnh', default: false })
  customizable: boolean;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Tên sản phẩm' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết', type: ProductDescriptionDto })
  @IsOptional()
  description?: ProductDescriptionDto;

  @ApiPropertyOptional({ description: 'Thông số kỹ thuật', type: ProductTechnicalSpecsDto })
  @IsOptional()
  technicalSpecs?: ProductTechnicalSpecsDto;

  @ApiPropertyOptional({ description: 'Giá sản phẩm (VND)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Danh sách hình ảnh URL', type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ description: 'Chế độ bảo hành', example: '12 tháng' })
  @IsString()
  @IsOptional()
  warrantyPolicy?: string;

  @ApiProperty({ description: 'ID danh mục' })
  @IsInt()
  @Min(1)
  categoryId: number;
}


