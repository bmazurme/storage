import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Box } from '../entities/box.entity';
import { Unit } from '../entities/unit.entity';
import { CreateUnitDto, ReorderUnitsDto, UpdateUnitDto } from './dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit) private readonly units: Repository<Unit>,
    @InjectRepository(Box) private readonly boxes: Repository<Box>,
  ) {}

  async create(dto: CreateUnitDto): Promise<Unit> {
    const box = await this.boxes.findOneBy({ id: dto.boxId });
    if (!box) throw new NotFoundException('Бокс не найден');
    const number =
      ((await this.units.maximum('number', { boxId: dto.boxId })) ?? 0) + 1;
    return this.units.save(
      this.units.create({
        ...dto,
        description: dto.description ?? '',
        number,
        sortOrder: number,
        code: `${box.code}-U${String(number).padStart(3, '0')}`,
      }),
    );
  }

  async update(id: string, dto: UpdateUnitDto): Promise<Unit> {
    const unit = await this.units.findOneBy({ id });
    if (!unit) throw new NotFoundException('Юнит не найден');
    Object.assign(unit, dto);
    return this.units.save(unit);
  }

  async remove(id: string) {
    const result = await this.units.delete(id);
    if (!result.affected) throw new NotFoundException('Юнит не найден');
    return { success: true };
  }

  async reorder(dto: ReorderUnitsDto) {
    const box = await this.boxes.findOneBy({ id: dto.boxId });
    if (!box) throw new NotFoundException('Бокс не найден');
    const units = await this.units.findBy({ boxId: dto.boxId });
    if (
      units.length !== dto.unitIds.length ||
      !units.every((unit) => dto.unitIds.includes(unit.id))
    ) {
      throw new NotFoundException(
        'Список юнитов не соответствует содержимому бокса',
      );
    }
    await Promise.all(
      dto.unitIds.map((id, index) =>
        this.units.update({ id, boxId: dto.boxId }, { sortOrder: index }),
      ),
    );
    return { success: true };
  }

  search(query: string): Promise<Unit[]> {
    const q = query?.trim();
    if (!q) return Promise.resolve([]);
    const pattern = `%${q}%`;
    return this.units.find({
      where: [
        { name: ILike(pattern) },
        { description: ILike(pattern) },
        { code: ILike(pattern) },
      ],
      order: { name: 'ASC' },
      take: 100,
    });
  }
}
