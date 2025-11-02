import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

class LoginResponse {
  access_token: string;
}

class RegisterResponse {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * Đăng nhập người dùng
   * @param body - Thông tin đăng nhập (email và mật khẩu)
   * @returns Trả về access token nếu đăng nhập thành công
   */
  @Post('login')
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Xác thực thông tin đăng nhập và trả về JWT token',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Thông tin đăng nhập',
    examples: {
      login: {
        value: {
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đăng nhập thành công',
    type: LoginResponse,
  })
  @ApiBadRequestResponse({
    description: 'Thông tin không hợp lệ',
    schema: {
      example: {
        message: ['email must be an email', 'password should not be empty'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Sai thông tin đăng nhập',
    schema: {
      example: {
        message: 'Email hoặc mật khẩu chưa đúng',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  /**
   * Đăng ký tài khoản mới
   * @param body - Thông tin đăng ký
   * @returns Thông tin người dùng vừa tạo (không bao gồm mật khẩu)
   */
  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản',
    description: 'Tạo tài khoản người dùng mới',
  })
  @ApiBody({
    description: 'Thông tin đăng ký',
    examples: {
      register: {
        value: {
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Đăng ký thành công',
    type: RegisterResponse,
  })
  @ApiBadRequestResponse({
    description: 'Thông tin không hợp lệ',
    schema: {
      example: {
        message: [
          'email must be an email',
          'password must be at least 6 characters',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email đã tồn tại',
    schema: {
      example: {
        message: 'Email đã tồn tại',
        statusCode: 409,
      },
    },
  })
  async register(@Body() body: { email: string; password: string }) {
    const exists = await this.usersService.findByEmail(body.email);
    if (exists) {
      return { message: 'Email đã tồn tại' };
    }
    const user = await this.usersService.createUser(body.email, body.password);
    // Explicitly type the user object to exclude password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user as Omit<
      typeof user,
      'password'
    > & { password?: string };
    return userWithoutPassword;
  }
}
