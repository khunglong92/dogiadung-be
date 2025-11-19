import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from '@prisma/client';

type PaginatedQuotesResult = {
  data: Quote[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const {
      attachments,
      attachmentUrl: dtoAttachmentUrl,
      ...rest
    } = createQuoteDto;

    const attachmentUrl = dtoAttachmentUrl ?? attachments ?? null;

    const quote = await this.prisma.quote.create({
      data: {
        ...rest,
        subject: rest.subject ?? 'quote',
        attachmentUrl: attachmentUrl ?? undefined,
      },
    });

    return quote;
  }

  async findAll(page: number, limit: number): Promise<PaginatedQuotesResult> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.quote.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quote.count(),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Quote> {
    const quote = await this.prisma.quote.findUnique({ where: { id } });

    if (!quote) {
      throw new NotFoundException(
        `Không tìm thấy yêu cầu báo giá với ID: ${id}`,
      );
    }

    return quote;
  }

  async updateStatus(
    id: string,
    updateQuoteDto: UpdateQuoteDto,
  ): Promise<Quote> {
    await this.findOne(id);
    return this.prisma.quote.update({
      where: { id },
      data: { isConfirmed: !!updateQuoteDto.isConfirmed },
    });
  }
}
