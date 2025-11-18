import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ValidationPipe,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadDto } from './dto/upload.dto';

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
  @ApiOperation({
    summary: 'Upload ảnh lên server (có đóng dấu logo)',
    description:
      'Upload ảnh với folder tùy chỉnh. Folder name chỉ chấp nhận chữ cái, số, gạch ngang và gạch dưới.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Form upload ảnh với folder tùy chỉnh (vd: products, services, banners, etc.)',
    type: UploadDto,
  })
  @ApiResponse({
    status: 201,
    type: UploadImageResponse,
    description: 'Trả về URL và public_id của ảnh đã upload',
  })
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
  @ApiOperation({
    summary: 'Xoá ảnh trên server',
    description:
      'Xoá ảnh bằng public_id (full path). Ví dụ: "products/1/product-name/abc123.jpg"',
  })
  @ApiQuery({
    name: 'public_id',
    description: 'Full path của ảnh cần xóa (bao gồm folder và tên file)',
    example:
      'products/1/product-name/28f6f727-12db-41e7-bd27-38e5e32c9dfd.jpeg',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Xoá thành công. Các folder rỗng sẽ tự động được xoá.',
  })
  @ApiResponse({
    status: 400,
    description: 'Không tìm thấy ảnh hoặc public_id không hợp lệ',
  })
  async deleteImage(@Query('public_id') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('public_id is required');
    }
    return this.uploadService.deleteImage(publicId);
  }
}
