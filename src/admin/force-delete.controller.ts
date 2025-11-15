import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

class ForceDeleteDto {
  type: 'category' | 'product' = 'category';
  id: number;
}

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class ForceDeleteController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('force-delete')
  @ApiOperation({ summary: 'Xoá cứng một thực thể và quan hệ liên quan' })
  @ApiBody({ schema: { example: { type: 'category', id: 1 } } })
  @ApiResponse({ status: 200, schema: { example: { success: true } } })
  async forceDelete(@Body() body: ForceDeleteDto) {
    if (body.type === 'product') {
      await this.prisma.product.delete({ where: { id: body.id } });
      return { success: true };
    }
    if (body.type === 'category') {
      // delete all products in this category then category itself
      await this.prisma.product.deleteMany({ where: { categoryId: body.id } });
      await this.prisma.category.delete({ where: { id: body.id } });
      return { success: true };
    }
    return { success: false };
  }
}
