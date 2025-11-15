import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Service quản lý kết nối database thông qua Prisma ORM
 */
@Injectable()
export class PrismaService
  extends PrismaClient<{
    errorFormat: 'pretty';
  }>
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
