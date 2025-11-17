import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import sharp, { Sharp, Metadata } from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UploadFolder } from './dto/upload.dto';
import slugify from 'slugify';
// Constants
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp'];
// const UPLOAD_BASE_PATH = '/var/www/uploads';
const UPLOAD_BASE_PATH = process.env.UPLOAD_BASE_PATH || '/var/www/uploads';

@Injectable()
export class UploadService {
  private logoBuffer: Buffer | null = null;

  constructor() {
    this.loadLogo();
  }

  private loadLogo() {
    // Path relative to project root, works in both dev and prod
    const logoPath = path.join(process.cwd(), 'src', 'images', 'logo.png');
    try {
      this.logoBuffer = fs.readFileSync(logoPath);
      console.log('✅ Logo loaded successfully from:', logoPath);
    } catch (error) {
      console.error('❌ Error loading logo file from:', logoPath);
      console.error(error);
      this.logoBuffer = null; // Ensure logoBuffer is null on failure
    }
  }

  async uploadImage(
    buffer: Buffer,
    folder?: UploadFolder,
    categoryId?: number,
    entityName?: string,
  ): Promise<{
    url: string;
    public_id: string;
    width?: number;
    height?: number;
    bytes?: number;
    format?: string;
  }> {
    try {
      if (!process.env.PUBLIC_BASE_URL) {
        throw new InternalServerErrorException(
          'PUBLIC_BASE_URL is not configured',
        );
      }

      // Validate file size
      if (buffer.length > MAX_FILE_SIZE) {
        throw new BadRequestException(
          `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        );
      }

      // Convert image to a standard format (jpg) if needed
      let format: string;
      let processedBuffer: Buffer;

      const metadata: Metadata = await sharp(buffer).metadata();
      const originalFormat = metadata.format;

      if (!originalFormat || !ALLOWED_IMAGE_TYPES.includes(originalFormat)) {
        // Nếu format không hợp lệ, convert sang JPG
        processedBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
        format = 'jpg';
      } else {
        // Nếu hợp lệ, giữ nguyên
        processedBuffer = buffer;
        format = originalFormat;
      }

      // Thêm watermark
      processedBuffer = await this.addWatermark(processedBuffer);

      const width = metadata.width;
      const height = metadata.height;

      // Handle update case - reuse existing filename
      // Khi tạo mới, áp dụng logic cấu trúc thư mục
      const filename = `${uuidv4()}.${format}`;
      const mainFolder = folder || UploadFolder.GENERAL;

      let subFolderPath: string;
      const safeEntityName = entityName
        ? slugify(entityName, { lower: true, strict: true })
        : undefined;

      if (
        mainFolder === UploadFolder.PRODUCTS &&
        categoryId &&
        safeEntityName
      ) {
        // Cấu trúc đặc biệt cho products: products/{categoryId}/{productName}
        subFolderPath = `${mainFolder}/${categoryId}/${safeEntityName}`;
      } else {
        // Cấu trúc mặc định: folder/{entityName}
        subFolderPath = safeEntityName
          ? `${mainFolder}/${safeEntityName}`
          : mainFolder;
      }
      const public_id = `${subFolderPath}/${filename}`;

      // Save to local filesystem
      const fullPath = path.join(UPLOAD_BASE_PATH, public_id);
      await this.saveToLocal(processedBuffer, fullPath);

      // Construct public URL
      const url = `${process.env.PUBLIC_BASE_URL}/uploads/${public_id}`;

      return {
        url,
        public_id,
        width,
        height,
        bytes: processedBuffer.length,
        format,
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      const message = err instanceof Error ? err.message : 'Upload failed';
      throw new InternalServerErrorException(message);
    }
  }

  private async saveToLocal(buffer: Buffer, fullPath: string): Promise<void> {
    try {
      // Create directory recursively if it doesn't exist
      await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
      // Write the file
      await fs.promises.writeFile(fullPath, buffer);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to save file locally: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async addWatermark(buffer: Buffer): Promise<Buffer> {
    if (!this.logoBuffer) {
      console.log('Logo buffer is not loaded. Skipping watermark.');
      return buffer;
    }

    try {
      const image: Sharp = sharp(buffer);
      const metadata: Metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        console.error('Could not get image metadata. Skipping watermark.');
        return buffer;
      }

      const logoWidth = Math.round(metadata.width * 0.2);
      const resizedLogoBuffer: Buffer = await sharp(this.logoBuffer)
        .resize({ width: logoWidth })
        .toBuffer();

      const resizedLogoMetadata: Metadata =
        await sharp(resizedLogoBuffer).metadata();
      if (!resizedLogoMetadata.width || !resizedLogoMetadata.height) {
        console.error(
          'Could not get resized logo metadata. Skipping watermark.',
        );
        return buffer;
      }

      const top = metadata.height - resizedLogoMetadata.height - 20;
      const left = metadata.width - resizedLogoMetadata.width - 20;

      return image
        .composite([
          {
            input: resizedLogoBuffer,
            top: top > 0 ? top : 0,
            left: left > 0 ? left : 0,
          },
        ])
        .toBuffer();
    } catch (error) {
      console.error('Error applying watermark:', error);
      return buffer;
    }
  }

  async deleteImage(public_id: string): Promise<{ result: string }> {
    try {
      const fullPath = path.join(UPLOAD_BASE_PATH, public_id);

      // Delete the file
      await fs.promises.unlink(fullPath);

      // Delete empty folders recursively
      await this.deleteEmptyLocalFolder(path.dirname(fullPath));

      return { result: 'ok' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      throw new InternalServerErrorException(message);
    }
  }

  private async deleteEmptyLocalFolder(folder: string): Promise<void> {
    try {
      // Don't delete the base upload folder
      while (folder !== UPLOAD_BASE_PATH) {
        const files = await fs.promises.readdir(folder);

        // If folder is not empty, stop
        if (files.length > 0) {
          break;
        }

        // Delete empty folder
        await fs.promises.rmdir(folder);
        console.log(`✅ Deleted empty folder: ${folder}`);

        // Move to parent folder
        folder = path.dirname(folder);
      }
    } catch (error) {
      // Don't throw error if we can't delete empty folders
      console.warn('Error checking/deleting empty folder:', error);
    }
  }
}
