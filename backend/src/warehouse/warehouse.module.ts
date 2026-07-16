import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from '../entities/box.entity';
import { Container } from '../entities/container.entity';
import { Rack } from '../entities/rack.entity';
import { Shelf } from '../entities/shelf.entity';
import { Unit } from '../entities/unit.entity';
import { QrController } from './qr.controller';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';
import {
  BoxesController,
  ContainersController,
  RacksController,
  ShelvesController,
} from './warehouse.controllers';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rack, Shelf, Container, Box, Unit])],
  controllers: [
    RacksController,
    ShelvesController,
    ContainersController,
    BoxesController,
    UnitsController,
    QrController,
  ],
  providers: [WarehouseService, UnitsService],
})
export class WarehouseModule {}
