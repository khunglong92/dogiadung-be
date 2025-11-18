import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  IsInt,
  IsEnum,
  IsBoolean,
  ArrayMaxSize,
} from 'class-validator';

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'Đường dẫn thân thiện SEO' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Tên dịch vụ' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Phân nhóm hoặc mô tả ngắn' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn gọn' })
  @IsString()
  @IsOptional()
  short_description?: string;

  @ApiPropertyOptional({ description: 'Nội dung chi tiết (mảng các đoạn văn)' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  content?: string[];

  @ApiPropertyOptional({ description: 'Danh sách các đặc điểm nổi bật (mảng)' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({ description: 'Danh sách công nghệ / thiết bị (mảng)' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @ApiPropertyOptional({ description: 'Lợi ích dành cho khách hàng (mảng)' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[];

  @ApiPropertyOptional({ description: 'Nhóm khách hàng mục tiêu' })
  @IsString()
  @IsOptional()
  customers?: string;

  @ApiPropertyOptional({ description: 'Danh sách link ảnh (tối đa 20)' })
  @IsArray()
  @ArrayMaxSize(20)
  @IsUrl({}, { each: true })
  @IsOptional()
  image_urls?: string[];

  @ApiPropertyOptional({
    description: 'Danh sách mô tả alt cho ảnh (tương ứng với image_urls)',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  image_alts?: string[];

  @ApiPropertyOptional({ description: 'Icon đại diện' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: 'Nội dung nút CTA' })
  @IsString()
  @IsOptional()
  cta_label?: string;

  @ApiPropertyOptional({ description: 'Đường dẫn CTA' })
  @IsString()
  @IsOptional()
  cta_link?: string;

  @ApiPropertyOptional({
    description: 'Target của CTA (_blank hoặc _self)',
    example: '_blank',
  })
  @IsString()
  @IsOptional()
  cta_target?: string;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị' })
  @IsInt()
  @IsOptional()
  order_index?: number;

  @ApiPropertyOptional({ description: 'Từ khóa hoặc hashtag' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Tiêu đề SEO' })
  @IsString()
  @IsOptional()
  seo_title?: string;

  @ApiPropertyOptional({ description: 'Mô tả SEO' })
  @IsString()
  @IsOptional()
  seo_description?: string;

  @ApiPropertyOptional({ description: 'Mô tả ảnh cho SEO' })
  @IsString()
  @IsOptional()
  alt_text?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái hiển thị',
    enum: ['draft', 'published', 'archived'],
  })
  @IsEnum(['draft', 'published', 'archived'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Giao diện ưu tiên',
    enum: ['light', 'dark', 'auto'],
  })
  @IsEnum(['light', 'dark', 'auto'])
  @IsOptional()
  theme_variant?: string;

  @ApiPropertyOptional({ description: 'Dịch vụ nổi bật' })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;
}
