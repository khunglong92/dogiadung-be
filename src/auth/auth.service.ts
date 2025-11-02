import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu chưa đúng');
    }

    const isValid = await this.usersService.validatePassword(
      pass,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu chưa đúng');
    }

    // trả về user (không trả password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  login(user: { email: string }) {
    const payload = { sub: user.email, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
