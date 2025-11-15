import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiOptions } from 'cloudinary';
import sharp, { Sharp, Metadata } from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

type UploadStreamOut = { end: (buf: Buffer) => void };
interface CloudinaryV2Safe {
  config: (opts: unknown) => void;
  uploader: {
    upload_stream: (
      options: UploadApiOptions,
      callback: (err: Error | null, res?: unknown) => void,
    ) => UploadStreamOut;
    destroy: (
      public_id: string,
      callback: (err: Error | null, res?: { result: string }) => void,
    ) => void;
  };
}
const cdn = cloudinary as unknown as CloudinaryV2Safe;

function ensureCloudinaryConfigured(): void {
  if (process.env.CLOUDINARY_URL) {
    cdn.config(process.env.CLOUDINARY_URL);
    return;
  }
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (cloud_name && api_key && api_secret) {
    cdn.config({ cloud_name, api_key, api_secret });
  }
}

@Injectable()
export class UploadService {
  private logoBuffer: Buffer | null = null;

  constructor() {
    ensureCloudinaryConfigured();
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
    folder?: string,
  ): Promise<{
    url: string;
    public_id: string;
    width?: number;
    height?: number;
    bytes?: number;
    format?: string;
  }> {
    try {
      const watermarkedBuffer = await this.addWatermark(buffer);

      const result: unknown = await new Promise<unknown>((resolve, reject) => {
        const options: UploadApiOptions = { folder };
        const stream = cdn.uploader.upload_stream(options, (err, res) => {
          if (err) {
            const msg =
              typeof err === 'string'
                ? err
                : ((err as { message?: unknown })?.message ?? 'Upload error');
            return reject(
              new Error(typeof msg === 'string' ? msg : 'Upload error'),
            );
          }
          if (!res || typeof res !== 'object') {
            return reject(new Error('Empty upload response'));
          }
          resolve(res);
        });
        stream.end(watermarkedBuffer);
      });

      const r = result as Record<string, unknown>;
      const secureUrl =
        typeof r.secure_url === 'string' ? r.secure_url : undefined;
      const url = typeof r.url === 'string' ? r.url : undefined;
      const public_id = typeof r.public_id === 'string' ? r.public_id : '';
      const width = typeof r.width === 'number' ? r.width : undefined;
      const height = typeof r.height === 'number' ? r.height : undefined;
      const bytes = typeof r.bytes === 'number' ? r.bytes : undefined;
      const format = typeof r.format === 'string' ? r.format : undefined;

      return {
        url: secureUrl || url || '',
        public_id,
        width,
        height,
        bytes,
        format,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      throw new InternalServerErrorException(message);
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
      return await new Promise((resolve, reject) => {
        cdn.uploader.destroy(public_id, (err, res) => {
          if (err) {
            const msg =
              typeof err === 'string'
                ? err
                : ((err as { message?: unknown })?.message ?? 'Delete error');
            return reject(
              new Error(typeof msg === 'string' ? msg : 'Delete error'),
            );
          }
          if (!res || typeof res.result !== 'string') {
            return reject(new Error('Empty delete response'));
          }
          resolve(res);
        });
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      throw new InternalServerErrorException(message);
    }
  }
}
