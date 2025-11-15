import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactInfoDto {
  @ApiProperty({
    description: 'Tên công ty',
    example: 'Công ty TNHH Kim Loại Tam Thiên Lộc',
  })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({
    description: 'Địa chỉ công ty',
    example: '123 Đường ABC, Quận 1, TP.HCM',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0123456789',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Email liên hệ',
    example: 'contact@company.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Giờ làm việc',
    example: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
  })
  @IsNotEmpty()
  @IsString()
  workingHours: string;

  @ApiProperty({
    description: 'Google Map URL',
    example: 'https://maps.google.com/...',
    required: false,
  })
  @IsOptional()
  @IsString()
  googleMapUrl?: string;
}
