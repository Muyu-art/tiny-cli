import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { I18Service } from './i18.service';
import { CreateI18Dto } from './dto/create-i18.dto';
import { UpdateI18Dto } from './dto/update-i18.dto';
import { CreateLang } from './dto/create-lang.dto';
import { I18LangService } from './lang.service';
import { Public } from '../public/public.decorator';

@Controller('i18')
export class I18Controller {
  constructor(
    private readonly i18Service: I18Service,
    private readonly langService: I18LangService
  ) {}

  @Public()
  @Post()
  create(@Body() createI18Dto: CreateI18Dto) {
    return this.i18Service.create(createI18Dto);
  }

  @Public()
  @Get('format')
  getFormat(@Query('lang') lang: string) {
    return this.i18Service.getFormat(lang);
  }

  @Public()
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit?: number,
    @Query('all', ParseIntPipe) all?: number
  ) {
    return this.i18Service.findAll(page, limit, Boolean(all));
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.i18Service.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateI18Dto: UpdateI18Dto
  ) {
    return this.i18Service.update(id, updateI18Dto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.i18Service.remove(id);
  }
}
