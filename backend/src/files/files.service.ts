import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Client } from 'minio';
import { extname } from 'path';
import type { Readable } from 'stream';

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);
  private readonly bucket = process.env.MINIO_BUCKET ?? 'storage-images';
  private readonly client = new Client({
    endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
    port: Number(process.env.MINIO_PORT ?? 9000),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
  });

  async onModuleInit() {
    try {
      if (!(await this.client.bucketExists(this.bucket))) {
        await this.client.makeBucket(this.bucket);
        this.logger.log(`Создан бакет MinIO: ${this.bucket}`);
      }
    } catch (error) {
      this.logger.error(`Не удалось инициализировать MinIO: ${error}`);
    }
  }

  async upload(file: Express.Multer.File): Promise<{ key: string }> {
    const key = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    await this.client.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });
    return { key };
  }

  async get(
    key: string,
  ): Promise<{ stream: Readable; contentType: string; size: number }> {
    const stat = await this.client.statObject(this.bucket, key);
    const stream = await this.client.getObject(this.bucket, key);
    return {
      stream,
      contentType:
        (stat.metaData?.['content-type'] as string) ??
        'application/octet-stream',
      size: stat.size,
    };
  }
}
