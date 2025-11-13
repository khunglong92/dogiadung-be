import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole as UserRoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    role: UserRoleEnum,
  ) {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hash, name, role },
    });
  }

  async validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
