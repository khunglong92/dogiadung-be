import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectCategoriesController } from './project-categories.controller';
import { ProjectCategoriesService } from './project-categories.service';

@Module({
  controllers: [ProjectsController, ProjectCategoriesController],
  providers: [ProjectsService, ProjectCategoriesService],
})
export class ProjectsModule {}
