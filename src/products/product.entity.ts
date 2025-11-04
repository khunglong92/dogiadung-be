import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({ description: 'ID sản phẩm', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Tên sản phẩm', example: 'Khung máy Inox 304' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Mô tả chi tiết (JSON)', required: false })
  @Column({ type: 'jsonb', nullable: true })
  description?: Record<string, unknown> | null;

  @ApiProperty({ description: 'Thông số kỹ thuật (JSON)', required: false })
  @Column({ type: 'jsonb', nullable: true, name: 'technical_specs' })
  technicalSpecs?: Record<string, unknown> | null;

  @ApiProperty({
    description: 'Giá sản phẩm (VND)',
    example: 1500000,
    required: false,
  })
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: {
      to: (value?: number | null) =>
        typeof value === 'number' ? String(value) : value,
      from: (value?: string | null) =>
        typeof value === 'string'
          ? Number(value)
          : (value as unknown as number | null),
    },
  })
  price?: number | null;

  @ApiProperty({
    description: 'Chế độ bảo hành',
    required: false,
    example: '12 tháng',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'warranty_policy',
  })
  warrantyPolicy?: string | null;

  @ApiProperty({
    description: 'Danh sách URL hình ảnh',
    required: false,
    isArray: true,
    type: String,
  })
  @Column({ type: 'text', array: true, nullable: true })
  images?: string[] | null;

  @ApiProperty({ description: 'Danh mục của sản phẩm', type: () => Category })
  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  category: Category;

  @ApiProperty({ description: 'Thời điểm tạo bản ghi' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Thời điểm cập nhật bản ghi' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Thời điểm xoá mềm', required: false })
  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
