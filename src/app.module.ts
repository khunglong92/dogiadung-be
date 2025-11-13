import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';
import { ForceDeleteController } from './admin/force-delete.controller';
import { ServicesModule } from './services/services.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    UploadModule,
    ServicesModule,
    ProductCategoriesModule,
    ProjectsModule,
    ContactsModule,
  ],
  controllers: [AppController, ForceDeleteController],
  providers: [AppService],
})
export class AppModule {}
