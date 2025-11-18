import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceStatus, ServiceThemeVariant } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        subtitle: dto.subtitle,
        shortDescription: dto.short_description,
        content: dto.content || [],
        features: dto.features || [],
        technologies: dto.technologies || [],
        benefits: dto.benefits || [],
        customers: dto.customers,
        imageUrls: dto.image_urls || [],
        imageAlts: dto.image_alts || [],
        icon: dto.icon,
        ctaLabel: dto.cta_label || 'Liên hệ tư vấn',
        ctaLink: dto.cta_link,
        ctaTarget: dto.cta_target,
        orderIndex: dto.order_index || 0,
        tags: dto.tags || [],
        seoTitle: dto.seo_title,
        seoDescription: dto.seo_description,
        altText: dto.alt_text,
        status: (dto.status as ServiceStatus) || ServiceStatus.published,
        themeVariant: dto.theme_variant as ServiceThemeVariant,
        isFeatured: dto.is_featured || false,
      },
    });
  }

  async findAll(
    page = 1,
    perPage = 10,
    status?: ServiceStatus,
  ): Promise<{
    pagination: { total: number; page: number; perpage: number };
    data: any[];
  }> {
    console.log('status', status);
    const where = { status: status ?? ServiceStatus.published };

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy: [{ orderIndex: 'asc' }, { title: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      pagination: {
        total,
        page,
        perpage: perPage,
      },
      data,
    };
  }

  async findOne(id: string) {
    const found = await this.prisma.service.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException('Service not found');
    }
    return found;
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id); // Check if exists
    return this.prisma.service.update({
      where: { id },
      data: {
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
        ...(dto.short_description !== undefined && {
          shortDescription: dto.short_description,
        }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.features !== undefined && { features: dto.features }),
        ...(dto.technologies !== undefined && {
          technologies: dto.technologies,
        }),
        ...(dto.benefits !== undefined && { benefits: dto.benefits }),
        ...(dto.customers !== undefined && { customers: dto.customers }),
        ...(dto.image_urls !== undefined && { imageUrls: dto.image_urls }),
        ...(dto.image_alts !== undefined && { imageAlts: dto.image_alts }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.cta_label !== undefined && { ctaLabel: dto.cta_label }),
        ...(dto.cta_link !== undefined && { ctaLink: dto.cta_link }),
        ...(dto.cta_target !== undefined && { ctaTarget: dto.cta_target }),
        ...(dto.order_index !== undefined && { orderIndex: dto.order_index }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.seo_title !== undefined && { seoTitle: dto.seo_title }),
        ...(dto.seo_description !== undefined && {
          seoDescription: dto.seo_description,
        }),
        ...(dto.alt_text !== undefined && { altText: dto.alt_text }),
        ...(dto.status !== undefined && {
          status: dto.status as ServiceStatus,
        }),
        ...(dto.theme_variant !== undefined && {
          themeVariant: dto.theme_variant as ServiceThemeVariant,
        }),
        ...(dto.is_featured !== undefined && { isFeatured: dto.is_featured }),
      },
    });
  }

  async findFeatured(
    page = 1,
    perPage = 10,
  ): Promise<{
    pagination: { total: number; page: number; perpage: number };
    data: any[];
  }> {
    const where = {
      isFeatured: true,
      status: ServiceStatus.published,
    };

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy: [{ orderIndex: 'asc' }, { title: 'asc' }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      pagination: {
        total,
        page,
        perpage: perPage,
      },
      data,
    };
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.prisma.service.delete({ where: { id } });
  }
}
