import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CompanyService } from './services.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyService])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
