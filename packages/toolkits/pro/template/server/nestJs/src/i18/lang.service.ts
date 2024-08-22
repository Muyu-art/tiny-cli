import { I18, Lang } from '@app/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLang } from './dto/create-lang.dto';

@Injectable()
export class I18LangService {
  constructor(
    @InjectRepository(I18) private readonly i18: Repository<I18>,
    @InjectRepository(Lang) private readonly lang: Repository<Lang>
  ) {}
  findAll() {
    return this.lang.find();
  }
  async create({ name }: CreateLang) {
    const item = await this.lang.findOneBy({ name });
    if (item) {
      throw new HttpException(`${name} 存在`, HttpStatus.CONFLICT);
    }
    const lang = this.lang.create();
    lang.name = name;
    return this.lang.save(lang);
  }
  findOne(id: number) {
    return this.lang.findOneBy({ id });
  }
  async update(id: number, data: Partial<CreateLang>) {
    const item = await this.findOne(id);
    if (!item) {
      throw new HttpException('语言不存在', HttpStatus.NOT_FOUND);
    }
    item.name = data.name;
    return await this.lang.save(item);
  }
  async remove(id: number) {
    const item = await this.findOne(id);
    if (!item) {
      throw new HttpException('语言不存在', HttpStatus.NOT_FOUND);
    }
    return await this.lang.remove(item);
  }
}
