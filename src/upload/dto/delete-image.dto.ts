import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteImageDto {
  @ApiProperty({
    description: 'The public_id of the image to delete',
    example: 'services/abc123',
  })
  @IsString()
  @IsNotEmpty()
  public_id: string;
}



