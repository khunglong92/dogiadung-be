import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity({ name: 'categories' })
export class Category {
  @ApiProperty({ description: 'ID của danh mục', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Gia công và sản xuất kim loại tấm',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty({ description: 'Mô tả danh mục', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ApiProperty({
    description: 'ID người dùng cập nhật gần nhất',
    required: false,
    example: 1,
  })
  @Column({ type: 'int', name: 'updated_by_user_id', nullable: true })
  updatedByUserId?: number | null;

  @ApiProperty({
    description: 'Tên người dùng cập nhật gần nhất',
    required: false,
    example: 'Nguyễn Văn A',
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'updated_by_name',
    nullable: true,
  })
  updatedByName?: string | null;

  @ApiProperty({
    description: 'Các sản phẩm thuộc danh mục',
    type: () => [Product],
    required: false,
  })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

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
