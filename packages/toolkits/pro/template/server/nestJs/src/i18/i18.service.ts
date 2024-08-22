import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateI18Dto } from './dto/create-i18.dto';
import { UpdateI18Dto } from './dto/update-i18.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { I18, Lang } from '@app/models';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class I18Service {
  private readonly COUNT_CACHE = 'i18::count::cache';
  constructor(
    @InjectRepository(I18) private readonly i18: Repository<I18>,
    @InjectRepository(Lang) private readonly lang: Repository<Lang>
  ) {}

  async getFormat(lang: string) {
    const data = await this.lang.find({
      where: {
        name: lang === '' ? undefined : lang,
      },
      relations: ['i18'],
    });
    const ret: Record<string, Record<string, string>> = {};
    for (let i = 0; i < data.length; i++) {
      const { name, i18 } = data[i];
      ret[name] = {};
      for (let i = 0; i < i18.length; i++) {
        const i18Item = i18[i];
        ret[name][i18Item.key] = i18Item.content;
      }
    }
    return ret;
  }

  async create(createI18Dto: CreateI18Dto) {
    const { key, content, lang } = createI18Dto;
    const i18 = this.i18.create();
    const langRecord = await this.lang.findOne({
      where: {
        id: lang,
      },
    });
    console.log(langRecord);
    if (!langRecord) {
      throw new HttpException(`${lang} 不存在`, HttpStatus.NOT_FOUND);
    }
    const i18Item = await this.i18.findOne({
      where: {
        key,
        content,
        lang: langRecord,
      },
    });
    if (i18Item) {
      throw new HttpException('国际化词条存在', HttpStatus.BAD_REQUEST);
    }
    i18.content = content;
    i18.key = key;
    i18.lang = langRecord;
    const items = await this.i18.save(i18);
    return items;
  }

  async findAll(page?: number, limit?: number, all?: boolean) {
    let count = 0;
    if (all) {
      count = await this.i18.count();
    }
    if (page && limit) {
      return paginate<I18>(this.i18, {
        limit,
        page,
      });
    } else {
      return paginate(this.i18, {
        limit: all ? count || process.env.PAGITION_LIMIT : limit,
        page: Number.isNaN(page) ? process.env.PAGITION_PAGE : page,
      });
    }
  }

  async findOne(id: number) {
    const [item] = await this.i18.find({
      where: {
        id,
      },
      loadEagerRelations: true,
      relations: ['lang'],
    });
    if (!item) {
      throw new HttpException('字段不存在', HttpStatus.NOT_FOUND);
    }
    return item;
  }

  async update(id: number, updateI18Dto: UpdateI18Dto) {
    const item = await this.findOne(id);
    item.content = updateI18Dto.content;
    item.key = updateI18Dto.key;
    const lang = await this.lang.findOne({
      where: {
        id: updateI18Dto.lang,
      },
    });
    if (!lang) {
      throw new HttpException(`${lang} 不存在`, HttpStatus.NOT_FOUND);
    }
    item.lang = lang;
    return await this.i18.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.i18.remove(item);
    return item;
  }
}
