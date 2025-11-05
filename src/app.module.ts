import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';
import { ForceDeleteController } from './admin/force-delete.controller';
import { ServicesModule } from './services/services.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'network-dogiadung',
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    UploadModule,
    ServicesModule,
    ProductCategoriesModule,
    // Repositories used directly by ForceDeleteController
    TypeOrmModule.forFeature([Category, Product]),
  ],
  controllers: [AppController, ForceDeleteController],
  providers: [AppService],
})
export class AppModule {}
