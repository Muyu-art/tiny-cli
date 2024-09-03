import { I18, Lang } from '@app/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLang } from './dto/create-lang.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../.generate/i18n.generated';

@Injectable()
export class I18LangService {
  constructor(
    @InjectRepository(I18) private readonly i18: Repository<I18>,
    @InjectRepository(Lang) private readonly lang: Repository<Lang>,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}
  findAll() {
    return this.lang.find();
  }
  async create({ name }: CreateLang) {
    const item = await this.lang.findOneBy({ name });
    if (item) {
      throw new HttpException(
        this.i18n.t('exception.lang.notExists', {
          lang: I18nContext.current().lang,
        }),
        HttpStatus.CONFLICT
      );
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
      throw new HttpException(
        this.i18n.t('exception.lang.notExistsCommon', {
          lang: I18nContext.current().lang,
        }),
        HttpStatus.NOT_FOUND
      );
    }
    item.name = data.name;
    return await this.lang.save(item);
  }
  async remove(id: number) {
    const item = await this.findOne(id);
    if (!item) {
      throw new HttpException(
        this.i18n.t('exception.lang.notExistsCommon', {
          lang: I18nContext.current().lang,
        }),
        HttpStatus.NOT_FOUND
      );
    }
    return await this.lang.remove(item);
  }
}
