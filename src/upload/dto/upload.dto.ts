import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum UploadFolder {
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  GENERAL = 'general',
  SERVICES = 'services',
}

export class UploadDto {
  @ApiPropertyOptional({
    description: 'Folder to save the image in',
    enum: UploadFolder,
  })
  @IsEnum(UploadFolder)
  @IsOptional()
  folder?: UploadFolder;
}
