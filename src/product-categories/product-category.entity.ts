import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'product_categories' })
export class ProductCategory {
  @ApiProperty({ description: 'ID (UUID) của danh mục' })
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

  @ApiProperty({ description: 'Sản phẩm mẫu (JSON)', required: false })
  @Column({ type: 'jsonb', name: 'sample_products', nullable: true })
  sampleProducts?: Array<{ name: string; image?: string; description?: string }> | null;

  @ApiProperty({ description: 'Điện thoại liên hệ', required: false })
  @Column({ type: 'varchar', length: 50, name: 'contact_phone', nullable: true })
  contactPhone?: string | null;

  @ApiProperty({ description: 'Zalo liên hệ', required: false })
  @Column({ type: 'varchar', length: 255, name: 'contact_zalo', nullable: true })
  contactZalo?: string | null;

  @ApiProperty({ description: 'Kích hoạt', default: true })
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Thời điểm xoá mềm', required: false })
  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}


