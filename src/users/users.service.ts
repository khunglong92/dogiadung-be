import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRole } from 'src/types/auth/User';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) {
    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, password: hash, name, role });
    return this.usersRepo.save(user);
  }

  async validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
