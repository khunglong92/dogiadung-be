import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'project_categories' })
export class ProjectCategory {
  @ApiProperty({ description: 'ID (UUID) danh mục dự án' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Tên danh mục' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Slug duy nhất' })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ApiProperty({ description: 'Thứ tự hiển thị', default: 0 })
  @Column({ type: 'int', default: 0 })
  order: number;

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
