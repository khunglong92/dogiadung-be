import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

class UserProfileResponse {
  userId: string;
  email: string;
}

interface UserPayload {
  userId: string;
  email: string;
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
    summary: 'Get current user profile',
    description: 'Retrieves the profile of the currently authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user profile',
    type: UserProfileResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getProfile(@Request() req: { user: UserPayload }) {
    return req.user;
  }
}
