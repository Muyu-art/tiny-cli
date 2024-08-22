import { IsNotEmpty } from 'class-validator';

export class CreateLang {
  @IsNotEmpty()
  name: string;
}
