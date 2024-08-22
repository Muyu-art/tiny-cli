import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { I18LangService } from './lang.service';
import { Public } from '../public/public.decorator';
import { CreateLang } from './dto/create-lang.dto';

@Controller('/lang')
export class I18nLangController {
  constructor(private readonly langService: I18LangService) {}

  @Public()
  @Post('')
  createLang(@Body() data: CreateLang) {
    return this.langService.create(data);
  }

  @Public()
  @Get('')
  findAllLang() {
    return this.langService.findAll();
  }

  @Public()
  @Patch(':id')
  updateLang(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateLang>
  ) {
    return this.langService.update(id, data);
  }

  @Public()
  @Delete(':id')
  removeLang(@Param('id', ParseIntPipe) id: number) {
    return this.langService.remove(id);
  }
}
