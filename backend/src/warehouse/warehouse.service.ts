import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Box } from '../entities/box.entity';
import { Container } from '../entities/container.entity';
import { Rack } from '../entities/rack.entity';
import { Shelf } from '../entities/shelf.entity';
import {
  CreateBoxDto,
  CreateContainerDto,
  CreateRackDto,
  CreateShelfDto,
  UpdateStorageDto,
} from './dto';

export type StorageKind = 'rack' | 'shelf' | 'container' | 'box';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Rack) private readonly racks: Repository<Rack>,
    @InjectRepository(Shelf) private readonly shelves: Repository<Shelf>,
    @InjectRepository(Container)
    private readonly containers: Repository<Container>,
    @InjectRepository(Box) private readonly boxes: Repository<Box>,
  ) {}

  private pad(n: number, len = 2): string {
    return String(n).padStart(len, '0');
  }

  private repo(kind: StorageKind): Repository<any> {
    return {
      rack: this.racks,
      shelf: this.shelves,
      container: this.containers,
      box: this.boxes,
    }[kind];
  }

  tree(): Promise<Rack[]> {
    return this.racks.find({
      relations: { shelves: { containers: { boxes: { units: true } } } },
      order: {
        number: 'ASC',
        shelves: {
          number: 'ASC',
          containers: {
            number: 'ASC',
            boxes: {
              number: 'ASC',
              units: { sortOrder: 'ASC', number: 'ASC' },
            },
          },
        },
      },
    });
  }

  async createRack(dto: CreateRackDto): Promise<Rack> {
    const number = ((await this.racks.maximum('number')) ?? 0) + 1;
    return this.racks.save(
      this.racks.create({ ...dto, number, code: `R${this.pad(number)}` }),
    );
  }

  async createShelf(dto: CreateShelfDto): Promise<Shelf> {
    const rack = await this.racks.findOneBy({ id: dto.rackId });
    if (!rack) throw new NotFoundException('Стеллаж не найден');
    const number =
      ((await this.shelves.maximum('number', { rackId: dto.rackId })) ?? 0) + 1;
    return this.shelves.save(
      this.shelves.create({
        ...dto,
        number,
        code: `${rack.code}-S${this.pad(number)}`,
      }),
    );
  }

  async createContainer(dto: CreateContainerDto): Promise<Container> {
    const shelf = await this.shelves.findOneBy({ id: dto.shelfId });
    if (!shelf) throw new NotFoundException('Полка не найдена');
    const number =
      ((await this.containers.maximum('number', { shelfId: dto.shelfId })) ??
        0) + 1;
    return this.containers.save(
      this.containers.create({
        ...dto,
        number,
        code: `${shelf.code}-C${this.pad(number)}`,
      }),
    );
  }

  async createBox(dto: CreateBoxDto): Promise<Box> {
    const container = await this.containers.findOneBy({ id: dto.containerId });
    if (!container) throw new NotFoundException('Контейнер не найден');
    const number =
      ((await this.boxes.maximum('number', {
        containerId: dto.containerId,
      })) ?? 0) + 1;
    return this.boxes.save(
      this.boxes.create({
        ...dto,
        number,
        code: `${container.code}-B${this.pad(number)}`,
      }),
    );
  }

  async updateStorage(kind: StorageKind, id: string, dto: UpdateStorageDto) {
    const repo = this.repo(kind);
    const entity = await repo.findOneBy({ id });
    if (!entity) throw new NotFoundException('Элемент хранения не найден');
    Object.assign(entity, dto);
    return repo.save(entity);
  }

  async removeStorage(kind: StorageKind, id: string) {
    const result = await this.repo(kind).delete(id);
    if (!result.affected)
      throw new NotFoundException('Элемент хранения не найден');
    return { success: true };
  }
}
