import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Service quản lý kết nối database thông qua Prisma ORM
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect(); // ✅ KHÔNG cần ép kiểu
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect(); // ✅ KHÔNG cần ép kiểu
  }
}
