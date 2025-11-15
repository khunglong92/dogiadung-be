import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadDto } from './dto/upload.dto';
import { DeleteImageDto } from './dto/delete-image.dto';

class UploadImageResponse {
  url: string;
  public_id: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload ảnh lên Cloudinary (có đóng dấu logo)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Form upload ảnh',
    type: UploadDto,
  })
  @ApiResponse({ status: 201, type: UploadImageResponse })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: unknown,
    @Body(new ValidationPipe()) body: UploadDto,
  ) {
    let buffer: Buffer = Buffer.alloc(0);
    const anyFile = (file as Record<string, unknown>) || null;
    const possibleBuffer = anyFile && anyFile['buffer'];
    if (possibleBuffer instanceof Buffer) {
      buffer = possibleBuffer;
    }
    return this.uploadService.uploadImage(buffer, body.folder);
  }

  @Delete('image')
  @ApiOperation({ summary: 'Xoá ảnh trên Cloudinary' })
  @ApiResponse({ status: 200, description: 'Xoá thành công' })
  async deleteImage(@Body(new ValidationPipe()) body: DeleteImageDto) {
    return this.uploadService.deleteImage(body.public_id ?? '');
  }
}
