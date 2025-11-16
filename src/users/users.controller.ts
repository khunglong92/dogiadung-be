import { Controller, Get, UseGuards, Request } from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';

class UserProfileResponse {
  @ApiProperty({ description: 'ID người dùng', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tên người dùng', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Email người dùng', example: 'user@example.com' })
  email: string;

  @ApiProperty({
    description: 'Vai trò người dùng',
    example: 'USER',
    enum: ['ADMIN', 'USER', 'MANAGER'],
  })
  role: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '2000-01-01',
    required: false,
    nullable: true,
  })
  dateOfBirth: string | null;

  @ApiProperty({
    description: 'URL ảnh đại diện',
    example: 'https://example.com/avatar.png',
    required: false,
    nullable: true,
  })
  avtUrl: string | null;

  @ApiProperty({
    description: 'Ngày tạo tài khoản',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Ngày cập nhật gần nhất',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  /**
   * Get current user's profile
   * @param req - The request object containing the authenticated user
   * @returns The user's profile information
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin profile người dùng hiện tại',
    description:
      'Trả về thông tin profile của người dùng đang đăng nhập dựa trên JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin profile thành công',
    type: UserProfileResponse, // Swagger will use this class for schema generation
  })
  @ApiUnauthorizedResponse({
    description: 'Không có quyền truy cập - Token không hợp lệ hoặc đã hết hạn',
  })
  getProfile(@Request() req: { user: UserProfileResponse }) {
    return req.user;
  }
}
