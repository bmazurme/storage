import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import QRCode from 'qrcode';

@Controller('qr')
export class QrController {
  @Get(':code')
  async generate(@Param('code') code: string, @Res() res: Response) {
    const buffer = await QRCode.toBuffer(code, {
      type: 'png',
      width: 512,
      margin: 2,
    });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  }
}
