import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectCategory } from './project-category.entity';

@Entity({ name: 'projects' })
export class Project {
  @ApiProperty({ description: 'ID (UUID) dự án' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProjectCategory, { nullable: false, onDelete: 'RESTRICT' })
  category: ProjectCategory;

  @ApiProperty({ description: 'Tên dự án' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Slug duy nhất' })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @ApiProperty({ description: 'Mô tả ngắn', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ApiProperty({ description: 'Nội dung chi tiết', required: false })
  @Column({ type: 'text', nullable: true })
  content?: string | null;

  @ApiProperty({ description: 'Địa điểm thi công', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @ApiProperty({ description: 'Ngày hoàn thành', required: false })
  @Column({ type: 'date', name: 'completion_date', nullable: true })
  completionDate?: string | null;

  @ApiProperty({ description: 'Ảnh đại diện', required: false })
  @Column({ type: 'varchar', length: 512, nullable: true })
  image?: string | null;

  @ApiProperty({ description: 'Bộ sưu tập ảnh (JSON)', required: false })
  @Column({ type: 'jsonb', nullable: true })
  gallery?: Array<{ url: string; caption?: string }> | null;

  @ApiProperty({ description: 'Dự án tiêu biểu', default: false })
  @Column({ type: 'boolean', name: 'is_featured', default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Kích hoạt', default: true })
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
