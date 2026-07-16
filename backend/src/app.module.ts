import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from './entities/box.entity';
import { Container } from './entities/container.entity';
import { Rack } from './entities/rack.entity';
import { Shelf } from './entities/shelf.entity';
import { Unit } from './entities/unit.entity';
import { FilesModule } from './files/files.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'storage',
      password: process.env.DB_PASSWORD ?? 'storage',
      database: process.env.DB_NAME ?? 'storage',
      entities: [Rack, Shelf, Container, Box, Unit],
      synchronize: true,
    }),
    WarehouseModule,
    FilesModule,
  ],
})
export class AppModule {}
