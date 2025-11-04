import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiOptions } from 'cloudinary';

type UploadStreamOut = { end: (buf: Buffer) => void };
interface CloudinaryV2Safe {
  config: (opts: unknown) => void;
  uploader: {
    upload_stream: (
      options: UploadApiOptions,
      callback: (err: Error | null, res?: unknown) => void,
    ) => UploadStreamOut;
  };
}
const cdn = cloudinary as unknown as CloudinaryV2Safe;

// Cloudinary config: prefer CLOUDINARY_URL (cloudinary://<api_key>:<api_secret>@<cloud_name>)
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
  constructor() {
    ensureCloudinaryConfigured();
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
        stream.end(buffer);
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
}
