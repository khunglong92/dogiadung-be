import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ProjectCategory } from './entities/project-category.entity';
import { ProjectCategoriesController } from './project-categories.controller';
import { ProjectCategoriesService } from './project-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectCategory])],
  controllers: [ProjectsController, ProjectCategoriesController],
  providers: [ProjectsService, ProjectCategoriesService],
})
export class ProjectsModule {}
