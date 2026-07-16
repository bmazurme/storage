import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateBoxDto,
  CreateContainerDto,
  CreateRackDto,
  CreateShelfDto,
  UpdateStorageDto,
} from './dto';
import { WarehouseService } from './warehouse.service';

@Controller('racks')
export class RacksController {
  constructor(private readonly service: WarehouseService) {}

  @Get('tree')
  tree() {
    return this.service.tree();
  }

  @Post()
  create(@Body() dto: CreateRackDto) {
    return this.service.createRack(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStorageDto,
  ) {
    return this.service.updateStorage('rack', id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removeStorage('rack', id);
  }
}

@Controller('shelves')
export class ShelvesController {
  constructor(private readonly service: WarehouseService) {}

  @Post()
  create(@Body() dto: CreateShelfDto) {
    return this.service.createShelf(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStorageDto,
  ) {
    return this.service.updateStorage('shelf', id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removeStorage('shelf', id);
  }
}

@Controller('containers')
export class ContainersController {
  constructor(private readonly service: WarehouseService) {}

  @Post()
  create(@Body() dto: CreateContainerDto) {
    return this.service.createContainer(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStorageDto,
  ) {
    return this.service.updateStorage('container', id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removeStorage('container', id);
  }
}

@Controller('boxes')
export class BoxesController {
  constructor(private readonly service: WarehouseService) {}

  @Post()
  create(@Body() dto: CreateBoxDto) {
    return this.service.createBox(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStorageDto,
  ) {
    return this.service.updateStorage('box', id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removeStorage('box', id);
  }
}
