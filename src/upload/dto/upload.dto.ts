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
    description:
      'Folder to save the image in (e.g., products, services, categories, or any custom folder name)',
    example: 'products',
  })
  @IsString()
  @IsOptional()
  @Matches(/^(?!.*\.\.)[a-zA-Z0-9_/-]+$/, {
    message:
      'Folder name chỉ được chứa chữ cái, số, gạch ngang, gạch dưới, dấu / và không được chứa ".."',
  })
  folder?: string;
}
