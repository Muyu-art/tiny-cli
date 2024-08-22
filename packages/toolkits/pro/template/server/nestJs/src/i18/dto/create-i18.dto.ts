import { IsNotEmpty } from 'class-validator';

export class CreateI18Dto {
  @IsNotEmpty()
  lang: number;
  @IsNotEmpty()
  key: string;
  @IsNotEmpty()
  content: string;
}
