import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        cb(
          file.mimetype.startsWith('image/')
            ? null
            : new BadRequestException('Допустимы только изображения'),
          file.mimetype.startsWith('image/'),
        );
      },
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Файл не передан');
    return this.service.upload(file);
  }

  @Get(':key')
  async get(@Param('key') key: string, @Res() res: Response) {
    try {
      const { stream, contentType, size } = await this.service.get(key);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', size);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      stream.pipe(res);
    } catch {
      res.status(404).json({ message: 'Файл не найден' });
    }
  }
}
