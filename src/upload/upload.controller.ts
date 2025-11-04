import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
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
  @ApiOperation({ summary: 'Upload ảnh lên Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Form upload ảnh',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'products' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, type: UploadImageResponse })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: unknown,
    @Body('folder') folder?: string,
  ) {
    let buffer: Buffer = Buffer.alloc(0);
    const anyFile = (file as Record<string, unknown>) || null;
    const possibleBuffer = anyFile && anyFile['buffer'];
    if (possibleBuffer instanceof Buffer) {
      buffer = possibleBuffer;
    }
    return this.uploadService.uploadImage(buffer, folder);
  }
}
