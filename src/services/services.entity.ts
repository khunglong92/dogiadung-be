import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'services' })
export class CompanyService {
  @ApiProperty({ description: 'ID (UUID) của dịch vụ' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Tên dịch vụ' })
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

  @ApiProperty({ description: 'Ảnh đại diện', required: false })
  @Column({ type: 'varchar', length: 512, nullable: true })
  image?: string | null;

  @ApiProperty({ description: 'Thứ tự hiển thị', default: 0 })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty({ description: 'Kích hoạt', default: true })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => CompanyService, (svc) => svc.children, { nullable: true })
  parent?: CompanyService | null;

  @OneToMany(() => CompanyService, (svc) => svc.parent)
  children?: CompanyService[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
