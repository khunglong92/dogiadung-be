import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export enum UploadFolder {
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  GENERAL = 'general',
  SERVICES = 'services',
}

export class UploadDto {
  @ApiPropertyOptional({
    description: 'Folder to save the image in (e.g., products, services, categories, or any custom folder name)',
    example: 'products',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Folder name can only contain letters, numbers, hyphens, and underscores',
  })
  folder?: string;
}
